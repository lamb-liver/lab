# Works 視覺風格系統（Work Art System）

> 適用範圍：`/works` 作品頁、`CurveModule` runtime、`WorkCard` build-time SVG 縮圖。  
> **只替換 geometry，不重做 style。**  
> 視覺入口見 [`art.md`](art.md)；工程整合見 [`p5toreact.md`](p5toreact.md)。

---

## 1. 目的與邊界

| 是 | 不是 |
|----|------|
| 極簡、安靜、可進作品集的數學視覺 | 工程 debug 視圖 |
| 固定視覺語言 + 可替換曲線模組 | 繪圖計算機 / 科學繪圖 / 教學圖解 |
| Rose、Lissajous、Spirograph、Harmonograph 等共用 | 每條曲線各做一套 UI / glow |

一句話：Curve 是唯一主角；其餘元素（grid、guide、UI）視覺權重必須更低。

---

## 2. 視覺層級

```text
1. Curve（含 glow 主線）
2. Glow 光暈層
3. Guide / Grid
4. UI 文字
```

禁止 guide 比 curve 更亮、更粗、更吸睛。

---

## 3. Design Tokens

### 3.1 色彩

| Token | 值 | 用途 |
|-------|-----|------|
| `bg.canvas` | `rgb(10, 10, 10)` | p5 `background`；畫布 host 背景 |
| `color.accent` | `rgb(212, 184, 122)` | 曲線主色（金） |
| `color.guide` | `rgb(255, 255, 255)` | 網格 / guide 線（必須低 alpha） |
| `color.ui.title` | accent + bold + 小字 | 曲線名稱 |
| `color.ui.meta` | 灰、小字 | 公式、參數 |

避免高彩度、多 accent、純白主體、大面積實心色塊。

### 3.2 透明度區間

| 元素 | alpha 範圍 |
|------|------------|
| Guide / grid | 6-18 |
| Ghost curve | 約 16 |
| Outer glow | 約 16 |
| Middle glow | 約 42 |
| Core line | 約 230 |
| UI | 低對比，融入背景 |

### 3.3 線寬（曲線 glow 標準）

| 層 | strokeWeight | stroke alpha |
|----|--------------|--------------|
| Outer glow | 約 7 | 約 16 |
| Middle glow | 約 3.5 | 約 42 |
| Core line | 約 1.5 | 約 230 |

實作對應 `CurveStyle.reveal.layers`（由外到內繪製）。

本節線寬是 Works runtime p5 畫布尺度；不要套用到 Explore 靜態封面。Explore cover 的 `1600x1000` PNG 線寬見 [`exploreart.md`](exploreart.md)。

---

## 4. 渲染規則

### 4.1 背景

```ts
background(10, 10, 10);
```

- 畫布容器 CSS 背景與 p5 一致（`#0a0a0a`）。
- 不用漸層、不用純白底。

### 4.2 Guide / Grid

Guide 只提供空間感，不是主體。

| 規則 | 說明 |
|------|------|
| 僅 outline | `noFill()`，禁止實心 guide |
| 低 alpha | `stroke(255, 255, 255, 6-18)` |
| 細、少、不密集 | 忌 HUD 風、粗網格、高亮軸 |

### 4.3 Ghost Curve

| 項目 | 規格 |
|------|------|
| 目的 | 完整 shape reference；reveal 時維持構圖 |
| 強度 | 永遠弱於 reveal 主線 |
| 建議 | accent @ alpha 約 16，weight 約 1 |

### 4.4 Reveal 主線

- 不要 instant 全出；需保留生成 / 漸進 / 繪製感。
- 幀驅動作品 `revealSpeed` 約 `0.0015-0.0025` / frame；Rose = `0.0024`。
- 依曲線選 `byTheta` 或 `byArcLength`。
- `revealProgress` 為 0-1 比例；連續 morph 中改 shape 的 identity 合約見 [`reactkey.md`](reactkey.md)。

### 4.5 構圖

| 項目 | 規格 |
|------|------|
| 曲線佔比 | 畫面 70%-85% |
| 對齊 | centered、symmetrical、visually balanced |
| 避免 | 過多留白、curve 過小 |

作品頁互動畫布通常是方形容器。從寬版 p5 prototype 移植時，先把設計座標收斂到接近方形的 world view，再讓幾何填滿畫布。

---

## 5. Works UI

- 舞台：`.work-detail__stage`，canvas 左、`.controls-panel--stage` 右（React portal）。
- 桌面 `>=1024px`：右欄 `sticky`；手機：canvas 上、控制下（均在 prose 之前）。
- **互動優先**：compact header（`.work-detail__header`：`h1` + tags）在舞台**上方**；prose 在舞台下方。詳情頂部 breadcrumb + 返回分工見 [`site-ux.md`](site-ux.md) §3–§4。
- 手機 `<1024px`：控制區包在 `<details.work-detail__controls>`，summary「調整參數」，預設收合；portal 目標 `<aside>` 收合時仍在 DOM，參數來自 React state 非 input 初值。
- 控件：`ParamControls` + `StatsPanel`（需要時 `DeltaPhaseControl` 或 `curve-work-mode-toggle`）；由 `getMetadata` 驅動公式與 stats。
- **分組小標**（`.controls-panel__section-label`）：僅用於自訂 `*CurveRoot` 且面板有 **≥2 語意群組** 時；標準 `CurveWorkRoot` **不加**「參數」小標。見 [`site-ux.md`](site-ux.md) §4.4。
- Canvas 內不放大段說明文字、公式清單或狀態面板；這些交給右側 React controls / Markdown。
- 上下篇 label：**較早一篇 / 較新一篇**（依 date 舊→新排序，語意不暗示主題連續）。

---

## 6. Works 縮圖

Works 卡片縮圖 = 作品概念的 build-time SVG 封面，不是互動畫布截圖。

| 區塊 | 來源 |
|------|------|
| `/works` | `curveThumbnail` + `workCurveBySlug` |

封面目標：

- 卡片尺寸下應能在 1 秒內看出主題。
- 封面場景可不同於互動初始參數，但只能在 `purpose: 'thumbnail'` 分支或 thumbnail builder 內處理。
- 結果型作品展示美感；概念型作品展示關係；過程型作品展示完成態與主因果。
- 主視覺約佔 70%-85%；375px mobile 下仍需可辨。
- 暗底 + 金色主線為主；概念型可用少量次要強調色區分語意。
- 避免大量文字、完整 UI 截圖、過密點雲、過細線條、單純複製不具辨識度的 runtime 初始狀態。

工程規範：

- 詳細 audit 與驗收清單見 [`thumbnail-cover-optimization.md`](thumbnail-cover-optimization.md)。
- 多幾何作品使用 `ThumbnailSpec.paths[]`；禁止把不相鄰分支硬串成單折線。
- `excludeFromBbox: true` 的 path 僅繪製，不參與定框。
- 粒子型縮圖可用單一 path + 多段 `M L` 點雲筆觸，避免數千個 `<path>`。
- 點雲筆觸允許以 `NaN` 分段，建置期會轉成多子路徑。

---

## 7. 程式對照

新增作品曲線：

```text
geometry     -> src/curve/modules/<name>/index.ts
style        -> src/systems/rendering/presets.ts
compose      -> renderFrame(p, snap, renderPreset)
lifecycle    -> CurveWorkRoot 或 *CurveRoot + useMorphCurveP5 + portal
thumbnail    -> sample(..., { purpose: 'thumbnail' })
```

檢查清單：

- [ ] `renderPreset.background` = `[10, 10, 10]`
- [ ] `curveStyle` 使用 accent `(212, 184, 122)` + 分層 glow
- [ ] ghost 弱於 reveal；grid/guide 僅低 alpha 線框
- [ ] `work-detail__stage` 右欄 portal；滑桿一屏可見
- [ ] 手機 accordion 收合不阻斷 portal mount（見 [`site-ux.md`](site-ux.md) §4.3）
- [ ] 連續 lerp 參數遵守 `reactkey.md`
- [ ] 未重做 glow / hierarchy 語言

---

## 8. 複數幾何主題補充

複數平面三題（四則運算、極座標、尤拉旋轉）沿用同一視覺語言，僅替換 geometry 與互動參數。

| 主題 | 主體 | guide | UI |
|------|------|-------|----|
| 複數四則運算 | `z1`、`z2`、`z1+z2`、`z1*z2` 向量 glow | 平行四邊形輔助邊 + 軸線低 alpha | 左上角僅顯示 r/theta 與運算標記 |
| 複數極座標 | 單一向量 `z=r e^{i theta}` glow | Re/Im 投影虛線 + theta 弧線 | 小字標示 `z=a+bi`、`r`、theta |
| 尤拉旋轉 | 旋轉向量 + 右側時域波形 glow | 端點到波形起點投影虛線 + 低亮度軸線 | 僅顯示 `A, omega, delta` |

主向量/曲線必須永遠強於 guide/projection；不加 panel 框，僅保留低對比文字。

---

## 9. 工作流程與反模式

```text
p5 Web Editor prototype
    -> 視覺成立（glow、hierarchy、composition、reveal）
    -> 再抽 CurveModule + systems/rendering
```

不要先 abstraction 再調視覺。不要在新曲線重做 glow system、UI style、hierarchy、rendering 哲學、構圖語言。

| 反模式 | 後果 |
|--------|------|
| `fill(255)` guide | 搶主角、破壞安靜感 |
| 純白 UI 框 | 像工具軟體，不像作品 |
| 單層、無 glow 曲線 | 暗底上幾乎消失 |
| instant 全曲線 | 失去生成感 |
| 每曲線自訂一套色 | 作品集不統一 |
| guide 亮於 curve | 層級顛倒 |

---

## 10. 參考

| 資源 | 路徑 |
|------|------|
| Style reference 曲線 | `src/curve/modules/rose/` |
| 渲染 preset | `src/systems/rendering/presets.ts` |
| 作品舞台 CSS | `src/styles/pages/work-detail.css` |
| p5 / React 整合 | `p5toreact.md` |
| 站點 UX（breadcrumb、列表 filter） | `site-ux.md` |
| Morph 曲線契約 | `reactkey.md` |
