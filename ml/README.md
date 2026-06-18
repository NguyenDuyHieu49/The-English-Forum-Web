# Focus Detection — ML Pipeline

## Có thể train bằng dữ liệu không?

**Có.** Hiện tại app dùng **rule-based scoring** trên landmark MediaPipe (EAR, MAR, head pose) để chạy real-time ngay. Pipeline Python trong thư mục `ml/` cho phép **train model ML thật** từ dataset có label và thay thế hàm `computeFocusScore()` trong `src/ml/focus-detection/metrics.ts`.

Luồng đầy đủ:

```
Dataset công khai → Trích xuất features (EAR, MAR, blink...) → Train model → Export → Inference
```

## Mock data (không cần Kaggle) — khuyến nghị cho demo

Tạo **6.000 mẫu synthetic** mô phỏng EAR, MAR, head pose theo 5 trạng thái focus:

```bash
bash ml/run_mock_pipeline.sh
# hoặc chỉ generate:
python ml/dataset/generate_mock_data.py --samples 1200
python ml/training/train.py
python ml/evaluation/evaluate.py --model ml/models/focus_model.pkl --data ml/dataset/data/processed
```

> **Lưu ý đồ án:** Inference real-time trên app vẫn dùng **MediaPipe thật** (camera). Mock data chỉ dùng cho **phần train/evaluate pipeline ML** trong báo cáo.

---

## Dataset công khai (tùy chọn — thay mock khi có Kaggle)

| Dataset | Mô tả | Label | Link |
|---------|-------|-------|------|
| **NTHUDDD** | Video ngủ gật khi lái xe | not drowsy / drowsy | [Kaggle](https://www.kaggle.com/datasets/banudeep/nthuddd2) |
| **UTA-RLDD** | ~30h video, 60 người | alert / low vigilance / drowsy | [UTA-RLDD](https://sites.google.com/view/utarldd/home) |
| **YawDD** | Video ngáp | normal / yawning | [Kaggle](https://www.kaggle.com/datasets/enider/yawdd-dataset) |
| **DROZY** | Video + 68 landmarks | awake / drowsy | [DROZY](https://www.drozy.ulg.ac.be/) |

### Ánh xạ label → Focus Score (0–100)

| Label gốc | Focus Score | Trạng thái |
|-----------|-------------|------------|
| alert / not drowsy / awake | 85–95 | focused |
| low vigilance | 55–75 | slightly_distracted |
| drowsy / yawning | 15–40 | sleepy / distracted |
| no face / away | 0–15 | away |

## Cách tải dataset

### NTHUDDD (khuyến nghị — dễ nhất trên Kaggle)

```bash
# Cài Kaggle CLI: pip install kaggle
# Đặt kaggle.json vào ~/.kaggle/

python ml/dataset/download.py --dataset nthuddd
```

### UTA-RLDD

Đăng ký tại https://sites.google.com/view/utarldd/home, tải thủ công vào `ml/dataset/data/raw/uta-rldd/`

## Train model

```bash
pip install -r ml/requirements.txt

# 1. Trích xuất features từ video
python ml/dataset/extract_features.py --input ml/dataset/data/raw/nthuddd --output ml/dataset/data/processed

# 2. Train
python ml/training/train.py --data ml/dataset/data/processed --output ml/models/

# 3. Đánh giá
python ml/evaluation/evaluate.py --model ml/models/focus_model.pkl --data ml/dataset/data/processed
```

Model output: `ml/models/focus_model.pkl` — có thể export sang ONNX cho inference trên browser.

## Feature vector (12 chiều)

1. EAR trái, 2. EAR phải, 3. EAR trung bình  
4. MAR, 5. Blink rate, 6–8. Head pitch/yaw/roll  
9. Looking away, 10. Yawning, 11. Face detected, 12. Focus delta  

Trùng với logic trong `src/ml/focus-detection/metrics.ts`.

## Kiến trúc

```
ml/
├── dataset/
│   ├── download.py       # Tải dataset từ Kaggle
│   ├── extract_features.py  # MediaPipe → .npy
│   ├── label_mapping.py  # Map label → focus score
│   └── sources.md
├── training/train.py     # GradientBoostingRegressor
├── evaluation/evaluate.py
└── models/               # Output sau train
```
