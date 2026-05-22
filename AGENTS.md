# Codex Agent Instructions — 打地鼠：花園大作戰 Product Build

你是本專案的 Codex 開發代理。請嚴格依照本文件從零開始建立、開發、測試、部署並交付成品。此專案不是 MVP，必須達到可直接展示、可上線、可交付使用的完成品水準。

## 0. 專案名稱與位置

- 專案名稱：`whack-a-mole-product`
- 本地端預設路徑：`C:\Users\lydie\My gitHub\whack-a-mole-product`
- GitHub repo 名稱：`whack-a-mole-product`
- Vercel project 名稱：`whack-a-mole-product`
- 技術棧：Next.js App Router、TypeScript、Tailwind CSS、React Hooks

## 1. 絕對必須遵守的總規則

1. 不可以只做 MVP。必須完成產品級版本。
2. 不可以用外部下載圖片、素材庫、盜版素材或未授權圖像。
3. 遊戲內所有圖像、角色、背景、圖示、道具、UI 裝飾，必須由 Image2 生成。
4. 生成圖像後要放在 `public/assets/`，並使用清楚命名。
5. 任何修改都要保留此架構，不可任意改名、刪除核心文件或跳過部署文件。
6. 開發完成後必須通過：`npm run lint`、`npm run typecheck`、`npm run build`。
7. 所有 UI 必須支援手機、平板、桌機響應式畫面。
8. 所有規則與分數要清楚顯示，玩家第一次打開就知道怎麼玩。
9. GitHub 與 Vercel 設定要完整，讓使用者可以照文件部署。
10. 若遇到缺圖，先用 Image2 補齊，不可用 emoji 當最終成品圖像。

## 2. 產品定位

製作一款可直接上線的瀏覽器打地鼠遊戲：

- 風格：溫暖可愛、花園主題、親子友善、可作為作品集展示。
- 遊戲名稱：`打地鼠：花園大作戰`
- 英文副標：`Whack-a-Mole: Garden Rush`
- 目標玩家：兒童、親子、休閒玩家、短時間反應力遊戲玩家。
- 遊玩時間：單局 60 秒。
- 操作方式：滑鼠點擊或手機觸控。

## 3. 主流玩法參考後的遊戲規則

請參照主流打地鼠遊戲常見機制：隨機出現、限時反應、打中得分、漏打懲罰、速度逐步提高、最高分紀錄、特殊目標與干擾物。

正式規則如下：

1. 棋盤：建議 3x4，共 12 個洞。
2. 時間：每局 60 秒。
3. 生命：起始 3 顆心。
4. 一般地鼠：打中 +10 分；漏打 -1 生命。
5. 黃金地鼠：打中 +30 分；漏打 -1 生命。
6. 炸彈鼴鼠：打中 -20 分並 -1 生命；不打不扣分。
7. 冰凍地鼠：打中 +15 分並加 2 秒；漏打 -1 生命。
8. 愛心補給：打中回復 1 生命，最多 3 顆；漏打不扣分。
9. 連擊：連續打對 5 次後，每次額外 +5 分；打錯或漏打歸零。
10. 難度：分數越高，出現速度越快，最多 9 級。
11. 結束條件：時間歸零或生命歸零。
12. 結算畫面：顯示本局分數、最高分、命中率、最大連擊、評語、重新開始按鈕。
13. 最高分：使用 localStorage 保存。
14. 音效：至少包含開始、打中、打錯、倒數、結束音效；若無音檔，請用 Web Audio API 生成。

## 4. UI/UX 完成品要求

必須包含：

- 開始畫面：遊戲標題、玩法說明、開始按鈕、難度/模式說明。
- 遊戲畫面：分數、最高分、時間、生命、等級、連擊、暫停按鈕。
- 遊戲盤：12 個洞，地鼠從洞中彈出，動畫自然。
- 特殊角色提示：讓玩家分辨一般地鼠、黃金地鼠、炸彈、冰凍、愛心。
- 結算畫面：本局成績、最高分、再次挑戰、分享文案。
- 響應式：手機直式可以完整遊玩，桌機有更寬敞的視覺。
- 無障礙：按鈕有 aria-label，顏色不作為唯一判斷，重要資訊有文字輔助。
- 視覺品質：不可像練習範例，必須有完整品牌感與細節。

## 5. Image2 圖像生成任務

請使用 Image2 生成以下完整素材，全部放在 `public/assets/`：

### 5.1 角色圖像

1. `mole-normal.png`：可愛棕色地鼠，圓臉，大眼睛，花園主題，透明背景。
2. `mole-gold.png`：金色發光地鼠，帶小星星，透明背景。
3. `mole-bomb.png`：黑色炸彈鼴鼠，表情調皮但不恐怖，透明背景。
4. `mole-freeze.png`：冰藍色地鼠，帶雪花元素，透明背景。
5. `mole-heart.png`：粉色愛心補給地鼠，溫柔可愛，透明背景。
6. `mole-hit-effect.png`：打中時的星星爆裂特效，透明背景。

### 5.2 場景與 UI 圖像

1. `garden-background.png`：溫暖花園背景，適合橫式與桌機延展。
2. `soil-hole.png`：泥土地洞，俯視角，透明背景。
3. `wood-panel.png`：木牌 UI 面板，透明背景。
4. `heart-icon.png`：生命值愛心圖示，透明背景。
5. `hammer-cursor.png`：可愛木槌游標/按鈕圖示，透明背景。
6. `logo-mark.png`：遊戲 logo 小圖示，透明背景。

### 5.3 Image2 提示詞規格

每張圖都要使用同一視覺風格：

```text
cute polished 2D mobile game asset, warm garden theme, soft rounded shapes, hand-painted texture, bright but gentle colors, high quality, transparent background, no text, no watermark, consistent character design, family friendly
```

產圖後必須檢查：

- 是否透明背景。
- 是否沒有文字與浮水印。
- 是否風格一致。
- 是否在手機畫面中仍清楚可辨識。
- 是否檔名與程式引用一致。

## 6. 專案資料夾結構

必須維持以下結構：

```text
whack-a-mole-product/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ Game.tsx
│  ├─ GameBoard.tsx
│  ├─ ScorePanel.tsx
│  ├─ StartScreen.tsx
│  └─ ResultModal.tsx
├─ lib/
│  ├─ gameConfig.ts
│  ├─ gameEngine.ts
│  └─ storage.ts
├─ public/
│  └─ assets/
├─ docs/
│  ├─ product-spec.md
│  ├─ github-setup.md
│  ├─ vercel-deploy.md
│  ├─ image2-prompts.md
│  └─ release-checklist.md
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ agent.md
├─ AGENTS.md
├─ README.md
├─ package.json
├─ next.config.mjs
├─ tailwind.config.ts
├─ postcss.config.mjs
└─ tsconfig.json
```

若目前檔案不足，請補齊；若程式已放在單一 Game.tsx，請依照上方結構拆分成可維護模組。

## 7. 開發流程

請依序完成：

1. 建立 Next.js 專案。
2. 安裝 TypeScript、Tailwind CSS、ESLint。
3. 建立資料夾與基礎檔案。
4. 用 Image2 生成所有素材。
5. 完成遊戲引擎：時間、分數、生命、連擊、等級、隨機出現、特殊角色、結束判定。
6. 完成 UI：開始畫面、遊戲畫面、暫停、結算。
7. 完成音效與互動回饋。
8. 完成 localStorage 最高分。
9. 完成 RWD 與無障礙。
10. 完成文件。
11. 本地測試：`npm run dev`。
12. 品質檢查：`npm run lint`、`npm run typecheck`、`npm run build`。
13. 建立 GitHub repo 並推送。
14. 連接 Vercel 並部署。
15. 檢查線上網址可正常遊玩。

## 8. GitHub 指令

在本地端完成後執行：

```bash
git init
git add .
git commit -m "Initial product release: Whack-a-Mole Garden Rush"
git branch -M main
git remote add origin https://github.com/lydie1976/whack-a-mole-product.git
git push -u origin main
```

若 repo 尚未建立，請先用 GitHub CLI：

```bash
gh repo create whack-a-mole-product --public --source=. --remote=origin --push
```

## 9. Vercel 部署指令

若使用 Vercel CLI：

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

部署設定：

- Framework Preset：Next.js
- Build Command：`npm run build`
- Output Directory：`.next`
- Install Command：`npm install`

## 10. 完成定義

只有符合以下條件才算完成：

- 可在本地端 `npm run dev` 遊玩。
- 可成功 `npm run build`。
- GitHub 有完整 repo。
- Vercel 有 production URL。
- 所有圖像由 Image2 生成並在遊戲中使用。
- 不是 emoji 或佔位圖版本。
- UI 完成度高，能直接當成作品展示。
- README 與 docs 足以讓非工程背景使用者照著部署。

