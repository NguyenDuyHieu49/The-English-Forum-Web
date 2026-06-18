import type { FocusMetrics, FocusResult, FocusState } from "@/types/focus";
import { FOCUS_STATE_THRESHOLDS } from "@/constants/focus";

export function euclideanDistance(
  p1: { x: number; y: number; z?: number },
  p2: { x: number; y: number; z?: number }
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z ?? 0) - (p2.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function calculateEyeAspectRatio(
  landmarks: { x: number; y: number; z?: number }[],
  leftEyeIndices: number[],
  rightEyeIndices: number[]
): number {
  const leftEAR = computeEAR(landmarks, leftEyeIndices);
  const rightEAR = computeEAR(landmarks, rightEyeIndices);
  return (leftEAR + rightEAR) / 2;
}

function computeEAR(
  landmarks: { x: number; y: number; z?: number }[],
  indices: number[]
): number {
  const vertical1 = euclideanDistance(landmarks[indices[1]], landmarks[indices[5]]);
  const vertical2 = euclideanDistance(landmarks[indices[2]], landmarks[indices[4]]);
  const horizontal = euclideanDistance(landmarks[indices[0]], landmarks[indices[3]]);
  if (horizontal === 0) return 0;
  return (vertical1 + vertical2) / (2 * horizontal);
}

export function calculateMouthAspectRatio(
  landmarks: { x: number; y: number; z?: number }[]
): number {
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  const leftCorner = landmarks[61];
  const rightCorner = landmarks[291];

  const vertical = euclideanDistance(upperLip, lowerLip);
  const horizontal = euclideanDistance(leftCorner, rightCorner);
  if (horizontal === 0) return 0;
  return vertical / horizontal;
}

export function calculateHeadPose(
  landmarks: { x: number; y: number; z?: number }[]
): { pitch: number; yaw: number; roll: number } {
  const noseTip = landmarks[1];
  const chin = landmarks[152];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  const pitch = Math.atan2(chin.y - noseTip.y, chin.z! - noseTip.z!) * (180 / Math.PI);
  const yaw = Math.atan2(rightEye.x - leftEye.x, rightEye.z! - leftEye.z!) * (180 / Math.PI);
  const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

  return { pitch, yaw, roll };
}

export function isLookingAway(headPose: { pitch: number; yaw: number; roll: number }): boolean {
  return Math.abs(headPose.yaw) > 25 || Math.abs(headPose.pitch) > 20;
}

export function isYawning(mar: number): boolean {
  return mar > 0.6;
}

export function scoreToState(score: number): FocusState {
  if (score >= FOCUS_STATE_THRESHOLDS.focused.min) return "focused";
  if (score >= FOCUS_STATE_THRESHOLDS.slightly_distracted.min) return "slightly_distracted";
  if (score >= FOCUS_STATE_THRESHOLDS.distracted.min) return "distracted";
  if (score >= FOCUS_STATE_THRESHOLDS.sleepy.min) return "sleepy";
  return "away";
}

export function computeFocusScore(
  metrics: FocusMetrics,
  blinkRate: number
): { score: number; confidence: number } {
  if (!metrics.faceDetected) {
    return { score: 0, confidence: 0.9 };
  }

  let score = 100;
  let confidence = 0.85;

  if (metrics.eyeAspectRatio < 0.15) {
    score -= 30;
    confidence += 0.05;
  } else if (metrics.eyeAspectRatio < 0.2) {
    score -= 15;
  }

  if (blinkRate > 30) {
    score -= 20;
  } else if (blinkRate > 20) {
    score -= 10;
  }

  if (metrics.yawning) {
    score -= 25;
    confidence += 0.05;
  }

  if (metrics.lookingAway) {
    score -= 30;
    confidence += 0.05;
  }

  const headDeviation =
    Math.abs(metrics.headPose.yaw) + Math.abs(metrics.headPose.pitch);
  if (headDeviation > 30) {
    score -= 20;
  } else if (headDeviation > 15) {
    score -= 10;
  }

  if (metrics.mouthAspectRatio > 0.5 && !metrics.yawning) {
    score -= 5;
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    confidence: Math.min(1, confidence),
  };
}

export function buildFocusResult(
  metrics: FocusMetrics,
  blinkRate: number
): FocusResult {
  const { score, confidence } = computeFocusScore(metrics, blinkRate);
  return {
    score,
    confidence,
    state: scoreToState(score),
    metrics: { ...metrics, blinkFrequency: blinkRate },
    timestamp: Date.now(),
  };
}
