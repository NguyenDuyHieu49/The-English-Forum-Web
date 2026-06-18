"use client";

import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import {
  buildFocusResult,
  calculateEyeAspectRatio,
  calculateHeadPose,
  calculateMouthAspectRatio,
  isLookingAway,
  isYawning,
} from "./metrics";
import type { FocusResult } from "@/types/focus";

const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
const EAR_BLINK_THRESHOLD = 0.21;
const WASM_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export class FocusDetectionEngine {
  private landmarker: FaceLandmarker | null = null;
  private blinkCount = 0;
  private lastBlinkTime = Date.now();
  private blinkRate = 0;
  private isInitialized = false;
  private frameIndex = 0;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const vision = await FilesetResolver.forVisionTasks(WASM_CDN);

    const sharedOptions = {
      runningMode: "VIDEO" as const,
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    };

    try {
      this.landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU",
        },
        ...sharedOptions,
      });
    } catch {
      this.landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "CPU",
        },
        ...sharedOptions,
      });
    }

    this.isInitialized = true;
  }

  detect(video: HTMLVideoElement): FocusResult | null {
    if (!this.landmarker || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return null;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    // MediaPipe VIDEO mode requires strictly increasing timestamps (ms).
    this.frameIndex += 1;
    const timestampMs = this.frameIndex * 33;

    let results;
    try {
      results = this.landmarker.detectForVideo(video, timestampMs);
    } catch (error) {
      console.warn("Focus detection frame error:", error);
      return null;
    }

    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      return buildFocusResult(
        {
          eyeAspectRatio: 0,
          mouthAspectRatio: 0,
          blinkFrequency: this.blinkRate,
          yawning: false,
          headPose: { pitch: 0, yaw: 0, roll: 0 },
          lookingAway: true,
          faceDetected: false,
        },
        this.blinkRate
      );
    }

    const landmarks = results.faceLandmarks[0];
    const ear = calculateEyeAspectRatio(landmarks, LEFT_EYE_INDICES, RIGHT_EYE_INDICES);
    const mar = calculateMouthAspectRatio(landmarks);
    const headPose = calculateHeadPose(landmarks);

    if (ear < EAR_BLINK_THRESHOLD) {
      const now = Date.now();
      if (now - this.lastBlinkTime > 200) {
        this.blinkCount++;
        this.lastBlinkTime = now;
      }
    }

    const elapsed = (Date.now() - this.lastBlinkTime) / 1000 / 60;
    this.blinkRate = elapsed > 0 ? this.blinkCount / elapsed : 0;

    const metrics = {
      eyeAspectRatio: ear,
      mouthAspectRatio: mar,
      blinkFrequency: this.blinkRate,
      yawning: isYawning(mar),
      headPose,
      lookingAway: isLookingAway(headPose),
      faceDetected: true,
    };

    return buildFocusResult(metrics, this.blinkRate);
  }

  reset(): void {
    this.blinkCount = 0;
    this.lastBlinkTime = Date.now();
    this.blinkRate = 0;
    this.frameIndex = 0;
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
    this.isInitialized = false;
    this.frameIndex = 0;
  }
}
