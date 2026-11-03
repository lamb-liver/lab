import { useState } from 'react';
import { stereographicProjectionModule } from '../../curve/modules/stereographic-projection';
import {
  AZIM_MAX,
  AZIM_MIN,
  COLAT_MAX,
  COLAT_MIN,
  DEFAULT_STEREO_PARAMS,
  type StereoParams,
} from '../../curve/modules/stereographic-projection/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useStereographicProjectionP5 } from '../curve/useStereographicProjectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  radius: 'Distance',
  height: 'Height',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Stereographic projection',
    formula: 'r = 1/tan(t/2)',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function StereographicProjectionCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<StereoParams>({ ...DEFAULT_STEREO_PARAMS });
  const { canvasHostRef } = useStereographicProjectionP5({ params });
  const metadata = stereographicProjectionModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;
  const en = locale === 'en';

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Stereographic projection: a point on the sphere projects from the north pole onto the equatorial plane'
            : '球極投影：球面上的點從北極沿直線投到赤道平面'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="stereo-colat">
            <span>{en ? 'Angle from the pole θ' : '離北極 θ'}</span>
            <span className="control-field__value">{params.colat.toFixed(0)}°</span>
          </label>
          <div className="range-wrap">
            <input
              id="stereo-colat"
              type="range"
              className="range"
              min={COLAT_MIN}
              max={COLAT_MAX}
              step={1}
              value={params.colat}
              onInput={(event) => {
                const colat = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, colat }));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="stereo-azim">
            <span>{en ? 'Azimuth φ' : '經角 φ'}</span>
            <span className="control-field__value">{params.azim.toFixed(0)}°</span>
          </label>
          <div className="range-wrap">
            <input
              id="stereo-azim"
              type="range"
              className="range"
              min={AZIM_MIN}
              max={AZIM_MAX}
              step={1}
              value={params.azim}
              onInput={(event) => {
                const azim = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, azim }));
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
