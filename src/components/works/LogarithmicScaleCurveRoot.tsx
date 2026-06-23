import { useCallback, useState } from 'react';
import { logarithmicScaleModule } from '../../curve/modules/logarithmic-scale';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useLogarithmicScaleP5 } from '../curve/useLogarithmicScaleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

export default function LogarithmicScaleCurveRoot({ controlsMountId }: Props) {
  const module = logarithmicScaleModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useLogarithmicScaleP5({
    targetParams,
    onRevealPctChange,
  });


  const compareMode = (targetParams.compareMode ?? 0) !== 0;
  const showExp = (targetParams.showExp ?? 1) !== 0;
  const showPower = (targetParams.showPower ?? 0) !== 0;
  const showLinear = (targetParams.showLinear ?? 0) !== 0;

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });

  const visibleKeys = new Set<string>(['a']);
  if (compareMode && showPower) visibleKeys.add('p');
  if (compareMode && showLinear) visibleKeys.add('m');
  const visibleSchema = module.paramSchema.filter((field) => visibleKeys.has(field.key));

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const patchCurveVisibility = (key: 'showExp' | 'showPower' | 'showLinear', current: boolean) => {
    const visibleCount = [showExp, showPower, showLinear].filter(Boolean).length;
    if (current && visibleCount <= 1) return;
    patchParams({ [key]: current ? 0 : 1 });
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <ParamControls
        module={{ ...module, paramSchema: visibleSchema }}
        values={targetParams}
        onChange={(key, value) => patchParams({ [key]: value })}
      />

      <div className="curve-work-mode-toggle" aria-label="比較模式">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={compareMode}
          onClick={() => patchParams(compareMode ? { compareMode: 0, showExp: 1 } : { compareMode: 1 })}
        >
          比較模式
        </button>
      </div>

      {compareMode ? (
        <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="曲線">
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showExp}
            onClick={() => patchCurveVisibility('showExp', showExp)}
          >
            指數
          </button>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showPower}
            onClick={() => patchCurveVisibility('showPower', showPower)}
          >
            冪
          </button>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showLinear}
            onClick={() => patchCurveVisibility('showLinear', showLinear)}
          >
            線性
          </button>
        </div>
      ) : null}
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="對數尺度互動視覺化"
      />
      {controls}
    </>
  );
}
