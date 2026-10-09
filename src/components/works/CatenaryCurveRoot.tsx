import { useCallback, useState } from 'react';
import { catenaryModule } from '../../curve/modules/catenary';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useCatenaryP5 } from '../curve/useCatenaryP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  ropeLength: 'Fixed rope length L',
  maxT: 'History range t',
  timeSpeed: 'Time speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Tractrix' };
}

export default function CatenaryCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = catenaryModule;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [pullPct, setPullPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);

  const onPullPctChange = useCallback((pct: number) => setPullPct(pct), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useCatenaryP5({
    targetParams,
    onPullPctChange,
    onSmoothParamsChange,
    locale,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct: pullPct,
    smoothParams,
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
        aria-label={en ? 'Tractrix' : '曳物線動畫'}
      />
      {controls}
    </>
  );
}
