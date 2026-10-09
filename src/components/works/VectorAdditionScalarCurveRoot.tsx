import { useCallback, useState } from 'react';
import {
  DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS,
  vectorAdditionScalarModule,
  type VectorAdditionScalarParams,
} from '../../curve/modules/vector-addition-scalar';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useVectorAdditionScalarP5 } from '../curve/useVectorAdditionScalarP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STAT: Record<string, string> = {
  u: 'Vector u',
  v: 'Vector v',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Vector addition and scalar multiplication',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STAT[stat.key] ?? stat.label,
    })),
  };
}

export default function VectorAdditionScalarCurveRoot({ controlsMountId, locale }: Props) {
  const module = vectorAdditionScalarModule;
  const [params, setParams] = useState<VectorAdditionScalarParams>(
    DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS,
  );
  const [showComponents, setShowComponents] = useState(true);

  const onParamsChange = useCallback((patch: Partial<VectorAdditionScalarParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useVectorAdditionScalarP5({
    params,
    showComponents,
    onParamsChange,
  });

  const metadata = module.getMetadata(params as ParamValues);
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;
  const controlsModule =
    locale === 'en'
      ? {
          ...module,
          paramSchema: module.paramSchema.map((def) =>
            def.key === 'scalar' ? { ...def, label: 'Scalar c' } : def,
          ),
        }
      : module;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <ParamControls
        module={controlsModule}
        values={params}
        onChange={(key, value) => {
          setParams((prev) => ({ ...prev, [key]: value }));
        }}
      />
      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showComponents}
          onClick={() => setShowComponents((prev) => !prev)}
        >
          {locale === 'en' ? 'Component lines' : '分量線'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => {
            setParams(DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS);
            setShowComponents(true);
          }}
        >
          {locale === 'en' ? 'Reset' : '重設'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          locale === 'en'
            ? 'Vector addition and scalar multiplication'
            : '向量的加法與純量乘法互動'
        }
      />
      {controls}
    </>
  );
}
