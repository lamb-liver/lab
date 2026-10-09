import { useCallback, useState } from 'react';
import { mandelbrotMapModule } from '../../curve/modules/mandelbrot-map';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useMandelbrotMapP5 } from '../curve/useMandelbrotMapP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  cx: 'Real part Re(c)',
  cy: 'Imaginary part Im(c)',
  maxIter: 'Maximum iterations',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Mandelbrot set and Julia set',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: stat.key === 'iter' ? 'Maximum iterations' : stat.label,
    })),
  };
}

export default function MandelbrotMapCurveRoot({ controlsMountId, locale }: Props) {
  const [params, setParams] = useState<ParamValues>({ ...mandelbrotMapModule.defaultParams });
  const en = locale === 'en';
  const controlsModule = en
    ? {
        ...mandelbrotMapModule,
        paramSchema: mandelbrotMapModule.paramSchema.map((def) => ({
          ...def,
          label: EN_PARAM_LABELS[def.key] ?? def.label,
        })),
      }
    : mandelbrotMapModule;

  const onCChange = useCallback((cx: number, cy: number) => {
    setParams((prev) => ({ ...prev, cx, cy }));
  }, []);

  const { canvasHostRef } = useMandelbrotMapP5({ params, onCChange, locale });

  const metadata = mandelbrotMapModule.getMetadata(params);
  const shown = en ? englishMetadata(metadata) : metadata;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en ? 'Mandelbrot set and the corresponding Julia set' : '曼德博集合與對應的朱利亞集合'
        }
      />
      <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
        <ParamControls
          module={controlsModule}
          values={params}
          onChange={(key, value) => setParams((prev) => ({ ...prev, [key]: value }))}
        />
      </WorkControlsPortal>
    </>
  );
}
