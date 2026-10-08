import { useCallback, useState } from 'react';
import {
  DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS,
  SURFACE_KINDS,
  gradientLevelCurvesModule,
  gradientLevelCurvesParamsForMetadata,
  type GradientLevelCurvesParams,
  type SurfaceKind,
} from '../../curve/modules/gradient-level-curves';
import type { CurveMetadata } from '../../curve/types';
import { useGradientLevelCurvesP5 } from '../curve/useGradientLevelCurvesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const KIND_LABELS: Record<'zh' | 'en', Record<SurfaceKind, string>> = {
  zh: {
    paraboloid: '圓 x²+y²',
    saddle: '鞍 x²−y²',
    product: '雙曲 xy',
  },
  en: {
    paraboloid: 'Circle x²+y²',
    saddle: 'Saddle x²−y²',
    product: 'Hyperbola xy',
  },
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Gradient and level curves',
    formula: metadata.formula.replaceAll('，', ', '),
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: stat.key === 'point' ? 'Test point P' : stat.label,
      value: stat.value === '0（臨界點）' ? '0 (critical point)' : stat.value,
    })),
  };
}

export default function GradientLevelCurvesCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<GradientLevelCurvesParams>(
    DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS,
  );
  const en = locale === 'en';
  const kindLabels = en ? KIND_LABELS.en : KIND_LABELS.zh;

  const onParamsChange = useCallback((patch: Partial<GradientLevelCurvesParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useGradientLevelCurvesP5({ params, onParamsChange, locale });

  const metadata = gradientLevelCurvesModule.getMetadata(
    gradientLevelCurvesParamsForMetadata(params),
  );
  const shown = en ? englishMetadata(metadata) : metadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {SURFACE_KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.kind === kind}
            onClick={() => onParamsChange({ kind })}
          >
            {kindLabels[kind]}
          </button>
        ))}
      </div>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showFamily}
          onClick={() => onParamsChange({ showFamily: !params.showFamily })}
        >
          {en ? 'Level curve family' : '等位線族'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS)}
        >
          {en ? 'Reset' : '重設'}
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
          en ? 'Gradient and level curves: drag the test point' : '梯度與等位線互動：可拖動測試點'
        }
      />
      {controls}
    </>
  );
}
