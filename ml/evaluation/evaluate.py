"""
Evaluate trained focus detection model.
"""

import argparse
import sys
from pathlib import Path

ML_ROOT = Path(__file__).resolve().parent.parent
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--data", type=Path, required=True)
    args = parser.parse_args()

    try:
        import joblib
        import numpy as np
        from evaluation.metrics import evaluate_predictions
    except ImportError:
        print("Install: pip install scikit-learn joblib numpy")
        return

    if not args.model.exists():
        print(f"Model not found: {args.model}")
        print("Train first: python ml/training/train.py")
        return

    features_path = args.data / "features.npy"
    labels_path = args.data / "labels.npy"

    if not features_path.exists():
        print(f"Data not found: {features_path}")
        return

    model = joblib.load(args.model)
    X = np.load(features_path)
    y_true = np.load(labels_path)
    y_pred = model.predict(X)

    metrics = evaluate_predictions(y_true.tolist(), y_pred.tolist())
    print("Evaluation Results:")
    for k, v in metrics.items():
        print(f"  {k}: {v:.3f}")


if __name__ == "__main__":
    main()
