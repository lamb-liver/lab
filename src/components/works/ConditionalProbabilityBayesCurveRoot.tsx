import {
  MODE_AREA,
  MODE_BAYES,
  MODE_TREE,
  SCENARIO_CARD,
  SCENARIO_MEDICAL,
  SCENARIO_SPAM,
  conditionalProbabilityBayesModule,
} from '../../curve/modules/conditional-probability-bayes';
import { scenarios } from '../../curve/modules/conditional-probability-bayes/geometry';
import type { CurveMetadata, CurveModule } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useConditionalProbabilityBayesP5 } from '../curve/useConditionalProbabilityBayesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  pA: 'Prior P(A)',
  pBgA: 'Conditional P(B|A)',
  pBgNotA: 'Conditional P(B|¬A)',
};

const EN_MODE: Record<string, string> = {
  樹狀圖: 'Tree',
  面積模型: 'Area model',
  貝氏更新: 'Bayes update',
};

const EN_SCENARIO: Record<string, string> = {
  醫檢: 'Medical test',
  抽牌: 'Card draw',
  垃圾信: 'Spam',
};

function withParamLabels(module: CurveModule, labels: Record<string, string>): CurveModule {
  return {
    ...module,
    paramSchema: module.paramSchema.map((def) => ({
      ...def,
      label: labels[def.key] ?? def.label,
    })),
  };
}

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: "Conditional probability and Bayes' theorem",
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'scenario') {
        return { ...stat, label: 'Scenario', value: EN_SCENARIO[String(stat.value)] ?? stat.value };
      }
      if (stat.key === 'mode') {
        return { ...stat, label: 'Mode', value: EN_MODE[String(stat.value)] ?? stat.value };
      }
      return stat;
    }),
  };
}

export default function ConditionalProbabilityBayesCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = en
    ? withParamLabels(conditionalProbabilityBayesModule, EN_PARAM_LABELS)
    : conditionalProbabilityBayesModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const { canvasHostRef } = useConditionalProbabilityBayesP5({
    targetParams,
    locale,
  });

  const metadata = module.getMetadata(targetParams);
  const shown = en ? englishMetadata(metadata) : metadata;
  const mode = Math.round(targetParams.mode ?? MODE_TREE);
  const scenario = Math.round(targetParams.scenario ?? SCENARIO_MEDICAL);
  const modeOptions = [
    { value: MODE_TREE, label: en ? 'Tree' : '樹狀圖' },
    { value: MODE_AREA, label: en ? 'Area model' : '面積模型' },
    { value: MODE_BAYES, label: en ? 'Bayes update' : '貝氏更新' },
  ];
  const scenarioOptions = [
    { value: SCENARIO_MEDICAL, label: en ? 'Medical test' : '醫檢' },
    { value: SCENARIO_CARD, label: en ? 'Card draw' : '抽牌' },
    { value: SCENARIO_SPAM, label: en ? 'Spam' : '垃圾信' },
  ];

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={en ? 'View' : '視圖模式'}>
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

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={en ? 'Scenario' : '情境'}>
        {scenarioOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={scenario === option.value}
            onClick={() => {
              const preset = scenarios[option.value]!;
              setTargetParams((prev) => ({
                ...prev,
                scenario: option.value,
                pA: Math.round(preset.pA * 100),
                pBgA: Math.round(preset.pBgA * 100),
                pBgNotA: Math.round(preset.pBgNotA * 100),
              }));
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
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? "Conditional probability and Bayes' theorem" : '條件機率與貝氏定理互動視覺化'}
      />
      {controls}
    </>
  );
}
