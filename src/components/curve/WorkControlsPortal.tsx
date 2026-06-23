import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { CurveMetadata } from '../../curve/types';
import StatsPanel from './StatsPanel';

type Props = {
  controlsMountId: string;
  metadata: CurveMetadata;
  metaExtra?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

export default function WorkControlsPortal({
  controlsMountId,
  metadata,
  metaExtra,
  children,
  footer,
}: Props) {
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  if (!controlsMount) return null;

  return createPortal(
    <div className="curve-work-controls">
      <div className="curve-work-controls__meta">
        <p className="curve-work-controls__title">{metadata.title}</p>
        <p className="curve-work-controls__formula">{metadata.formula}</p>
        {metaExtra}
      </div>
      {children}
      <StatsPanel metadata={metadata} />
      {footer}
    </div>,
    controlsMount,
  );
}
