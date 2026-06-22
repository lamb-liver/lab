import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MODE_AREA,
  MODE_INVERSE,
  naturalLogEGeometryModule,
} from '../../curve/modules/natural-log-e-geometry';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useNaturalLogEGeometryP5 } from '../curve/useNaturalLogEGeometryP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId: string };

const modeOptions = [
  { value: MODE_AREA, label: '面積' },
  { value: MODE_INVERSE, label: '反函數' },
];

export default function NaturalLogEGeometryCurveRoot({ controlsMountId }: Props) {
  const module = naturalLogEGeometryModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useNaturalLogEGeometryP5({
    targetParams,
    onRevealPctChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const mode = Math.round(targetParams.mode ?? MODE_AREA);
  const areaMode = mode === MODE_AREA;
  const riemannMode = areaMode && (targetParams.riemannMode ?? 0) !== 0;

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });

  const visibleSchema = !areaMode || !riemannMode
    ? module.paramSchema.filter((field) => field.key === 't')
    : module.paramSchema;

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => {
      const next = { ...prev, ...patch };
      if (patch.mode === MODE_INVERSE) {
        next.riemannMode = 0;
      }
      return next;
    });
  };

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="模式">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={mode === option.value}
                onClick={() => patchParams({ mode: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ParamControls
            module={{ ...module, paramSchema: visibleSchema }}
            values={targetParams}
            onChange={(key, value) => patchParams({ [key]: value })}
          />

          {areaMode ? (
            <div className="curve-work-mode-toggle" aria-label="進階">
              <button
                type="button"
                className="curve-work-mode-button"
                aria-pressed={riemannMode}
                onClick={() => patchParams({ riemannMode: riemannMode ? 0 : 1 })}
              >
                黎曼矩形
              </button>
            </div>
          ) : null}

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
        aria-label="自然對數 e 的幾何定義互動視覺化"
      />
      {controls}
    </>
  );
}
