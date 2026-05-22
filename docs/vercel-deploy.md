# Vercel Deploy

## Vercel Dashboard

1. Import GitHub repo：`whack-a-mole-product`
2. Framework Preset：Next.js
3. Install Command：`npm install`
4. Build Command：`npm run build`
5. Output Directory：`.next`

## Vercel CLI

```bash
npm install
npm run build
npm i -g vercel
vercel login
vercel
vercel --prod
```

## 部署後檢查

- Production URL 可開啟。
- 主選單、玩法教學、開始遊戲可操作。
- 手機直式畫面可完整看到 HUD 與棋盤。
- Console 無 hydration error。
- localStorage 可保存最高分與排行榜。
