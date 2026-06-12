# Explore 視覺風格系統（Explore Art System）

> 適用範圍：`/explore` 視覺化頁、`ExploreInteractiveStage`、ExploreCard 靜態封面。  
> Works 規格見 [`workart.md`](workart.md)；視覺入口見 [`art.md`](art.md)。

---

## 1. 目的與邊界

Explore 是主題型視覺化入口，和 Works 分離：

- 不走 `CurveModule` / Works portal 架構。
- 互動根元件由 `src/components/explore/*ExploreRoot.tsx` 擁有。
- 列表封面使用靜態 `coverImage` PNG，不使用 `curveThumbnail.ts`。
- 本輪封面補齊不修改 `ExploreCard` 顯示邏輯；只補靜態圖片資產、來源檔與 `src/content/explore/*.md` frontmatter。

Explore 封面是主題概念入口，不是完整 UI 截圖，也不是單一 Works 作品封面的複製。

---

## 2. 共通視覺語言

| 項目 | 規格 |
|------|------|
| 背景 | `rgb(10, 10, 10)` / `#0a0a0a` |
| 主線 | `rgb(212, 184, 122)` 金色 |
| Guide / grid | 白或灰白低 alpha |
| 主視覺佔比 | 70%-85% |
| UI 權重 | 融入背景，不搶主視覺 |

視覺層級固定：

```text
1. 主曲線 / 解軌跡 / 主向量 / 主結構
2. Glow 或高亮層
3. Guide / Grid / projection
4. UI 文字
```

---

## 3. Explore Runtime Layout

### 3.1 通用規則

- 控件內嵌於各 `*ExploreRoot`，非 Works 頁的 `createPortal`。
- **Layout 優先順序**（新主題預設）：
  ```text
  stage + sidebar（visual 左 / 控件右；手機 visual 上 / sidebar 下）
  ```
  例如 Wave Superposition。僅在概念適合時才用 **toolbar 型**（canvas 下 `.…-explore__toolbar`，如 Fourier）。
- Reveal 用 `deltaTime`；避免固定每幀增量。
- Mode / N 等離散參數應走 path cache；draw 只做 slice + guide。
- Canvas 內避免長文、完整公式清單、debug panel。
- Canvas HUD 不重複 Explore 頁面標題；主題名稱只出現在頁面 header。p5 內只保留必要模式、短狀態或局部標籤，避免和 `h1` 形成雙標題。
- 未列出專屬 layout 的 Explore root，先遵守本節通用規則；不得自行引入 Works portal 或重做控制面板架構。
- **共用控件 CSS**（詳情頁由 `[slug].astro` 引入；**toolbar 型專用**，非所有 Explore 的 layout 標準）：
  - `src/styles/components/explore/explore-toolbar.css` — toolbar 型：間距、mode 字級/邊框、`--explore-accent`
  - `src/styles/components/explore-touch.css` — mode 按鈕最小觸控區（toolbar 與 sidebar 內 button 皆可共用）
- **toolbar 型** `*ExploreRoot` 的 mode / toolbar 按鈕對齊 §3.1.1；**sidebar 型** 寫主題 layout CSS，勿為套用 toolbar 而改 DOM 結構。站點殼層見 [`site-ux.md`](site-ux.md) §5。

#### 3.1.1 Toolbar / mode 命名約定（`explore-toolbar.css`）

共用樣式靠 **suffix / substring attribute selector** 零配置套用（刻意設計，非 accidental global）：

| Selector | 新主題應使用的 class 慣例 |
|----------|---------------------------|
| `[class$='-explore__toolbar']` | `.{topic}-explore__toolbar` |
| `[class*='-explore__mode-btn']` | `.{topic}-explore__mode-btn` |
| `[class*='-explore__mode']:where(button)` | 短名 `__mode` 的 `<button>` |

- Specificity 與 class 相同。偏離共用樣式 → 在主題 CSS **覆寫**（import 順序在 `explore-toolbar.css` 之後），或改用不觸發 selector 的 class 名。
- `fourier-explore.css` 等檔案只保留 **layout 專屬** 規則；與 toolbar/mode 重複的 spacing、字級、邊框應刪除，否則共用層失效。
- Canonical comment：`src/styles/components/explore/explore-toolbar.css` 檔首。

### 3.2 Fourier（`fourier-series`）

- 佈局：`.fourier-explore`，canvas 上、`.fourier-explore__toolbar` 下。
- 方形容器 + `min(34vh, 400px)` 限高。
- Epicycles guide 低於主曲線：`stroke(255,255,255,12-20)`，細線。
- Guide 端點需對齊 reveal 邊緣。

### 3.3 Wave Superposition（`trig-wave-interference`）

- 佈局：`.wave-explore__stage`，圖左、控件右。
- 桌面 `>=1024px`：sidebar sticky，`overscroll-behavior: contain`。
- 手機：canvas 上、sidebar 下。
- 舞台隔離：`wave-explore__stage { contain: layout }`。

固定 DOM：

```text
wave-explore
└─ wave-explore__stage
   ├─ wave-explore__visual
   └─ wave-explore__sidebar
      ├─ mode-switch
      ├─ state-info
      ├─ wave-a-controls
      ├─ wave-b-controls
      └─ formula
```

Canvas 高度：

```ts
height = clamp(300px, width * ratio, 520px)
```

`vh` 只作可選上限，不單獨作主高度。

---

## 4. Explore Cover Pipeline

Explore list card 使用 `ExploreCard` + frontmatter `coverImage`。

| 系統 | 封面來源 |
|------|----------|
| `/explore` | 靜態 PNG cover |
| `/works` | build-time SVG（見 `workart.md`） |

目前 `fourier-series` 已有封面；其餘新封面依本文件生成。

---

## 5. File Naming And Source Files

- 新 PNG：`public/images/explore-covers/{slug}.png`
- 新來源檔：`scripts/explore-covers/{slug}.*`
- 可接受來源：SVG、Canvas/p5.js 腳本、Matplotlib 腳本、設計軟體向量檔。
- frontmatter：`coverImage: /images/explore-covers/{slug}.png`
- 每完成一張 PNG，立即將來源檔、PNG、對應 `src/content/explore/{slug}.md` 的 `coverImage` 納入同一個變更單位；不得只產 PNG 而漏補來源或 frontmatter。
- `fourier-series` 保留 `coverImage: /explore/fourier-series-epicycles-cover.png`。
- 不接受只有 PNG、沒有可重現來源檔的封面變更。

---

## 6. Production Rules

- 優先使用 SVG/canvas/p5.js/Matplotlib 等可重現方式。
- AI 可用於草稿構想，但不得作為最終 PNG 的直接來源。
- 統一輸出 `1600x1000` PNG；卡片由 CSS 壓縮。
- 縮圖有效線寬：主線 `6-10px`；輔助線 `3-5px`；ghost guide 可更細更淡但不得承擔主語意。
- 本節線寬只適用於 Explore 靜態封面輸出尺度；不要套用到 Works runtime p5 glow 線寬。
- 安全區為中心 `1248x720px`。核心語意元素必須落入；背景網格、guide、波形延伸、低透明紋理可超出。
- 驗收 overlay 使用同尺寸透明 SVG 或瀏覽器/CSS 絕對定位框，重疊於 `1600x1000` PNG 檢查；最終 PNG 不顯示安全區。
- 不加入完整 UI、滑桿、按鈕、控制面板、密集數值刻度、長標籤或圖例。
- 不依賴文字；必要符號只能少量出現，且不能成為辨識主體。

### 6.1 Cover Palette

| Token | 值 | 用途 |
|-------|-----|------|
| background | `#0A0A0A` 或 `#0F0F0F` | 暗底 |
| gold | `#D4B87A` | 主線、主結構 |
| guide | `#D8D8D8` | 低透明 guide / 分割線 |
| blue | `#5DADE2` | 對數、投影波形、抽樣點等次要語意 |
| red | `#E76F51` | 誤差區、局部警示語意 |

每張封面最多使用 2 種次要語意色；金色主線仍是主識別。

---

## 7. Cover Decisions

### 優先修正

- `limits-riemann-sum`：n >= 6 等寬矩形切片，金色曲線覆蓋；局部紅色誤差區 opacity `0.18-0.28`，不得壓過主曲線。
- `differential-equations-geometry`：灰白 slope field 短線網格 opacity `0.35-0.5`，疊 1-2 條金色解曲線；密度不得過高，375px 下需看得出短線方向場而非灰霧。

### 語意調整

- `sequences-and-series`：金色 `1/2`、`1/4`、`1/8`、`1/16` 遞減區塊逐步填滿固定總量；灰白極限邊界線與金色收斂箭頭指向邊界；相鄰區塊尺寸比至少約 `2:1`，不得使用等寬切片。
- `probability-statistics`：中央 `2x2` 或嵌套矩形表達事件交集與條件比例；灰白分割線 opacity `0.35-0.5`；少量低透明藍色隨機點只作背景紋理，數量不得干擾中央矩形；不用投針。
- `permutations-combinations`：金色格點分支路徑，灰白低透明格點 guide；突出選擇與路徑計數，不用帕斯卡三角形。
- `complex-euler-formula`：金色複平面旋轉向量 + 藍色 sin/cos 投影波形 + 灰白 projection guide，避免純單位圓。
- `exponential-logarithm`：第一象限 `x: 0..3`、`y: 0..3`；金色指數、藍色對數、灰白 `y=x` 虛線；對數只繪可見區段，從接近 `(1,0)` 向右上延伸，避免 `x=0` 附近斷裂或貼邊雜訊。
- `vectors`：原向量金色實線箭頭；投影線段落在另一向量上；垂直虛線用低對比灰白 opacity `0.38-0.5` 連接投影點與原向量終點。

### 既定方向新生成

- `matrix-linear-transform`：變形後金色網格為主；原始直角網格 ghost guide opacity `0.05-0.08`；中央突出單位方形變成的平行四邊形。
- `trig-wave-interference`：兩條來源波 opacity `0.28-0.4`；合成波與包絡線較亮，避免所有波線同權重。
- `conic-dynamic-geometry`：正式實作前先做低成本 375px 草稿。優先三段式橫向構圖，左橢圓、中拋物線、右雙曲線；三段大致各佔中央寬度 30%，留 5% 間距；共享 guide 只作輔助。若草稿不可辨，改為放大三段側向排列並弱化共享 guide，不改成單一曲線。
- `trigonometry-fundamentals`：中央單位圓為主（金色半徑 + 投影虛線 + 小角度弧）；右下三角形與外接圓 guide 只作次要提示，opacity 0.22–0.32，不得與單位圓同權重。

### 保留現有

- `fourier-series`：保留既有 epicycle cover 與路徑。本輪只檢查並記錄偏差，不裁切、不改色、不覆蓋；若要調整，另開任務。

---

## 8. Implementation Order

Gate：

1. 先檢查 `fourier-series` 現有圖並記錄差異。
2. 先做 `conic-dynamic-geometry` 375px 草稿驗證。

正式順序：

1. `limits-riemann-sum`
2. `differential-equations-geometry`
3. `sequences-and-series`
4. `probability-statistics`
5. `permutations-combinations`
6. `complex-euler-formula`
7. `exponential-logarithm`
8. `vectors`
9. `matrix-linear-transform`
10. `trig-wave-interference`
11. `conic-dynamic-geometry`

---

## 9. Acceptance

- 每張 PNG 用 375px 寬、16:10 card 容器檢查，並疊安全區 overlay；主語意不得裁切或落出安全區。
- 同一列 Explore cards 並排時，需呈現同一系列：暗底、金色主線、低噪音、無完整 UI。
- 若需要讀文字、依賴超過 3 種語意色、包含完整 UI、主體被裁切、或小尺寸只剩裝飾線條，視為不通過。
- `limits-riemann-sum` 不可像普通函數圖；`sequences-and-series` 不可像黎曼等寬切片。
- `probability-statistics` 不可被誤認為 Buffon 投針作品。
- `conic-dynamic-geometry` 必須在 375px 下仍能分辨橢圓、拋物線、雙曲線。
- 所有新封面完成後，確認每個新 PNG 都有來源檔、對應 frontmatter 已補 `coverImage`，且路徑實際存在。

---

## 10. Explore 檢查清單

- [ ] Reveal 用 `deltaTime`，非固定每幀增量。
- [ ] Mode / N 離散參數有 cache；draw 只做 slice + guide。
- [ ] 控件內嵌於 Explore root，不走 Works portal。
- [ ] mode / toolbar 樣式優先沿用 `explore-toolbar.css` + `explore-touch.css`。
- [ ] 列表 `coverImage` 只有在實際資產存在時才設定。
- [ ] 新封面同時納入 PNG 與可重現來源檔。
