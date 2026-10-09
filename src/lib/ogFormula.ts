/**
 * OG 卡片上的公式顯示。
 *
 * 作品模組的 `formula` 是給頁面用的純文字，有些含 `z_{n+1}`、`e^(iθ)` 這類 TeX／插入符號寫法，
 * 有些太長；卡片上公式只排一行（不在式子中間換行），所以這裡準備中英文卡片可直接顯示的版本：
 * 用 Unicode 上下標，太長的只留能完整放下的部分。
 */

/**
 * 中英文卡片共用的公式（slug → 顯示字串）：只有數學符號、不含文字，兩種語言都適用。
 * 沒列出的直接用模組公式。
 */
export const OG_FORMULA_SHARED: Record<string, string> = {
  // TeX／插入符號寫法改成上下標
  'julia-set': 'zₙ₊₁ = zₙ² + c',
  'mandelbrot-map': 'zₙ₊₁ = zₙ² + c, z₀ = 0',
  'exponential-growth-decay': 'y(t) = C eᵏᵗ',
  'equiangular-spiral': 'r = a·eᵇᶿ',
  'complex-polar-form': 'z = r·eⁱᶿ',
  'demoivre-nth-roots': '(r eⁱᶿ)ⁿ = rⁿ eⁱⁿᶿ',
  'polynomial-roots-multiplicity': 'f(x) = a∏(x − rᵢ)ᵐⁱ',
  'circle-inversion': "P' = R² P / |P|²",
  'binomial-expansion-geometry': '(a + b)² = a² + 2ab + b²',
  'binomial-geometric-distribution': 'P(X = k) = C(n, k) pᵏ(1 − p)ⁿ⁻ᵏ',
  'catalan-numbers': 'Cₙ = C(2n, n) / (n + 1)',
  'logarithmic-scale': 'y = 10ᵃˣ, log₁₀ y = ax',
  'logistic-curve': 'y(t) = L / (1 + a·e⁻ᵏᵗ)',
  'taylor-polynomial-approximation': 'Tₙ(x) = Σ f⁽ᵏ⁾(a)(x − a)ᵏ / k!',
  // 沒有對應的 Unicode 下標（A、B、y）時改用等價寫法
  'conic-envelope': 'x/a + y/b = 1',
  'complex-phase-portrait': 'R(t) = P₁(t) + P₂(t)',
  'vector-projection': 'proj(a) = (a·b / b·b) b',
  'space-vector-three-plane-projection': '(x, y, z) ↦ (x, y, 0)',
  // 「x--1.25」寫成 x + 1.25
  'rational-vertical-horizontal-asymptotes': 'R(x) = 1.35(x + 1.25) / (x − 1.10)',
  'rational-oblique-asymptote': 'R(x) = 0.85x + 0.25 + 1.45 / (x + 0.85)',
  'buffon-needle': 'P(hit) = 2l / (πd)',
  // 太長：只留一行放得下的部分
  'euler-formula-rotation': 'eⁱᵠ = cos φ + i sin φ, φ = ωt + δ',
  'harmonograph-curve': 'x = A sin(at + δ) e⁻ᵈᵗ',
  'spirograph-curve': 'x = (R − r)cos t + d·cos((R − r)t / r)',
};

/** 英文卡片的公式：共用版本，再加上模組公式含中文的英文版。用語依 docs/i18n-glossary.md */
export const EN_OG_FORMULA: Record<string, string> = {
  ...OG_FORMULA_SHARED,
  // 模組公式含中文
  'lp-objective-level-curves': 'z = px + qy, level curves px + qy = k',
  'lp-vertex-optimum': 'zⱼ = p xⱼ + q yⱼ, optimum at a vertex',
  'poincare-triangle': 'angle sum < 180°',
  'row-op-solution-space': 'row 3 := row 3 + k × row 1',
};

/** 左欄可用寬度（1200 − 左右 padding 112 − 圖框 520 − 間距 40） */
export const OG_FORMULA_MAX_WIDTH = 528;
/** 等寬字約 0.6em 寬 */
const MONO_ADVANCE = 0.6;
/** 中文字與全形標點約 1em 寬 */
const WIDE_CHAR = /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/;

/** 公式寬度，以等寬字的字數計（中文字與全形標點約佔 1/0.6 個等寬字；英文公式不含中文，結果與字數相同） */
export function ogFormulaWidth(formula: string): number {
  let width = 0;
  for (const ch of formula) width += WIDE_CHAR.test(ch) ? 1 / MONO_ADVANCE : 1;
  return width;
}
export const OG_FORMULA_MAX_SIZE = 34;
export const OG_FORMULA_MIN_SIZE = 22;
/** 最小字級時一行能放的字數 */
export const OG_FORMULA_MAX_CHARS = Math.floor(OG_FORMULA_MAX_WIDTH / (MONO_ADVANCE * OG_FORMULA_MIN_SIZE));

/** 公式排一行：字級取放得下的最大值 */
export function ogFormulaFontSize(formula: string): number {
  const width = ogFormulaWidth(formula);
  const fit = Math.floor(OG_FORMULA_MAX_WIDTH / (MONO_ADVANCE * Math.max(width, 1)));
  return Math.max(OG_FORMULA_MIN_SIZE, Math.min(OG_FORMULA_MAX_SIZE, fit));
}

/** 卡片上的公式不得有 TeX／插入符號寫法，也不得長到一行放不下 */
export function ogFormulaProblems(formula: string): string[] {
  const problems: string[] = [];
  if (/[_^\\]/.test(formula)) problems.push('TeX-like syntax (_ ^ \\)');
  if (/\w\{|\}\w/.test(formula)) problems.push('TeX-like braces');
  if (ogFormulaWidth(formula) > OG_FORMULA_MAX_CHARS) {
    problems.push(`longer than ${OG_FORMULA_MAX_CHARS} characters`);
  }
  return problems;
}

/** 英文卡片的公式：先套對照表，再把全形逗號／分號換成半形 */
export function toEnOgFormula(slug: string, formula: string): string {
  const text = EN_OG_FORMULA[slug] ?? formula;
  return text.replace(/，\s*/g, ', ').replace(/；\s*/g, '; ').trim();
}

/** 中文卡片的公式：套共用對照表（中文與全形標點保留原樣） */
export function toZhOgFormula(slug: string, formula: string): string {
  return (OG_FORMULA_SHARED[slug] ?? formula).trim();
}
