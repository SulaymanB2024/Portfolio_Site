import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';
import './styles/article-reader.css';
import Lenis from 'lenis';
import { startPortfolioAnalytics, startPortfolioCtaTracking } from './analytics/portfolioAnalytics';

document.documentElement.classList.add('js');
startPortfolioAnalytics();
startPortfolioCtaTracking();

const editorialFontStylesheet = document.getElementById('editorial-fonts') as HTMLLinkElement | null;
if (editorialFontStylesheet) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      editorialFontStylesheet.rel = 'stylesheet';
    });
  });
}

function Root() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersNativeScrolling = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    if (prefersReducedMotion || prefersNativeScrolling) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    (window as any).lenis = lenis;
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
    <Analytics />
    <SpeedInsights />
  </StrictMode>,
);
