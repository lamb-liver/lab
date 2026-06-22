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
        const id = `${module.id}-${def.key}`;

        return (
          <div key={def.key} className="control-field">
            <label htmlFor={id}>
              {def.label}
              <span className="control-field__value">{display}</span>
            </label>
            <div className="range-wrap">
              <input
                id={id}
                type="range"
                className="range"
                min={def.min}
                max={def.max}
                step={def.step}
                value={value}
                onInput={(event) => onChange(def.key, Number(event.currentTarget.value))}
              />
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
