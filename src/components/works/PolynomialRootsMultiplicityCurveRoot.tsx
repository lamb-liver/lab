import { useCallback, useState } from 'react';
import { MULT_LABELS, PRESETS } from '../../curve/modules/polynomial-roots-multiplicity/constants';
import {
  DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS,
  isPresetActive,
  paramsForMetadata,
  polynomialRootsMultiplicityModule,
  sanitizeA,
  type Multiplicity,
  type PolynomialRootsMultiplicityParams,
} from '../../curve/modules/polynomial-roots-multiplicity';
import ParamControls from '../curve/ParamControls';
import { usePolynomialRootsMultiplicityP5 } from '../curve/usePolynomialRootsMultiplicityP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const ROOT_KEYS = ['root0', 'root1', 'root2'] as const;

export default function PolynomialRootsMultiplicityCurveRoot({ controlsMountId }: Props) {
  const module = polynomialRootsMultiplicityModule;
  const [params, setParams] = useState<PolynomialRootsMultiplicityParams>(
    DEFAULT_POLYNOMIAL_ROOTS_MULTIPLICITY_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<PolynomialRootsMultiplicityParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = usePolynomialRootsMultiplicityP5({
    params,
    onParamsChange,
  });


  const sliderValues = paramsForMetadata(params);
  const metadata = module.getMetadata(sliderValues, {
    revealPct: 100,
    smoothParams: sliderValues,
  });

  const setRoot = (index: number, value: number) => {
    const roots = [...params.roots] as [number, number, number];
    roots[index] = value;
    onParamsChange({ roots });
  };

  const setMult = (index: number, value: Multiplicity) => {
    const mult = [...params.mult] as [Multiplicity, Multiplicity, Multiplicity];
    mult[index] = value;
    onParamsChange({ mult });
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <p className="curve-work-controls__formula">快速狀態</p>
      <div
        className="curve-work-mode-toggle"
        style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={isPresetActive(params, preset)}
            onClick={() =>
              onParamsChange({
                a: preset.a,
                roots: [...preset.roots],
                mult: [...preset.mult],
              })
            }
          >
            {preset.label}
          </button>
        ))}
      </div>

      <ParamControls
        module={module}
        values={sliderValues}
        onChange={(key, value) => {
          if (key === 'a') {
            onParamsChange({ a: sanitizeA(value) });
            return;
          }
          const rootIndex = ROOT_KEYS.indexOf(key as (typeof ROOT_KEYS)[number]);
          if (rootIndex >= 0) {
            setRoot(rootIndex, value);
          }
        }}
      />

      {[0, 1, 2].map((index) => (
        <div key={MULT_LABELS[index]} className="control-field">
          <span className="curve-work-controls__formula">重數 {MULT_LABELS[index]}</span>
          <div className="curve-work-mode-toggle" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {([1, 2] as const).map((value) => (
              <button
                key={value}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={params.mult[index] === value}
                onClick={() => setMult(index, value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.advanced}
          onClick={() => onParamsChange({ advanced: !params.advanced })}
        >
          {params.advanced ? '重數 guide：開' : '重數 guide：關'}
        </button>
      </div>

      <p className="curve-work-controls__formula">也可在圖上拖動零點 rᵢ</p>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="多項式零點與重根"
      />
      {controls}
    </>
  );
}
