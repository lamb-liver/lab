import { PASCAL_PRIMES, pascalsTriangleModule } from '../../curve/modules/pascals-triangle';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { usePascalsTriangleP5 } from '../curve/usePascalsTriangleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  rows: 'Rows n',
  prime: 'Modulus p',
  active: 'Nonzero',
  primes: 'Primes',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: "Pascal's triangle",
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function PascalsTriangleCurveRoot({ controlsMountId, locale }: Props) {
  const module = pascalsTriangleModule;
  const en = locale === 'en';
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: def.key === 'rows' ? 'Rows n' : def.label,
        })),
      }
    : module;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);

  const { canvasHostRef } = usePascalsTriangleP5({
    targetParams,
    locale,
  });

  const metadata = module.getMetadata(targetParams);
  const shown = en ? englishMetadata(metadata) : metadata;
  const prime = Math.round(targetParams.prime ?? 2);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle" aria-label={en ? 'Modulus' : '模運算素數'}>
        {PASCAL_PRIMES.map((p) => (
          <button
            key={p}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={prime === p}
            onClick={() => setTargetParams((prev) => ({ ...prev, prime: p }))}
          >
            {en ? `Mod ${p}` : `模 ${p}`}
          </button>
        ))}
      </div>

      <ParamControls
        module={controlsModule}
        values={targetParams}
        onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? "Pascal's triangle" : '帕斯卡三角形互動視覺化'}
      />
      {controls}
    </>
  );
}
