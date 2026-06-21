# 視覺化內容上線排程

> 狀態依目前 `src/content`、Work / Explore registry 與最近一次驗證結果修正。  
> 本檔為本機排程備忘，不納入 Git 推送。

---

## 一、目前進度

### 已完成並發布

| 類型 | slug | 標題 | 狀態 |
|------|------|------|------|
| Work | `function-derivative-graph` | 原函數與導函數圖形對照 | 已發布；已接入 Work registry / `WorkInteractiveStage` |
| Work | `eigenvector-geometry` | 特徵向量與伸縮比 | 已發布；已接入 Work registry / `WorkInteractiveStage` |
| Work | `taylor-polynomial-approximation` | 泰勒多項式逼近 | 已發布；已接入 Work registry / `WorkInteractiveStage` |
| Explore | `rational-functions-asymptotes` | 有理函數與漸近線 | 已發布；已接入 Explore registry / `ExploreInteractiveStage` |
| Work | `rational-vertical-horizontal-asymptotes` | 垂直與水平漸近線 | 已發布；已接入 Work registry / `WorkInteractiveStage` |
| Work | `rational-oblique-asymptote` | 斜漸近線與多項式除法 | 已發布；已接入 Work registry / `WorkInteractiveStage` |

### 已完成的穩定化修正

- 作品頁參數控制恢復：portal mount 先於 React island 存在，桌面右欄維持展開，手機維持 accordion。
- Canvas HUD 不再重複頁面標題：標題由 Astro header / breadcrumb 負責，canvas 只保留必要讀數與短狀態。
- `docs/workart.md`、`docs/exploreart.md`、`docs/p5toreact.md` 已補上 HUD 與 portal mount 規則。
- `npm test` 通過：66 files / 343 tests。
- `npm run build` 通過：75 pages，包含有理函數 Explore 與兩個有理函數 Works。

---

## 二、建議上線批次

| 批次 | 目標 | 包含項目 | 驗收重點 |
|------|------|----------|----------|
| Batch 0 | 已完成 P0 收尾 | `function-derivative-graph`、`eigenvector-geometry`、`taylor-polynomial-approximation`、有理函數 Explore + 2 Works | 已發布頁面不再連到 draft；Work 皆有互動、registry、縮圖與 controls；Canvas HUD 不重複標題 |
| Batch 1 | 補齊高頻課綱主題 | 三角圖形、數據分析、離散隨機變數 | 每條主題線 Explore + 3 Works 可獨立發布；已發布頁面不得連到 draft |
| Batch 2 | 處理較高複雜度主題 | 空間向量、線性規劃 | 先完成 Work 核心互動，再開 Explore；3D / feasible region 的視覺驗收需額外瀏覽器檢查 |
| Batch 3 | 後補新題 | 斜率場、一般 CLT、部分分式 | 目前尚未完整建檔；依內容缺口與時間排入 |

---

## 三、已發布 Explore 標題更名

| slug | 現行標題 |
|------|----------|
| `trigonometry-fundamentals` | 三角函數的幾何定義與恆等式 |
| `probability-statistics` | 古典機率與條件機率 |
| `vectors` | 平面向量 |
| `function-equations` | 函數圖形與方程解集 |

站內連結、部分 `aria-label`、`README` 表已同步；後續新增主題時避免和這些已發布 Explore 撞名。

---

## 四、尚待上線 Explore

目前草案 Explore 為 4 篇；`trig-function-graphs` 已從草案移到已發布。

| 優先 | slug | 標題 | 定位 | 難易度 | 必要性 | 檔案 |
|------|------|------|------|--------|--------|------|
| 1 | `data-analysis` | 數據分析 | 散布、相關、迴歸、盒鬚圖 | 中 | 高 | `src/content/explore/data-analysis.md` |
| 2 | `discrete-random-variables` | 離散隨機變數與分布 | PMF、期望值、變異數、二項／幾何 | 中 | 高 | `src/content/explore/discrete-random-variables.md` |
| 3 | `space-vectors-planes-lines` | 空間向量與平面直線 | 3D、線面、外積 | 高 | 中高 | `src/content/explore/space-vectors-planes-lines.md` |
| 4 | `linear-programming` | 線性規劃 | 可行域、等值線、頂點最優 | 中高 | 中高 | `src/content/explore/linear-programming.md` |

---

## 五、尚待上線 Works

目前草案 Works 為 8 篇；原 P0 的 7 篇與數據分析的 3 篇 Work 已發布。

| 優先 | slug | 標題 | 掛載主題 | 必要性 | 難易度 | 檔案 |
|------|------|------|----------|--------|--------|------|
| 3.3 | `binomial-geometric-distribution` | 二項分布與幾何分布 | 離散隨機變數與分布 | 高 | 中 | `src/content/works/binomial-geometric-distribution.md` |
| 4.1 | `cross-product-geometry` | 外積的幾何意義 | 空間向量與平面直線 | 中高 | 中 | `src/content/works/cross-product-geometry.md` |
| 4.2 | `space-vector-three-plane-projection` | 空間向量與三平面投影 | 空間向量與平面直線 | 中高 | 高 | `src/content/works/space-vector-three-plane-projection.md` |
| 4.3 | `line-plane-intersection` | 空間直線與平面交點 | 空間向量與平面直線 | 中高 | 高 | `src/content/works/line-plane-intersection.md` |
| 4.4 | `plane-normal-distance` | 平面法向量與點面距離 | 空間向量與平面直線 | 中高 | 中高 | `src/content/works/plane-normal-distance.md` |
| 5.1 | `lp-feasible-half-planes` | 約束半平面與可行域 | 線性規劃 | 中高 | 中 | `src/content/works/lp-feasible-half-planes.md` |
| 5.2 | `lp-objective-level-curves` | 目標函數等值線 | 線性規劃 | 中高 | 中 | `src/content/works/lp-objective-level-curves.md` |
| 5.3 | `lp-vertex-optimum` | 頂點法求最優解 | 線性規劃 | 中高 | 中高 | `src/content/works/lp-vertex-optimum.md` |

---

## 六、主題線對照

| 主題線 | Explore | 狀態 | 核心定位 |
|--------|---------|------|----------|
| 三角 | 三角函數的幾何定義與恆等式 | 已發布 | 單位圓、恆等式、角度合成 |
| 三角 | 三角函數圖形與弧度 | 已發布 | 弧度、圖形、振幅／週期／相位 |
| 機率 | 古典機率與條件機率 | 已發布 | 條件機率、Bayes、CLT 模式、蒙提霍爾 |
| 統計 | 數據分析 | draft | 散布、相關、迴歸、盒鬚圖 |
| 統計 | 離散隨機變數與分布 | draft | PMF、期望、變異數、分布 |
| 向量 | 平面向量 | 已發布 | 內積、投影、法向、基底 |
| 向量 | 空間向量與平面直線 | draft | 3D、線面、外積 |
| 函數 | 函數圖形與方程解集 | 已發布 | 零點、不等式、圖形變換導覽 |
| 函數 | 有理函數與漸近線 | 已發布 | 約分、漸近線骨架 |
| 分析 | 極限與黎曼和 | 已發布 | 積分與導數極限對照 |
| 分析 | 數列與級數 | 已發布 | 數列、級數、泰勒補強 |
| 代數 | 矩陣與線性變換 | 已發布 | 欄向量、行列式、特徵向量補強 |
| 最佳化 | 線性規劃 | draft | 可行域、等值線、頂點最優 |

---

## 七、上線前待辦

每篇草案上線前至少完成：

- [ ] `draft: false`
- [ ] Works：`src/curve/modules/*` + `src/systems/rendering/*` + `src/components/curve/use*P5.ts`
- [ ] Works：`src/curve/registry.ts`、`src/works/interactiveRegistry.ts`、`WorkInteractiveStage.tsx`
- [ ] Explore：`src/explore/*`、`src/components/explore/*ExploreRoot.tsx`、`src/explore/interactiveRegistry.ts`、`ExploreInteractiveStage.tsx`
- [ ] Explore：`public/images/explore-covers/` + `scripts/explore-covers/` + frontmatter `coverImage`
- [ ] 確認已發布頁面沒有連到 draft slug
- [ ] Canvas HUD 不重複頁面標題
- [ ] Work controls 在桌面右欄可見，手機 accordion 不阻斷 portal mount
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run validate:frontend -- --url <route>`
- [ ] 若 Explore cover 有變更，補跑 cover / 內容相關 audit

---

## 八、審查定稿要點速查

### 特徵向量 `eigenvector-geometry`

- 「所在直線不變」，非方向字面值不變。
- 補 `lambda = 0` 壓扁、重根／純量矩陣例外。
- 預設網格 + 特徵方向，係數放進階。

### 泰勒 `taylor-polynomial-approximation`

- 僅 `sin x`、`cos x`、`e^x`。
- 低透明誤差帶，不做熱圖。
- 項次分解放進階。

### f 與 f' `function-derivative-graph`

- 強調區間單調性。
- `f' = 0` 可能是平台點，不必然是極值。
- 預設 `x^2`、`x^3 - 3x`、`sin x`。

### 有理函數三篇

- 漸近線判斷皆以約簡後為準。
- 垂直／水平 Work 預設：`A(x-r)/(x-a)`。
- 斜漸近線 Work 預設：`R(x)=mx+b+A/(x-c)`。
- 長除法與餘式拆解放側欄或 Markdown，不塞入 canvas 主畫面。

### 外積 `cross-product-geometry`

- 移除三重積，補零向量退化。
- 預設：`a`、`b`、平行四邊形、`n`。
- 右手定則放進階。

---

## 九、快速開檔索引

```text
src/content/explore/
  data-analysis.md
  discrete-random-variables.md
  space-vectors-planes-lines.md
  linear-programming.md

src/content/works/
  binomial-geometric-distribution.md
  cross-product-geometry.md
  space-vector-three-plane-projection.md
  line-plane-intersection.md
  plane-normal-distance.md
  lp-feasible-half-planes.md
  lp-objective-level-curves.md
  lp-vertex-optimum.md
```
