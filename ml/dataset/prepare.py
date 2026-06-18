"""
Dataset module for focus detection training data.

Expected format:
- video_clips/: Raw video recordings labeled with focus states
- annotations/: CSV with columns [clip_id, timestamp, state, score]
- processed/: Extracted feature vectors as .npy files

States: focused, slightly_distracted, distracted, sleepy, away
"""

from pathlib import Path

DATASET_DIR = Path(__file__).parent / "data"
ANNOTATIONS_FILE = DATASET_DIR / "annotations.csv"

FOCUS_STATES = [
    "focused",
    "slightly_distracted",
    "distracted",
    "sleepy",
    "away",
]

def load_annotations():
    """Load annotation CSV. Implement when dataset is available."""
    if not ANNOTATIONS_FILE.exists():
        return []
    import csv
    with open(ANNOTATIONS_FILE) as f:
        return list(csv.DictReader(f))
