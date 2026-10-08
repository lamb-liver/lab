import { useMemo, useState } from 'react';
import {
  DEFAULT_VECTOR_FIELD_PATTERN_PARAMS,
  PATTERN_ORDER,
  vectorFieldPatternParamsForMetadata,
  vectorFieldPatternsModule,
  type VectorFieldPattern,
  type VectorFieldPatternParams,
} from '../../curve/modules/vector-field-patterns';
import {
  buildStreamlines,
  getFieldConfig,
  getSeedCount,
} from '../../curve/modules/vector-field-patterns/geometry';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useVectorFieldPatternsP5 } from '../curve/useVectorFieldPatternsP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const PATTERN_LABELS: Record<VectorFieldPattern, string> = {
  source: '源 source',
  sink: '匯 sink',
  vortex: '漩渦 vortex',
  saddle: '鞍點 saddle',
  uniform: '均勻流',
};

const EN_PATTERN_LABELS: Record<VectorFieldPattern, string> = {
  source: 'Source',
  sink: 'Sink',
  vortex: 'Vortex',
  saddle: 'Saddle',
  uniform: 'Uniform flow',
};

function englishMetadata(metadata: CurveMetadata, params: VectorFieldPatternParams): CurveMetadata {
  const seeds = getSeedCount(getFieldConfig(params.pattern), Math.round(params.density));
  return {
    ...metadata,
    title: 'Basic patterns of a vector field',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'pattern') {
        return { ...stat, label: 'Pattern', value: EN_PATTERN_LABELS[params.pattern] };
      }
      if (stat.key === 'eigen') return { ...stat, label: 'Eigenvalues' };
      if (stat.key === 'arrows') {
        const density = Math.round(params.density);
        return {
          ...stat,
          label: 'Arrows',
          value: `${density} × ${density}, ${params.normalized ? 'normalized' : 'scaled by |F|'}`,
        };
      }
      if (stat.key === 'streamlines') {
        return {
          ...stat,
          label: 'Streamlines',
          value: `${params.showStreamlines ? 'shown' : 'hidden'}, ${seeds} lines`,
        };
      }
      return stat;
    }),
  };
}

export default function VectorFieldPatternsCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = vectorFieldPatternsModule;
  const [params, setParams] = useState<VectorFieldPatternParams>(
    DEFAULT_VECTOR_FIELD_PATTERN_PARAMS,
  );
  const streamlines = useMemo(() => {
    if (!params.showStreamlines) return [];
    return buildStreamlines(getFieldConfig(params.pattern), params.density);
  }, [params.pattern, params.density, params.showStreamlines]);

  const { canvasHostRef } = useVectorFieldPatternsP5({ params, streamlines, locale });

  const metadataParams = vectorFieldPatternParamsForMetadata(params);
  const rawMetadata = module.getMetadata(metadataParams);
  const metadata = en ? englishMetadata(rawMetadata, params) : rawMetadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {PATTERN_ORDER.map((pattern) => (
          <button
            key={pattern}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.pattern === pattern}
            onClick={() => setParams((prev) => ({ ...prev, pattern }))}
          >
            {en ? EN_PATTERN_LABELS[pattern] : PATTERN_LABELS[pattern]}
          </button>
        ))}
      </div>
      <ParamControls
        module={
          en
            ? {
                ...module,
                paramSchema: module.paramSchema.map((def) =>
                  def.key === 'density' ? { ...def, label: 'Density n' } : def,
                ),
              }
            : module
        }
        values={metadataParams}
        onChange={(key, value) => {
          if (key !== 'density') return;
          setParams((prev) => ({ ...prev, density: value }));
        }}
      />
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.normalized}
          onClick={() =>
            setParams((prev) => ({ ...prev, normalized: !prev.normalized }))
          }
        >
          {en ? 'Normalize arrows' : '歸一化箭頭'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showStreamlines}
          onClick={() =>
            setParams((prev) => ({
              ...prev,
              showStreamlines: !prev.showStreamlines,
            }))
          }
        >
          {en ? 'Overlay streamlines' : '流線疊加'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Basic patterns of a vector field' : '向量場的基本圖樣互動'}
      />
      {controls}
    </>
  );
}
