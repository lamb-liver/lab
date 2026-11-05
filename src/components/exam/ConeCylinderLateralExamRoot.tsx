import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_RADIUS,
  RADIUS_MAX,
  RADIUS_MIN,
  clampRadius,
  readConeCylinder,
} from '../../exam/gaokao-2024-i-cone-cylinder-lateral/geometry';
import { renderConeCylinderExam } from '../../systems/rendering/coneCylinderLateralExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

function volumeText(match: boolean, volume: number): string {
  return match ? '3√3 π' : `≈ ${volume.toFixed(3)}`;
}

type Props = { locale?: 'en' };

export default function ConeCylinderLateralExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const reading = readConeCylinder(radius);
  const nearHeight = Math.abs(reading.radius - Math.sqrt(3)) < 0.008;

  const draw = useCallback(
    (p: p5) => {
      renderConeCylinderExam(p, { width: p.width, height: p.height, radius });
    },
    [radius],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: radius,
  });

  const trap = reading.areasMatch
    ? en
      ? 'Dropping the 1/3 writes 9√3 π'
      : '漏掉 1/3 會寫成 9√3 π'
    : nearHeight
      ? en
        ? 'Dropping the 1/3 writes 3√3 π, and the lateral areas still differ'
        : '漏掉 1/3 會寫成 3√3 π，側面積仍然不相等'
      : en
        ? `Dropping the 1/3 writes ≈ ${reading.volumeWithoutThird.toFixed(2)}`
        : `漏掉 1/3 會寫成 ≈ ${reading.volumeWithoutThird.toFixed(2)}`;

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Equal height, then the slant' : '同高的軸截面，再看母線'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The slant is longer than the height. Why does forgetting the 1/3 at r = √3 still print the right volume?'
              : '母線比高長。為什麼半徑設成 √3 再漏掉 1/3，體積仍會印出正確的數？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'White is the cylinder section, gold is the cone. The right triangle is r, h and the slant l.'
              : '白線是圓柱的軸截面，金線是圓錐。直角三角形的三邊是 r、h、母線 l'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Cylinder and cone of height √3 and base radius ${reading.radius.toFixed(2)}, with the slant right triangle`
                : `高 √3、底面半徑 ${reading.radius.toFixed(2)} 的圓柱與圓錐，以及母線直角三角形`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Shared base' : '共用的底'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Base radius r' : '底面半徑 r'}</span>
              <output>{reading.radius.toFixed(2)}</output>
              <input
                id="cone-radius"
                type="range"
                aria-label={en ? 'Base radius r' : '底面半徑 r'}
                min={RADIUS_MIN}
                max={RADIUS_MAX}
                step={0.01}
                value={radius}
                onInput={(event) => setRadius(clampRadius(Number(event.currentTarget.value)))}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Both heights stay √3. The slant is √(r² + 3).'
                : '兩邊的高都停在 √3。母線是 √(r² + 3)。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Slant' : '母線'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {reading.areasMatch ? 'l = 2√3' : `l ≈ ${reading.slant.toFixed(3)}`}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Using the height in place of the slant makes the cone’s lateral area half the cylinder’s, so the two never meet.'
                : '母線改用高，圓錐側面積永遠是圓柱的一半，兩邊不會相等。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Cone volume' : '圓錐體積'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {reading.areasMatch
                ? en
                  ? 'Lateral areas match. V = 3√3 π'
                  : '側面積相等。V = 3√3 π'
                : en
                  ? `Lateral areas differ. V ${volumeText(false, reading.coneVolume)}`
                  : `側面積還沒相等。V ${volumeText(false, reading.coneVolume)}`}
            </p>
            <p className="exam-interactive-explore__note">{trap}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
