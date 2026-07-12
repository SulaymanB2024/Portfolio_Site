import {StrictMode, useEffect, useLayoutEffect} from 'react';
import {createRoot, type Root as ReactRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import Lenis from 'lenis';

document.documentElement.classList.add('js');

type PortfolioWindow = Window & {
  __portfolioReactRoot?: ReactRoot;
};

function Root() {
  useLayoutEffect(() => {
    document.documentElement.classList.add('app-mounted');
    return () => document.documentElement.classList.remove('app-mounted');
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
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

const portfolioWindow = window as PortfolioWindow;
const reactRoot = portfolioWindow.__portfolioReactRoot ?? createRoot(document.getElementById('root')!);
portfolioWindow.__portfolioReactRoot = reactRoot;

reactRoot.render(
  <StrictMode>
    <Root />
    <Analytics />
  </StrictMode>,
);
