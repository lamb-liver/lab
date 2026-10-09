import { useCallback, useState } from 'react';
import { BASIS_OPTIONS } from '../../curve/modules/function-graph-transform/constants';
import {
  DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  functionGraphTransformModule,
  paramsForMetadata,
  type BasisKind,
  type FunctionGraphTransformParams,
} from '../../curve/modules/function-graph-transform';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useFunctionGraphTransformP5 } from '../curve/useFunctionGraphTransformP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  a: 'Vertical scale a',
  b: 'Horizontal scale b',
  h: 'Horizontal shift h',
  k: 'Vertical shift k',
};

function englishScale(symbol: 'a' | 'b', value: number): string {
  const absValue = Math.abs(value);
  const flip = value < 0 ? ' + flip' : '';
  if (absValue < 0.0005) return `${symbol}=0: flat horizontal line`;
  if (Math.abs(absValue - 1) < 0.0005) {
    return symbol === 'a'
      ? `a: vertical scale unchanged${flip}`
      : `b: horizontal scale unchanged${flip}`;
  }
  if (symbol === 'a') {
    return absValue > 1 ? `a: vertical stretch${flip}` : `a: vertical compression${flip}`;
  }
  return absValue > 1 ? `b: horizontal compression${flip}` : `b: horizontal stretch${flip}`;
}

function englishMetadata(
  metadata: CurveMetadata,
  params: FunctionGraphTransformParams,
): CurveMetadata {
  const base = BASIS_OPTIONS.find((item) => item.id === params.basis)?.text || 'f(x)';
  const point = metadata.stats.find((stat) => stat.key === 'p')?.value ?? '';
  return {
    title: 'Function graph transformations',
    formula: metadata.formula,
    stats: [
      { key: 'base', label: 'Basis', value: base },
      { key: 'p', label: 'P', value: point },
      { key: 'a', label: 'a', value: englishScale('a', params.a) },
      { key: 'b', label: 'b', value: englishScale('b', params.b) },
    ],
  };
}

export default function FunctionGraphTransformCurveRoot({ controlsMountId, locale }: Props) {
  const module = functionGraphTransformModule;
  const en = locale === 'en';
  const [params, setParams] = useState<FunctionGraphTransformParams>(
    DEFAULT_FUNCTION_GRAPH_TRANSFORM_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<FunctionGraphTransformParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useFunctionGraphTransformP5({
    params,
    onParamsChange,
    locale,
  });

  const sliderValues = paramsForMetadata(params);
  const metadata = module.getMetadata(sliderValues, {
    revealPct: 100,
    smoothParams: sliderValues,
  });
  const shown = en ? englishMetadata(metadata, params) : metadata;
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
      <p className="curve-work-controls__formula">{en ? 'Basis f(x)' : '基底 f(x)'}</p>
      <div
        className="curve-work-mode-toggle"
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        {BASIS_OPTIONS.map((basis) => (
          <button
            key={basis.id}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.basis === basis.id}
            onClick={() => onParamsChange({ basis: basis.id as BasisKind })}
          >
            {basis.label}
          </button>
        ))}
      </div>

      <ParamControls
        module={controlsModule}
        values={sliderValues}
        onChange={(key, value) => {
          if (key === 'a' || key === 'b' || key === 'h' || key === 'k') {
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
              ? 'Advanced guide: on'
              : 'Advanced guide: off'
            : params.advanced
              ? '進階 guide：開'
              : '進階 guide：關'}
        </button>
      </div>

      <p className="curve-work-controls__formula">
        {en ? 'Drag P on the figure' : '也可在圖上拖動 P 控制點'}
      </p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Function graph transformations' : '函數圖形變換'}
      />
      {controls}
    </>
  );
}
