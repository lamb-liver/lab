import {
  MODE_CHAOS,
  MODE_COMPARE,
  MODE_RECURSIVE,
  sierpinskiTriangleModule,
} from '../../curve/modules/sierpinski-triangle';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import { useSierpinskiTriangleP5 } from '../curve/useSierpinskiTriangleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_MODE: Record<string, string> = {
  遞迴: 'Recursive',
  混沌遊戲: 'Chaos game',
  比較: 'Compare',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Sierpinski triangle',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'mode') return { ...stat, value: EN_MODE[String(stat.value)] ?? stat.value };
      if (stat.key === 'area') return { ...stat, label: 'Remaining area' };
      return stat;
    }),
  };
}

export default function SierpinskiTriangleCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = sierpinskiTriangleModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);

  const { canvasHostRef } = useSierpinskiTriangleP5({
    targetParams,
  });

  const rawMetadata = module.getMetadata(targetParams);
  const metadata = en ? englishMetadata(rawMetadata) : rawMetadata;

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const mode = Math.round(targetParams.mode ?? MODE_COMPARE);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle" aria-label={en ? 'Generation mode' : '生成模式'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={mode === MODE_RECURSIVE}
          onClick={() => patchParams({ mode: MODE_RECURSIVE })}
        >
          {en ? 'Recursive' : '遞迴'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={mode === MODE_CHAOS}
          onClick={() => patchParams({ mode: MODE_CHAOS })}
        >
          {en ? 'Chaos' : '混沌'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={mode === MODE_COMPARE}
          onClick={() => patchParams({ mode: MODE_COMPARE })}
        >
          {en ? 'Compare' : '對照'}
        </button>
      </div>

      <div className="control-field">
        <label htmlFor="sierpinski-depth">
          <span>{en ? 'Recursion depth n' : '遞迴深度 n'}</span>
          <span className="control-field__value">{Math.round(targetParams.depth ?? 6)}</span>
        </label>
        <div className="range-wrap">
          <input
            id="sierpinski-depth"
            type="range"
            className="range"
            min={1}
            max={8}
            step={1}
            value={targetParams.depth ?? 6}
            onInput={(event) => patchParams({ depth: Number(event.currentTarget.value) })}
          />
        </div>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Sierpinski triangle' : '謝爾賓斯基三角形'}
      />
      {controls}
    </>
  );
}
