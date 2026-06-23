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
} from '../../curve/modules/vector-field-patterns/geometry';
import ParamControls from '../curve/ParamControls';
import { useVectorFieldPatternsP5 } from '../curve/useVectorFieldPatternsP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const PATTERN_LABELS: Record<VectorFieldPattern, string> = {
  source: '源 source',
  sink: '匯 sink',
  vortex: '漩渦 vortex',
  saddle: '鞍點 saddle',
  uniform: '均勻流',
};

export default function VectorFieldPatternsCurveRoot({ controlsMountId }: Props) {
  const module = vectorFieldPatternsModule;
  const [params, setParams] = useState<VectorFieldPatternParams>(
    DEFAULT_VECTOR_FIELD_PATTERN_PARAMS,
  );
  const streamlines = useMemo(() => {
    if (!params.showStreamlines) return [];
    return buildStreamlines(getFieldConfig(params.pattern), params.density);
  }, [params.pattern, params.density, params.showStreamlines]);

  const { canvasHostRef } = useVectorFieldPatternsP5({ params, streamlines });

Params = vectorFieldPatternParamsForMetadata(params);
  const metadata = module.getMetadata(metadataParams);

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
            {PATTERN_LABELS[pattern]}
          </button>
        ))}
      </div>
      <ParamControls
        module={module}
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
          歸一化箭頭
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
          流線疊加
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="向量場的基本圖樣互動"
      />
      {controls}
    </>
  );
}
