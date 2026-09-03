import { useEffect, useRef, useState } from 'react';
import type p5 from 'p5';

import type { GenerativeArtwork } from '../art/generative/types';

type GenerativeArticleArtProps = {
  artwork: GenerativeArtwork;
};

export function GenerativeArticleArt({ artwork }: GenerativeArticleArtProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [motionPreferenceKnown, setMotionPreferenceKnown] = useState(false);
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const wantsMotion = motionOverride ?? (motionPreferenceKnown && !prefersReducedMotion);
  const shouldAnimate = wantsMotion && isIntersecting && documentVisible;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPrefersReducedMotion(query.matches);
      setMotionPreferenceKnown(true);
    };

    updatePreference();
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      setHasEnteredViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setIsIntersecting(visible);
        if (visible) setHasEnteredViewport(true);
      },
      { threshold: 0.01 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState === 'visible');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (!hasEnteredViewport || instanceRef.current) return undefined;

    let cancelled = false;
    let readyFrame = 0;
    setCanvasReady(false);
    setLoadFailed(false);

    Promise.all([import('p5'), artwork.factory()])
      .then(([p5Module, sketchModule]) => {
        if (cancelled || !hostRef.current) return;
        const P5 = p5Module.default;
        instanceRef.current = new P5(sketchModule.default, hostRef.current);
        instanceRef.current.noLoop();

        const markReady = () => {
          if (cancelled) return;
          const canvas = hostRef.current?.querySelector('canvas');
          if (canvas) {
            canvas.setAttribute('aria-hidden', 'true');
            canvas.setAttribute('tabindex', '-1');
            setCanvasReady(true);
            return;
          }
          readyFrame = window.requestAnimationFrame(markReady);
        };
        readyFrame = window.requestAnimationFrame(markReady);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(readyFrame);
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, [artwork, hasEnteredViewport]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !canvasReady) return;
    if (shouldAnimate) instance.loop();
    else instance.noLoop();
  }, [canvasReady, shouldAnimate]);

  const state = loadFailed
    ? 'fallback'
    : !canvasReady
      ? 'loading'
      : shouldAnimate
        ? 'running'
        : 'paused';

  return (
    <>
      <figcaption className="article-reader__image-caption article-reader__generative-caption">
        <span>{artwork.title}</span>
        <small>
          p5.js by{' '}
          <a href={artwork.attribution.artistUrl} target="_blank" rel="noreferrer">@yuruyurau</a>
          {' · '}
          <a href={artwork.attribution.sourceUrl} target="_blank" rel="noreferrer">Source</a>
        </small>
      </figcaption>
      <div
        className="article-reader__generative-stage"
        data-art-state={state}
        data-art-treatment={artwork.treatment}
        data-sketch-id={artwork.sketchId}
      >
        <div className="article-reader__generative-square">
          <img
            className="article-reader__generative-poster"
            src={artwork.posterSrc}
            alt={artwork.alt}
            width="400"
            height="400"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div
            ref={hostRef}
            className="article-reader__generative-canvas"
            aria-hidden="true"
          />
        </div>
        <button
          className="article-reader__generative-toggle"
          type="button"
          aria-pressed={wantsMotion}
          disabled={loadFailed}
          onClick={() => setMotionOverride(!wantsMotion)}
        >
          <span aria-hidden="true">{wantsMotion ? 'Ⅱ' : '▶'}</span>
          {loadFailed ? 'Static artwork' : wantsMotion ? 'Pause artwork' : 'Play artwork'}
        </button>
      </div>
    </>
  );
}
