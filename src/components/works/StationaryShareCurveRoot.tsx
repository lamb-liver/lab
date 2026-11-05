import { useState } from 'react';
import { stationaryShareModule } from '../../curve/modules/stationary-share';
import {
  DEFAULT_SHARE_PARAMS,
  RATE_MAX,
  RATE_MIN,
  type ShareParams,
} from '../../curve/modules/stationary-share/geometry';
import type { CurveMetadata } from '../../curve/types';
import { useStationaryShareP5 } from '../curve/useStationaryShareP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  share: 'Share of A',
  flow: 'Flow',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Stationary share',
    formula: 'A = b/(a+b)',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function StationaryShareCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<ShareParams>({ ...DEFAULT_SHARE_PARAMS });
  const { canvasHostRef } = useStationaryShareP5({ params });
  const metadata = stationaryShareModule.getMetadata(params);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;
  const en = locale === 'en';

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Stationary share: two states trade, and the long-run share of each side is fixed'
            : '穩態份額：兩狀態以固定速率互換，長時間停在每一邊的比例跟著確定'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <div className="control-field">
          <label htmlFor="share-leave-a">
            <span>{en ? 'Leave A' : '離開 A'}</span>
            <span className="control-field__value">{params.a.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="share-leave-a"
              type="range"
              className="range"
              min={RATE_MIN}
              max={RATE_MAX}
              step={0.01}
              value={params.a}
              onInput={(event) => {
                const a = Number(event.currentTarget.value);
                setParams((current) => ({ ...current, a }));
              }}
            />
          </div>
        </div>
        <div className="control-field">
          <label htmlFor="share-leave-b">
            <span>{en ? 'Leave B' : '離開 B'}</span>
            <span className="control-field__value">{params.b.toFixed(2)}</span>
          </label>
          <div className="range-wrap">
            <input
              id="share-leave-b"
              type="range"
              className="range"
              min={RATE_MIN}
              max={RATE_MAX}
              step={0.01}
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
