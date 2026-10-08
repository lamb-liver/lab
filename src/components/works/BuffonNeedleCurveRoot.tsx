import { useState } from 'react';
import { buffonNeedleModule } from '../../curve/modules/buffon-needle';
import type { CurveMetadata, CurveModule } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBuffonNeedleP5 } from '../curve/useBuffonNeedleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = { controlsMountId: string; locale?: 'en' };

const EN_PARAM_LABELS: Record<string, string> = {
  l: 'Needle length ℓ',
  d: 'Line spacing d',
  speed: 'Throws per frame',
};

const EN_STATS: Record<string, string> = {
  l: 'Needle length ℓ',
  d: 'Line spacing d',
  speed: 'Throws/frame',
  theory: 'P(cross)',
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
    title: "Buffon's needle",
    formula: 'P(cross) = 2ℓ / (π d)',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function BuffonNeedleCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = en ? withParamLabels(buffonNeedleModule, EN_PARAM_LABELS) : buffonNeedleModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [resetNonce, setResetNonce] = useState(0);

  const { canvasHostRef } = useBuffonNeedleP5({
    targetParams,
    resetNonce,
    locale,
  });

  const metadata = module.getMetadata(targetParams);
  const shown = en ? englishMetadata(metadata) : metadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams((prev) => ({ ...prev, [key]: value }));
          setResetNonce((prev) => prev + 1);
        }}
      />

      <div className="curve-work-mode-toggle" aria-label={en ? 'Experiment' : '實驗控制'}>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setResetNonce((prev) => prev + 1)}>
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
        aria-label={en ? "Buffon's needle" : '蒲豐投針互動視覺化'}
      />
      {controls}
    </>
  );
}
