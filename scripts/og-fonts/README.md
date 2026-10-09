# 英文 OG 卡片的符號字型

只給 `src/lib/enOgImage.ts`（satori，build 前產生 `/og/en/**.png`）使用，網站頁面不載入。

公式裡的希臘字母、上下標（ₙ ᵢ ₁…）、‖ ∇ ≈ ≤ → 等符號不在 JetBrains Mono 與 Noto Sans TC 的 fontsource 子集內，
satori 會畫成豆腐字，所以另外放兩個 SIL OFL 1.1 字型的小子集當備援（授權見 `OFL.txt`）：

| 檔案 | 來源 | 範圍 |
|------|------|------|
| `NotoSansMono-OgSymbols.woff` | Noto Sans Mono（可變字型取 wght 400、wdth 100） | 希臘、拉丁擴充、修飾字母（ˣ 等）、上下標、標點、字母符號、箭頭、數學運算子、雜項技術符號 |
| `NotoSansMath-OgSymbols.woff` | Noto Sans Math（`@fontsource/noto-sans-math` 5.3.0 latin 400） | 數學運算子與補充、箭頭、雜項數學符號（∫ ∏ 等） |

缺字時 `renderEnOgCard` 會讓 build 失敗並列出字元；需要新符號時用 `pyftsubset` 擴大範圍重新產生。
