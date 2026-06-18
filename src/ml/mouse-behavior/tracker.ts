import type { MouseBehaviorMetrics } from "@/types/focus";
import { MOUSE_BEHAVIOR_THRESHOLDS } from "@/constants/focus";

interface MousePoint {
  x: number;
  y: number;
  timestamp: number;
}

export class MouseBehaviorTracker {
  private points: MousePoint[] = [];
  private lastMoveTime = Date.now();
  private directionChanges = 0;
  private lastDirection: { dx: number; dy: number } | null = null;

  track(event: MouseEvent): void {
    const point: MousePoint = {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
    };

    if (this.points.length > 0) {
      const prev = this.points[this.points.length - 1];
      const dx = point.x - prev.x;
      const dy = point.y - prev.y;

      if (this.lastDirection) {
        const dot =
          dx * this.lastDirection.dx + dy * this.lastDirection.dy;
        if (dot < 0 && Math.sqrt(dx * dx + dy * dy) > 5) {
          this.directionChanges++;
        }
      }
      this.lastDirection = { dx, dy };
    }

    this.points.push(point);
    this.lastMoveTime = Date.now();

    if (this.points.length > 200) {
      this.points = this.points.slice(-100);
    }
  }

  getMetrics(): MouseBehaviorMetrics {
    let totalDistance = 0;
    let totalSpeed = 0;
    let speedCount = 0;

    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1];
      const curr = this.points[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const dt = (curr.timestamp - prev.timestamp) / 1000;

      totalDistance += dist;
      if (dt > 0) {
        totalSpeed += dist / dt;
        speedCount++;
      }
    }

    const averageSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
    const idleTimeMs = Date.now() - this.lastMoveTime;
    const randomMovementScore = this.directionChanges;

    const isSuspicious =
      randomMovementScore > MOUSE_BEHAVIOR_THRESHOLDS.randomMovementThreshold ||
      averageSpeed > MOUSE_BEHAVIOR_THRESHOLDS.speedThreshold * 100 ||
      idleTimeMs > MOUSE_BEHAVIOR_THRESHOLDS.idleWarningMs;

    return {
      totalDistance,
      averageSpeed,
      idleTimeMs,
      randomMovementScore,
      isSuspicious,
    };
  }

  reset(): void {
    this.points = [];
    this.directionChanges = 0;
    this.lastDirection = null;
    this.lastMoveTime = Date.now();
  }
}
