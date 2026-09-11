/** Own one scroller and one animation loop; return to native scrolling when preferences change. */
export interface SmoothScroller {
  raf(time: number): void;
  destroy(): void;
}

export interface ScrollEnvironment {
  matchMedia(query: string): MediaQueryList;
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(id: number): void;
  lenis?: unknown;
}

export function installSmoothScrolling(env: ScrollEnvironment, create: () => SmoothScroller) {
  const reduced = env.matchMedia('(prefers-reduced-motion: reduce)');
  const native = env.matchMedia('(max-width: 767px), (pointer: coarse)');
  let scroller: SmoothScroller | undefined;
  let frame: number | undefined;
  let disposed = false;

  const stop = () => {
    if (frame !== undefined) env.cancelAnimationFrame(frame);
    frame = undefined;
    if (scroller) {
      if (env.lenis === scroller) delete env.lenis;
      scroller.destroy();
      scroller = undefined;
    }
  };
  const sync = () => {
    if (disposed || reduced.matches || native.matches) { stop(); return; }
    if (scroller) return;
    const instance = create();
    scroller = instance;
    env.lenis = instance;
    const tick: FrameRequestCallback = (time) => {
      if (disposed || scroller !== instance) return;
      instance.raf(time);
      if (!disposed && scroller === instance) frame = env.requestAnimationFrame(tick);
    };
    frame = env.requestAnimationFrame(tick);
  };
  reduced.addEventListener('change', sync);
  native.addEventListener('change', sync);
  sync();
  return () => {
    disposed = true;
    reduced.removeEventListener('change', sync);
    native.removeEventListener('change', sync);
    stop();
  };
}
