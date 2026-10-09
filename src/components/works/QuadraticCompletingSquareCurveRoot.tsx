import { useCallback, useState } from 'react';
import { PRESETS } from '../../curve/modules/quadratic-completing-square/constants';
import {
  DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS,
  isPresetActive,
  paramsForMetadata,
  quadraticCompletingSquareModule,
  sanitizeA,
  type QuadraticCompletingSquareParams,
} from '../../curve/modules/quadratic-completing-square';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useQuadraticCompletingSquareP5 } from '../curve/useQuadraticCompletingSquareP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  a: 'Coefficient a',
  b: 'Coefficient b',
  c: 'Coefficient c',
};

const PRESET_EN: Record<string, string> = {
  '兩實根': 'Two real roots',
  '重根': 'Repeated root',
  '無實根': 'No real roots',
};

const STATE_EN: Record<string, string> = {
  '兩實根': 'Two real roots',
  '重根': 'Repeated root',
  '無實根': 'No real roots',
};

function englishRootValue(value: string): string {
  if (value === '無實根') return 'No real roots';
  return value.replaceAll('，', ', ');
}

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Completing the square',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'roots') {
        return { ...stat, label: 'Roots', value: englishRootValue(String(stat.value)) };
      }
      if (stat.key === 'state') {
        const value = String(stat.value);
        return { ...stat, label: 'State', value: STATE_EN[value] ?? value };
      }
      return stat;
    }),
  };
}

export default function QuadraticCompletingSquareCurveRoot({ controlsMountId, locale }: Props) {
  const module = quadraticCompletingSquareModule;
  const en = locale === 'en';
  const [params, setParams] = useState<QuadraticCompletingSquareParams>(
    DEFAULT_QUADRATIC_COMPLETING_SQUARE_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<QuadraticCompletingSquareParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useQuadraticCompletingSquareP5({
    params,
    onParamsChange,
    locale,
  });

  const sliderValues = paramsForMetadata(params);
  const metadata = module.getMetadata(sliderValues, {
    revealPct: 100,
    smoothParams: sliderValues,
  });
  const shown = en ? englishMetadata(metadata) : metadata;
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: EN_LABELS[def.key] ?? def.label,
        })),
      }
    : module;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <p className="curve-work-controls__formula">=a(x-h)²+k</p>

      <p className="curve-work-controls__formula">{en ? 'Quick states' : '快速狀態'}</p>
      <div
        className="curve-work-mode-toggle"
        style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={isPresetActive(params, preset)}
            onClick={() =>
              onParamsChange({ a: preset.a, b: preset.b, c: preset.c })
            }
          >
            {en ? PRESET_EN[preset.label] : preset.label}
          </button>
        ))}
      </div>

      <ParamControls
        module={controlsModule}
        values={sliderValues}
        onChange={(key, value) => {
          if (key === 'a') {
            onParamsChange({ a: sanitizeA(value) });
            return;
          }
          if (key === 'b' || key === 'c') {
            onParamsChange({ [key]: value });
          }
        }}
      />

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.advanced}
          onClick={() => onParamsChange({ advanced: !params.advanced })}
        >
          {en
            ? params.advanced
              ? 'Completing guide: on'
              : 'Completing guide: off'
            : params.advanced
              ? '配方 guide：開'
              : '配方 guide：關'}
        </button>
      </div>

      <p className="curve-work-controls__formula">
        {en ? 'Drag the vertex V on the figure' : '也可在圖上拖動頂點 V'}
      </p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Completing the square' : '二次函數配方視覺化'}
      />
      {controls}
    </>
  );
}
