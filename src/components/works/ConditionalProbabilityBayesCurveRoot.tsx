import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MODE_AREA,
  MODE_BAYES,
  MODE_TREE,
  SCENARIO_CARD,
  SCENARIO_MEDICAL,
  SCENARIO_SPAM,
  conditionalProbabilityBayesModule,
} from '../../curve/modules/conditional-probability-bayes';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { useConditionalProbabilityBayesP5 } from '../curve/useConditionalProbabilityBayesP5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId?: string };

const modeOptions = [
  { value: MODE_TREE, label: '樹狀圖' },
  { value: MODE_AREA, label: '面積模型' },
  { value: MODE_BAYES, label: '貝氏更新' },
];

const scenarioOptions = [
  { value: SCENARIO_MEDICAL, label: '醫檢' },
  { value: SCENARIO_CARD, label: '抽牌' },
  { value: SCENARIO_SPAM, label: '垃圾信' },
];

export default function ConditionalProbabilityBayesCurveRoot({
  controlsMountId = 'conditional-probability-bayes-controls',
}: Props) {
  const module = conditionalProbabilityBayesModule;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);
  const { canvasHostRef } = useConditionalProbabilityBayesP5({
    targetParams,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams);
  const mode = Math.round(targetParams.mode ?? MODE_TREE);
  const scenario = Math.round(targetParams.scenario ?? SCENARIO_MEDICAL);

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="視圖模式">
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={mode === option.value}
                onClick={() => setTargetParams((prev) => ({ ...prev, mode: option.value }))}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label="情境">
            {scenarioOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="curve-work-mode-button"
                aria-pressed={scenario === option.value}
                onClick={() => {
                  const presets: Record<number, { pA: number; pBgA: number; pBgNotA: number }> = {
                    [SCENARIO_MEDICAL]: { pA: 1, pBgA: 95, pBgNotA: 5 },
                    [SCENARIO_CARD]: { pA: 25, pBgA: 100, pBgNotA: 33 },
                    [SCENARIO_SPAM]: { pA: 18, pBgA: 88, pBgNotA: 12 },
                  };
                  const preset = presets[option.value]!;
                  setTargetParams((prev) => ({ ...prev, scenario: option.value, ...preset }));
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
          />

          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div ref={canvasHostRef} className="curve-work-canvas-host work-canvas" aria-label="條件機率與貝氏定理互動視覺化" />
      {controls}
    </>
  );
}
