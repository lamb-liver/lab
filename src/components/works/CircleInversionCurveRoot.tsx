import { useCallback, useState } from 'react';
import { circleInversionModule } from '../../curve/modules/circle-inversion';
import {
  DEFAULT_CIRCLE_INVERSION,
  type CircleInversionParams,
} from '../../curve/modules/circle-inversion/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useCircleInversionP5 } from '../curve/useCircleInversionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_IMAGE: Record<string, string> = {
  圓: 'Circle',
  直線: 'Line',
  未定義: 'Undefined',
};

const EN_STAT: Record<string, string> = {
  line: 'Line image',
  circle: 'Circle image',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Circle inversion',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STAT[stat.key] ?? stat.label,
      value:
        stat.key === 'line' || stat.key === 'circle'
          ? (EN_IMAGE[String(stat.value)] ?? stat.value)
          : stat.value,
    })),
  };
}

export default function CircleInversionCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<CircleInversionParams>({ ...DEFAULT_CIRCLE_INVERSION });
  const radiusDef = circleInversionModule.paramSchema[0];
  const places = Math.min((String(radiusDef.step).split('.')[1] ?? '').length, 3);

  const onChange = useCallback((next: CircleInversionParams) => {
    setParams(next);
  }, []);

  const { canvasHostRef } = useCircleInversionP5({ params, onChange });
  const metadata = circleInversionModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en' ? 'Circle inversion: images of a line and a circle' : '圓反演：直線與圓的像'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor={`${circleInversionModule.id}-${radiusDef.key}`}>
            {locale === 'en' ? 'Inversion radius R' : radiusDef.label}
            <span className="control-field__value">{params.radius.toFixed(places)}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`${circleInversionModule.id}-${radiusDef.key}`}
              type="range"
              className="range"
              min={radiusDef.min}
              max={radiusDef.max}
              step={radiusDef.step}
              value={params.radius}
              onInput={(event) => {
                // 先取值：updater 晚於事件執行，那時 currentTarget 已是 null
                const radius = Number(event.currentTarget.value);
                setParams((prev) => ({ ...prev, radius }));
              }}
            />
          </div>
        </div>
        <div className="curve-work-mode-toggle">
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => setParams({ ...DEFAULT_CIRCLE_INVERSION })}
          >
            {locale === 'en' ? 'Reset' : '還原'}
          </button>
        </div>
      </WorkControlsPortal>
    </>
  );
}
