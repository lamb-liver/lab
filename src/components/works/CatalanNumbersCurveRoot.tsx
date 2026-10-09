import { useState } from 'react';
import {
  MODE_PAREN,
  MODE_PATH,
  MODE_TRIANGULATION,
  catalanNumbersModule,
} from '../../curve/modules/catalan-numbers';
import type { CurveMetadata, CurveModule } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useCatalanNumbersP5 } from '../curve/useCatalanNumbersP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const MODE_LABELS = {
  [MODE_PATH]: { zh: 'Dyck 路徑', en: 'Dyck path' },
  [MODE_PAREN]: { zh: '括號', en: 'Parentheses' },
  [MODE_TRIANGULATION]: { zh: '三角剖分', en: 'Triangulation' },
} as const;

function presentMetadata(metadata: CurveMetadata, locale?: 'en'): CurveMetadata {
  if (locale !== 'en') return metadata;
  return {
    ...metadata,
    title: 'Catalan numbers',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'n') return { ...stat, label: 'Order n' };
      if (stat.key === 'mode') {
        const match = Object.values(MODE_LABELS).find((item) => item.zh === stat.value);
        return { ...stat, label: 'Mode', value: match?.en ?? stat.value };
      }
      return stat;
    }),
  };
}

function controlsModule(module: CurveModule, locale?: 'en'): CurveModule {
  if (locale !== 'en') return module;
  return {
    ...module,
    paramSchema: module.paramSchema.map((def) => ({
      ...def,
      label: def.key === 'n' ? 'Order n' : def.label,
    })),
  };
}

export default function CatalanNumbersCurveRoot({ controlsMountId, locale }: Props) {
  const module = catalanNumbersModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [nextNonce, setNextNonce] = useState(0);

  const { canvasHostRef } = useCatalanNumbersP5({
    targetParams,
    nextNonce,
    locale,
  });


  const mode = Math.round(targetParams.mode ?? MODE_PATH);
  const metadata = presentMetadata(module.getMetadata(targetParams), locale);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={locale === 'en' ? 'Catalan model' : '卡特蘭模型'}>
        {Object.entries(MODE_LABELS).map(([value, labels]) => (
          <button
            key={value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === Number(value)}
            onClick={() => setTargetParams((prev) => ({ ...prev, mode: Number(value) }))}
          >
            {locale === 'en' ? labels.en : labels.zh}
          </button>
        ))}
      </div>

      <ParamControls
        module={controlsModule(module, locale)}
        values={targetParams}
        onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
      />

      <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Object' : '物件切換'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={false}
          onClick={() => setNextNonce((prev) => prev + 1)}
        >
          {locale === 'en' ? 'Next' : '下一個'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={locale === 'en' ? 'Catalan numbers' : '卡特蘭數互動視覺化'}
      />
      {controls}
    </>
  );
}
