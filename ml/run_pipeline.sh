#!/usr/bin/env bash
# Full ML pipeline: extract features → train → evaluate
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/ml/.venv/bin/activate"

# Auto-detect downloaded dataset folder
RAW=""
for candidate in ddd eyes-yawn yawdd nthuddd; do
  dir="$ROOT/ml/dataset/data/raw/$candidate"
  if [ -d "$dir" ] && [ -n "$(find "$dir" -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.mp4' \) 2>/dev/null | head -1)" ]; then
    RAW="$dir"
    break
  fi
done

PROCESSED="$ROOT/ml/dataset/data/processed"
MODELS="$ROOT/ml/models"

if [ -z "$RAW" ]; then
  echo "Dataset chưa có trong ml/dataset/data/raw/"
  echo "Chạy: bash ml/setup_kaggle.sh"
  echo "Hoặc tải thủ công và giải nén vào ml/dataset/data/raw/ddd/"
  exit 1
fi

echo "Using dataset: $RAW"
echo ""
echo "=== Extracting features (MediaPipe) ==="
python "$ROOT/ml/dataset/extract_features.py" \
  --input "$RAW" \
  --output "$PROCESSED" \
  --label-from-folder \
  --sample-every 10

echo ""
echo "=== Training model ==="
python "$ROOT/ml/training/train.py" --data "$PROCESSED" --output "$MODELS"

echo ""
echo "=== Evaluating ==="
python "$ROOT/ml/evaluation/evaluate.py" --model "$MODELS/focus_model.pkl" --data "$PROCESSED"

echo ""
echo "✓ Hoàn tất! Model lưu tại: $MODELS/focus_model.pkl"
