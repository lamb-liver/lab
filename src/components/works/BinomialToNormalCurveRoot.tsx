import { useState } from 'react';
import { MODE_SIM, MODE_X, MODE_Z, binomialToNormalModule } from '../../curve/modules/binomial-to-normal';
import type { CurveMetadata, CurveModule } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBinomialToNormalP5 } from '../curve/useBinomialToNormalP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  n: 'Trials n',
  p: 'Probability p',
};

const EN_MODE: Record<string, string> = {
  'X 分佈': 'X distribution',
  'Z 標準化': 'Standardized Z',
  伯努利模擬: 'Bernoulli trials',
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
    title: 'Binomial distribution to the normal distribution',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'mode') {
        return { ...stat, label: 'Mode', value: EN_MODE[String(stat.value)] ?? stat.value };
      }
      return stat;
    }),
  };
}

export default function BinomialToNormalCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = en ? withParamLabels(binomialToNormalModule, EN_PARAM_LABELS) : binomialToNormalModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [runNonce, setRunNonce] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);

  const { canvasHostRef } = useBinomialToNormalP5({
    targetParams,
    runNonce,
    resetNonce,
    locale,
  });

  const mode = Math.round(targetParams.mode ?? MODE_X);
  const metadata = module.getMetadata(targetParams);
  const shown = en ? englishMetadata(metadata) : metadata;
  const modeOptions = [
    { value: MODE_X, label: en ? 'X distribution' : 'X 分佈' },
    { value: MODE_Z, label: en ? 'Standardized Z' : 'Z 標準化' },
    { value: MODE_SIM, label: en ? 'Bernoulli trials' : '伯努利模擬' },
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
            onClick={() => {
              setTargetParams((prev) => ({ ...prev, mode: option.value }));
              setResetNonce((prev) => prev + 1);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ParamControls
        module={module}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams((prev) => ({ ...prev, [key]: value }));
          setResetNonce((prev) => prev + 1);
        }}
      />

      <div className="curve-work-mode-toggle" aria-label={en ? 'Simulation' : '模擬控制'}>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setRunNonce((prev) => prev + 1)}>
          {en ? 'Sample' : '抽樣'}
        </button>
        <button type="button" className="curve-work-mode-button" aria-pressed={false} onClick={() => setResetNonce((prev) => prev + 1)}>
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
        aria-label={en ? 'Binomial distribution to the normal distribution' : '二項分佈到常態分佈互動視覺化'}
      />
      {controls}
    </>
  );
}
