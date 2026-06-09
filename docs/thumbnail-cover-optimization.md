# 數學視覺化封面優化規範

## 目標

封面不是作品輸出的截圖，而是作品概念的入口。

在 `/works` 卡片縮圖尺寸下，讓使用者 **1 秒內大致理解作品在講什麼**。不追求複雜，不重寫互動，而是用最少元素呈現核心概念。

---

## 範圍與既有 API

- 範圍只包含 `/works` 的 `WorkCard` build-time SVG 縮圖。
- 首頁「最新作品」共用 `WorkCard`，因此會同步套用。
- Explore `coverImage` PNG 不在本規格範圍。
- `purpose: 'thumbnail'`、`ThumbnailSpec`、multi-path、circle、fill、`coordinateSystem` 已存在於 `src/curve/types.ts` 與 `src/lib/curveThumbnail.ts`。
- 本次不新增 sample 參數、public type、frontmatter API、`data-role` 或 `data-testid` attribute。

---

## 封面類型分類

### A. 結果型封面

圖形本身具有辨識度，可直接使用主要圖形作為封面。

**控制要點：** 主體置中、線條清楚、留白適中、避免過密。

### B. 概念型封面

作品重點是數學關係、過程或統計結構，不應直接截初始畫面，必須設計封面專用構圖。

**控制要點：** 讓關係先於細節被看見，例如分區、路徑、命中狀態、疊合關係。

### C. 結果概念型封面

結果圖可用，但需降噪或強化辨識度。

**控制要點：** 保留數學輪廓，降低小尺寸噪點與過細元素。

---

## 視覺語言規範

| 元素 | 規格 |
|------|------|
| 背景 | 深色 / 黑色 |
| 主線 | 金色 |
| 輔助線 | 低透明度金色或灰色 |
| 例外色 | 概念型作品可用少量次要強調色區分語意 |
| 文字 | 盡量避免，必要時只保留極少量符號 |
| 線條 | 縮圖尺寸下仍需可見 |
| 構圖 | 簡潔、留白、中央主體清楚 |

**避免：** 過多細碎 path、太淡的點雲、大量小字、過度裝飾、完整複製互動 UI、直接截取不具辨識度的初始狀態。

---

## 工程原則

### 不可破壞項目

- 不修改作品主互動邏輯。
- 不修改 p5 runtime。
- 不全域改 thumbnail 座標轉換邏輯。
- 不硬編碼 `/lab/` 路徑。
- 封面不做成完整 UI 截圖。
- 不加入大量文字。

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

- 主作品初始值：適合互動。
- 封面場景：適合理解主題。

只應調整 thumbnail builder 或 thumbnail 專用資料。

---

## 交付順序

| Phase | 對象 | 交付目標 |
|-------|------|----------|
| 1 | 概念型 8 件 | MVP，可獨立 screenshot review |
| 2 | 結果型與點雲型 | 調整 bbox、密度、線寬、主體比例 |
| 3 | 多層 / 過程型 | 避免鬼線、平線、完成態不明 |
| 4 | 向量 / 複數 / 函數 / 級數型 | 補強主關係與 guide 層級 |
| 5 | 全 47 件總覽 | 一致性微調，不重寫單件構圖 |

---

## 各作品封面 Audit Table

| slug | 分類 | 封面意圖 | 必要元素 | 避免項 | 人工 review |
|------|------|----------|----------|--------|-------------|
| `conditional-probability-bayes` | concept | 條件機率由路徑與樣本空間交集共同決定 | 機率樹、高亮 A∩B、樣本空間分區 | 抽象折線、純面積塊 | 已截圖驗收 |
| `binomial-to-normal` | concept | 二項柱狀分布趨近常態曲線 | 直方柱、鐘形曲線、疊合關係 | 單一曲線 | 已截圖驗收 |
| `buffon-needle` | concept | 投針命中平行線以估計 π | 平行線、多根針、命中/未命中對比 | 只有一根小針 | 已截圖驗收 |
| `combinatorial-path-counting` | concept | 從起點到終點的格路徑計數 | 格線、起點、終點、多條路徑 | 純格線 | 已截圖驗收 |
| `binomial-expansion-geometry` | concept | `(a+b)^2` 的面積分割 | 大正方形、四個區塊、分割線 | 只有外框或斜線 | 已截圖驗收 |
| `catalan-numbers` | concept | 不越界 Dyck path | 格線、對角邊界、合法路徑、端點 | 單一 L 形、過多路徑 | 已截圖驗收 |
| `pascals-triangle` | result-concept | 帕斯卡三角形的模數碎形 | 三角陣列、奇偶/模數著色 | 點太密、全螢光糊成一片 | 已截圖驗收 |
| `logistic-bifurcation` | result-concept | Logistic map 的分岔骨架 | 左側單支、中央分岔、右側混沌 | 混沌區過密噪點 | 已截圖驗收 |
| `rose-curve` | result | 玫瑰曲線的對稱花瓣 | 閉合主曲線、置中構圖 | 太小或未閉合 | 已截圖驗收 |
| `lissajous-curve` | result | 利薩茹週期軌跡 | 閉合曲線、交織結構 | 頻率太平或太密 | 已截圖驗收 |
| `harmonograph-curve` | result | 衰減諧振軌跡 | 主軌跡、中心密度 | 過密黑團 | 已截圖驗收 |
| `spirograph-curve` | result | 繁花曲線輪廓 | 閉合繁花、穩定留白 | 鬼線、過小主體 | 已截圖驗收 |
| `equiangular-spiral` | result | 等角螺線的自相似旋轉 | 主螺線、淡 ghost、端點 | ghost 壓縮主體 | 已截圖驗收 |
| `fibonacci-spiral` | result | 方格與費波那契螺線 | 方格、弧線、主螺線 | 方格比主線更搶眼 | 已截圖驗收 |
| `sierpinski-triangle` | result | 謝爾賓斯基三角形洞洞結構 | 三角外形、遞迴孔洞 | 階數過高造成噪點 | 已截圖驗收 |
| `julia-set` | result | 朱利亞集合點雲輪廓 | 集合邊界、穩定點雲 | 太淡、太散 | 已截圖驗收 |
| `affine-ifs-fractal` | result | IFS 植物碎形 | 主幹、葉狀點雲 | 點雲太厚或太淡 | 已截圖驗收 |
| `chladni-figures` | result | 克拉尼節線粒子雲 | 節線分布、粒子質感 | 稀疏掃線、過密糊成面 | 已截圖驗收 |
| `standing-wave` | process | 駐波完成態主波形 | 非平線主波、可辨振幅 | 平線、只剩包絡 | 已截圖驗收 |
| `interference-fringes` | process | 干涉 envelope 骨架 | 多條 envelope、中心對稱 | 只取單弧、fringe 噪點 | 已截圖驗收 |
| `parabolic-reflection` | process | 拋物線反射聚焦 | 拋物線、光線族、焦點感 | 光線過密 | 已截圖驗收 |
| `conic-envelope` | process | 直線族形成二次曲線包絡 | 線族、包絡輪廓 | 只剩外框 | 已截圖驗收 |
| `conic-focus-locus` | process | 焦點軌跡與連線 | 軌跡、焦點連線 | 單一橢圓無關係 | 已截圖驗收 |
| `linear-transform-grid` | process | 線性變換後的網格 | 變形網格、完整線段 | 未變形正方格、單線 | 已截圖驗收 |
| `affine-transform-pattern` | process | 遞迴仿射變換圖樣 | 多個變換方形、層級 | 過深過密 | 已截圖驗收 |
| `rotation-scale-composition` | process | 旋轉縮放疊加軌跡 | 疊層、旋轉縮放方向 | 只見單一線段 | 已截圖驗收 |
| `riemann-sum` | process | 曲線下方矩形近似面積 | 主曲線、矩形分割 | 主曲線平線、矩形過淡 | 已截圖驗收 |
| `tangent-approximation` | process | 割線趨近切線 | 函數 ghost、割線、切線方向 | 只畫函數曲線 | 已截圖驗收 |
| `catenary` | process | 曳物線與拉繩關係 | dynamic 軌跡、rope、ghost | ghost 壓縮 bbox | 已截圖驗收 |
| `vector-addition-scalar` | concept | 向量加法與純量伸縮 | 主向量、結果向量、guide | 所有向量同權重 | 已截圖驗收 |
| `dot-product-geometry` | concept | 內積由投影長度決定 | 兩向量、投影、垂線 | 只有兩支箭頭 | 已截圖驗收 |
| `vector-projection` | concept | 向量分解到基底方向 | 原向量、投影、分量 | guide 過亮 | 已截圖驗收 |
| `complex-arithmetic-geometry` | concept | 複數加法與乘法的幾何效果 | 單位圓、輸入向量、結果向量 | 結果與輸入難區分 | 已截圖驗收 |
| `complex-polar-form` | concept | 複數由半徑與角度定位 | 單位圓、半徑、角度弧 | 只畫半徑線 | 已截圖驗收 |
| `euler-formula-rotation` | concept | 單位圓旋轉對應波形 | 圓、旋轉向量、波形 | 波形與圓分離過遠 | 已截圖驗收 |
| `complex-phase-portrait` | concept | 複數函數的相位軌跡 | 主軌跡、相位 guide | 軌跡太淡 | 已截圖驗收 |
| `vector-field-patterns` | concept | 向量場基本圖樣 | 多個箭頭/流向、中心規律 | 箭頭過小不可辨 | 已截圖驗收 |
| `vector-field-streamlines` | result-concept | 向量場流線方向 | 多條流線、方向感 | 流線首尾硬接 | 已截圖驗收 |
| `arithmetic-geometric-sequences` | concept | 等差與等比序列的幾何比較 | 階梯/曲線、序列對比 | 像普通折線圖 | 已截圖驗收 |
| `basel-problem` | concept | 級數部分和逼近 π²/6 | 部分和階層、極限參考 | 太多小刻度 | 已截圖驗收 |
| `exponential-growth-decay` | concept | 成長與衰減曲線對比 | 上升曲線、下降曲線、基準 | 只留單曲線 | 已截圖驗收 |
| `logarithmic-scale` | concept | 對數尺度壓縮乘法距離 | 對數軸、刻度距離 | 純座標軸 | 已截圖驗收 |
| `natural-log-e-geometry` | concept | `1/x` 下方面積定義 ln | 曲線、填色面積、邊界 | 只畫曲線 | 已截圖驗收 |
| `logistic-curve` | result-concept | S 型成長與承載上限 | S 曲線、水平上限 guide | 普通斜線 | 已截圖驗收 |
| `unit-circle-trig-definition` | concept | sin、cos 由單位圓座標定義 | 單位圓、金色半徑、投影虛線 | 只有折線、無圓周 | 待截圖驗收 |
| `law-of-sines-cosines` | concept | 邊角比與外接圓綁在同一比例 | 三角形、外接圓 guide、底邊強調 | 只有三邊、無外接圓 | 待截圖驗收 |
| `trig-angle-identities` | concept | 兩角合成由中點角 m 與偏移 d 讀出 | 單位圓、兩半徑、m 導引 | 只有弦線、無圓與 m | 待截圖驗收 |

---

## 自動測試策略

自動測試只驗結構穩定性，不驗語意命名：

1. 所有 47 slug 都可 render SVG。
2. SVG 不空白，至少有一個 `<path>` 或 `<circle>`。
3. SVG 不含 `NaN` / `Infinity`。
4. thumbnail sample 的 bbox 不為零。
5. 既有多 path、point cloud、`excludeFromBbox`、circle/fill 測試維持通過。

語意驗證留給人工 screenshot review，例如：

- Bayes 是否看得出 tree + area。
- Buffon 是否看得出 hit / miss。
- Binomial 是否看得出 bars + curve。
- Catalan 是否看得出 boundary + Dyck path。

---

## 驗收標準

驗收時只看作品卡片縮圖，不看大圖。

| 檢查項目 | 標準 |
|---------|------|
| Desktop 主體清楚度 | 有明確主體，不模糊，主視覺約佔 70%–85% |
| Mobile 可辨識度 | 375px viewport 下主體輪廓仍可辨識 |
| 密度 | 不過密、不過空 |
| 方向 | 無倒置 |
| 視覺風格 | 暗色 + 金線為主，概念型允許少量次要色 |
| 獨立性 | 不依賴文字仍能理解 |

任一答案為否，代表目前封面只是「作品輸出」，尚未達到「封面」標準。

> 結果型作品展示美感。概念型作品展示關係。縮圖的任務是讓使用者知道：**這個作品值得點進去，因為我大概知道它在探索什麼。**
