import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  blur?: boolean;
  staggerChildren?: boolean;
}

type RevealPhase = 'pending' | 'animating' | 'visible';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const revealCallbacks = new Map<Element, () => void>();
const reducedMotionSubscribers = new Set<() => void>();
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

let revealObserver: IntersectionObserver | null = null;
let reducedMotionMediaQuery: MediaQueryList | null = null;

function getReducedMotionMediaQuery() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  reducedMotionMediaQuery ??= window.matchMedia(REDUCED_MOTION_QUERY);
  return reducedMotionMediaQuery;
}

function notifyReducedMotionSubscribers() {
  reducedMotionSubscribers.forEach((subscriber) => subscriber());
}

function subscribeToReducedMotion(subscriber: () => void) {
  reducedMotionSubscribers.add(subscriber);
  const mediaQuery = getReducedMotionMediaQuery();

  if (reducedMotionSubscribers.size === 1 && mediaQuery) {
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', notifyReducedMotionSubscribers);
    } else {
      mediaQuery.addListener(notifyReducedMotionSubscribers);
    }
  }

  return () => {
    reducedMotionSubscribers.delete(subscriber);

    if (reducedMotionSubscribers.size === 0 && mediaQuery) {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', notifyReducedMotionSubscribers);
      } else {
        mediaQuery.removeListener(notifyReducedMotionSubscribers);
      }
    }
  };
}

function getReducedMotionSnapshot() {
  return getReducedMotionMediaQuery()?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

/**
 * Hydration-safe, live reduced-motion preference shared by the motion
 * infrastructure components. Multiple ScrollReveal instances use one native
 * MediaQueryList listener instead of registering a listener per instance.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

function releaseRevealObserverIfIdle(observer: IntersectionObserver) {
  if (revealCallbacks.size === 0 && revealObserver === observer) {
    observer.disconnect();
    revealObserver = null;
  }
}

function getRevealObserver() {
  if (revealObserver || typeof IntersectionObserver === 'undefined') {
    return revealObserver;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const reveal = revealCallbacks.get(entry.target);
      if (!reveal) {
        return;
      }

      revealCallbacks.delete(entry.target);
      observer.unobserve(entry.target);
      reveal();
    });

    releaseRevealObserverIfIdle(observer);
  }, {
    rootMargin: '-6%',
    threshold: 0,
  });

  revealObserver = observer;
  return observer;
}

function observeReveal(element: Element, reveal: () => void) {
  const observer = getRevealObserver();
  if (!observer) {
    return null;
  }

  revealCallbacks.set(element, reveal);
  observer.observe(element);

  return () => {
    revealCallbacks.delete(element);
    observer.unobserve(element);
    releaseRevealObserverIfIdle(observer);
  };
}

function clearRevealStyles(element: HTMLElement) {
  element.style.removeProperty('filter');
  element.style.removeProperty('opacity');
  element.style.removeProperty('transform');
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 30,
  blur = true,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const observerCleanupRef = useRef<(() => void) | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const phaseRef = useRef<RevealPhase>('pending');
  const prefersReducedMotion = usePrefersReducedMotion();
  const safeDelayMs = Math.min(Math.max(Number.isFinite(delay) ? delay : 0, 0), 0.35) * 1000;
  const safeYOffset = Math.min(Math.max(Number.isFinite(yOffset) ? yOffset : 0, -160), 160);

  const reveal = useCallback((immediate = false) => {
    const element = elementRef.current;
    if (!element || phaseRef.current === 'visible') {
      return;
    }

    observerCleanupRef.current?.();
    observerCleanupRef.current = null;

    if (immediate) {
      phaseRef.current = 'visible';
      const activeAnimation = animationRef.current;
      animationRef.current = null;
      activeAnimation?.cancel();
      clearRevealStyles(element);
      return;
    }

    if (phaseRef.current === 'animating') {
      return;
    }

    phaseRef.current = 'animating';

    try {
      const animation = element.animate(
        [
          {
            opacity: 0,
            transform: `translate3d(0, ${safeYOffset}px, 0)`,
            filter: blur ? 'blur(8px)' : 'blur(0px)',
          },
          {
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
            filter: 'blur(0px)',
          },
        ],
        {
          duration: 780,
          delay: safeDelayMs,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        },
      );

      animationRef.current = animation;
      animation.addEventListener('finish', () => {
        if (animationRef.current !== animation) {
          return;
        }

        phaseRef.current = 'visible';
        animationRef.current = null;
        clearRevealStyles(element);
        animation.cancel();
      }, { once: true });
    } catch {
      phaseRef.current = 'pending';
      reveal(true);
    }
  }, [blur, safeDelayMs, safeYOffset]);

  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    if (prefersReducedMotion || phaseRef.current === 'visible') {
      reveal(true);
      return;
    }

    if (
      typeof IntersectionObserver === 'undefined'
      || typeof element.animate !== 'function'
    ) {
      reveal(true);
      return;
    }

    phaseRef.current = 'pending';
    element.style.opacity = '0';
    element.style.transform = `translate3d(0, ${safeYOffset}px, 0)`;
    element.style.filter = blur ? 'blur(8px)' : 'blur(0px)';

    observerCleanupRef.current = observeReveal(element, () => reveal(false));
    if (!observerCleanupRef.current) {
      reveal(true);
    }

    return () => {
      observerCleanupRef.current?.();
      observerCleanupRef.current = null;

      const activeAnimation = animationRef.current;
      animationRef.current = null;
      activeAnimation?.cancel();
      clearRevealStyles(element);

      if (phaseRef.current === 'animating') {
        phaseRef.current = 'pending';
      }
    };
  }, [blur, prefersReducedMotion, reveal, safeYOffset]);

  return (
    <div
      ref={elementRef}
      className={className}
      onFocusCapture={() => reveal(true)}
    >
      {children}
    </div>
  );
}
