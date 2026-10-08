import { useCallback, useState } from 'react';
import {
  DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS,
  lpObjectiveLevelCurvesModule,
  lpObjectiveLevelCurvesParamsForMetadata,
  type LpObjectiveLevelCurvesParams,
} from '../../curve/modules/lp-objective-level-curves';
import type { CurveMetadata } from '../../curve/types';
import { useLpObjectiveLevelCurvesP5 } from '../curve/useLpObjectiveLevelCurvesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

type SliderKey = 'p' | 'q' | 'k';

const SLIDERS: Array<{
  key: SliderKey;
  label: string;
  en: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: 'p', label: '係數 p', en: 'Coefficient p', min: -6, max: 6, step: 0.1 },
  { key: 'q', label: '係數 q', en: 'Coefficient q', min: -6, max: 6, step: 0.1 },
  { key: 'k', label: '等值 k', en: 'Level k', min: -30, max: 60, step: 0.5 },
];

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Level curves of the objective',
    formula: metadata.formula.replace('，等值線 ', ', level line '),
    stats: metadata.stats.map((stat) => {
      switch (stat.key) {
        case 'normal':
          return { ...stat, label: 'Normal n' };
        case 'k':
          return { ...stat, label: 'Current k' };
        case 'test':
          return { ...stat, label: String(stat.label).replace('測試點', 'Test point') };
        case 'spacing':
          return {
            ...stat,
            label: String(stat.label).replace('相鄰間距（', 'Spacing (').replace('）', ')'),
            value:
              stat.value === '係數皆為零，沒有等值線'
                ? 'all coefficients zero, no level lines'
                : stat.value,
          };
        default:
          return stat;
      }
    }),
  };
}

export default function LpObjectiveLevelCurvesCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const [params, setParams] = useState<LpObjectiveLevelCurvesParams>(
    DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<LpObjectiveLevelCurvesParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useLpObjectiveLevelCurvesP5({ params, onParamsChange, locale });

  const rawMetadata = lpObjectiveLevelCurvesModule.getMetadata(
    lpObjectiveLevelCurvesParamsForMetadata(params),
  );
  const metadata = en ? englishMetadata(rawMetadata) : rawMetadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      {SLIDERS.map((slider) => (
        <div className="control-field" key={slider.key}>
          <label htmlFor={`lp-objective-${slider.key}`}>
            <span>{en ? slider.en : slider.label}</span>
            <span className="control-field__value">{params[slider.key].toFixed(1)}</span>
          </label>
          <div className="range-wrap">
            <input
              id={`lp-objective-${slider.key}`}
              type="range"
              className="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={params[slider.key]}
              onInput={(event) =>
                onParamsChange({ [slider.key]: Number(event.currentTarget.value) })
              }
            />
          </div>
        </div>
      ))}

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.showFamily}
          onClick={() => onParamsChange({ showFamily: !params.showFamily })}
        >
          {en ? 'Level line family' : '等值線族'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_LP_OBJECTIVE_LEVEL_CURVES_PARAMS)}
        >
          {en ? 'Reset' : '重設'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Level curves of the objective. Drag the level line or the test point.'
            : '目標函數等值線互動：可拖動等值線與測試點'
        }
      />
      {controls}
    </>
  );
}
