import { useCallback, useState } from 'react';
import { conicEnvelopeModule } from '../../curve/modules/conic-envelope';
import ParamControls from '../curve/ParamControls';
import { useConicEnvelopeP5 } from '../curve/useConicEnvelopeP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  lineDensity: 'Line density',
  deformationRatio: 'Deformation ratio',
  timeSpeed: 'Time speed ω',
};

export default function ConicEnvelopeCurveRoot({ controlsMountId, locale }: Props) {
  const module = conicEnvelopeModule;
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
  const [revealPct, setRevealPct] = useState(0);
  const [smoothRatio, setSmoothRatio] = useState(module.defaultParams.deformationRatio);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothRatioChange = useCallback((ratio: number) => setSmoothRatio(ratio), []);

  const { canvasHostRef } = useConicEnvelopeP5({
    targetParams,
    onRevealPctChange,
    onSmoothRatioChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      deformationRatio: smoothRatio,
    },
  });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <ParamControls
        module={controlsModule}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Conic envelope: lines on the axes weave a parabolic outline in four quadrants'
            : '二次曲線包絡線動畫'
        }
      />
      {controls}
    </>
  );
}
