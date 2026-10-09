import { useCallback, useState } from 'react';
import { FUNCTIONS } from '../../curve/modules/inverse-function-reflection/constants';
import {
  clampInputForMode,
  DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
  inputRangeForMode,
  inverseFunctionReflectionModule,
  paramsForMetadata,
  paramsForModeSwitch,
  type InverseFunctionMode,
  type InverseFunctionReflectionParams,
} from '../../curve/modules/inverse-function-reflection';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useInverseFunctionReflectionP5 } from '../curve/useInverseFunctionReflectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_TITLES: Record<InverseFunctionMode, string> = {
  linear: 'Linear',
  quadraticRestricted: 'Restricted quadratic',
  quadraticFull: 'Unrestricted quadratic',
  exponential: 'Exponential and logarithm',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Inverse function by reflection',
    formula: metadata.formula.replaceAll('，', ', '),
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'inverse') {
        const value = String(stat.value);
        return {
          ...stat,
          value: value === '未限制：無反函數' ? 'Unrestricted: no inverse' : value,
        };
      }
      if (stat.key === 'hlt') {
        return {
          ...stat,
          label: 'Horizontal line test',
          value: stat.value === '通過' ? 'Passes' : 'Fails',
        };
      }
      return stat;
    }),
  };
}

export default function InverseFunctionReflectionCurveRoot({ controlsMountId, locale }: Props) {
  const module = inverseFunctionReflectionModule;
  const en = locale === 'en';
  const [params, setParams] = useState<InverseFunctionReflectionParams>(
    DEFAULT_INVERSE_FUNCTION_REFLECTION_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<InverseFunctionReflectionParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useInverseFunctionReflectionP5({
    params,
    onParamsChange,
    locale,
  });

  const metadataParams = paramsForMetadata(params);
  const metadata = module.getMetadata(metadataParams, {
    revealPct: 100,
    smoothParams: metadataParams,
  });
  const shown = en ? englishMetadata(metadata) : metadata;
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: def.key === 'base' ? 'Base q' : def.label,
        })),
      }
    : module;

  const inputRange = inputRangeForMode(params.mode);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <p className="curve-work-controls__formula">{en ? 'Function f(x)' : '函數 f(x)'}</p>
      <div
        className="curve-work-mode-toggle"
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        {FUNCTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="curve-work-mode-button"
            title={en ? EN_TITLES[item.id] : item.label}
            aria-pressed={params.mode === item.id}
            onClick={() => onParamsChange(paramsForModeSwitch(item.id as InverseFunctionMode))}
          >
            {item.short}
          </button>
        ))}
      </div>

      <div className="control-field">
        <label htmlFor={`${module.id}-input`}>{en ? 'Input x' : '輸入 x'}</label>
        <div className="range-wrap">
          <input
            id={`${module.id}-input`}
            type="range"
            className="range"
            min={inputRange.min}
            max={inputRange.max}
            step={0.05}
            value={params.input}
            onInput={(e) =>
              onParamsChange({
                input: clampInputForMode(params.mode, Number(e.currentTarget.value)),
              })
            }
          />
        </div>
      </div>

      {params.mode === 'exponential' ? (
        <ParamControls
          module={controlsModule}
          values={{ base: params.base }}
          onChange={(_key, value) => onParamsChange({ base: value })}
        />
      ) : null}

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.advanced}
          onClick={() => onParamsChange({ advanced: !params.advanced })}
        >
          {en
            ? params.advanced
              ? 'guide: on'
              : 'guide: off'
            : params.advanced
              ? 'guide：開'
              : 'guide：關'}
        </button>
      </div>

      <p className="curve-work-controls__formula">
        {en ? 'Drag the point P on the figure' : '也可在圖上拖動點 P'}
      </p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Inverse function by reflection' : '反函數鏡射'}
      />
      {controls}
    </>
  );
}
