import { createElement, type CSSProperties, type ReactNode } from 'react';
import { OG_FORMULA_MAX_WIDTH, ogFormulaFontSize } from './ogFormula';
import { ZH_WORK_TITLE_SIZES, zhTitleLayout } from './zhOgTitle';

export type WorkOgCardContent = {
  title: string;
  formula: string;
  thumbnailDataUrl: string;
};

/** 公式文字的字型順序：等寬拉丁 → 符號備援 → 中文 → 全形標點（字型檔見 workOgFonts.ts） */
const FORMULA_FONT_FAMILY =
  'JetBrains Mono, Noto Sans Mono, Noto Sans Math, Noto Sans TC, Noto Sans TC Punct, Noto Sans TC Punct2';

const BG = '#0d0d0d';
const TEXT = '#e8e8e8';
const MUTED = '#888888';
const FORMULA = '#d4b87a';
const BORDER = '#2a2a2a';

export function buildWorkOgElement(content: WorkOgCardContent): ReactNode {
  const { formula, thumbnailDataUrl } = content;
  // 標題與試題／主題卡同一套斷行規則：放得下排一行，否則在標點或「的」「與」之後斷成兩行
  const title = zhTitleLayout(content.title, ZH_WORK_TITLE_SIZES);

  const rootStyle: CSSProperties = {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: BG,
    color: TEXT,
    padding: '48px 56px',
    fontFamily: 'Noto Sans TC',
  };

  const leftStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    paddingRight: 40,
  };

  const brandStyle: CSSProperties = {
    fontSize: 24,
    color: MUTED,
    letterSpacing: '0.08em',
    marginBottom: 28,
  };

  const titleStyle: CSSProperties = {
    fontSize: title.fontSize,
    fontWeight: 400,
    lineHeight: 1.15,
    marginBottom: 24,
    whiteSpace: 'pre-line',
  };

  const formulaStyle: CSSProperties = {
    // 與英文卡片相同：公式只排一行，不在式子中間換行，字級取放得下的最大值（ogFormula.ts）
    fontSize: ogFormulaFontSize(formula),
    lineHeight: 1.35,
    whiteSpace: 'nowrap',
    color: FORMULA,
    fontFamily: FORMULA_FONT_FAMILY,
    maxWidth: OG_FORMULA_MAX_WIDTH,
  };

  const frameOuterStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 520,
  };

  const frameInnerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 420,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
  };

  const imgStyle: CSSProperties = {
    objectFit: 'contain',
  };

  return createElement(
    'div',
    { style: rootStyle },
    createElement(
      'div',
      { style: leftStyle },
      createElement('div', { style: brandStyle }, '羊·實驗'),
      createElement('div', { style: titleStyle }, title.text),
      formula
        ? createElement('div', { style: formulaStyle }, formula)
        : null,
    ),
    createElement(
      'div',
      { style: frameOuterStyle },
      createElement(
        'div',
        { style: frameInnerStyle },
        createElement('img', {
          src: thumbnailDataUrl,
          width: 480,
          height: 300,
          style: imgStyle,
        }),
      ),
    ),
  );
}
