import type p5 from 'p5';

/**
 * 把觸控轉接到既有的 mouse handler。
 *
 * 為什麼不能只靠瀏覽器補送的相容 mouse 事件：
 * `work-detail.css` 在手機給 works 畫布 `touch-action: pan-y`，垂直拖曳會被瀏覽器
 * 判成捲頁，畫布手勢就失效；explore 若沒設 `touch-action`，預設還會被拿去平移縮放。
 * 回傳 false 讓 p5 呼叫 preventDefault，攔下這些接管。
 *
 * 而一旦 preventDefault，瀏覽器就不再補送相容 mouse 事件，所以這裡必須主動轉呼叫——
 * 兩者是綁在一起的，只做其中一半都會壞。實測相同拖曳距離下，滑鼠與觸控造成的變化量
 * 一致（比值 1.00），沒有重複觸發。
 *
 * 在 sketch 指派完 mouse handler 之後呼叫；未定義的 handler 會被略過。
 */
export function wireTouchToMouse(p: p5): void {
  const forward = (handler: unknown) => {
    if (typeof handler === 'function') (handler as () => void).call(p);
    return false;
  };

  p.touchStarted = () => forward(p.mousePressed);
  p.touchMoved = () => forward(p.mouseDragged);
  p.touchEnded = () => forward(p.mouseReleased);
}
