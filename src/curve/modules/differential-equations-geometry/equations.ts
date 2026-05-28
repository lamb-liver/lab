import type { EqKey, EquationDef } from './types';

export function getEquation(key: EqKey): EquationDef {
  if (key === 'x') {
    return {
      key: 'x',
      label: 'dy/dx = x',
      f: (x) => x,
      exact: (x, x0, y0) => y0 + 0.5 * (x * x - x0 * x0),
      note: '方向只跟 x 有關',
    };
  }

  if (key === 'xPlusY') {
    return {
      key: 'xPlusY',
      label: 'dy/dx = x + y',
      f: (x, y) => x + y,
      exact: (x, x0, y0) => {
        const c = (y0 + x0 + 1) * Math.exp(-x0);
        return c * Math.exp(x) - x - 1;
      },
      note: '斜率同時受 x 與 y 影響',
    };
  }

  return {
    key: 'minusY',
    label: 'dy/dx = -y',
    f: (_x, y) => -y,
    exact: (x, x0, y0) => y0 * Math.exp(-(x - x0)),
    note: '解曲線族是指數衰減',
  };
}

export function formatNum(v: number): string {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) >= 100) return v.toFixed(2);
  if (Math.abs(v) >= 10) return v.toFixed(3);
  return v.toFixed(4);
}
