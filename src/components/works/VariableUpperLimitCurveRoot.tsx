import { useState } from 'react';
import { variableUpperLimitModule } from '../../curve/modules/variable-upper-limit';
import {
  DEFAULT_UPPER_LIMIT_PARAMS,
  H_MAX,
  H_MIN,
  X_MAX,
  X_MIN,
  type UpperLimitParams,
} from '../../curve/modules/variable-upper-limit/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useVariableUpperLimitP5 } from '../curve/useVariableUpperLimitP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  area: 'Area A',
  height: 'Height f(x)',
  ratio: 'ΔA/h',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Area and right-endpoint height',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function VariableUpperLimitCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<UpperLimitParams>({ ...DEFAULT_UPPER_LIMIT_PARAMS });
  const { canvasHostRef } = useVariableUpperLimitP5({ params });
  const metadata = variableUpperLimitModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en'
            ? 'Area and right-endpoint height: strip height over width'
            : '面積與右端高度：細條的高度比上寬度'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="variable-upper-limit-x">
            <span>{locale === 'en' ? 'Right endpoint x' : '右端 x'}</span>
            <span className="control-field__value">{params.x.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="variable-upper-limit-x"
              type="range"
              className="range"
              min={X_MIN}
              max={X_MAX}
              step={0.05}
              value={params.x}
              onInput={(event) => {
                const x = Number(event.currentTarget.value);
                setParams((prev) => ({ ...prev, x }));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="variable-upper-limit-h">
            <span>{locale === 'en' ? 'Strip width h' : '細條寬度 h'}</span>
            <span className="control-field__value">{params.h.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="variable-upper-limit-h"
              type="range"
              className="range"
              min={H_MIN}
              max={H_MAX}
              step={0.01}
              value={params.h}
              onInput={(event) => {
                const h = Number(event.currentTarget.value);
                setParams((prev) => ({ ...prev, h }));
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
