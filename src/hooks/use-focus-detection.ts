"use client";

import { useEffect, useRef, useCallback } from "react";
import { FocusDetectionEngine } from "@/ml/focus-detection/engine";
import { useAppStore } from "@/store/app-store";

interface UseFocusDetectionOptions {
  enabled?: boolean;
  intervalMs?: number;
}

function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const onReady = () => {
      if (video.videoWidth > 0) {
        video.removeEventListener("loadeddata", onReady);
        resolve();
      }
    };
    video.addEventListener("loadeddata", onReady);
  });
}

function attachHiddenVideo(video: HTMLVideoElement) {
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  video.setAttribute("playsinline", "true");

  if (!video.parentElement) {
    Object.assign(video.style, {
      position: "fixed",
      width: "1px",
      height: "1px",
      opacity: "0",
      pointerEvents: "none",
      zIndex: "-1",
    });
    document.body.appendChild(video);
  }
}

export function useFocusDetection(options: UseFocusDetectionOptions = {}) {
  const { enabled = true, intervalMs = 500 } = options;
  const engineRef = useRef<FocusDetectionEngine | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const setFocusResult = useAppStore((s) => s.setFocusResult);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    engineRef.current?.dispose();
    engineRef.current = null;
    if (videoRef.current?.parentElement) {
      videoRef.current.parentElement.removeChild(videoRef.current);
    }
    videoRef.current = null;
    setFocusResult(null);
  }, [setFocusResult]);

  const start = useCallback(async () => {
    if (!enabled) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;

      const video = document.createElement("video");
      attachHiddenVideo(video);
      videoRef.current = video;

      video.srcObject = stream;
      await video.play();
      await waitForVideoReady(video);

      if (!engineRef.current) {
        engineRef.current = new FocusDetectionEngine();
        await engineRef.current.initialize();
      }

      intervalRef.current = setInterval(() => {
        if (!videoRef.current || !engineRef.current) return;
        const result = engineRef.current.detect(videoRef.current);
        if (result) setFocusResult(result);
      }, intervalMs);
    } catch (err) {
      console.error("Focus detection camera error:", err);
      stop();
    }
  }, [enabled, intervalMs, setFocusResult, stop]);

  useEffect(() => {
    if (enabled) {
      start();
    }
    return () => stop();
  }, [enabled, start, stop]);

  return { start, stop, videoRef };
}
