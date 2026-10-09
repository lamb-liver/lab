import { createElement, type CSSProperties, type ReactNode } from 'react';

/**
 * 英文版 OG 卡片：版面與中文作品 OG（workOgSatori.ts）相同，左邊品牌＋標題（＋公式），
 * 右邊作品縮圖或 exam／explore 封面。英文標題比中文長，所以字級依字數另算，
 * 字型先用 Noto Sans（拉丁子集），品牌「羊·實驗」再落到 Noto Sans TC。
 */
export type EnOgCardContent = {
  title: string;
  /** 標題上方的小字，例如試題出處或主題分類；作品卡不放 */
  kicker?: string;
  /** 作品卡的公式；exam／explore 卡不放 */
  formula?: string;
  imageDataUrl: string;
};

export const EN_OG_SANS = 'Noto Sans, Noto Sans TC, Noto Sans Mono, Noto Sans Math';

const BG = '#0d0d0d';
const TEXT = '#e8e8e8';
const MUTED = '#888888';
const ACCENT = '#d4b87a';
const BORDER = '#2a2a2a';

export function enTitleFontSize(title: string): number {
  if (title.length > 48) return 42;
  if (title.length > 32) return 48;
  if (title.length > 20) return 56;
  return 64;
}

function formulaFontSize(formula: string): number {
  if (formula.length > 72) return 22;
  if (formula.length > 44) return 28;
  return 34;
}

export function buildEnOgElement(content: EnOgCardContent): ReactNode {
  const { title, kicker, formula, imageDataUrl } = content;

  const rootStyle: CSSProperties = {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: BG,
    color: TEXT,
    padding: '48px 56px',
    fontFamily: EN_OG_SANS,
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
    marginBottom: kicker ? 16 : 28,
  };
  const kickerStyle: CSSProperties = {
    fontSize: 22,
    lineHeight: 1.3,
    color: ACCENT,
    marginBottom: 20,
  };
  const titleStyle: CSSProperties = {
    fontSize: enTitleFontSize(title),
    fontWeight: 400,
    lineHeight: 1.15,
    marginBottom: formula ? 24 : 0,
  };
  const formulaStyle: CSSProperties = {
    fontSize: formulaFontSize(formula ?? ''),
    lineHeight: 1.35,
    color: ACCENT,
    fontFamily: `JetBrains Mono, Noto Sans Mono, Noto Sans Math, ${EN_OG_SANS}`,
    maxWidth: 560,
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

  return createElement(
    'div',
    { style: rootStyle },
    createElement(
      'div',
      { style: leftStyle },
      createElement('div', { style: brandStyle }, '羊·實驗'),
      kicker ? createElement('div', { style: kickerStyle }, kicker) : null,
      createElement('div', { style: titleStyle }, title),
      formula ? createElement('div', { style: formulaStyle }, formula) : null,
    ),
    createElement(
      'div',
      { style: frameOuterStyle },
      createElement(
        'div',
        { style: frameInnerStyle },
        createElement('img', {
          src: imageDataUrl,
          width: 480,
          height: 300,
          style: { objectFit: 'contain' },
        }),
      ),
    ),
  );
}
