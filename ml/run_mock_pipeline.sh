#!/usr/bin/env bash
# Train focus model using synthetic mock data (no Kaggle required)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/ml/.venv/bin/activate"

PROCESSED="$ROOT/ml/dataset/data/processed"
MODELS="$ROOT/ml/models"
SAMPLES="${1:-1200}"

echo "=== The English Forum — Mock ML Pipeline ==="
echo ""

echo "Step 1/3: Generating synthetic training data..."
python "$ROOT/ml/dataset/generate_mock_data.py" \
  --output "$PROCESSED" \
  --samples "$SAMPLES"

echo ""
echo "Step 2/3: Training model..."
python "$ROOT/ml/training/train.py" --data "$PROCESSED" --output "$MODELS"

echo ""
echo "Step 3/3: Evaluating..."
python "$ROOT/ml/evaluation/evaluate.py" --model "$MODELS/focus_model.pkl" --data "$PROCESSED"

echo ""
echo "✓ Hoàn tất với mock data!"
echo "  Model: $MODELS/focus_model.pkl"
echo "  Data:  $PROCESSED/features.npy"
