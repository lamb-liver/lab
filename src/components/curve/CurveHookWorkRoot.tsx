import { useCallback, useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { CurveModule, ParamValues } from '../../curve/types';
import ParamControls from './ParamControls';
import StatsPanel from './StatsPanel';
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
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

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

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, { revealPct, smoothParams });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>
          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => {
              setTargetParams((prev) => ({ ...prev, [key]: value }));
            }}
          />
          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

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
