import { useEffect, useRef } from 'react';

type NormalizePath = (path: string) => string;

type UsePageTransitionsOptions = {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  normalizePath?: NormalizePath;
  preloadPath?: (path: string) => Promise<void> | void;
  contactHash?: string;
  shutterCoverMs?: number;
  revealDelayMs?: number;
  hashFocusSelector?: string;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

type LenisWindow = Window & {
  lenis?: {
    scrollTo: (
      target: string | number,
      options?: {
        duration?: number;
        ease?: (t: number) => number;
        immediate?: boolean;
      },
    ) => void;
  };
  triggerShutter?: (active: boolean) => void;
};

const identityNormalize: NormalizePath = (path) => path;

function focusElement(selector?: string) {
  if (!selector) return;
  document.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
}

function scrollToHashTarget(hash: string, contactHash?: string, hashFocusSelector?: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  const lenis = (window as unknown as LenisWindow).lenis;
  if (lenis) {
    if (typeof (lenis as any).resize === 'function') {
      (lenis as any).resize();
    }
    lenis.scrollTo(hash, {
      duration: 1.2,
      ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }

  if (contactHash && hash === contactHash) {
    window.setTimeout(() => focusElement(hashFocusSelector), 450);
  }
}

function getCurrentCanonicalPath(normalizePath: NormalizePath) {
  const canonicalPath = normalizePath(window.location.pathname);
  if (canonicalPath !== window.location.pathname) {
    window.history.replaceState({}, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
  }
  return `${canonicalPath}${window.location.search}${window.location.hash}`;
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

export function usePageTransitions({
  currentPath,
  setCurrentPath,
  normalizePath = identityNormalize,
  preloadPath,
  contactHash = '#contact',
  shutterCoverMs = 800,
  revealDelayMs = 90,
  hashFocusSelector = '#contact-name',
}: UsePageTransitionsOptions) {
  const isPopStateRef = useRef(false);

  useEffect(() => {
    const executeTransition = async (navigateCallback: () => void, targetPath?: string) => {
      const triggerShutter = (window as unknown as LenisWindow).triggerShutter;
      const viewTransitionDocument = document as ViewTransitionDocument;
      const unlockScroll = () => {
        document.documentElement.classList.remove('page-transition-lock');
      };
      const reveal = async () => {
        await waitForNextPaint();
        if (revealDelayMs > 0) {
          await wait(revealDelayMs);
        }
        triggerShutter?.(false);
        unlockScroll();
      };

      document.documentElement.classList.add('page-transition-lock');

      if (triggerShutter) {
        triggerShutter(true);

        try {
          await Promise.all([
            wait(shutterCoverMs),
            targetPath ? Promise.resolve(preloadPath?.(targetPath)) : Promise.resolve(),
          ]);

          if (viewTransitionDocument.startViewTransition) {
            const transition = viewTransitionDocument.startViewTransition(() => {
              navigateCallback();
            });

            transition.ready
              .then(reveal)
              .catch(reveal);
          } else {
            navigateCallback();
            void reveal();
          }
        } catch {
          navigateCallback();
          void reveal();
        }
      } else if (viewTransitionDocument.startViewTransition) {
        try {
          if (targetPath) {
            await Promise.resolve(preloadPath?.(targetPath));
          }
        } finally {
          viewTransitionDocument.startViewTransition(navigateCallback);
          unlockScroll();
        }
      } else {
        try {
          if (targetPath) {
            await Promise.resolve(preloadPath?.(targetPath));
          }
        } finally {
          navigateCallback();
          unlockScroll();
        }
      }
    };

    const handlePopState = () => {
      isPopStateRef.current = true;
      const targetPath = getCurrentCanonicalPath(normalizePath);
      void executeTransition(() => {
        setCurrentPath(targetPath);
      }, targetPath);
    };

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (
        !link ||
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const canonicalPath = normalizePath(url.pathname);
      const currentCanonicalPath = normalizePath(window.location.pathname);

      if (canonicalPath === currentCanonicalPath && url.hash) {
        event.preventDefault();
        scrollToHashTarget(url.hash, contactHash, hashFocusSelector);
        return;
      }

      event.preventDefault();

      const fullPath = `${canonicalPath}${url.search}${url.hash}`;
      isPopStateRef.current = false;
      void executeTransition(() => {
        window.history.pushState({}, '', fullPath);
        setCurrentPath(fullPath);
      }, fullPath);
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
  }, [contactHash, hashFocusSelector, normalizePath, preloadPath, revealDelayMs, setCurrentPath, shutterCoverMs]);

  useEffect(() => {
    const lenis = (window as unknown as LenisWindow).lenis;
    const hash = window.location.hash;

    if (hash) {
      const performScroll = () => {
        if (document.documentElement.classList.contains('page-transition-lock')) {
          requestAnimationFrame(performScroll);
        } else {
          scrollToHashTarget(hash, contactHash, hashFocusSelector);
        }
      };

      if (hash === contactHash) {
        window.setTimeout(() => {
          scrollToHashTarget(hash, contactHash, hashFocusSelector);
        }, 1400);
      }

      performScroll();
    } else {
      if (isPopStateRef.current) {
        isPopStateRef.current = false;
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
        lenis?.scrollTo(0, { immediate: true });
      }
    }
  }, [currentPath, contactHash, hashFocusSelector]);
}
