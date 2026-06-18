export type FocusState =
  | "focused"
  | "slightly_distracted"
  | "distracted"
  | "sleepy"
  | "away";

export interface FocusMetrics {
  eyeAspectRatio: number;
  mouthAspectRatio: number;
  blinkFrequency: number;
  yawning: boolean;
  headPose: { pitch: number; yaw: number; roll: number };
  lookingAway: boolean;
  faceDetected: boolean;
}

export interface FocusResult {
  score: number;
  confidence: number;
  state: FocusState;
  metrics: FocusMetrics;
  timestamp: number;
}

export interface MouseBehaviorMetrics {
  totalDistance: number;
  averageSpeed: number;
  idleTimeMs: number;
  randomMovementScore: number;
  isSuspicious: boolean;
}
