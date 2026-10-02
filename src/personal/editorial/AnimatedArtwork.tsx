import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { GenerativeArtwork } from './generative/types';
import { artworkPlayers, createArtworkPlayer, type ArtworkPlayer, type ArtworkPlayerStatus } from './artwork-player';

export type ArtworkState = 'poster' | 'running' | 'paused' | 'fallback';

export type AnimatedArtworkProps = {
  artwork: GenerativeArtwork;
  size?: number;
  paused?: boolean;
  eager?: boolean;
  decorative?: boolean;
  embedded?: boolean;
  transitionName?: string;
  onStateChange?: (state: ArtworkState) => void;
};

/** Live source artwork without nested controls, shared by covers and small previews. */
export default function AnimatedArtwork({
  artwork, size = 240, paused = false, eager = false, decorative = false, embedded = false, transitionName, onStateChange,
}: AnimatedArtworkProps) {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<ArtworkPlayer | null>(null);
  const callback = useRef(onStateChange);
  const lastState = useRef<ArtworkState | undefined>(undefined);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paintedSketch, setPaintedSketch] = useState<string | null>(null);
  const [failedSketch, setFailedSketch] = useState<string | null>(null);
  const [renderer, setRenderer] = useState<'worker' | 'main'>('main');
  const physicalSize = transitionName ? 400 : Number.isFinite(size) ? Math.max(160, Math.min(400, Math.round(size))) : 240;
  const failed = failedSketch === artwork.sketchId;
  const ready = paintedSketch === artwork.sketchId;
  const allowed = visible && documentVisible && !reduced && !paused && !failed;
  const canLoad = (entered || artworkPlayers.traveling(transitionName)) && !reduced && !failed;
  const state: ArtworkState = failed ? 'fallback' : !ready || reduced ? 'poster' : allowed ? 'running' : 'paused';

  useEffect(() => { callback.current = onStateChange; }, [onStateChange]);
  useEffect(() => {
    if (lastState.current !== state) {
      lastState.current = state;
      callback.current?.(state);
    }
  }, [state]);

  useEffect(() => {
    const target = root.current;
    if (!target) return;
    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        const nextVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .15);
        if (!nextVisible) player.current?.setVisible(false);
        setVisible(nextVisible);
        if (entry?.isIntersecting) setEntered(true);
      }, { threshold: [0, .15] });
      observer.observe(target);
    } else {
      setVisible(true);
      setEntered(true);
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => {
      if (query.matches) player.current?.setPlayback(false, true);
      setReduced(query.matches);
    };
    const visibility = () => {
      if (document.hidden) player.current?.setVisible(false);
      setDocumentVisible(!document.hidden);
    };
    preference();
    visibility();
    query.addEventListener('change', preference);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer?.disconnect();
      query.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useLayoutEffect(() => {
    player.current?.setPlayback(visible && documentVisible, paused || reduced);
  }, [visible, documentVisible, paused, reduced]);

  useLayoutEffect(() => {
    if (!canLoad || !host.current) return;
    const owner = {};
    const current = artworkPlayers.acquire(transitionName, owner, host.current, () => createArtworkPlayer(artwork, physicalSize));
    player.current = current;
    current.setPlayback(visible && documentVisible, paused || reduced);
    let wasPainted: boolean | undefined, wasFailed: boolean | undefined, lastRenderer: string | undefined;
    const unsubscribe = current.subscribe((status: ArtworkPlayerStatus) => {
      const target = root.current;
      if (target) {
        const stats = status.stats;
        target.dataset.player = String(status.id);
        target.dataset.frames = String(stats.frames);
        target.dataset.drawMs = stats.drawMs.toFixed(2);
        target.dataset.averageMs = stats.averageMs.toFixed(2);
        target.dataset.targetFps = String(stats.targetFps);
        target.dataset.observedFps = (stats.observedFps ?? 0).toFixed(1);
        target.dataset.engine = stats.engine ?? 'canvas';
        target.dataset.workerJobs = String(status.jobs);
        target.dataset.formulaMs = (stats.formulaMs ?? 0).toFixed(2);
        target.dataset.submitMs = (stats.submitMs ?? 0).toFixed(2);
        target.dataset.presentMs = (stats.presentMs ?? 0).toFixed(2);
        target.dataset.points = String(stats.points ?? 0);
        target.dataset.drawCalls = String(stats.drawCalls ?? 0);
      }
      if (wasPainted !== status.painted) { wasPainted = status.painted; setPaintedSketch(status.painted ? artwork.sketchId : null); }
      if (wasFailed !== status.failed) { wasFailed = status.failed; setFailedSketch(status.failed ? artwork.sketchId : null); }
      if (lastRenderer !== status.renderer) { lastRenderer = status.renderer; setRenderer(status.renderer); }
    });
    return () => {
      unsubscribe();
      artworkPlayers.release(transitionName, owner, current);
      if (player.current === current) player.current = null;
    };
  }, [artwork, canLoad, physicalSize, transitionName]);

  return <div ref={root} className="animated-artwork" data-artwork-key={transitionName} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : artwork.alt} aria-hidden={decorative ? true : undefined}
    data-art-state={state} data-sketch={artwork.sketchId} data-treatment={artwork.treatment} data-embedded={embedded} data-physical-size={physicalSize}
    data-renderer={renderer} data-engine="canvas" data-observed-fps="0" data-worker-jobs="0" data-frames="0" data-draw-ms="0" data-average-ms="0" data-target-fps="18">
    <img className="animated-artwork-poster" src={`${import.meta.env.BASE_URL}${artwork.posterSrc.replace(/^\//, '')}`} alt="" width="400" height="400" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    <div ref={host} className="animated-artwork-canvas" aria-hidden="true" />
  </div>;
}
