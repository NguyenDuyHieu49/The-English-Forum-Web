"""
Evaluation metrics for focus detection model.
"""

def evaluate_predictions(y_true, y_pred):
    import numpy as np

    mae = np.mean(np.abs(np.array(y_true) - np.array(y_pred)))
    within_10 = np.mean(np.abs(np.array(y_true) - np.array(y_pred)) <= 10)

    state_accuracy = sum(
        1 for t, p in zip(y_true, y_pred)
        if score_to_state(t) == score_to_state(p)
    ) / len(y_true)

    return {
        "mae": float(mae),
        "accuracy_within_10": float(within_10),
        "state_accuracy": float(state_accuracy),
    }


def score_to_state(score: float) -> str:
    if score >= 80:
        return "focused"
    if score >= 60:
        return "slightly_distracted"
    if score >= 40:
        return "distracted"
    if score >= 20:
        return "sleepy"
    return "away"
