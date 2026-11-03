import { useState } from 'react';
import { uniformSumDensityModule } from '../../curve/modules/uniform-sum-density';
import {
  DEFAULT_UNIFORM_SUM_PARAMS,
  LENGTH_MAX,
  LENGTH_MIN,
  type UniformSumParams,
} from '../../curve/modules/uniform-sum-density/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useUniformSumDensityP5 } from '../curve/useUniformSumDensityP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  peak: 'Peak height',
  flat: 'Flat width',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Density of the sum',
    formula: 'peak = 1/max(a, b)',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function UniformSumDensityCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<UniformSumParams>({ ...DEFAULT_UNIFORM_SUM_PARAMS });
  const { canvasHostRef } = useUniformSumDensityP5({ params });
  const metadata = uniformSumDensityModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;
  const en = locale === 'en';

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Density of the sum: two uniform lengths add into a flat-topped density'
            : '和的密度：兩段均勻長度相加後，密度中間是一段平頂'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="uniform-sum-a">
            <span>{en ? 'Length a' : '長度 a'}</span>
            <span className="control-field__value">{params.a.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="uniform-sum-a"
              type="range"
              className="range"
              min={LENGTH_MIN}
              max={LENGTH_MAX}
              step={0.05}
              value={params.a}
              onInput={(event) => {
                const a = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, a }));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="uniform-sum-b">
            <span>{en ? 'Length b' : '長度 b'}</span>
            <span className="control-field__value">{params.b.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="uniform-sum-b"
              type="range"
              className="range"
              min={LENGTH_MIN}
              max={LENGTH_MAX}
              step={0.05}
              value={params.b}
              onInput={(event) => {
                const b = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, b }));
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
