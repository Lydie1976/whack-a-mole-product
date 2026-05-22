# Image2 Prompts

所有遊戲圖片素材均由 Image2 / AI Image Generation 製作，禁止使用網路抓圖、素材庫、盜版素材或 emoji 當最終圖像。

## 共同風格詞

```text
cute polished 2D mobile game asset, warm garden theme, soft rounded shapes, hand-painted texture, bright but gentle colors, high quality, transparent background, no text, no watermark, consistent character design, family friendly
```

透明素材採用 flat chroma-key 背景生成後本機去背，成品置於 `public/assets/`。

## 已生成素材

- `mole-normal.png`：可愛棕色地鼠，圓臉、大眼睛。
- `mole-gold.png`：金色發光地鼠，帶小星星。
- `mole-bomb.png`：黑色炸彈鼴鼠，調皮但不恐怖。
- `mole-freeze.png`：冰藍色地鼠，帶雪花元素。
- `mole-heart.png`：粉色愛心補給地鼠。
- `mole-boss.png`：園丁 Boss 地鼠，帶花園帽與工具。
- `mole-hit-effect.png`：星星爆裂打中特效。
- `garden-background.png`：溫暖花園背景。
- `garden-banner.png`：主選單橫幅圖。
- `soil-hole.png`：俯視角泥土地洞。
- `wood-panel.png`：木牌 UI 面板。
- `heart-icon.png`：生命值愛心圖示。
- `hammer-cursor.png`：可愛木槌圖示。
- `logo-mark.png`：遊戲 logo 小圖示。
- `coin-icon.png`：金幣分數圖示。
- `flower-badge.png`、`leaf-ornament.png`、`sparkle-cluster.png`：補充 UI 裝飾。

## 主要生成提示詞

### 遊戲素材表

```text
Create a single clean 4x4 grid sprite sheet of separate mobile game assets, one asset centered per cell, with generous padding and no labels. Assets in order: cute brown mole, golden glowing mole, black bomb mole, ice blue mole, pink heart support mole, larger garden boss mole, star burst hit effect, top-down cartoon soil hole, rounded wooden UI panel, cute heart life icon, cute wooden mallet icon, small garden mole logo mark, shiny gold coin icon, small flower badge, soft leaf button ornament, tiny sparkle cluster. Perfectly flat solid #00ff00 chroma-key background, no text, no watermark.
```

### 背景

```text
A warm sunny garden background for a family-friendly whack-a-mole browser game, with soft grass, flower beds, small shrubs, distant fence, gentle blue sky, cozy hand-painted mobile game polish, no characters and no text.
```

### 主選單 Banner

```text
A cheerful garden arcade banner for a whack-a-mole game, showing a friendly cute mole peeking from a soil hole with flowers, leaves, golden sparkles, a wooden mallet resting nearby, no written words.
```

## 檢查結果

- 透明素材角落 alpha 為 0。
- 背景與 Banner 保持不透明，適合頁面 cover 使用。
- 所有檔名與程式引用一致。
- 圖像無文字與浮水印。
