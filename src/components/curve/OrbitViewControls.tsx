import type { OrbitView } from './useOrbitViewP5';
import { clampPitch, normalizeYaw } from './useOrbitViewP5';

type Props<P extends OrbitView> = {
  /** 用來組出唯一的 input id，通常傳作品 slug */
  idPrefix: string;
  params: P;
  onParamsChange: (patch: Partial<P>) => void;
};

/**
 * 視角的 yaw／pitch 滑桿。
 *
 * 拖曳畫布仍是主要操作，但站內的原則是「互動靠控件」：手機上畫布手勢會與捲動競爭，
 * 桌機上也有讀者不會發現畫布可以拖。這組滑桿提供不依賴手勢的第二條路徑。
 */
export default function OrbitViewControls<P extends OrbitView>({
  idPrefix,
  params,
  onParamsChange,
}: Props<P>) {
  const fields = [
    {
      key: 'yaw' as const,
      label: '視角水平',
      min: -180,
      max: 180,
      value: params.yaw,
      normalize: normalizeYaw,
    },
    {
      key: 'pitch' as const,
      label: '視角仰角',
      min: -80,
      max: 80,
      value: params.pitch,
      normalize: clampPitch,
    },
  ];

  return (
    <>
      {fields.map((field) => (
        <div className="control-field" key={field.key}>
          <label htmlFor={`${idPrefix}-${field.key}`}>
            <span>{field.label}</span>
            <span className="control-field__value">{`${Math.round(field.value)}°`}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`${idPrefix}-${field.key}`}
              type="range"
              className="range"
              min={field.min}
              max={field.max}
              step={1}
              value={field.value}
              onInput={(event) =>
                onParamsChange({
                  [field.key]: field.normalize(Number(event.currentTarget.value)),
                } as Partial<P>)
              }
            />
          </div>
        </div>
      ))}
    </>
  );
}
