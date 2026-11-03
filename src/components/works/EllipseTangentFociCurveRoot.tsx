import { useState } from 'react';
import { ellipseTangentFociModule } from '../../curve/modules/ellipse-tangent-foci';
import {
  DEFAULT_ELLIPSE_TANGENT_PARAMS,
  E_MAX,
  E_MIN,
  T_MAX,
  T_MIN,
  type EllipseTangentParams,
} from '../../curve/modules/ellipse-tangent-foci/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useEllipseTangentFociP5 } from '../curve/useEllipseTangentFociP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  sum: 'Distance sum',
  angle1: 'F₁ angle',
  angle2: 'F₂ angle',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Tangent and two foci',
    formula: 'θ₁ = θ₂',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function EllipseTangentFociCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<EllipseTangentParams>({ ...DEFAULT_ELLIPSE_TANGENT_PARAMS });
  const { canvasHostRef } = useEllipseTangentFociP5({ params });
  const metadata = ellipseTangentFociModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;
  const en = locale === 'en';

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Tangent and two foci: the tangent makes equal angles with the two focal radii'
            : '兩焦點切線：切線與兩條焦半徑的夾角相等'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="ellipse-tangent-foci-t">
            <span>{en ? 'Position t' : '位置 t'}</span>
            <span className="control-field__value">{params.tDeg.toFixed(0)}°</span>
          </label>
          <div className="range-wrap">
            <input
              id="ellipse-tangent-foci-t"
              type="range"
              className="range"
              min={T_MIN}
              max={T_MAX}
              step={1}
              value={params.tDeg}
              onInput={(event) => {
                const tDeg = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, tDeg }));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="ellipse-tangent-foci-e">
            <span>{en ? 'Eccentricity e' : '離心率 e'}</span>
            <span className="control-field__value">{params.e.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="ellipse-tangent-foci-e"
              type="range"
              className="range"
              min={E_MIN}
              max={E_MAX}
              step={0.01}
              value={params.e}
              onInput={(event) => {
                const e = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, e }));
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
