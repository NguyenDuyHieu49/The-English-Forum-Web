"""
Verify Kaggle authentication and dataset access.

Usage:
  export KAGGLE_API_TOKEN=your_token
  python ml/dataset/verify_kaggle.py
"""

import subprocess
import sys
from pathlib import Path

DATASETS_TO_CHECK = [
    ("ddd", "ismailnasri20/driver-drowsiness-dataset-ddd"),
    ("eyes-yawn", "aryansharma8911/open-closed-eyes-and-yawning-labelled"),
    ("yawdd", "enider/yawdd-dataset"),
]


def kaggle_cmd(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, "-m", "kaggle", *args],
        capture_output=True,
        text=True,
    )


def main():
    print("=== Kaggle Verification ===\n")

    # Auth check
    result = kaggle_cmd("datasets", "list", "--max-size", "1")
    if result.returncode != 0:
        print("✗ Authentication failed")
        print(result.stderr or result.stdout)
        print("\nFix:")
        print("  export KAGGLE_API_TOKEN=your_token")
        print("  # or: kaggle auth login")
        sys.exit(1)
    print("✓ Authentication OK\n")

    # Dataset access check
    print("Checking dataset access:\n")
    accessible = []
    for name, slug in DATASETS_TO_CHECK:
        meta = kaggle_cmd("datasets", "metadata", slug)
        if meta.returncode == 0:
            print(f"  ✓ {name:12} {slug}")
            accessible.append(name)
        else:
            err = (meta.stderr or meta.stdout or "").strip()
            status = "403 — chấp nhận điều khoản trên web" if "403" in err else "✗"
            print(f"  ✗ {name:12} {slug}  ({status})")

    print()
    if accessible:
        print(f"Recommended: python ml/dataset/download.py --dataset {accessible[0]}")
    else:
        print("Không dataset nào accessible. Mở từng link trên browser và chấp nhận điều khoản:")
        for name, slug in DATASETS_TO_CHECK:
            print(f"  https://www.kaggle.com/datasets/{slug}")


if __name__ == "__main__":
    main()
