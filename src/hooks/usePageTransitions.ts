import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

type NormalizePath = (path: string) => string;

type UsePageTransitionsOptions = {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  normalizePath?: NormalizePath;
  preloadPath?: (path: string) => Promise<void> | void;
  contactHash?: string;
  hashFocusSelector?: string;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

type LenisWindow = Window & {
  lenis?: {
    resize?: () => void;
    scrollTo: (
      target: string | number,
      options?: {
        duration?: number;
        ease?: (t: number) => number;
        immediate?: boolean;
      },
    ) => void;
  };
};

const identityNormalize: NormalizePath = (path) => path;

function reducedMotionRequested() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function focusElement(selector?: string) {
  if (!selector) return;
  document.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
}

function scrollToHashTarget(hash: string, contactHash?: string, hashFocusSelector?: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const reducedMotion = reducedMotionRequested();
  const lenis = (window as unknown as LenisWindow).lenis;

  if (lenis && !reducedMotion) {
    lenis.resize?.();
    lenis.scrollTo(hash, {
      duration: 0.55,
      ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  if (contactHash && hash === contactHash) {
    window.requestAnimationFrame(() => focusElement(hashFocusSelector));
  }
}

function getCurrentCanonicalPath(normalizePath: NormalizePath) {
  const canonicalPath = normalizePath(window.location.pathname);
  if (canonicalPath !== window.location.pathname) {
    window.history.replaceState({}, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
  }
  return `${canonicalPath}${window.location.search}${window.location.hash}`;
}

function commitNavigation(callback: () => void) {
  flushSync(callback);
}

export function usePageTransitions({
  currentPath,
  setCurrentPath,
  normalizePath = identityNormalize,
  preloadPath,
  contactHash = '#contact',
  hashFocusSelector = '#contact-name',
}: UsePageTransitionsOptions) {
  const isPopStateRef = useRef(false);
  const preloadedPathsRef = useRef(new Set<string>());

  useEffect(() => {
    const preloadInBackground = (targetPath?: string) => {
      if (!targetPath || !preloadPath || preloadedPathsRef.current.has(targetPath)) return;
      preloadedPathsRef.current.add(targetPath);
      void Promise.resolve(preloadPath(targetPath)).catch(() => {
        preloadedPathsRef.current.delete(targetPath);
      });
    };

    const executeTransition = (navigateCallback: () => void, targetPath?: string) => {
      preloadInBackground(targetPath);

      const viewTransitionDocument = document as ViewTransitionDocument;
      if (reducedMotionRequested() || !viewTransitionDocument.startViewTransition) {
        commitNavigation(navigateCallback);
        return;
      }

      let committed = false;
      try {
        viewTransitionDocument.startViewTransition(() => {
          committed = true;
          commitNavigation(navigateCallback);
        });
      } catch {
        if (!committed) {
          commitNavigation(navigateCallback);
        }
      }
    };

    const handleLinkIntent = (event: Event) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a');
      const href = link?.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || /\.[a-z0-9]{2,8}$/i.test(url.pathname)) return;
      preloadInBackground(`${normalizePath(url.pathname)}${url.search}${url.hash}`);
    };

    const handlePopState = () => {
      isPopStateRef.current = true;
      const targetPath = getCurrentCanonicalPath(normalizePath);
      void executeTransition(() => setCurrentPath(targetPath), targetPath);
    };

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest<HTMLAnchorElement>('a');

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
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || /\.[a-z0-9]{2,8}$/i.test(url.pathname)) return;

      const canonicalPath = normalizePath(url.pathname);
      const currentCanonicalPath = normalizePath(window.location.pathname);

      if (canonicalPath === currentCanonicalPath && url.hash) {
        event.preventDefault();
        const fullPath = `${canonicalPath}${url.search}${url.hash}`;
        if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== fullPath) {
          window.history.pushState({}, '', fullPath);
          setCurrentPath(fullPath);
        }
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
    document.addEventListener('pointerover', handleLinkIntent);
    document.addEventListener('focusin', handleLinkIntent);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
      document.removeEventListener('pointerover', handleLinkIntent);
      document.removeEventListener('focusin', handleLinkIntent);
    };
  }, [contactHash, hashFocusSelector, normalizePath, preloadPath, setCurrentPath]);

  useEffect(() => {
    const lenis = (window as unknown as LenisWindow).lenis;
    const hash = window.location.hash;

    if (hash) {
      const firstFrame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToHashTarget(hash, contactHash, hashFocusSelector));
      });
      return () => window.cancelAnimationFrame(firstFrame);
    }

    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    lenis?.scrollTo(0, { immediate: true });
  }, [currentPath, contactHash, hashFocusSelector]);
}
