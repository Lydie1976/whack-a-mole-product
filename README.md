# 打地鼠：花園大作戰

**Whack-a-Mole: Garden Rush** 是一款可部署到 Vercel 的產品級瀏覽器打地鼠遊戲。遊戲以溫暖花園為主題，支援滑鼠與手機觸控，包含完整主選單、教學、HUD、音效、動畫、Combo、Boss、排行榜與 localStorage 保存。

## 功能

- 60 秒限時、3x4 共 12 個洞、3 顆生命。
- 一般、黃金、炸彈、冰凍、愛心、園丁 Boss 六種目標。
- Combo 系統：連續打對 5 次後，每次額外 +5 分。
- 分數越高速度越快，最高 9 級，低等級限制同時出現數量以維持親子友善節奏。
- Web Audio API 生成開始、命中、誤打、漏打、倒數、結束音效。
- localStorage 保存最高分、排行榜與音效偏好。
- Framer Motion 動畫、Zustand 狀態管理、Tailwind 響應式 UI。
- 所有遊戲圖像素材皆由 Image2 / AI Image Generation 生成，存放於 `public/assets/`。

## 本機執行

```bash
npm install
npm run dev
```

開啟 `http://127.0.0.1:3000`。

## 品質檢查

```bash
npm run lint
npm run typecheck
npm run build
```

目前本機已通過以上三項檢查。

## 部署

Production URL：

- https://whack-a-mole-product.vercel.app

Vercel 設定：

- Framework Preset：Next.js
- Build Command：`npm run build`
- Install Command：`npm install`
- Output Directory：`.next`

詳見：

- [GitHub 設定](docs/github-setup.md)
- [Vercel 部署](docs/vercel-deploy.md)
- [產品規格](docs/product-spec.md)
- [Image2 提示詞](docs/image2-prompts.md)
- [發佈檢查表](docs/release-checklist.md)
