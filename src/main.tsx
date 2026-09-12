import {StrictMode, Suspense, lazy, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';
import './styles/article-reader.css';
import './styles/work-studies.css';
import Lenis from 'lenis';
import { installSmoothScrolling } from './utils/smoothScroll';
import { startPortfolioAnalytics, startPortfolioCtaTracking } from './analytics/portfolioAnalytics';
import { findWorkStudy } from './content/workStudies';

const WorkStudyPage = lazy(() => import('./pages/WorkStudyPage'));

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
  useEffect(() => installSmoothScrolling(window, () => new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  })), []);

  // Case-study links use native document navigation. This keeps history, deep links,
  // no-JavaScript reading, and the existing portfolio router independent.
  const study = findWorkStudy(window.location.pathname);
  return study
    ? <Suspense fallback={null}><WorkStudyPage study={study} /></Suspense>
    : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
    <Analytics />
    <SpeedInsights />
  </StrictMode>,
);
