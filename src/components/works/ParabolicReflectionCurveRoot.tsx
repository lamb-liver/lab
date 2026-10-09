import { useCallback, useState } from 'react';
import { parabolicReflectionModule } from '../../curve/modules/parabolic-reflection';
import ParamControls from '../curve/ParamControls';
import { useParabolicReflectionP5 } from '../curve/useParabolicReflectionP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  focalLength: 'Focal length p',
  rayCount: 'Ray count',
  scanSpeed: 'Scan speed ω',
};

export default function ParabolicReflectionCurveRoot({ controlsMountId, locale }: Props) {
  const module = parabolicReflectionModule;
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
  const [smoothFocalLength, setSmoothFocalLength] = useState(
    module.defaultParams.focalLength,
  );

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothFocalLengthChange = useCallback(
    (focalLength: number) => setSmoothFocalLength(focalLength),
    [],
  );

  const { canvasHostRef } = useParabolicReflectionP5({
    targetParams,
    onRevealPctChange,
    onSmoothFocalLengthChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      focalLength: smoothFocalLength,
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
            ? 'Parabolic reflection: rays from the focus leave parallel to the axis'
            : '拋物線反射動畫'
        }
      />
      {controls}
    </>
  );
}
