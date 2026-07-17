// p5 2.x's bundled type declarations dropped the touchStarted/touchMoved/
// touchEnded instance hooks even though the runtime still dispatches them.
// Declare them here (mirroring the bundled mousePressed signature) so sketch
// code can keep assigning `p.touchStarted = ...` without casts.
import 'p5';

declare module 'p5' {
  export default interface p5 {
    touchStarted(event?: TouchEvent): void;
    touchMoved(event?: TouchEvent): void;
    touchEnded(event?: TouchEvent): void;
  }
}
