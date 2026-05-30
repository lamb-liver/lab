import type { CurveModule, ParamKey, ParamValues } from '../../curve/types';

type Props = {
  module: CurveModule;
  values: ParamValues;
  onChange: (key: ParamKey, value: number) => void;
};

export default function ParamControls({ module, values, onChange }: Props) {
  return (
    <>
      {module.paramSchema.map((def) => (
        <div key={def.key} className="control-field">
          <label htmlFor={`${module.id}-${def.key}`}>{def.label}</label>
          <div className="range-wrap">
            <input
              id={`${module.id}-${def.key}`}
              type="range"
              className="range"
              min={def.min}
              max={def.max}
              step={def.step}
              value={values[def.key] ?? def.default}
              onInput={(e) => onChange(def.key, Number(e.currentTarget.value))}
            />
          </div>
        </div>
      ))}
    </>
  );
}
