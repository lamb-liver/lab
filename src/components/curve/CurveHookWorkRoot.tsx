import { useCallback, useState, type RefObject } from 'react';
import type { CurveModule, ParamValues } from '../../curve/types';
import ParamControls from './ParamControls';
import WorkControlsPortal from './WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type CommonHook = (options: {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
  onSmoothParamsChange: (params: ParamValues) => void;
}) => {
  canvasHostRef: RefObject<HTMLDivElement | null>;
};

type Props = {
  module: CurveModule;
  useCanvas: CommonHook;
  controlsMountId: string;
  canvasAriaLabel: string;
};

export default function CurveHookWorkRoot({
  module,
  useCanvas,
  controlsMountId,
  canvasAriaLabel,
}: Props) {
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);

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
  });

  const metadata = module.getMetadata(targetParams, { revealPct, smoothParams });

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <ParamControls
        module={module}
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
