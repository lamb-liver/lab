# 英文用語表（English glossary）

> 英文版（`/en/`）翻譯與審查依據。來源優先序與每個詞的出處見「Official terminology」。2026-10-09 依 #75、#76 更新。驗收紀錄見 [`i18n-verification.md`](i18n-verification.md)。

## Frontmatter
- audience: 高中概念 → High-school concept · 大學概念 → University concept · 直觀探索 → Intuitive exploration
- works tags: 幾何 Geometry · 函數與分析 Functions and analysis · 線性代數 Linear algebra · 機率統計 Probability and statistics · 組合數學 Combinatorial mathematics · 動力系統 Dynamical systems · 碎形 Fractal
- explore category: 代數 Algebra · 幾何 Geometry · 分析 Analysis · 統計 Statistics
- exam: subject / questionType stay as the zh enum; description starts "114 GSAT Mathematics A, Fill-in 13: …" / "112 AST Mathematics I, Fill-in 9: …"; unit "高一必修數學・多項式函數" → "Grade 10 required mathematics · Polynomial functions" (superseded by PR 11 — see Official terminology)

## Section headings
- works: 參數方程 → ## Parametric equations · 互動說明 → ## Interaction · 觀察重點 → ## What to notice · 相關作品 → ## Related · 延伸閱讀 → ## Further reading
- explore: 基本概念 → ## Idea · 互動說明 → ## Interaction · 觀察重點 → ## What to notice · 相關作品 → ## Related · 延伸閱讀 → ## Further reading
- exam: 題意 → ## Problem · 為什麼會錯 → ## Where it goes wrong · 觀念 → ## Idea · 互動怎麼看 → ## What the figure shows
- Further reading uses English Wikipedia: "[Topic (Wikipedia)](https://en.wikipedia.org/wiki/…)"
- AMC credit: "Source: MAA AMC, {year} AMC 12X, Problem #n. © {year} Mathematical Association of America"; links: "AoPS problem page" / "Solutions"; Taiwan: "Original paper" / "Official solutions"; CEEC "item statistics" / "scoring guidelines"; CEEC P = correct rate（答對率，單選／選填）, score rate（得分率，多選或原文用得分率者）; third-party analyses are labeled as such (e.g. "Hanlin's solution notes (a publisher's analysis, not CEEC)")

## Interaction bullets
- "- **Control name**: what it does, plain verbs (show, move, drag, switch, mark, compare)"; control names in bold, sentence case
- Buttons: Play / Pause / Replay / Reset; Mode; View; Display; Compare; Advanced; Readings; Parameters; Adjust parameters / Hide parameters
- Param labels: "Name symbol", e.g. "Number of terms N", "Exponent p", "Angle θ", "Period T", "Common ratio q", "Transform speed ω", "X shear b"
- Exam prompt: "Think first"; result feedback "Correct: …" / "Think again: …"; "Pick … first"
- aria for canvas loading: "Loading the figure"; breadcrumbs label "Breadcrumb"; comments "Comments / Load comments / Comment with a GitHub account."
- Related block: Related · Work: · Explore: · Exam:

## Style
- Plain, short declarative sentences; no hype; American spelling (normalize, color, center)
- Math notation identical to zh source ($…$, same symbols)
- Keep proper names: Euler, Sierpinski, Fourier, Mandelbrot, Julia
- Existing titles: Iterated affine fractal · Affine transformation pattern · Rotation and scaling, composed · Basic patterns of a vector field · Sierpinski triangle · Logistic map bifurcation diagram · Level curves of the objective · Fourier series · Superposition of trigonometric functions and wave interference · Iteration dynamics: from convergence to fractals

## Site chrome (PR 9/10)
- Nav/footer: 作品集 Works · 主題導覽 Explore · 試題視覺化 Exams (list h1: Works / Math topics / Exam visualizations)
- 首頁 Home · 返回作品集 ← Back to works · 返回主題導覽 ← Back to Explore · 返回試題視覺化 ← Back to exams
- 開啟選單/關閉選單 Open menu / Close menu · 主要導覽 Main navigation · 網站導覽 Site navigation
- Language switch: 「中文」 on en pages (endonym, mirrors 「English」 on zh pages); brand 羊·實驗 stays

## Official terminology (PR 11 「用詞對齊官方譯名」)
Sources (precedence: CEEC / MOE / MAA for exam & curriculum names → NAER 高中以下數學名詞 → NAER 數學名詞):
- [CEEC-GSAT] CEEC English, GSAT: https://www.ceec.edu.tw/en/xmdoc/cont?xsmsid=0J180519762978782512 · GSAT Mathematics: https://www.ceec.edu.tw/en/xmdoc/cont?xsmsid=0J180520015414136566
- [CEEC-AST] CEEC English, AST ("Mathematics I (for science and engineering majors)"): https://www.ceec.edu.tw/en/xmdoc/cont?xsmsid=0J180520257949680510 · AST Mathematics I & II ("non-multiple-choice questions"): https://www.ceec.edu.tw/en/xmdoc/cont?xsmsid=0J180520465857418078
- [MOE] 108 Curriculum Guidelines, Mathematics (official English; Grade 10–12, Mathematics A/B, Mathematics I/II, sine law, cosine law, spatial vector, conic sections, inner product, scatter diagram): https://englishcenter.ntpc.edu.tw/uploads/16767043725953AafXiFc.pdf (MOE mirror https://cirn.moe.edu.tw/Upload/file/40548/112074.pdf has a broken TLS cert)
- [MAA] MAA AMC solutions booklet: "All problems should be credited to the MAA AMC (for example, '2017 AMC 12 B, Problem #21')", © {year} Mathematical Association of America (text mirror: http://www.stemivy.com/2021-AMC%2012A%20Solutions.pdf ; policy page https://maa.org/student-programs/amc/maa-amc-policies/)
- [NAER-HS] 樂詞網 高中以下數學名詞: https://terms.naer.edu.tw/download/4/ · [NAER-M] 數學名詞: https://terms.naer.edu.tw/download/1/?page=9 (searchable at https://terms.naer.edu.tw/)

Rule: an English term passes if NAER lists it for the exact zh term (HS or M). Otherwise use the HS form (else M). Curriculum/exam names follow CEEC/MOE.

| zh | old en | new en | source |
|---|---|---|---|
| 學測數A / 學測數B | GSAT Math A / B | GSAT Mathematics A / B | CEEC-GSAT + MOE |
| 分科數甲 | AST Math A | AST Mathematics I | CEEC-AST + MOE |
| 非選 | Written | Non-multiple-choice | CEEC-AST |
| 高一/高二/高三 | Senior-high year 1/2/3 | Grade 10/11/12 | MOE |
| 數學A / 數A | Math A | Mathematics A | MOE |
| 數學甲 / 數甲 | Math A (mistranslated) | Mathematics I | MOE |
| 必修 / 選修 | required / elective | required / elective (unchanged) | MOE |
| AMC 第 n 題 (label) | 2023 AMC 12B, Problem 21 / "AMC 12B #21" | 2023 AMC 12B, Problem #21 | MAA |
| AMC credit | Source: 2023 AMC 12B, Problem #21 © MAA | Source: MAA AMC, 2023 AMC 12B, Problem #21. © 2023 Mathematical Association of America | MAA |
| 線性變換 | linear transform | linear transformation | NAER-M (linear transform = 線性變換式) + MOE |
| 仿射變換 | affine transform | affine transformation | NAER-M |
| 線性方程組 | linear system | system of linear equations | NAER-M |
| 空間向量 | space vector | spatial vector | NAER-M + MOE |
| 正弦定理 / 餘弦定理 | law of sines / law of cosines | sine law / cosine law | NAER-HS 正弦定律/餘弦定律 + MOE |
| 散布圖 / 散布 | Scatter | scatter diagram | NAER-HS |
| 旋轉體 | volume of revolution | solid of revolution | NAER-HS |
| 二次函數 | Quadratics | quadratic functions | NAER-HS |
| 三角函數 | trigonometric functions | (unchanged; full form used in unit line) | NAER-HS |
| 參數方程 (works heading) | ## Figure | ## Parametric equations | NAER-M parametric equation |
| 組合數學 (tag) | Combinatorics | Combinatorial mathematics | NAER-M |
| 駐波 | standing wave | stationary wave | NAER-M 駐波；定波 = stationary wave |
| 最優解 | optimum | optimal solution | NAER-M 最佳解 = optimal solution (only where zh says 最優解; 最優 alone keeps "optimum") |
| X的幾何意義 (4 titles) | Dot product / Cross product / Geometry of … | Geometric significance of … | NAER-M 幾何意義 = geometric significance |

Checked and kept (NAER lists the current English for the exact zh term): dot product (內積；點積), cross product (外積；叉積), conic sections (MOE), random variable, complex plane, definite integral, derivative, tangent line, limit, conditional probability, binomial theorem, expected value, linear programming, feasible region, objective function, matrix, polynomial, asymptote, inverse function, rational function, trigonometric identity, classical probability, dynamical system, fractal, vector field, inversion, regression line, skew lines, focal chord, center of symmetry, common perpendicular, level curve, box plot, percentile, Riemann sum, polar form, tractrix, rose curve, equiangular spiral, unit circle, reflection matrix, logistic curve, bifurcation.
Judgment calls (kept, flag for user): eigenvector (NAER 特徵向量 = characteristic vector; eigenvector is NAER for synonym 固有向量); hyperbolic law of cosines (named theorem, no NAER entry); 高二數學甲 / 高三選修數A in the zh unit lines are translated literally (Grade 11 Mathematics I / Grade 12 elective Mathematics A) although MOE places 數學甲 in Grade 12 and 數A in Grade 11 — possible zh slip, zh not changed. **Resolved in #75**: English unit lines now follow MOE (Grade 11 Mathematics A · Plane vectors / Planes and lines in space / Matrices and linear transformations; Grade 10 required mathematics · Circles and lines); zh unchanged.
No NAER entry (kept common English): logistic map (單峰映射), Buffon's needle, Catalan numbers, Basel problem, Chladni figures, Lissajous curve, harmonograph, Julia set, Mandelbrot set, Sierpinski triangle, Taylor polynomial, oblique asymptote, 單選 Multiple choice, 多選 Multiple select, 選填 Fill-in (CEEC has no English for these three).
No official source (site UI): Works / Explore / Exams, Home, ← Back to …, Open menu / Close menu, Main navigation, Site navigation, Play / Pause / Replay / Reset, audience labels, section headings (Interaction / What to notice / Related / Further reading / Idea / Problem / Where it goes wrong / What the figure shows), Original paper / Official solutions / AoPS problem page / Solutions, 中文 / English switch.
Wikipedia link texts ("Law of sines (Wikipedia)") keep the article title.

## Concept labels / curated paths / About (PR 12–14)
Concept names: src/lib/conceptLabels.ts. Path copy: src/lib/learningPathsEn.ts. About: src/pages/en/about.astro. SEO: siteSeoEn.concept/path/about in src/lib/seoCopy.ts.
- NAER/MOE-sourced: 三角函數 Trigonometric functions (HS) · 三角恆等式 Trigonometric identities (M) · 正餘弦定理 Sine law and cosine law (HS+MOE) · 波的疊加與干涉 Superposition and interference of waves (M 疊加=superposition, 干涉=interference) · 複數 Complex numbers (HS) · 平面向量 Plane vectors (MOE) · 內積與外積 Dot product and cross product (M) · 空間向量 Spatial vectors (M+MOE) · 矩陣 Matrices (HS) · 線性變換 Linear transformations (M) · 線性方程組 Systems of linear equations (M) · 函數圖形變換 Transformations of graphs of functions (HS 函數圖形=graph of function; M 變換=transformation) · 二次函數 Quadratic functions (HS) · 多項式 Polynomials (HS) · 有理函數與漸近線 Rational functions and asymptotes (M/HS) · 反函數 Inverse functions (HS) · 圓錐曲線 Conic sections (MOE) · 指數與對數 Exponents and logarithms (HS) · 極限 Limits (HS) · 導數與切線 Derivatives and tangent lines (HS) · 定積分 Definite integrals (HS) · 泰勒展開 Taylor expansions (M 泰勒展開[式]) · 微分方程 Differential equations (M) · 數列與級數 Sequences and series (MOE "sequence"; HS 級數=series) · 古典機率 Classical probability (M) · 條件機率與貝氏 Conditional probability and Bayes' theorem (HS) · 機率分佈 Probability distributions (HS 機率分布) · 期望值 Expected value (HS) · 敘述統計 Descriptive statistics (HS) · 迴歸與相關 Regression and correlation (M) · 排列組合 Permutations and combinations (HS) · 二項式定理 Binomial theorem (HS) · 參數曲線 Parametric curves (M) · 碎形 Fractals (M) · 動力系統 Dynamical systems (M) · 向量場 Vector fields (M) · 線性規劃 Linear programming (HS) · 反演 Inversion (M) · 雙曲幾何 Hyperbolic geometry (M) · 圓冪 Power of a point (M 點對圓的冪 = power of a point to a circle)
- Areas: 組合 Combinatorial mathematics (M) · 微積分 Differential and integral calculus (M) · 機率統計 Probability and statistics · 向量與線性代數 Vectors and linear algebra · 函數與多項式 Functions and polynomials · 數列級數 Sequences and series · 幾何 Geometry · 複數 / 圓錐曲線 as above
- No official source: Euler's formula (尤拉公式), Logistic growth, chaos, Eigenvectors (kept, pending user), areas "Trigonometry and periodicity", "Exponents, logarithms, and growth", "Curves, fractals, and optimization"
- Paths: 從平面向量到空間幾何 → From plane vectors to three-dimensional geometry (M 三維幾何; 空間幾何 not listed). Notes use unit circle, radian, amplitude (MOE), period, phase, superposition, interference, stationary wave, periodic function, scalar multiplication, projection, normal vector, cross product.
- UI (no official source): Concept index · Concepts · Curated paths / Curated path · {n} steps → · Follow a curated path · ← Back to the concept index / curated paths · Work / Explore / Exam step kinds · About · Privacy · Contact · Email / Other · Copy / Copied / Copy failed. Select the address manually. · English (zh nav switch)
