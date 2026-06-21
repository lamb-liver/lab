/** Frontmatter description: plain-text math only (cards / OG), not LaTeX delimiters. */

const DESCRIPTION_RAW_MATH_DELIMITER = /(^|[^\\])\$[^$\n]+\$/;
const DESCRIPTION_RAW_DISPLAY_MATH_DELIMITER = /(^|[^\\])\$\$/;
const DESCRIPTION_ESCAPED_MATH_DELIMITER = /\\[([]/;
const DESCRIPTION_LATEX_ENVIRONMENT = /\\(?:begin|end)\{/;
const DESCRIPTION_LATEX_COMMAND = /\\[a-zA-Z]+/;

const DESCRIPTION_MATH_CHECKS = [
  DESCRIPTION_RAW_MATH_DELIMITER,
  DESCRIPTION_RAW_DISPLAY_MATH_DELIMITER,
  DESCRIPTION_ESCAPED_MATH_DELIMITER,
  DESCRIPTION_LATEX_ENVIRONMENT,
  DESCRIPTION_LATEX_COMMAND,
] as const;

export function descriptionHasRawMath(value: string): boolean {
  return DESCRIPTION_MATH_CHECKS.some((pattern) => pattern.test(value));
}
