"""
Training pipeline for focus detection model.

Usage:
    python ml/training/train.py --data ml/dataset/data/processed --output ml/models/

Requires scikit-learn:
    pip install scikit-learn pandas numpy
"""

import argparse
from pathlib import Path


def train_model(data_dir: Path, output_dir: Path):
    try:
        import numpy as np
        from sklearn.ensemble import GradientBoostingRegressor
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import mean_absolute_error, r2_score
    except ImportError:
        print("Install scikit-learn: pip install scikit-learn pandas numpy")
        return

    features_path = data_dir / "features.npy"
    labels_path = data_dir / "labels.npy"

    if not features_path.exists():
        print(f"No training data found at {features_path}")
        print("Collect labeled data first using ml/dataset/prepare.py")
        return

    X = np.load(features_path)
    y = np.load(labels_path)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"MAE: {mae:.2f}")
    print(f"R²: {r2:.3f}")

    output_dir.mkdir(parents=True, exist_ok=True)
    import joblib
    joblib.dump(model, output_dir / "focus_model.pkl")
    print(f"Model saved to {output_dir / 'focus_model.pkl'}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=Path("ml/dataset/data/processed"))
    parser.add_argument("--output", type=Path, default=Path("ml/models"))
    args = parser.parse_args()
    train_model(args.data, args.output)
