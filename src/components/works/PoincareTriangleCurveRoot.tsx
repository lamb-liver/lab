import { useState } from 'react';
import { poincareTriangleModule } from '../../curve/modules/poincare-triangle';
import {
  DEFAULT_DISK_TRIANGLE_PARAMS,
  R_MAX,
  R_MIN,
  type DiskTriangleParams,
} from '../../curve/modules/poincare-triangle/geometry';
import type { CurveMetadata } from '../../curve/types';
import { usePoincareTriangleP5 } from '../curve/usePoincareTriangleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  angle: 'Interior angle',
  sum: 'Angle sum',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'A triangle on the disk',
    formula: 'Angle sum < 180°',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function PoincareTriangleCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<DiskTriangleParams>({ ...DEFAULT_DISK_TRIANGLE_PARAMS });
  const { canvasHostRef } = usePoincareTriangleP5({ params });
  const metadata = poincareTriangleModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en'
            ? 'A triangle on the disk: the sides are arcs orthogonal to the outer circle'
            : '圓盤上的三角形：三邊是跟外圓垂直的圓弧'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="poincare-triangle-r">
            <span>{locale === 'en' ? 'Distance from center' : '離圓心'}</span>
            <span className="control-field__value">{params.r.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="poincare-triangle-r"
              type="range"
              className="range"
              min={R_MIN}
              max={R_MAX}
              step={0.01}
              value={params.r}
              onInput={(event) => {
                const r = Number(event.currentTarget.value);
                setParams({ r });
              }}
            />
          </div>
        </div>
      </WorkControlsPortal>
    </>
  );
}
