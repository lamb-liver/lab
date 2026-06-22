import type { CurveModule, ParamKey, ParamValues } from '../../curve/types';

type Props = {
  module: CurveModule;
  values: ParamValues;
  onChange: (key: ParamKey, value: number) => void;
};

export default function ParamControls({ module, values, onChange }: Props) {
  return (
    <>
      {module.paramSchema.map((def) => {
        const value = values[def.key] ?? def.default;
        const display =
          def.step >= 1 ? String(Math.round(value)) : value.toFixed(decimalPlaces(def.step));
        const setStep = (direction: -1 | 1) => {
          onChange(def.key, nextStepValue(value, def.min, def.max, def.step, direction));
        };

        return (
          <div key={def.key} className="control-field">
            <div className="control-field__label">
              {def.label}
              <span className="control-field__value">{display}</span>
            </div>
            <div className="range-wrap range-stepper" role="group" aria-label={def.label}>
              <button
                type="button"
                className="range-step"
                aria-label={`降低 ${def.label}`}
                disabled={value <= def.min}
                onClick={() => setStep(-1)}
              >
                -
              </button>
              <button
                type="button"
                className="range-step"
                aria-label={`提高 ${def.label}`}
                disabled={value >= def.max}
                onClick={() => setStep(1)}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

function decimalPlaces(step: number): number {
  const [, decimals = ''] = String(step).split('.');
  return Math.min(decimals.length, 3);
}

function nextStepValue(
  value: number,
  min: number,
  max: number,
  step: number,
  direction: -1 | 1,
): number {
  const next = Math.min(max, Math.max(min, value + step * direction));
  const places = decimalPlaces(step);
  return places === 0 ? Math.round(next) : Number(next.toFixed(places));
}
