export const SPEED_SCALE = 0.25;

export const DEFAULT_SUPERPOSITION = {
  fA: 1,
  aA: 0.8,
  pA: 0,
  fB: 1.5,
  aB: 0.6,
  pB: 0,
} as const;

export const DEFAULT_BEAT = {
  fA: 2,
  fB: 2.4,
} as const;

export const DEFAULT_GUIDE = {
  phase: 0,
} as const;

export const GUIDE_PARAM_SCHEMA = [
  { key: 'phase' as const, label: '相位關係 Δφ (×π)', min: 0, max: 1, step: 0.01 },
];

export const SUPERPOSITION_PARAM_SCHEMA = [
  { key: 'fA' as const, label: '頻率 f_A (Hz)', min: 0.2, max: 2, step: 0.05, group: '波 A' },
  { key: 'aA' as const, label: '振幅 A_A', min: 0.1, max: 1, step: 0.05, group: '波 A' },
  { key: 'pA' as const, label: '相位 φ_A (×π)', min: 0, max: 2, step: 0.05, group: '波 A' },
  { key: 'fB' as const, label: '頻率 f_B (Hz)', min: 0.2, max: 2, step: 0.05, group: '波 B' },
  { key: 'aB' as const, label: '振幅 A_B', min: 0.1, max: 1, step: 0.05, group: '波 B' },
  { key: 'pB' as const, label: '相位 φ_B (×π)', min: 0, max: 2, step: 0.05, group: '波 B' },
];

export const BEAT_PARAM_SCHEMA = [
  { key: 'fA' as const, label: '頻率 f₁ (Hz)', min: 1, max: 4, step: 0.05 },
  { key: 'fB' as const, label: '頻率 f₂ (Hz)', min: 1, max: 4, step: 0.05 },
];
