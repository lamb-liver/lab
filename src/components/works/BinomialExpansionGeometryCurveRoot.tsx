import {
  MODE_CUBE,
  MODE_SQUARE,
  binomialExpansionGeometryModule,
} from '../../curve/modules/binomial-expansion-geometry';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBinomialExpansionGeometryP5 } from '../curve/useBinomialExpansionGeometryP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const modeOptions = [
  { value: MODE_SQUARE, zh: 'n = 2 平方', en: 'n = 2 square' },
  { value: MODE_CUBE, zh: 'n = 3 立方', en: 'n = 3 cube' },
];

const EN_PARAM_LABELS: Record<string, string> = {
  a: 'Side a',
  b: 'Side b',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Geometry of the binomial expansion',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: stat.key === 'mode' ? 'Mode' : stat.label,
      value:
        stat.key === 'mode' ? (stat.value === '平方' ? 'square' : 'cube') : stat.value,
    })),
  };
}

export default function BinomialExpansionGeometryCurveRoot({ controlsMountId, locale }: Props) {
  const module = binomialExpansionGeometryModule;
  const en = locale === 'en';
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: EN_PARAM_LABELS[def.key] ?? def.label,
        })),
      }
    : module;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const { canvasHostRef } = useBinomialExpansionGeometryP5({
    targetParams,
    locale,
  });

  const metadata = module.getMetadata(targetParams);
  const shown = en ? englishMetadata(metadata) : metadata;
  const mode = Math.round(targetParams.mode ?? MODE_SQUARE);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle" aria-label={en ? 'Dimension' : '維度模式'}>
        {modeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === option.value}
            onClick={() => setTargetParams((prev) => ({ ...prev, mode: option.value }))}
          >
            {en ? option.en : option.zh}
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
        aria-label={en ? 'Geometry of the binomial expansion' : '二項式展開幾何互動視覺化'}
      />
      {controls}
    </>
  );
}
