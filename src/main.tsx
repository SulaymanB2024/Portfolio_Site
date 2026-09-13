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

const WorkPage = lazy(() => import('./pages/WorkPage'));
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

  // Work documents are complete in the initial HTML. Keep them document-routed so
  // crawlers, no-JavaScript readers, and hydrated visitors all receive one source.
  const study = findWorkStudy(window.location.pathname);
  if (study) {
    return <Suspense fallback={null}><WorkStudyPage study={study} /></Suspense>;
  }
  if (window.location.pathname.replace(/\/+$/, '') === '/work') {
    return <Suspense fallback={null}><WorkPage /></Suspense>;
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
    <Analytics />
    <SpeedInsights />
  </StrictMode>,
);
