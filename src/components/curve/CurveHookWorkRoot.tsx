import { useCallback, useState, type RefObject } from 'react';
import type { CurveMetadata, CurveModule, ParamValues } from '../../curve/types';
import ParamControls from './ParamControls';
import { useQuerySyncedParams } from './useQuerySyncedParams';
import WorkControlsPortal from './WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type CommonHook = (options: {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
  locale?: 'en';
}) => {
  canvasHostRef: RefObject<HTMLDivElement | null>;
};

type Props = {
  module: CurveModule;
  useCanvas: CommonHook;
  controlsMountId: string;
  canvasAriaLabel: string;
  locale?: 'en';
  presentMetadata?: (metadata: CurveMetadata) => CurveMetadata;
  paramLabels?: Record<string, string>;
};

export default function CurveHookWorkRoot({
  module,
  useCanvas,
  controlsMountId,
  canvasAriaLabel,
  locale,
  presentMetadata,
  paramLabels,
}: Props) {
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(targetParams);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useCanvas({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealPctChange,
    onSmoothParamsChange,
    locale,
  });

  const metadata = module.getMetadata(targetParams, { revealPct, smoothParams });
  const shown = presentMetadata ? presentMetadata(metadata) : metadata;
  const controlsModule = paramLabels
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: paramLabels[def.key] ?? def.label,
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
        aria-label={canvasAriaLabel}
      />
      {controls}
    </>
  );
}
