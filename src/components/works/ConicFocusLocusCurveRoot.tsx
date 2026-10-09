import { useCallback, useState } from 'react';
import { conicFocusLocusModule } from '../../curve/modules/conic-focus-locus';
import ParamControls from '../curve/ParamControls';
import { useConicFocusLocusP5 } from '../curve/useConicFocusLocusP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  semiMajorAxis: 'Semi-major axis a',
  eccentricity: 'Eccentricity e',
  orbitSpeed: 'Orbit speed ω',
};

export default function ConicFocusLocusCurveRoot({ controlsMountId, locale }: Props) {
  const module = conicFocusLocusModule;
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
  const [smoothA, setSmoothA] = useState(module.defaultParams.semiMajorAxis);
  const [smoothE, setSmoothE] = useState(module.defaultParams.eccentricity);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothParamsChange = useCallback((a: number, e: number) => {
    setSmoothA(a);
    setSmoothE(e);
  }, []);

  const { canvasHostRef } = useConicFocusLocusP5({
    targetParams,
    onRevealPctChange,
    onSmoothParamsChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      semiMajorAxis: smoothA,
      eccentricity: smoothE,
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
            ? 'Focus locus: a point on an ellipse joined to each focus'
            : '焦點軌跡動畫'
        }
      />
      {controls}
    </>
  );
}
