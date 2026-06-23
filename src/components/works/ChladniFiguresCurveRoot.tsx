import { useCallback, useState } from 'react';
import { chladniFiguresModule } from '../../curve/modules/chladni-figures';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useChladniP5 } from '../curve/useChladniP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

export default function ChladniFiguresCurveRoot({ controlsMountId }: Props) {
  const module = chladniFiguresModule;

  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
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
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      modeM: smoothM,
      modeN: smoothN,
    },
  });

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
        aria-label="克拉尼圖形動畫"
      />
      {controls}
    </>
  );
}
