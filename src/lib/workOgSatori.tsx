import type { ReactNode } from 'react';

export type WorkOgCardContent = {
  title: string;
  formula: string;
  thumbnailDataUrl: string;
};

const BG = '#0d0d0d';
const TEXT = '#e8e8e8';
const MUTED = '#888888';
const FORMULA = '#d4b87a';
const BORDER = '#2a2a2a';

function titleFontSize(title: string): number {
  if (title.length > 18) return 52;
  if (title.length > 12) return 60;
  return 72;
}

function formulaFontSize(formula: string): number {
  if (formula.length > 72) return 22;
  if (formula.length > 44) return 28;
  return 34;
}

export function buildWorkOgElement(content: WorkOgCardContent): ReactNode {
  const { title, formula, thumbnailDataUrl } = content;

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: BG,
        color: TEXT,
        padding: '48px 56px',
        fontFamily: 'Noto Sans TC',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          paddingRight: 40,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: MUTED,
            letterSpacing: '0.08em',
            marginBottom: 28,
          }}
        >
          羊·實驗
        </div>
        <div
          style={{
            fontSize: titleFontSize(title),
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: 24,
          }}
        >
          {title}
        </div>
        {formula ? (
          <div
            style={{
              fontSize: formulaFontSize(formula),
              lineHeight: 1.35,
              color: FORMULA,
              fontFamily: 'JetBrains Mono, Noto Sans TC',
              maxWidth: 560,
            }}
          >
            {formula}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 520,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 420,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            backgroundColor: '#0a0a0a',
            overflow: 'hidden',
          }}
        >
          <img
            src={thumbnailDataUrl}
            width={480}
            height={300}
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </div>
  );
}
