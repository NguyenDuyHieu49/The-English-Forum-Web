"""
Generate synthetic focus-detection training data.

Simulates 12-dim feature vectors (EAR, MAR, head pose, etc.)
with realistic distributions per focus state — no Kaggle/camera needed.

Usage:
  python ml/dataset/generate_mock_data.py
  python ml/dataset/generate_mock_data.py --samples 8000 --output ml/dataset/data/processed
"""

import argparse
from pathlib import Path

import numpy as np

# Feature indices (match src/ml/focus-detection/metrics.ts pipeline)
# 0 ear_l, 1 ear_r, 2 ear_avg, 3 mar, 4 blink_rate,
# 5 pitch, 6 yaw, 7 roll, 8 looking_away, 9 yawning, 10 face_detected, 11 focus_delta

STATE_PROFILES: dict[str, dict] = {
    "focused": {
        "score": (82, 98),
        "ear": (0.28, 0.38),
        "mar": (0.15, 0.35),
        "yaw": (-0.08, 0.08),
        "pitch": (-0.12, 0.12),
        "looking_away": 0.05,
        "yawning": 0.02,
        "face_detected": 0.98,
    },
    "slightly_distracted": {
        "score": (62, 79),
        "ear": (0.22, 0.30),
        "mar": (0.20, 0.42),
        "yaw": (-0.18, 0.18),
        "pitch": (-0.20, 0.20),
        "looking_away": 0.25,
        "yawning": 0.08,
        "face_detected": 0.95,
    },
    "distracted": {
        "score": (40, 59),
        "ear": (0.18, 0.26),
        "mar": (0.25, 0.48),
        "yaw": (-0.28, 0.28),
        "pitch": (-0.30, 0.28),
        "looking_away": 0.55,
        "yawning": 0.15,
        "face_detected": 0.90,
    },
    "sleepy": {
        "score": (18, 39),
        "ear": (0.10, 0.20),
        "mar": (0.35, 0.65),
        "yaw": (-0.15, 0.15),
        "pitch": (0.15, 0.45),
        "looking_away": 0.30,
        "yawning": 0.45,
        "face_detected": 0.88,
    },
    "away": {
        "score": (0, 18),
        "ear": (0.0, 0.12),
        "mar": (0.0, 0.30),
        "yaw": (-0.5, 0.5),
        "pitch": (-0.5, 0.5),
        "looking_away": 0.85,
        "yawning": 0.10,
        "face_detected": 0.15,
    },
}


def sample_uniform(rng: np.random.Generator, low: float, high: float) -> float:
    return float(rng.uniform(low, high))


def generate_sample(rng: np.random.Generator, profile: dict) -> tuple[np.ndarray, float]:
    ear_avg = sample_uniform(rng, *profile["ear"])
    ear_l = ear_avg + rng.normal(0, 0.02)
    ear_r = ear_avg + rng.normal(0, 0.02)
    mar = max(0, sample_uniform(rng, *profile["mar"]))
    yaw = sample_uniform(rng, *profile["yaw"])
    pitch = sample_uniform(rng, *profile["pitch"])
    roll = float(rng.normal(0, 0.08))

    looking_away = 1.0 if rng.random() < profile["looking_away"] else 0.0
    yawning = 1.0 if rng.random() < profile["yawning"] else 0.0
    face_detected = 1.0 if rng.random() < profile["face_detected"] else 0.0
    blink_rate = float(rng.uniform(8, 25) if profile["score"][0] >= 80 else rng.uniform(15, 40))
    focus_delta = float(rng.normal(0, 3))

    features = np.array([
        ear_l, ear_r, ear_avg, mar,
        blink_rate, pitch, yaw, roll,
        looking_away, yawning, face_detected, focus_delta,
    ], dtype=np.float32)

    score = sample_uniform(rng, *profile["score"])
    if not face_detected:
        score = min(score, 15)

    return features, score


def generate_dataset(
    samples_per_state: int = 1200,
    seed: int = 42,
) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    features_list: list[np.ndarray] = []
    labels_list: list[float] = []

    for profile in STATE_PROFILES.values():
        for _ in range(samples_per_state):
            feat, score = generate_sample(rng, profile)
            features_list.append(feat)
            labels_list.append(score)

    rng.shuffle(indices := np.arange(len(features_list)))
    X = np.array(features_list)[indices]
    y = np.array(labels_list, dtype=np.float32)[indices]
    return X, y


def main():
    parser = argparse.ArgumentParser(description="Generate mock focus detection training data")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).parent / "data" / "processed",
    )
    parser.add_argument(
        "--samples",
        type=int,
        default=1200,
        help="Samples per focus state (5 states)",
    )
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)

    X, y = generate_dataset(samples_per_state=args.samples, seed=args.seed)

    np.save(args.output / "features.npy", X)
    np.save(args.output / "labels.npy", y)

    print(f"✓ Generated mock dataset: {args.output}")
    print(f"  features.npy: {X.shape}")
    print(f"  labels.npy:   {y.shape}")
    print(f"  Score range:  {y.min():.0f} – {y.max():.0f} (mean {y.mean():.1f})")
    print(f"  Total samples: {len(y)} ({args.samples} × {len(STATE_PROFILES)} states)")


if __name__ == "__main__":
    main()
