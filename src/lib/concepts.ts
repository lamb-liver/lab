/**
 * 跨集合概念聚合的正規詞彙（registry）。
 * frontmatter 的 `concepts` 欄位存 slug；顯示用 label；`area` 供 /concept 索引頁分組。
 * 文件說明見 docs/concept-taxonomy.md。
 */

export interface Concept {
  slug: string;
  label: string;
  area: string;
}

export const concepts = [
  { slug: 'trig-functions', label: '三角函數', area: '三角與週期' },
  { slug: 'trig-identities', label: '三角恆等式', area: '三角與週期' },
  { slug: 'law-of-sines-cosines', label: '正餘弦定理', area: '三角與週期' },
  { slug: 'wave-superposition', label: '波的疊加與干涉', area: '三角與週期' },
  { slug: 'complex-numbers', label: '複數', area: '複數' },
  { slug: 'euler-formula', label: '尤拉公式', area: '複數' },
  { slug: 'vectors', label: '平面向量', area: '向量與線性代數' },
  { slug: 'dot-cross-product', label: '內積與外積', area: '向量與線性代數' },
  { slug: 'space-vectors', label: '空間向量', area: '向量與線性代數' },
  { slug: 'matrix', label: '矩陣', area: '向量與線性代數' },
  { slug: 'linear-transformation', label: '線性變換', area: '向量與線性代數' },
  { slug: 'eigenvector', label: '特徵向量', area: '向量與線性代數' },
  { slug: 'linear-systems', label: '線性方程組', area: '向量與線性代數' },
  { slug: 'function-transformation', label: '函數圖形變換', area: '函數與多項式' },
  { slug: 'quadratic-function', label: '二次函數', area: '函數與多項式' },
  { slug: 'polynomial', label: '多項式', area: '函數與多項式' },
  { slug: 'rational-asymptote', label: '有理函數與漸近線', area: '函數與多項式' },
  { slug: 'inverse-function', label: '反函數', area: '函數與多項式' },
  { slug: 'conic-sections', label: '圓錐曲線', area: '圓錐曲線' },
  { slug: 'exponential-logarithm', label: '指數與對數', area: '指對與成長' },
  { slug: 'logistic-growth', label: '邏輯斯蒂成長', area: '指對與成長' },
  { slug: 'limit', label: '極限', area: '微積分' },
  { slug: 'derivative-tangent', label: '導數與切線', area: '微積分' },
  { slug: 'definite-integral', label: '定積分', area: '微積分' },
  { slug: 'taylor-approximation', label: '泰勒展開', area: '微積分' },
  { slug: 'differential-equation', label: '微分方程', area: '微積分' },
  { slug: 'sequences-series', label: '數列與級數', area: '數列級數' },
  { slug: 'classical-probability', label: '古典機率', area: '機率統計' },
  { slug: 'conditional-probability', label: '條件機率與貝氏', area: '機率統計' },
  { slug: 'probability-distribution', label: '機率分佈', area: '機率統計' },
  { slug: 'expected-value', label: '期望值', area: '機率統計' },
  { slug: 'descriptive-statistics', label: '敘述統計', area: '機率統計' },
  { slug: 'regression-correlation', label: '迴歸與相關', area: '機率統計' },
  { slug: 'permutation-combination', label: '排列組合', area: '組合' },
  { slug: 'binomial-theorem', label: '二項式定理', area: '組合' },
  { slug: 'parametric-curve', label: '參數曲線', area: '曲線・碎形・最佳化' },
  { slug: 'fractal', label: '碎形', area: '曲線・碎形・最佳化' },
  { slug: 'dynamical-system', label: '動力系統與混沌', area: '曲線・碎形・最佳化' },
  { slug: 'vector-field', label: '向量場', area: '曲線・碎形・最佳化' },
  { slug: 'linear-programming', label: '線性規劃', area: '曲線・碎形・最佳化' },
] as const satisfies readonly Concept[];

/** 領域顯示順序沿用 registry 首次出現順序，避免平行清單漂移。 */
export const conceptAreas = [...new Set(concepts.map((concept) => concept.area))];

export type ConceptSlug = (typeof concepts)[number]['slug'];

export const conceptSlugs = concepts.map((c) => c.slug) as ConceptSlug[];

const bySlug = new Map<string, Concept>(concepts.map((c) => [c.slug, c]));

/** slug → Concept；未知 slug 回傳 undefined */
export const conceptBySlug = (slug: string): Concept | undefined => bySlug.get(slug);

/** slug → 顯示 label；未知 slug 退回原 slug（不應發生，enum 已擋） */
export const conceptLabel = (slug: string): string => bySlug.get(slug)?.label ?? slug;
