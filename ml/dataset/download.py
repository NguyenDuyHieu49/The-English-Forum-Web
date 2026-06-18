"""
Download public focus/drowsiness datasets from Kaggle.

Auth (pick one):
  export KAGGLE_API_TOKEN=your_token
  ~/.kaggle/access_token
  ~/.kaggle/kaggle.json  (legacy)

Usage:
  python ml/dataset/download.py --list
  python ml/dataset/download.py --dataset ddd
  python ml/dataset/download.py --dataset yawdd
  python ml/dataset/verify_kaggle.py
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data" / "raw"

# banudeep/nthuddd2 was removed from Kaggle (404) — use alternatives below
DATASETS = {
    "ddd": {
        "kaggle": "ismailnasri20/driver-drowsiness-dataset-ddd",
        "description": "Driver Drowsiness Dataset (DDD) — images, recommended",
        "url": "https://www.kaggle.com/datasets/ismailnasri20/driver-drowsiness-dataset-ddd",
    },
    "eyes-yawn": {
        "kaggle": "aryansharma8911/open-closed-eyes-and-yawning-labelled",
        "description": "Open/closed eyes & yawning — labelled images",
        "url": "https://www.kaggle.com/datasets/aryansharma8911/open-closed-eyes-and-yawning-labelled",
    },
    "yawdd": {
        "kaggle": "enider/yawdd-dataset",
        "description": "YawDD — yawning detection videos",
        "url": "https://www.kaggle.com/datasets/enider/yawdd-dataset",
    },
    "nthuddd": {
        "kaggle": "banudeep/nthuddd2",
        "description": "[DEPRECATED] Removed from Kaggle — use 'ddd' instead",
        "url": "https://www.kaggle.com/datasets/banudeep/nthuddd2",
        "deprecated": True,
    },
}


def check_kaggle() -> bool:
    if shutil.which("kaggle") is not None:
        return True
    try:
        import kaggle  # noqa: F401
        return True
    except ImportError:
        return False


def kaggle_cmd(*args: str) -> subprocess.CompletedProcess[str]:
    if shutil.which("kaggle"):
        return subprocess.run(["kaggle", *args], capture_output=True, text=True)
    return subprocess.run(
        [sys.executable, "-m", "kaggle", *args],
        capture_output=True,
        text=True,
    )


def print_403_help(slug: str, url: str) -> None:
    print("\n── 403 Forbidden — cách xử lý ──")
    print("1. Mở link dataset trên trình duyệt (đã đăng nhập Kaggle):")
    print(f"   {url}")
    print("2. Bấm nút download hoặc 'New Notebook' — nếu có popup, chấp nhận điều khoản.")
    print("3. Vào tab Data → bấm 'Download' hoặc copy API command chính xác từ đó.")
    print("4. Thử lại:")
    print(f"   python ml/dataset/download.py --dataset ddd")
    print("\nHoặc tải thủ công:")
    print(f"   - Tải zip từ {url}")
    print(f"   - Giải nén vào: {DATA_DIR / 'ddd'}")
    print("   - Chạy: bash ml/run_pipeline.sh")


def download_kaggle_dataset(name: str, kaggle_slug: str, url: str) -> Path:
    output = DATA_DIR / name
    output.mkdir(parents=True, exist_ok=True)

    print(f"Downloading {name} from Kaggle ({kaggle_slug})...")
    print(f"Output: {output}")

    result = kaggle_cmd(
        "datasets", "download", "-d", kaggle_slug, "-p", str(output), "--unzip"
    )

    if result.returncode != 0:
        print("Kaggle download failed:")
        err = (result.stderr or result.stdout or "").strip()
        print(err)
        if "403" in err or "Forbidden" in err:
            print_403_help(kaggle_slug, url)
        sys.exit(1)

    print(f"Downloaded to {output}")
    return output


def main():
    parser = argparse.ArgumentParser(description="Download focus detection datasets")
    parser.add_argument(
        "--dataset",
        choices=list(DATASETS.keys()),
        help="Dataset to download",
    )
    parser.add_argument("--list", action="store_true", help="List available datasets")
    args = parser.parse_args()

    if args.list:
        print("Available datasets:\n")
        for key, info in DATASETS.items():
            flag = " [DEPRECATED]" if info.get("deprecated") else ""
            print(f"  {key:12} {info['description']}{flag}")
            print(f"             {info['url']}\n")
        return

    if not args.dataset:
        parser.print_help()
        sys.exit(1)

    info = DATASETS[args.dataset]
    print(f"Dataset: {info['description']}")

    if info.get("deprecated"):
        print("\n⚠ Dataset này không còn trên Kaggle. Dùng --dataset ddd thay thế.")
        sys.exit(1)

    if not check_kaggle():
        print("Kaggle CLI not found. Install: pip install kaggle")
        print(f"\nManual download: {info['url']}")
        print(f"Extract to: {DATA_DIR / args.dataset}")
        return

    download_kaggle_dataset(args.dataset, info["kaggle"], info["url"])


if __name__ == "__main__":
    main()
