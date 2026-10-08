import { useCallback, useState } from 'react';
import { chladniFiguresModule } from '../../curve/modules/chladni-figures';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useChladniP5 } from '../curve/useChladniP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  modeM: 'Mode m',
  modeN: 'Mode n',
  vibrationSpeed: 'Vibration speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Chladni figures' };
}

export default function ChladniFiguresCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = chladniFiguresModule;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothM, setSmoothM] = useState(module.defaultParams.modeM);
  const [smoothN, setSmoothN] = useState(module.defaultParams.modeN);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothModesChange = useCallback((m: number, n: number) => {
    setSmoothM(m);
    setSmoothN(n);
  }, []);

  const { canvasHostRef } = useChladniP5({
    targetParams,
    onRevealPctChange,
    onSmoothModesChange,
    locale,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      modeM: smoothM,
      modeN: smoothN,
    },
  });
  const shown = en ? englishMetadata(metadata) : metadata;
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: EN_LABELS[def.key] ?? def.label,
        })),
      }
    : module;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
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
        aria-label={en ? 'Chladni figures' : '克拉尼圖形動畫'}
      />
      {controls}
    </>
  );
}
