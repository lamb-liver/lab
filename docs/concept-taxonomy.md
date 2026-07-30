# 概念分類（Concept Taxonomy）

> 跨集合概念聚合（`/concept/[slug]`）的正規詞彙。source of truth 是 `src/lib/concepts.ts`（registry）與各內容檔 frontmatter 的 `concepts` 欄位；本文件說明詞彙與指派原則，**不逐篇列出對照**。

## 兩個欄位

- **`concepts`**（slug enum，works／explore／exam 三集合共用）：本文件的正規詞彙，餵 `/concept/[slug]` 聚合頁。frontmatter 存英文 slug，顯示用 label。
- **`topics`**（自由字串，exam 專用）：exam 原有的細粒度觀念標籤（棣美弗定理、焦點與準線…），供 exam 卡片顯示與站內搜尋，**不受本詞彙約束**。

## 指派原則

- 每篇已發布內容至少 1 個 `concepts`，通常 1–3 個。
- 選「這篇主要在講的數學對象／技巧」，不是周邊背景。
- 依既有訊號推導：works 的 `tags`／`prerequisites`、explore 的 `category`／`prerequisites`、exam 既有的 `topics`（原 concepts）、以及標題。

## 概念頁門檻

一個概念要涵蓋至少 2 個已發布內容集合，才會產生 `/concept/[slug]` 頁（由 `conceptIndex.test.ts` 驗證）。未達門檻的概念仍是合法標籤，只是在詳情頁顯示為純文字、不加連結；目前結果以 `/concept` 索引為準。

## 正規詞彙（40）

| slug | label | area |
|------|-------|------|
| trig-functions | 三角函數 | 三角與週期 |
| trig-identities | 三角恆等式 | 三角與週期 |
| law-of-sines-cosines | 正餘弦定理 | 三角與週期 |
| wave-superposition | 波的疊加與干涉 | 三角與週期 |
| complex-numbers | 複數 | 複數 |
| euler-formula | 尤拉公式 | 複數 |
| vectors | 平面向量 | 向量與線性代數 |
| dot-cross-product | 內積與外積 | 向量與線性代數 |
| space-vectors | 空間向量 | 向量與線性代數 |
| matrix | 矩陣 | 向量與線性代數 |
| linear-transformation | 線性變換 | 向量與線性代數 |
| eigenvector | 特徵向量 | 向量與線性代數 |
| linear-systems | 線性方程組 | 向量與線性代數 |
| function-transformation | 函數圖形變換 | 函數與多項式 |
| quadratic-function | 二次函數 | 函數與多項式 |
| polynomial | 多項式 | 函數與多項式 |
| rational-asymptote | 有理函數與漸近線 | 函數與多項式 |
| inverse-function | 反函數 | 函數與多項式 |
| conic-sections | 圓錐曲線 | 圓錐曲線 |
| exponential-logarithm | 指數與對數 | 指對與成長 |
| logistic-growth | 邏輯斯蒂成長 | 指對與成長 |
| limit | 極限 | 微積分 |
| derivative-tangent | 導數與切線 | 微積分 |
| definite-integral | 定積分 | 微積分 |
| taylor-approximation | 泰勒展開 | 微積分 |
| differential-equation | 微分方程 | 微積分 |
| sequences-series | 數列與級數 | 數列級數 |
| classical-probability | 古典機率 | 機率統計 |
| conditional-probability | 條件機率與貝氏 | 機率統計 |
| probability-distribution | 機率分佈 | 機率統計 |
| expected-value | 期望值 | 機率統計 |
| descriptive-statistics | 敘述統計 | 機率統計 |
| regression-correlation | 迴歸與相關 | 機率統計 |
| permutation-combination | 排列組合 | 組合 |
| binomial-theorem | 二項式定理 | 組合 |
| parametric-curve | 參數曲線 | 曲線・碎形・最佳化 |
| fractal | 碎形 | 曲線・碎形・最佳化 |
| dynamical-system | 動力系統與混沌 | 曲線・碎形・最佳化 |
| vector-field | 向量場 | 曲線・碎形・最佳化 |
| linear-programming | 線性規劃 | 曲線・碎形・最佳化 |
