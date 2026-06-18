"""
Extract focus detection features from videos OR images using MediaPipe.

Usage:
  python ml/dataset/extract_features.py \\
    --input ml/dataset/data/raw/ddd \\
    --output ml/dataset/data/processed \\
    --label-from-folder
"""

import argparse
import sys
from pathlib import Path

import numpy as np

try:
    import cv2
    import mediapipe as mp
    from tqdm import tqdm
except ImportError:
    print("Install dependencies: pip install mediapipe opencv-python numpy tqdm")
    sys.exit(1)

from label_mapping import label_to_focus_score

mp_face_mesh = mp.solutions.face_mesh

LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
VIDEO_EXTS = {".mp4", ".avi", ".mov", ".mkv"}


def euclidean(p1, p2):
    return np.linalg.norm(np.array(p1) - np.array(p2))


def compute_ear(landmarks, indices, w, h):
    pts = [(landmarks[i].x * w, landmarks[i].y * h) for i in indices]
    v1 = euclidean(pts[1], pts[5])
    v2 = euclidean(pts[2], pts[4])
    horiz = euclidean(pts[0], pts[3])
    return (v1 + v2) / (2 * horiz) if horiz > 0 else 0


def compute_mar(landmarks, w, h):
    upper = (landmarks[13].x * w, landmarks[13].y * h)
    lower = (landmarks[14].x * w, landmarks[14].y * h)
    left = (landmarks[61].x * w, landmarks[61].y * h)
    right = (landmarks[291].x * w, landmarks[291].y * h)
    vertical = euclidean(upper, lower)
    horizontal = euclidean(left, right)
    return vertical / horizontal if horizontal > 0 else 0


def extract_from_frame(frame, face_mesh) -> np.ndarray | None:
    h, w = frame.shape[:2]
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return None

    lm = results.multi_face_landmarks[0].landmark
    ear_l = compute_ear(lm, LEFT_EYE, w, h)
    ear_r = compute_ear(lm, RIGHT_EYE, w, h)
    ear_avg = (ear_l + ear_r) / 2
    mar = compute_mar(lm, w, h)
    nose = lm[1]
    chin = lm[152]
    pitch = float(np.arctan2(chin.y - nose.y, chin.z - nose.z))
    yaw = float(lm[263].x - lm[33].x)

    return np.array([
        ear_l, ear_r, ear_avg, mar,
        0, pitch, yaw, 0,
        int(abs(yaw) > 0.15),
        int(mar > 0.6),
        1, 0,
    ], dtype=np.float32)


def extract_from_image(image_path: Path, face_mesh) -> np.ndarray | None:
    frame = cv2.imread(str(image_path))
    if frame is None:
        return None
    return extract_from_frame(frame, face_mesh)


def extract_from_video(video_path: Path, face_mesh, sample_every: int = 5) -> list[np.ndarray]:
    cap = cv2.VideoCapture(str(video_path))
    features = []
    frame_idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % sample_every == 0:
            feat = extract_from_frame(frame, face_mesh)
            if feat is not None:
                features.append(feat)
        frame_idx += 1

    cap.release()
    return features


def infer_label_from_path(path: Path) -> str:
    text = " ".join(path.parts).lower() + " " + path.stem.lower()
    keywords = [
        ("notdrowsy", "notdrowsy"),
        ("not_drowsy", "not_drowsy"),
        ("non_drowsy", "not_drowsy"),
        ("nondrowsy", "not_drowsy"),
        ("non drowsy", "not_drowsy"),
        ("closed_eye", "drowsy"),
        ("closed eye", "drowsy"),
        ("closed", "drowsy"),
        ("open_eye", "alert"),
        ("open eye", "alert"),
        ("open", "alert"),
        ("yawn", "yawning"),
        ("drowsy", "drowsy"),
        ("sleep", "drowsy"),
        ("alert", "alert"),
        ("awake", "awake"),
        ("normal", "normal"),
        ("active", "alert"),
    ]
    for pattern, label in keywords:
        if pattern in text:
            return label
    return "normal"


def collect_files(input_dir: Path) -> tuple[list[Path], list[Path]]:
    images = [p for p in input_dir.rglob("*") if p.suffix.lower() in IMAGE_EXTS]
    videos = [p for p in input_dir.rglob("*") if p.suffix.lower() in VIDEO_EXTS]
    return images, videos


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--label-from-folder", action="store_true")
    parser.add_argument("--sample-every", type=int, default=5)
    parser.add_argument("--max-images", type=int, default=5000, help="Cap images for faster training")
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    images, videos = collect_files(args.input)

    if not images and not videos:
        print(f"No images/videos found in {args.input}")
        print("Download: python ml/dataset/download.py --dataset ddd")
        sys.exit(1)

    print(f"Found {len(images)} images, {len(videos)} videos")

    if len(images) > args.max_images:
        import random
        random.seed(42)
        images = random.sample(images, args.max_images)
        print(f"Sampling {args.max_images} images for training")

    all_features: list[np.ndarray] = []
    all_labels: list[float] = []

    with mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ) as face_mesh:
        for img in tqdm(images, desc="Processing images"):
            feat = extract_from_image(img, face_mesh)
            if feat is None:
                continue
            label = infer_label_from_path(img) if args.label_from_folder else "normal"
            all_features.append(feat)
            all_labels.append(label_to_focus_score(label))

        for video in tqdm(videos, desc="Processing videos"):
            feats = extract_from_video(video, face_mesh, args.sample_every)
            if not feats:
                continue
            label = infer_label_from_path(video) if args.label_from_folder else "normal"
            score = label_to_focus_score(label)
            for f in feats:
                all_features.append(f)
                all_labels.append(score)

    if not all_features:
        print("No features extracted. Check files and face visibility.")
        sys.exit(1)

    X = np.array(all_features)
    y = np.array(all_labels, dtype=np.float32)

    np.save(args.output / "features.npy", X)
    np.save(args.output / "labels.npy", y)
    print(f"Saved {len(X)} samples to {args.output}")
    print(f"  features.npy: {X.shape}")
    print(f"  labels.npy: {y.shape}  (min={y.min():.0f}, max={y.max():.0f}, mean={y.mean():.1f})")


if __name__ == "__main__":
    main()
