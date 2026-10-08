import {
  MODE_BINOMIAL,
  MODE_GEOMETRIC,
  binomialGeometricDistributionModule,
} from '../../curve/modules/binomial-geometric-distribution';
import type { CurveMetadata, CurveModule } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBinomialGeometricDistributionP5 } from '../curve/useBinomialGeometricDistributionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  n: 'Trials n',
  p: 'Success probability p',
};

const EN_DIST: Record<string, string> = {
  二項: 'Binomial',
  幾何: 'Geometric',
};

function withParamLabels(module: CurveModule, labels: Record<string, string>): CurveModule {
  return {
    ...module,
    paramSchema: module.paramSchema.map((def) => ({
      ...def,
      label: labels[def.key] ?? def.label,
    })),
  };
}

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Binomial and geometric distributions',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'mode') {
        return { ...stat, label: 'Distribution', value: EN_DIST[String(stat.value)] ?? stat.value };
      }
      if (stat.key === 'support') return { ...stat, label: 'Support' };
      return stat;
    }),
  };
}

export default function BinomialGeometricDistributionCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = en
    ? withParamLabels(binomialGeometricDistributionModule, EN_PARAM_LABELS)
    : binomialGeometricDistributionModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const { canvasHostRef } = useBinomialGeometricDistributionP5({ targetParams, locale });
  const mode = Math.round(targetParams.mode ?? MODE_BINOMIAL);
  const metadata = module.getMetadata(targetParams);
  const shown = en ? englishMetadata(metadata) : metadata;
  const controlsModule =
    mode === MODE_GEOMETRIC
      ? ({ ...module, paramSchema: module.paramSchema.filter((def) => def.key === 'p') } as CurveModule)
      : module;
  const modeOptions = [
    { value: MODE_BINOMIAL, label: en ? 'Binomial' : '二項' },
    { value: MODE_GEOMETRIC, label: en ? 'Geometric' : '幾何' },
  ];

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle" aria-label={en ? 'Distribution' : '分佈'}>
        {modeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === option.value}
            onClick={() => setTargetParams((prev) => ({ ...prev, mode: option.value }))}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ParamControls
        module={controlsModule}
        values={targetParams}
        onChange={(key, value) =>
          setTargetParams((prev) => ({
            ...prev,
            [key]: key === 'n' ? Math.round(value) : value,
          }))
        }
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Binomial and geometric distributions' : '二項分佈與幾何分佈互動視覺化'}
      />
      {controls}
    </>
  );
}
