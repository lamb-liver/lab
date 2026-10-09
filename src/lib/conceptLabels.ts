import { concepts } from './concepts';

export type ConceptSlug = (typeof concepts)[number]['slug'];
type ConceptArea = (typeof concepts)[number]['area'];

/**
 * 概念與領域的英文顯示名（/en/concept 用）。
 * 有官方來源的才用官方譯名；其餘標「no official source」見 glossary。
 * 概念 slug 與中文 label 仍以 concepts.ts 為準，這裡只加英文。
 */

/** slug → 英文名。缺漏或多出的 slug 會讓 typecheck 失敗。 */
export const conceptLabelsEn = {
  'trig-functions': 'Trigonometric functions',
  'trig-identities': 'Trigonometric identities',
  'law-of-sines-cosines': 'Sine law and cosine law',
  'wave-superposition': 'Superposition and interference of waves',
  'complex-numbers': 'Complex numbers',
  'euler-formula': "Euler's formula",
  vectors: 'Plane vectors',
  'dot-cross-product': 'Dot product and cross product',
  'space-vectors': 'Spatial vectors',
  matrix: 'Matrices',
  'linear-transformation': 'Linear transformations',
  eigenvector: 'Eigenvectors',
  'linear-systems': 'Systems of linear equations',
  'function-transformation': 'Transformations of graphs of functions',
  'quadratic-function': 'Quadratic functions',
  polynomial: 'Polynomials',
  'rational-asymptote': 'Rational functions and asymptotes',
  'inverse-function': 'Inverse functions',
  'conic-sections': 'Conic sections',
  'exponential-logarithm': 'Exponents and logarithms',
  'logistic-growth': 'Logistic growth',
  limit: 'Limits',
  'derivative-tangent': 'Derivatives and tangent lines',
  'definite-integral': 'Definite integrals',
  'taylor-approximation': 'Taylor expansions',
  'differential-equation': 'Differential equations',
  'sequences-series': 'Sequences and series',
  'classical-probability': 'Classical probability',
  'conditional-probability': "Conditional probability and Bayes' theorem",
  'probability-distribution': 'Probability distributions',
  'expected-value': 'Expected value',
  'descriptive-statistics': 'Descriptive statistics',
  'regression-correlation': 'Regression and correlation',
  'permutation-combination': 'Permutations and combinations',
  'binomial-theorem': 'Binomial theorem',
  'parametric-curve': 'Parametric curves',
  fractal: 'Fractals',
  'dynamical-system': 'Dynamical systems and chaos',
  'vector-field': 'Vector fields',
  'linear-programming': 'Linear programming',
  inversion: 'Inversion',
  'hyperbolic-geometry': 'Hyperbolic geometry',
  'circle-power': 'Power of a point',
} as const satisfies Record<ConceptSlug, string>;

export const conceptAreasEn = {
  三角與週期: 'Trigonometry and periodicity',
  複數: 'Complex numbers',
  向量與線性代數: 'Vectors and linear algebra',
  函數與多項式: 'Functions and polynomials',
  圓錐曲線: 'Conic sections',
  指對與成長: 'Exponents, logarithms, and growth',
  微積分: 'Differential and integral calculus',
  數列級數: 'Sequences and series',
  機率統計: 'Probability and statistics',
  組合: 'Combinatorial mathematics',
  '曲線・碎形・最佳化': 'Curves, fractals, and optimization',
  幾何: 'Geometry',
} as const satisfies Record<ConceptArea, string>;

export const conceptLabelEn = (slug: ConceptSlug): string => conceptLabelsEn[slug];
export const conceptAreaEn = (area: string): string => conceptAreasEn[area as ConceptArea] ?? area;
