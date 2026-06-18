"""
Map dataset-specific labels to unified focus scores (0-100).
"""

LABEL_TO_FOCUS_SCORE = {
    # NTHUDDD
    "notdrowsy": 90,
    "not_drowsy": 90,
    "alert": 90,
    "normal": 85,
    "awake": 88,
    # Low vigilance
    "low_vigilance": 65,
    "lowvigilance": 65,
    # Drowsy
    "drowsy": 25,
    "drowsiness": 25,
    "sleepy": 20,
    # Yawning
    "yawn": 30,
    "yawning": 30,
    "talk": 75,
    "talking": 75,
}

LABEL_TO_STATE = {
    "notdrowsy": "focused",
    "not_drowsy": "focused",
    "alert": "focused",
    "normal": "focused",
    "awake": "focused",
    "talk": "slightly_distracted",
    "talking": "slightly_distracted",
    "low_vigilance": "slightly_distracted",
    "drowsy": "sleepy",
    "drowsiness": "sleepy",
    "sleepy": "sleepy",
    "yawn": "distracted",
    "yawning": "distracted",
}


def label_to_focus_score(label: str) -> float:
    normalized = label.lower().strip().replace(" ", "_").replace("-", "_")
    return float(LABEL_TO_FOCUS_SCORE.get(normalized, 50))


def label_to_state(label: str) -> str:
    normalized = label.lower().strip().replace(" ", "_").replace("-", "_")
    return LABEL_TO_STATE.get(normalized, "slightly_distracted")
