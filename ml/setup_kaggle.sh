#!/usr/bin/env bash
# Setup Kaggle API for The English Forum ML pipeline
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/ml/.venv"
KAGGLE_DIR="$HOME/.kaggle"
KAGGLE_JSON="$KAGGLE_DIR/kaggle.json"
ENV_FILE="$ROOT/ml/.env"

echo "=== The English Forum — Kaggle Setup ==="
echo ""

# Load token from ml/.env if present (gitignored)
if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# 1. Python venv
if [ ! -d "$VENV" ]; then
  echo "Creating Python venv..."
  python3 -m venv "$VENV"
fi

source "$VENV/bin/activate"
pip install -q -r "$ROOT/ml/requirements.txt"
echo "✓ Python dependencies installed"

# 2. Kaggle credentials — KAGGLE_API_TOKEN (new) or kaggle.json (legacy)
if [ -n "${KAGGLE_API_TOKEN:-}" ]; then
  export KAGGLE_API_TOKEN
  echo "✓ Kaggle API token loaded from environment"
elif [ -f "$KAGGLE_JSON" ]; then
  chmod 600 "$KAGGLE_JSON"
  echo "✓ Kaggle credentials found at $KAGGLE_JSON"
else
  echo ""
  echo "⚠ Chưa có Kaggle API token."
  echo ""
  echo "Cách 1 — Biến môi trường (khuyến nghị):"
  echo "  export KAGGLE_API_TOKEN=your_token_here"
  echo "  bash ml/setup_kaggle.sh"
  echo ""
  echo "Cách 2 — File ml/.env (gitignored):"
  echo "  cp ml/.env.example ml/.env"
  echo "  # Thêm KAGGLE_API_TOKEN=... vào ml/.env"
  echo "  bash ml/setup_kaggle.sh"
  echo ""
  echo "Cách 3 — kaggle.json:"
  echo "  https://www.kaggle.com/settings → Create New Token"
  echo "  mv ~/Downloads/kaggle.json ~/.kaggle/kaggle.json"
  echo "  chmod 600 ~/.kaggle/kaggle.json"
  echo ""
  exit 1
fi

# 3. Accept dataset rules
echo ""
echo "Lưu ý: Chấp nhận điều khoản dataset trước khi tải:"
echo "  https://www.kaggle.com/datasets/ismailnasri20/driver-drowsiness-dataset-ddd"
echo ""

# 4. Download DDD (NTHUDDD removed from Kaggle)
echo "Verifying Kaggle access..."
python "$ROOT/ml/dataset/verify_kaggle.py" || true
echo ""
echo "Downloading Driver Drowsiness Dataset (DDD)..."
python "$ROOT/ml/dataset/download.py" --dataset ddd

echo ""
echo "✓ Download xong!"
echo ""
echo "Bước tiếp theo:"
echo "  bash ml/run_pipeline.sh"
