# Public Pages Audit

Last updated: 2026-06-20

This is the post-release audit for currently public Lab pages. It follows the `社團發布前 Release Checklist` in `docs/lab-release-system.md`.

## Scope

- Public Works: 61
- Draft Works: 8
- Public Explore: 16
- Draft Explore: 4

This audit is a publication-scope report only. It does not change `draft`, registry wiring, generator behavior, analytics, comments, or DOM validation defaults.

## Automated release checks

- Public Explore entries all define `coverImage`.
- Public Explore cover assets all exist under `public/`.
- Public Explore categories are valid.
- Public pages do not contain `TODO`, `FIXME`, `placeholder`, `debug`, `lorem`, `待補`, `暫定`, or `測試用`.
- The first-stage validation remains `npm run validate:frontend -- --skip-dom`, which runs content audit, tests, and build.
- DOM smoke and screenshots remain opt-in through `--url` and screenshot flags.

## Currently public Explore pages

| Slug | Title | Category | Audit result | Release note |
|------|-------|----------|--------------|--------------|
| `complex-euler-formula` | 複數與尤拉公式 | 代數 | OK | Good enrichment page; keep public with context for students who know complex numbers. |
| `conic-dynamic-geometry` | 二次曲線的幾何動態軌跡 | 幾何 | OK | Strong high-school fit. |
| `differential-equations-geometry` | 微分方程的幾何視覺化 | 分析 | OK | Keep public, but treat as advanced enrichment. |
| `exponential-logarithm` | 指數與對數 | 分析 | OK | Strong high-school fit. |
| `fourier-series` | 傅立葉級數 | 分析 | OK | Keep public, but treat as advanced enrichment. |
| `function-equations` | 函數圖形與方程解集 | 代數 | OK | Strong high-school fit. |
| `limits-riemann-sum` | 極限與黎曼和 | 分析 | OK | Good calculus bridge. |
| `matrix-linear-transform` | 矩陣與線性變換 | 代數 | OK | Good enrichment page. |
| `permutations-combinations` | 排列組合 | 代數 | OK | Strong high-school fit; description is dense but acceptable. |
| `probability-statistics` | 古典機率與條件機率 | 統計 | OK | Strong high-school fit. |
| `rational-functions-asymptotes` | 有理函數與漸近線 | 代數 | OK | Strong high-school fit. |
| `sequences-and-series` | 數列與級數 | 分析 | OK | Strong high-school fit. |
| `trig-function-graphs` | 三角函數圖形與弧度 | 分析 | OK | Strong high-school fit. |
| `trig-wave-interference` | 三角函數的疊加與波的干涉 | 分析 | OK | Good enrichment page. |
| `trigonometry-fundamentals` | 三角函數的幾何定義與恆等式 | 幾何 | OK | Strong high-school fit. |
| `vectors` | 平面向量 | 幾何 | OK | Strong high-school fit. |

## Currently public Works

| Slug | Title | Audit result | Release note |
|------|-------|--------------|--------------|
| `affine-ifs-fractal` | 碎形仿射疊代 | OK | Enrichment; keep public. |
| `affine-transform-pattern` | 仿射變換圖樣 | OK | Enrichment; keep public. |
| `arithmetic-geometric-sequences` | 等差等比數列的幾何視覺 | OK | Strong high-school fit. |
| `basel-problem` | 巴塞爾問題 | OK | Advanced enrichment; keep public with context. |
| `binomial-expansion-geometry` | 二項式展開的幾何意義 | OK | Strong high-school fit. |
| `binomial-to-normal` | 二項分佈到常態分佈 | OK | Good enrichment bridge. |
| `buffon-needle` | 蒲豐投針 | OK | Good enrichment page. |
| `catalan-numbers` | 卡特蘭數 | OK | Enrichment; keep public. |
| `catenary` | 曳物線（Tractrix） | OK | Advanced geometry; keep public. |
| `chladni-figures` | 克拉尼圖形 | OK | Enrichment; keep public. |
| `combinatorial-path-counting` | 組合的路徑計數 | OK | Strong high-school fit. |
| `complex-arithmetic-geometry` | 複數四則運算的幾何意義 | OK | Good high-school enrichment. |
| `complex-phase-portrait` | 相位圖 | OK | Advanced enrichment; consider adding more reader guidance. |
| `complex-polar-form` | 複數的極座標形式 | OK | Good high-school enrichment. |
| `conditional-probability-bayes` | 條件機率與貝氏定理 | OK | Strong high-school fit. |
| `conic-envelope` | 二次曲線包絡線 | OK | Good geometry enrichment. |
| `conic-focus-locus` | 焦點軌跡 | OK | Strong high-school fit. |
| `dot-product-geometry` | 內積的幾何意義 | OK | Strong high-school fit. |
| `eigenvector-geometry` | 特徵向量與伸縮比 | OK | Enrichment; keep public. |
| `equiangular-spiral` | 等角螺線 | OK | Enrichment; keep public. |
| `euler-formula-rotation` | 尤拉公式旋轉動畫 | OK | Good high-school enrichment. |
| `exponential-growth-decay` | 指數成長與衰減 | OK | Strong high-school fit. |
| `fibonacci-spiral` | 費波那契螺線 | OK | Strong visual entry page. |
| `function-derivative-graph` | 原函數與導函數圖形對照 | OK | Good calculus bridge. |
| `function-graph-transform` | 函數圖形變換 | OK | Strong high-school fit. |
| `harmonograph-curve` | 諧振圖 | OK | Enrichment; keep public. |
| `interference-fringes` | 干涉條紋 | OK | Enrichment; keep public. |
| `inverse-function-reflection` | 反函數鏡射 | OK | Strong high-school fit. |
| `julia-set` | 朱利亞集合 | OK | Advanced enrichment; keep public but not as a first-stop page. |
| `law-of-sines-cosines` | 正弦定理與餘弦定理 | OK | Strong high-school fit. |
| `linear-transform-grid` | 線性變換網格 | OK | Good enrichment page. |
| `lissajous-curve` | 利薩茹曲線 | Description risk | Description is long; keep public, but shorten before prominent sharing. |
| `logarithmic-scale` | 對數尺度 | OK | Strong high-school fit. |
| `logistic-bifurcation` | 邏輯斯諦映射分岔圖 | OK | Advanced enrichment; keep public but not as a first-stop page. |
| `logistic-curve` | 邏輯斯諦曲線 | OK | Good enrichment page. |
| `natural-log-e-geometry` | 自然對數 e 的幾何定義 | OK | Good calculus bridge. |
| `parabolic-reflection` | 拋物線反射 | OK | Strong high-school fit. |
| `pascals-triangle` | 帕斯卡三角形 | OK | Strong high-school fit. |
| `percentile-box-plot` | 百分位數與盒鬚圖 | OK | Strong statistics fit. |
| `polynomial-roots-multiplicity` | 多項式零點與重根 | OK | Strong high-school fit. |
| `quadratic-completing-square` | 二次函數配方視覺化 | OK | Strong high-school fit. |
| `radian-arc-length` | 弧度與圓弧長 | OK | Strong high-school fit. |
| `rational-oblique-asymptote` | 斜漸近線與多項式除法 | OK | Good high-school enrichment. |
| `rational-vertical-horizontal-asymptotes` | 垂直與水平漸近線 | OK | Strong high-school fit. |
| `regression-outlier-influence` | 離群值對迴歸的影響 | OK | Strong statistics fit. |
| `riemann-sum` | 黎曼和動態圖 | OK | Good calculus bridge. |
| `rose-curve` | 玫瑰曲線 | OK | Strong visual entry page. |
| `rotation-scale-composition` | 旋轉縮放疊加 | OK | Enrichment; keep public. |
| `scatter-correlation-regression` | 散布圖、相關與迴歸線 | OK | Strong statistics fit. |
| `sierpinski-triangle` | 謝爾賓斯基三角形 | OK | Strong visual entry page. |
| `sinusoid-amplitude-period-phase` | 正弦型函數的振幅、週期與相位 | OK | Strong high-school fit. |
| `spirograph-curve` | 繁花曲線 | Description risk | Description is long; keep public, but shorten before prominent sharing. |
| `standing-wave` | 駐波圖 | OK | Enrichment; keep public. |
| `tangent-approximation` | 切線逼近動畫 | OK | Good calculus bridge. |
| `taylor-polynomial-approximation` | 泰勒多項式逼近 | OK | Advanced enrichment; keep public with context. |
| `trig-angle-identities` | 三角恆等式與角度合成 | OK | Strong high-school fit. |
| `unit-circle-trig-definition` | 單位圓與三角函數定義 | OK | Strong high-school fit. |
| `vector-addition-scalar` | 向量的加法與純量乘法 | OK | Strong high-school fit. |
| `vector-field-patterns` | 向量場的基本圖樣 | OK | Advanced enrichment; keep public with context. |
| `vector-field-streamlines` | 向量場流線 | OK | Advanced enrichment; keep public with context. |
| `vector-projection` | 向量投影與分解 | OK | Strong high-school fit. |

## Pages that can continue to be public

No currently public page has a hard release-blocking issue from the automated audit. These pages are especially suitable as stable high-school club entry points:

- Explore: `trigonometry-fundamentals`, `trig-function-graphs`, `vectors`, `conic-dynamic-geometry`, `function-equations`, `exponential-logarithm`, `sequences-and-series`, `probability-statistics`, `permutations-combinations`, `rational-functions-asymptotes`, `limits-riemann-sum`, `matrix-linear-transform`.
- Works: `unit-circle-trig-definition`, `radian-arc-length`, `law-of-sines-cosines`, `trig-angle-identities`, `sinusoid-amplitude-period-phase`, `vector-addition-scalar`, `dot-product-geometry`, `vector-projection`, `quadratic-completing-square`, `function-graph-transform`, `polynomial-roots-multiplicity`, `rational-vertical-horizontal-asymptotes`, `arithmetic-geometric-sequences`, `pascals-triangle`, `combinatorial-path-counting`, `conditional-probability-bayes`, `rose-curve`, `sierpinski-triangle`, `fibonacci-spiral`.

## Pages to strengthen

These pages can remain public, but should get more guidance before being promoted as first-stop pages for a high-school club audience:

- Advanced Explore: `differential-equations-geometry`, `fourier-series`, `complex-euler-formula`, `trig-wave-interference`.
- Advanced Works: `basel-problem`, `julia-set`, `logistic-bifurcation`, `vector-field-patterns`, `vector-field-streamlines`, `taylor-polynomial-approximation`, `complex-phase-portrait`.
- Long descriptions: `lissajous-curve` and `spirograph-curve`.
- Dense but acceptable Explore description: `permutations-combinations`.

Recommended improvements:

- Add a short "先看什麼" sentence for advanced pages.
- Keep formulas, but pair them with a concrete visual reading target.
- Shorten long descriptions before using them in social previews or featured positions.
- Run DOM smoke with `--url` for representative advanced pages before prominent promotion.

## Pages to keep draft or avoid exposing

There is no currently public page that must be changed back to draft based on this audit.

Keep these draft pages unpublished until their release dependencies are ready:

- Draft Explore: `data-analysis`, `discrete-random-variables`, `linear-programming`, `space-vectors-planes-lines`.
- Draft Works: `binomial-geometric-distribution`, `cross-product-geometry`, `line-plane-intersection`, `lp-feasible-half-planes`, `lp-objective-level-curves`, `lp-vertex-optimum`, `plane-normal-distance`, `space-vector-three-plane-projection`.

Draft Explore pages currently point to cover paths, but the referenced public PNG files are not present. This is acceptable while they remain draft, but it is a publish blocker for those pages.

## Post-release risks

- Mobile layout was not manually inspected in this audit. Before promotion, run DOM smoke or browser checks for Home, Works list, Explore list, and representative detail pages at 390px and 430px.
- Umami and giscus are still P2 follow-ups unless separately connected.
- The current audit confirms file/content readiness, not production availability. Production URL, sitemap, and canonical checks still need to be performed after deployment.
