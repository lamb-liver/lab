# 數學視覺化封面優化規範

## 目標

封面不是作品輸出的截圖，而是作品概念的入口。

在卡片縮圖尺寸下，讓使用者 **1 秒內大致理解作品在講什麼**。不追求複雜，不重寫互動，而是用最少元素呈現核心概念。

---

## 封面類型分類

### A. 結果型封面

圖形本身具有辨識度，可直接使用主要圖形作為封面。

**適用作品：** 玫瑰曲線、繁花曲線、尤拉公式旋轉、朱利亞集合、碎形、螺線、參數曲線

**控制要點：** 主體置中、線條清楚、留白適中、避免過密

---

### B. 概念型封面

作品重點是數學關係、過程或統計結構，不應直接截初始畫面，必須設計封面專用構圖。

**適用作品：** 條件機率與貝氏定理、二項分布到常態分布、蒲豐投針、組合路徑計數、二項式展開幾何意義、卡特蘭數

---

### C. 結果概念型封面

結果圖可用，但需降噪或強化辨識度。

**適用作品：** 帕斯卡三角形、Logistic 分岔圖

---

## 視覺語言規範

| 元素 | 規格 |
|------|------|
| 背景 | 深色 / 黑色 |
| 主線 | 金色 |
| 輔助線 | 低透明度金色或灰色 |
| 文字 | 盡量避免，必要時只保留極少量符號 |
| 線條 | 縮圖尺寸下仍需可見 |
| 構圖 | 簡潔、留白、中央主體清楚 |

**避免：** 過多細碎 path、太淡的點雲、大量小字、過度裝飾、完整複製互動 UI、直接截取不具辨識度的初始狀態

---

## 封面審查標準

每張封面以下列問題逐一確認：

1. 使用者能不能在 1 秒內猜到主題？
2. 圖形是否有明確主體？
3. 是否能看出數學關係，而不只是抽象線條？
4. 小尺寸下是否仍然清楚？
5. 是否符合暗色系 + 金色線條語言？
6. 是否避免過密點雲、過細線條、過多文字？

任一答案為否，代表目前封面只是「作品輸出」，尚未達到「封面」標準。

---

## 各作品封面規格

### 1. 條件機率與貝氏定理

**核心公式**
```
P(A|B) = P(A ∩ B) / P(B)
P(A|B) = P(B|A)P(A) / P(B)
```

**封面問題**
抽象折線無法讓使用者判斷這是機率、樹圖、集合，還是幾何線段。

**建議構圖：** 機率樹 + 條件樣本空間

**必要元素：**
- 簡化二層樹狀圖（第一層：A / not A，第二層：B / not B）
- 高亮其中一條條件路徑
- 中央面積區塊表示 A∩B

```json
thumbnailSpec: {
  type: "concept",
  coordinateSystem: "canvas",
  density: "low",
  showText: false,
  mainElements: ["probability-tree", "highlighted-branch", "conditional-area"],
  avoid: ["abstract-polyline-only"]
}
```

---

### 2. 二項分布到常態分布

**核心公式**
```
X ~ Binomial(n, p)
P(X = k) = C(n,k) pᵏ (1-p)^(n-k)
X ≈ N(np, np(1-p))  當 n 增大時
```

**封面問題**
單一鐘形曲線只能看出「某種曲線」，看不出「二項分布 → 常態分布」的轉化關係。

**建議構圖：** 柱狀分布 + 平滑曲線疊合

**必要元素：**
- 底部一組金色直方柱
- 上方疊一條鐘形曲線
- 曲線略亮，柱狀略淡

```json
thumbnailSpec: {
  type: "concept",
  coordinateSystem: "canvas",
  density: "medium",
  showText: false,
  mainElements: ["histogram-bars", "normal-curve"],
  avoid: ["single-curve-only"]
}
```

---

### 3. 蒲豐投針

**核心公式**
```
P(相交) = 2ℓ / (πd)，其中 ℓ ≤ d
π ≈ 2ℓN / (dn)
```

**封面問題**
兩條平行線加一根短針，縮圖下看不出實驗感，也看不出相交與未相交的差異。

**建議構圖：** 平行線 + 多根投針 + 高亮相交針

**必要元素：**
- 3 到 5 條水平平行線
- 8 到 14 根短針
- 2 到 4 根跨越平行線者高亮，其餘淡化

```json
thumbnailSpec: {
  type: "concept",
  coordinateSystem: "canvas",
  density: "medium",
  showText: false,
  mainElements: ["parallel-lines", "random-needles", "intersection-highlight"],
  avoid: ["only-one-small-needle"]
}
```

---

### 4. 組合的路徑計數

**核心公式**
```
從 (0,0) 到 (m,n)，每次只能向右或向上
路徑數 = C(m+n, m) = C(m+n, n)
```

**封面問題**
只有格線看起來像普通網格，無法知道是在數路徑。

**建議構圖：** 起點 → 終點的高亮路徑

**必要元素：**
- 清楚格線
- 左下起點、右上終點
- 2 到 4 條不同路徑（一條主路徑較亮，其他較淡）

```json
thumbnailSpec: {
  type: "concept",
  coordinateSystem: "canvas",
  density: "low",
  showText: false,
  mainElements: ["grid", "start-point", "end-point", "highlighted-paths"],
  avoid: ["grid-only"]
}
```

---

### 5. 二項式展開的幾何意義

**核心公式**
```
(a + b)² = a² + 2ab + b²
(a + b)ⁿ = Σ C(n,k) a^(n-k) bᵏ
```

**封面問題**
單純的切割方形，使用者不一定能對應到 (a+b)²。

**建議構圖：** 明確的大正方形分割

**必要元素：**
- 一個大正方形切成 a²、ab、ab、b² 四塊
- 不同區塊使用不同透明度
- 中線與分割線清楚
- 可保留極少符號（a²、ab、b²），縮圖太小時可省略

```json
thumbnailSpec: {
  type: "concept",
  coordinateSystem: "canvas",
  density: "low",
  showText: "minimal",
  mainElements: ["square-partition", "area-blocks"],
  avoid: ["plain-square-lines-only"]
}
```

---

### 6. 卡特蘭數

**核心公式**
```
Cₙ = 1/(n+1) · C(2n, n)
Cₙ = C(2n,n) - C(2n,n+1)
```

可計數：合法括號、不越過對角線的 Dyck path、凸多邊形三角剖分、二元樹結構。

**封面問題**
單一 L 形或折線看不出卡特蘭數，也看不出「不越界」限制。

**建議構圖：** Dyck path（縮圖辨識度最高）

**必要元素：**
- 方形網格
- 一條淡對角線（邊界）
- 一條高亮合法 Dyck path
- 少量其他合法路徑淡化

```json
thumbnailSpec: {
  type: "concept",
  coordinateSystem: "canvas",
  density: "low",
  showText: false,
  mainElements: ["grid", "diagonal-boundary", "dyck-path"],
  avoid: ["single-L-shape", "too-many-paths"]
}
```

---

### 7. 帕斯卡三角形

**核心公式**
```
C(n,k) = n! / (k!(n-k)!)
C(n,k) = C(n-1,k-1) + C(n-1,k)
```

**封面問題**
點太密或行數太多，小尺寸下會變成雜訊。

**建議構圖：** 清楚的三角陣列 + 奇偶著色

**必要元素：**
- 適中層數（建議 20–24 行）
- 奇偶著色或模數著色
- 三角形輪廓清楚，保留中央碎形感

```json
thumbnailSpec: {
  type: "result-concept",
  coordinateSystem: "canvas",
  density: "medium-low",
  rows: 22,
  showText: false,
  mainElements: ["pascal-triangle", "mod-pattern"],
  avoid: ["too-many-tiny-dots"]
}
```

---

### 8. Logistic Map / 分岔圖

**核心公式**
```
x_{n+1} = r · xₙ · (1 - xₙ)
xₙ ∈ [0, 1]，r ∈ [0, 4]
```

**封面問題**
採樣點過多在小尺寸下變成噪點；採樣點太少又看不出分岔形狀。

**建議構圖：** 清楚的分岔骨架

**必要元素：**
- 保留主要分岔輪廓
- 降低細碎混沌區點密度
- 左側單支、中央分岔、右側混沌三段均可辨識

```json
thumbnailSpec: {
  type: "result-concept",
  coordinateSystem: "canvas",
  density: "medium",
  showText: false,
  mainElements: ["bifurcation-branches"],
  avoid: ["overdense-chaos-noise"]
}
```

---

## coverIntent 資料結構

概念型作品建議補充封面意圖描述：

```typescript
coverIntent: {
  type: "concept",
  concept: string,      // 作品核心數學概念
  visualHook: string,   // 封面第一眼要看到的主視覺
  mustShow: string[],   // 必要元素
  avoid: string[],      // 避免元素
  composition: string,  // 建議構圖方式
}
```

**範例（蒲豐投針）：**

```typescript
coverIntent: {
  type: "concept",
  concept: "以隨機投針與平行線相交機率估計 π",
  visualHook: "平行線與多根投針，其中相交者高亮",
  mustShow: ["平行線", "投針", "相交與未相交的對比"],
  avoid: ["只畫兩條線與一根很小的針", "畫面過空"],
  composition: "中央放大主針，背景保留數根淡化投針",
}
```

---

## 工程原則

### 不可破壞項目

- 不修改作品主互動邏輯
- 不修改 p5 runtime
- 不全域改 thumbnail 座標轉換邏輯
- 不硬編碼 `/lab/` 路徑
- 封面不做成完整 UI 截圖
- 不加入大量文字
- 每次改動後執行 `npm run build`

### 座標系說明

```typescript
coordinateSystem?: 'math' | 'canvas'
```

| 值 | 說明 | y 軸方向 |
|----|------|---------|
| `math` | 數學座標（預設） | 向上，會進行 y 翻轉 |
| `canvas` | 畫布座標 | 向下，不進行 y 翻轉 |

**預設維持** `coordinateSystem: 'math'`，不要全域修改。

### 允許的封面調整

封面場景與主作品初始值可以不同：

- 主作品初始值 → 適合互動
- 封面場景 → 適合理解主題

只應調整 thumbnail builder 或 thumbnail 專用資料。

---

## 實作順序

### Phase 1：建立封面分類

檢查每個作品的 thumbnail builder，分類為 `result` / `concept` / `result-concept`。不修改 runtime。

### Phase 2：處理概念型封面

優先順序：

1. `conditional-probability-bayes`
2. `binomial-to-normal`
3. `buffon-needle`
4. `combinatorial-path-counting`
5. `binomial-expansion-geometry`
6. `catalan-numbers`

每個作品只改 thumbnail builder，不修改互動 UI。

### Phase 3：降噪結果概念型封面

對象：`pascals-triangle`、`logistic-bifurcation`

只調整：點數、線條數、透明度、主體縮放、留白。不重寫演算法。

---

## 驗收標準

驗收時只看作品卡片縮圖，不看大圖。

| 檢查項目 | 標準 |
|---------|------|
| 主體清楚度 | 有明確主體，不模糊 |
| 主題辨識度 | 可猜到作品主題 |
| 密度 | 不過密、不過空 |
| 方向 | 無倒置 |
| 視覺風格 | 暗色 + 金線風格 |
| 獨立性 | 不依賴文字仍能理解 |

> 結果型作品展示美感。概念型作品展示關係。縮圖的任務是讓使用者知道：**這個作品值得點進去，因為我大概知道它在探索什麼。**
