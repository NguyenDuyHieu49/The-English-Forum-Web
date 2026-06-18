# The English Forum — AI-Powered English Learning Platform

Nền tảng học tiếng Anh thông minh với AI, gamification và Computer Vision focus detection.

## Features

- **The English Forum** branding — UI hiện đại, SaaS-quality
- **i18n** — Mặc định Tiếng Việt, chuyển sang English trong Settings
- **AI Focus Detection** — MediaPipe real-time + ML pipeline train được
- **Gamification** — XP, tokens, pet, streaks, rewards
- **Dual modes** — Normal (gamified) & Focus (minimalist)

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở http://localhost:3000 → Splash → Login → Sign In (demo mode nếu chưa có Firebase)

**Node.js ≥ 20** khuyến nghị.

## Focus Detection — Mock hoặc Kaggle

**Mock (nhanh, không cần Kaggle):**
```bash
bash ml/run_mock_pipeline.sh
```

**Kaggle (dataset thật):** xem [`ml/README.md`](ml/README.md)

## Language / Ngôn ngữ

- Mặc định: **Tiếng Việt**
- Đổi ngôn ngữ: **Cài đặt → Ngôn ngữ**

## License

University graduation project.
# The-English-Forum-Web
