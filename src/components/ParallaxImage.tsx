import {
  type ReactEventHandler,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from './ScrollReveal';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'auto' | 'high' | 'low';
  onError?: ReactEventHandler<HTMLImageElement>;
}

interface ImageElementProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
  loading: 'eager' | 'lazy';
  decoding: 'async' | 'auto' | 'sync';
  fetchPriority: 'auto' | 'high' | 'low';
  onError: ReactEventHandler<HTMLImageElement>;
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const imageClassName = 'absolute -inset-[20%] h-[140%] w-[140%] object-cover grayscale brightness-90 contrast-[1.2]';

function clearEntryStyles(element: HTMLElement) {
  element.style.removeProperty('clip-path');
  element.style.removeProperty('opacity');
}

function useImageEntryReveal(
  elementRef: RefObject<HTMLDivElement | null>,
  prefersReducedMotion: boolean,
) {
  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    if (
      !element
      || prefersReducedMotion
      || typeof IntersectionObserver === 'undefined'
      || typeof element.animate !== 'function'
    ) {
      if (element) {
        clearEntryStyles(element);
      }
      return;
    }

    let animation: Animation | null = null;
    element.style.opacity = '0';
    element.style.clipPath = 'inset(7% 0 7% 0)';

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) {
        return;
      }

      observer.disconnect();

      try {
        animation = element.animate(
          [
            { opacity: 0, clipPath: 'inset(7% 0 7% 0)' },
            { opacity: 1, clipPath: 'inset(0% 0 0% 0)' },
          ],
          {
            duration: 820,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          },
        );

        animation.addEventListener('finish', () => {
          clearEntryStyles(element);
          animation?.cancel();
          animation = null;
        }, { once: true });
      } catch {
        clearEntryStyles(element);
      }
    }, {
      rootMargin: '-5%',
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      animation?.cancel();
      clearEntryStyles(element);
    };
  }, [elementRef, prefersReducedMotion]);
}

function StaticImage(props: ImageElementProps) {
  return <img {...props} className={imageClassName} />;
}

function AnimatedParallaxImage({
  targetRef,
  speed,
  ...imageProps
}: ImageElementProps & {
  targetRef: RefObject<HTMLDivElement | null>;
  speed: number;
}) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });
  const startOffset = -speed * 100;
  const endOffset = speed * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${startOffset}%`, `${endOffset}%`],
  );

  return (
    <motion.img
      {...imageProps}
      className={imageClassName}
      style={{ y, scale: 1 + Math.abs(speed) * 2 }}
    />
  );
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.2,
  width,
  height,
  srcSet,
  sizes,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  onError,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const safeSpeed = Math.min(Math.max(Number.isFinite(speed) ? speed : 0.2, -0.5), 0.5);
  const safeWidth = width && Number.isFinite(width) && width > 0 ? Math.round(width) : undefined;
  const safeHeight = height && Number.isFinite(height) && height > 0 ? Math.round(height) : undefined;
  const aspectRatio = safeWidth && safeHeight ? `${safeWidth} / ${safeHeight}` : undefined;
  const didFail = failedSource === src;

  useImageEntryReveal(revealRef, prefersReducedMotion);

  const handleError: ReactEventHandler<HTMLImageElement> = (event) => {
    setFailedSource(src);
    onError?.(event);
  };

  const imageProps: ImageElementProps = {
    src,
    alt,
    width: safeWidth,
    height: safeHeight,
    srcSet,
    sizes,
    loading,
    decoding,
    fetchPriority,
    onError: handleError,
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div ref={revealRef} className="absolute inset-0 h-full w-full">
        {didFail ? (
          <div
            className="absolute inset-0 bg-ink/10"
            role={alt ? 'img' : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true}
          />
        ) : prefersReducedMotion ? (
          <StaticImage {...imageProps} />
        ) : (
          <AnimatedParallaxImage
            {...imageProps}
            targetRef={containerRef}
            speed={safeSpeed}
          />
        )}
        {!didFail && (
          <div className="pointer-events-none absolute inset-0 bg-ink/10 mix-blend-overlay" />
        )}
      </div>
    </div>
  );
}
