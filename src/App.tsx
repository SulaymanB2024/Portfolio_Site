import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState, lazy, Suspense, type CSSProperties } from 'react';
import { StaggeredText } from './components/StaggeredText';
import { InkTrails } from './components/InkTrails';
import { RomanTogaReveal } from './components/RomanTogaReveal';
import { ScrambleText } from './components/ScrambleText';
import { ScrollReveal } from './components/ScrollReveal';
import { ScrollProgress } from './components/ScrollProgress';
import { MagneticButton } from './components/MagneticButton';
import { InternalHeader } from './components/InternalHeader';
import { InternalFooter } from './components/InternalFooter';
import { KineticTypography } from './components/KineticTypography';
import { usePageTransitions } from './hooks/usePageTransitions';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useRouteBodyTheme } from './hooks/useRouteBodyTheme';
import { getCanonicalRoutes, getRouteTone, getSeoRoute, normalizePath } from './seo/routes';
import { navItemId, navLabel, primaryNav, utilityNav } from './content/siteNavigation';
import { TEXAS_TOLL_ARTICLE_SLUG } from './content/texasTollRoadArticleMeta';
import { formatIsoDate, PROFILE_FACTS } from './content/profileFacts';
import { useSEO } from './utils/seo';
import './styles/page-transitions.css';
import { TextMarquee } from './components/TextMarquee';
import { AuditIntakeForm } from './components/AuditIntakeForm';
import { WireframeGrid } from './components/WireframeGrid';
import NotFoundPage from './pages/NotFoundPage';

const loadAtlasPage = () => import('./pages/AtlasPage');
const loadAtlasCelestialParallaxPage = () => import('./pages/AtlasCelestialParallaxPage');
const loadMethodPage = () => import('./pages/VoidAgencyMethodPage');
const loadAboutPage = () => import('./pages/AboutPage');
const loadResumePage = () => import('./pages/ResumePage');
const loadAiInformationPage = () => import('./pages/AiInformationPage');
const loadResearchPage = () => import('./pages/ResearchPage');
const loadMarketsPage = () => import('./pages/MarketsPage');
const loadMarketArticlePage = () => import('./pages/MarketArticlePage');
const loadViralBenchArticlePage = () => import('./pages/ViralBenchArticlePage');
const loadTexasTollRoadArticlePage = () => import('./pages/TexasTollRoadArticlePage');
const loadSimplePage = () => import('./pages/SimplePage');
const loadWorkPage = () => import('./pages/WorkPage');
const loadContactPage = () => import('./pages/ContactPage');
const loadAtlasSampleCrawlPage = () => import('./pages/AtlasSampleCrawlPage');
const loadTechnicalSeoCaseStudyPage = () => import('./pages/TechnicalSeoCaseStudyPage');
const loadAustinTechnicalSeoPage = () => import('./pages/AustinTechnicalSeoPage');
const loadVoidAgencyPage = () => import('./pages/VoidAgencyPage');

const AtlasPage = lazy(loadAtlasPage);
const AtlasCelestialParallaxPage = lazy(loadAtlasCelestialParallaxPage);
const VoidAgencyMethodPage = lazy(loadMethodPage);
const AboutPage = lazy(loadAboutPage);
const ResumePage = lazy(loadResumePage);
const AiInformationPage = lazy(loadAiInformationPage);
const ResearchPage = lazy(loadResearchPage);
const MarketsPage = lazy(loadMarketsPage);
const MarketArticlePage = lazy(loadMarketArticlePage);
const ViralBenchArticlePage = lazy(loadViralBenchArticlePage);
const TexasTollRoadArticlePage = lazy(loadTexasTollRoadArticlePage);
const SimplePage = lazy(loadSimplePage);
const WorkPage = lazy(loadWorkPage);
const ContactPage = lazy(loadContactPage);
const AtlasSampleCrawlPage = lazy(loadAtlasSampleCrawlPage);
const TechnicalSeoCaseStudyPage = lazy(loadTechnicalSeoCaseStudyPage);
const AustinTechnicalSeoPage = lazy(loadAustinTechnicalSeoPage);
const VoidAgencyPage = lazy(loadVoidAgencyPage);
const LocalTime = lazy(() => import('./components/LocalTime').then(m => ({ default: m.LocalTime })));
const FlowField = lazy(() => import('./components/FlowField').then(m => ({ default: m.FlowField })));
const CandlestickChart = lazy(() => import('./components/CandlestickChart').then(m => ({ default: m.default })));
const AtmosphereCore = lazy(() => import('./components/AtmosphereCore').then(m => ({ default: m.default })));
const GenerativeMesh = lazy(() => import('./components/GenerativeMesh').then(m => ({ default: m.GenerativeMesh })));
const GeometricPattern = lazy(() => import('./components/GeometricPattern').then(m => ({ default: m.GeometricPattern })));
const FooterM = lazy(() => import('./components/FooterM').then(m => ({ default: m.FooterM })));

const CONTACT_HASH = '#contact';
const HOME_SEO = getSeoRoute('/')!;

const homeDisciplineItems = [
  {
    num: '01',
    title: 'Technical SEO',
    desc: 'Crawl architecture, indexability, internal links, page templates, metadata, structured data, and issue logic built for diagnosis.',
  },
  {
    num: '02',
    title: 'Search Visibility',
    desc: 'Crawler access, entity clarity, structured content, and pages that explain the work without forcing a reader to guess.',
  },
  {
    num: '03',
    title: 'Atlas / Crawl Evidence',
    desc: 'URL discovery, rendered HTML, canonical state, internal-link maps, structured-data checks, and report-ready audit notes.',
  },
  {
    num: '04',
    title: 'Markets Research',
    desc: 'Finance research, valuation assumptions, market structure, operating analysis, dashboards, and decision tools with inspectable assumptions.',
  },
];

const homeProofHighlights = PROFILE_FACTS.proofClaims.map((item) => ({
  ...item,
  displayDate: formatIsoDate(item.asOf),
}));

function isDarkRoute(path: string) {
  return getRouteTone(path) === 'dark';
}

async function preloadRoute(path: string) {
  const route = getSeoRoute(path);

  if (route?.path === '/atlas') {
    await loadAtlasPage();
  } else if (route?.path === '/atlas/celestial-parallax') {
    await loadAtlasCelestialParallaxPage();
  } else if (route?.path === '/method') {
    await loadMethodPage();
  } else if (route?.path === '/about') {
    await loadAboutPage();
  } else if (route?.path === '/simple') {
    await loadSimplePage();
  } else if (route?.path === '/work') {
    await loadWorkPage();
  } else if (route?.path === '/contact') {
    await loadContactPage();
  } else if (route?.path === '/atlas/sample-crawl') {
    await loadAtlasSampleCrawlPage();
  } else if (route?.path === '/case-studies/technical-seo-audit') {
    await loadTechnicalSeoCaseStudyPage();
  } else if (route?.path === '/austin-technical-seo') {
    await loadAustinTechnicalSeoPage();
  } else if (route?.path === '/void-agency') {
    await loadVoidAgencyPage();
  } else if (route?.path === '/resume') {
    await loadResumePage();
  } else if (route?.path === '/ai-information') {
    await loadAiInformationPage();
  } else if (route?.path === '/research') {
    await loadResearchPage();
  } else if (route?.path === '/markets') {
    await loadMarketsPage();
  } else if (route?.path === '/viralbench-codex-agent-harness') {
    await loadViralBenchArticlePage();
  } else if (route?.path === `/markets/${TEXAS_TOLL_ARTICLE_SLUG}`) {
    await loadTexasTollRoadArticlePage();
  } else if (route?.section === 'research-article') {
    await loadMarketArticlePage();
  }
}

function getCurrentCanonicalPath() {
  const canonicalPath = normalizePath(window.location.pathname);
  if (canonicalPath !== window.location.pathname) {
    window.history.replaceState({}, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
  }
  return `${canonicalPath}${window.location.search}${window.location.hash}`;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentCanonicalPath);

  usePageTransitions({
    currentPath,
    setCurrentPath,
    normalizePath,
    preloadPath: preloadRoute,
    contactHash: CONTACT_HASH,
    hashFocusSelector: '#contact-name',
  });

  useRouteBodyTheme({ currentPath, isDarkRoute });

  const route = getSeoRoute(currentPath);
  let page;

  if (route?.path === '/atlas') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <AtlasPage />
      </Suspense>
    );
  } else if (route?.path === '/atlas/celestial-parallax') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <AtlasCelestialParallaxPage />
      </Suspense>
    );
  } else if (route?.path === '/method') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <VoidAgencyMethodPage />
      </Suspense>
    );
  } else if (route?.path === '/about') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <AboutPage />
      </Suspense>
    );
  } else if (route?.path === '/simple') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <SimplePage />
      </Suspense>
    );
  } else if (route?.path === '/work') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <WorkPage />
      </Suspense>
    );
  } else if (route?.path === '/contact') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <ContactPage />
      </Suspense>
    );
  } else if (route?.path === '/atlas/sample-crawl') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <AtlasSampleCrawlPage />
      </Suspense>
    );
  } else if (route?.path === '/case-studies/technical-seo-audit') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <TechnicalSeoCaseStudyPage />
      </Suspense>
    );
  } else if (route?.path === '/austin-technical-seo') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <AustinTechnicalSeoPage />
      </Suspense>
    );
  } else if (route?.path === '/void-agency') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <VoidAgencyPage />
      </Suspense>
    );
  } else if (route?.path === '/resume') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <ResumePage />
      </Suspense>
    );
  } else if (route?.path === '/ai-information') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <AiInformationPage />
      </Suspense>
    );
  } else if (route?.path === '/research') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <ResearchPage />
      </Suspense>
    );
  } else if (route?.path === '/sitemap') {
    page = <SitemapPage />;
  } else if (route?.path === '/viralbench-codex-agent-harness') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <ViralBenchArticlePage />
      </Suspense>
    );
  } else if (route?.path === `/markets/${TEXAS_TOLL_ARTICLE_SLUG}`) {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <TexasTollRoadArticlePage />
      </Suspense>
    );
  } else if (route?.section === 'research-article') {
    const slug = route.path.split('/').at(-1) ?? '';
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <MarketArticlePage slug={slug} />
      </Suspense>
    );
  } else if (route?.path === '/markets') {
    page = (
      <Suspense fallback={<RouteFallback route={route} />}>
        <MarketsPage />
      </Suspense>
    );
  } else if (route?.path === '/') {
    page = <HomePage />;
  } else {
    page = <NotFoundPage />;
  }

  return page;
}

function SitemapPage() {
  const route = getSeoRoute('/sitemap')!;
  const routes = getCanonicalRoutes();

  useSEO(route);

  return (
    <main className="site-page site-page-light relative min-h-screen bg-canvas font-sans text-ink">
      <Suspense fallback={null}>
        <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-40" />
      </Suspense>
      <InternalHeader activePath="/sitemap" tone="light" />
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <header className="grid min-h-[52vh] content-end border-b border-ink/14 pb-12">
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink/58">
            Sulayman Bowles / Sitemap
          </p>
          <h1 className="mt-10 font-serif text-[3.5rem] md:text-[5.5rem] xl:text-[8rem] italic leading-[0.86] tracking-normal">
            HTML Sitemap
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/64">
            Plain links to every public page on sulayman-bowles.dev.
          </p>
        </header>

        <section className="py-10">
          <h2 className="mb-5 text-[10px] uppercase tracking-[0.28em] text-ink/48">Pages</h2>
          <ul className="grid gap-3">
            {routes.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="block border border-ink/14 px-5 py-4 transition-colors hover:bg-ink hover:text-canvas"
                >
                  <span className="block text-sm uppercase tracking-[0.18em]">{item.h1}</span>
                  <span className="mt-2 block text-sm leading-relaxed opacity-65">{item.description}</span>
                  <span className="mt-3 block text-[10px] uppercase tracking-[0.22em] opacity-60">{item.path}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <InternalFooter activePath="/sitemap" tone="light" />
      </div>
    </main>
  );
}

function RouteFallback({ route }: { route?: ReturnType<typeof getSeoRoute> }) {
  const dark = route ? isDarkRoute(route.path) : false;
  const heading = route?.h1 ?? HOME_SEO.h1;
  const description = route?.description ?? HOME_SEO.description;
  const summary = route?.staticSummary ?? HOME_SEO.staticSummary;
  const fallbackLinks = [
    ['Home', '/'],
    ['Selected Work', '/work'],
    ['Atlas', '/atlas'],
    ['Method', '/method'],
    ['Research', '/research'],
    ['Contact', '/contact'],
  ];

  return (
    <main
      aria-busy="true"
      className={`flex min-h-screen items-center justify-center px-6 font-sans ${
        dark ? 'bg-ink text-canvas' : 'bg-canvas text-ink'
      }`}
    >
      <div className="w-full max-w-[1480px] border-t border-current/20 pt-6">
        <div className="text-[10px] uppercase tracking-[0.32em] opacity-60">Route overview</div>
        <h1 className="mt-6 font-serif text-[3.4rem] md:text-[5.75rem] xl:text-[8rem] italic leading-[0.86] tracking-normal">
          {heading}
        </h1>
        <p className="mt-8 max-w-3xl text-base leading-relaxed opacity-70">{description}</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed opacity-58">{summary}</p>
        <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.22em] opacity-70" aria-label="Fallback route links">
          {fallbackLinks.map(([label, href]) => (
            <a key={href} href={href} className="underline decoration-current/20 underline-offset-4 transition-opacity hover:opacity-100">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}

let initialLoadComplete = false;

function HomePage() {
  useSEO(HOME_SEO);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const [counter, setCounter] = useState(initialLoadComplete ? 100 : 0);
  const [isLoaded, setIsLoaded] = useState(initialLoadComplete);
  const [homeHeaderTone, setHomeHeaderTone] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (initialLoadComplete) return;

    let frameId = 0;
    let finishTimeoutId = 0;
    const startedAt = window.performance.now();
    const duration = prefersReducedMotion ? 180 : 900;
    const holdDuration = prefersReducedMotion ? 40 : 100;

    const animateCounter = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2.4);

      setCounter(Math.min(100, Math.round(easedProgress * 100)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateCounter);
        return;
      }

      finishTimeoutId = window.setTimeout(() => {
        initialLoadComplete = true;
        setIsLoaded(true);
      }, holdDuration);
    };

    frameId = window.requestAnimationFrame(animateCounter);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(finishTimeoutId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      setHomeHeaderTone('light');
      return;
    }

    let frameId = 0;
    const darkBackgroundClasses = new Set(['bg-ink', 'site-page-dark']);
    const toneIgnoreSelector = '[data-header-tone-ignore="true"]';

    const isDarkBackground = (background: string) => {
      const rgbMatch = background.match(/rgba?\(([^)]+)\)/);
      if (rgbMatch) {
        const [r = 0, g = 0, b = 0, alpha = 1] = rgbMatch[1]
          .split(',')
          .map((value) => Number.parseFloat(value.trim()));

        if (!alpha) {
          return false;
        }

        return 0.2126 * r + 0.7152 * g + 0.0722 * b < 40;
      }

      const srgbMatch = background.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
      if (srgbMatch) {
        const [, r, g, b, alpha = '1'] = srgbMatch;
        if (Number.parseFloat(alpha) === 0) {
          return false;
        }

        return (
          0.2126 * Number.parseFloat(r) +
            0.7152 * Number.parseFloat(g) +
            0.0722 * Number.parseFloat(b) <
          0.16
        );
      }

      return false;
    };

    const elementNeedsDarkHeader = (element: Element) => {
      const classNames = (element.getAttribute('class') ?? '').split(/\s+/);
      return (
        classNames.some((className) => darkBackgroundClasses.has(className)) ||
        isDarkBackground(window.getComputedStyle(element).backgroundColor)
      );
    };

    const updateHeaderTone = () => {
      frameId = 0;

      const header = document.querySelector('header');
      const headerRect = header?.getBoundingClientRect();
      const probeX = Math.round(window.innerWidth / 2);
      const probeY = Math.min(
        Math.max(Math.round((headerRect?.bottom ?? 96) + 10), 72),
        window.innerHeight - 1,
      );
      const toneElements = document
        .elementsFromPoint(probeX, probeY)
        .filter((element) => !header?.contains(element) && !element.closest(toneIgnoreSelector));
      const nextTone = toneElements.some(elementNeedsDarkHeader)
        ? 'dark'
        : 'light';

      setHomeHeaderTone((currentTone) => (currentTone === nextTone ? currentTone : nextTone));
    };

    const scheduleHeaderToneUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateHeaderTone);
    };

    scheduleHeaderToneUpdate();
    const delayedChecks = [
      window.setTimeout(scheduleHeaderToneUpdate, 80),
      window.setTimeout(scheduleHeaderToneUpdate, 300),
      window.setTimeout(scheduleHeaderToneUpdate, 800),
    ];
    window.addEventListener('scroll', scheduleHeaderToneUpdate, { passive: true });
    window.addEventListener('resize', scheduleHeaderToneUpdate);
    window.addEventListener('hashchange', scheduleHeaderToneUpdate);
    window.addEventListener('popstate', scheduleHeaderToneUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      delayedChecks.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener('scroll', scheduleHeaderToneUpdate);
      window.removeEventListener('resize', scheduleHeaderToneUpdate);
      window.removeEventListener('hashchange', scheduleHeaderToneUpdate);
      window.removeEventListener('popstate', scheduleHeaderToneUpdate);
    };
  }, [isLoaded]);

  const subY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="relative min-h-screen bg-canvas text-ink font-sans overflow-x-hidden selection:bg-ink selection:text-canvas" ref={containerRef}>
      {!prefersReducedMotion && <InkTrails />}
        
      <InternalHeader activePath="/" tone={homeHeaderTone} variant="home" />

      {/* Grid Crosshairs */}
      <div className="fixed inset-0 pointer-events-none z-40 hidden md:block mix-blend-difference text-canvas select-none">
        {/* Top Left */}
        <div className="absolute top-12 left-16 w-4 h-[1px] bg-canvas opacity-30" />
        <div className="absolute top-8 left-12 w-[1px] h-4 bg-canvas opacity-30" />
        
        {/* Top Right */}
        <div className="absolute top-12 right-16 w-4 h-[1px] bg-canvas opacity-30" />
        <div className="absolute top-8 right-12 w-[1px] h-4 bg-canvas opacity-30" />
        
        {/* Bottom Left */}
        <div className="absolute bottom-12 left-16 w-4 h-[1px] bg-canvas opacity-30" />
        <div className="absolute bottom-8 left-12 w-[1px] h-4 bg-canvas opacity-30" />
        
        {/* Bottom Right */}
        <div className="absolute bottom-12 right-16 w-4 h-[1px] bg-canvas opacity-30" />
        <div className="absolute bottom-8 right-12 w-[1px] h-4 bg-canvas opacity-30" />
      </div>

      {/* Intro Preloader Mask */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center p-8 text-canvas"
            data-header-tone-ignore="true"
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.35, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="w-full flex justify-between absolute pt-8 px-8 md:px-16 normal-case font-sans uppercase tracking-[0.2em] text-xs opacity-60 justify-self-start self-start top-0">
               <span>Building Evidence</span>
               <span>{counter}%</span>
            </div>
            
            <motion.div
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.4 }}
               className="font-serif text-6xl md:text-9xl font-light tracking-normal flex items-baseline"
            >
              <span className="italic">{counter}</span>
              <span className="text-xl md:text-2xl ml-2 font-sans tracking-widest">%</span>
            </motion.div>

            {/* Progress bar */}
            <div className="absolute bottom-16 left-8 right-8 md:left-16 md:right-16 h-[1px] bg-canvas/20">
              <motion.div 
                className="h-full bg-canvas"
                style={{ width: `${counter}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="w-full" id="top">
        {/* HERO SECTION - Very Editorial */}
        <section className="relative w-full h-screen flex flex-col justify-end pb-12 px-4 md:px-16 pt-32 overflow-hidden">
          {/* Background Motion */}
          {!prefersReducedMotion && <Suspense fallback={null}>
            <FlowField className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none mix-blend-overlay" density={25} />
          </Suspense>}
          
          {/* Faint sample reveal */}
          <motion.div 
            style={{ opacity: titleOpacity }}
            className="pointer-events-none absolute inset-0 z-[1]"
          >
            {isLoaded && (
              <RomanTogaReveal
                fit="cover"
                focus="large-figure"
                restOpacity={0.14}
                revealOpacity={0.82}
                className="h-full w-full"
              />
            )}
           </motion.div>

           <motion.div 
             style={{ y: subY }}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
             transition={{ duration: 0.8, delay: isLoaded ? 0.2 : 0 }}
             className="relative z-10 ml-auto w-full max-w-[28rem] pb-8 md:pb-12 md:text-right"
           >
	             <div>
	               <h1 className="font-serif text-5xl font-light leading-none tracking-normal text-ink md:text-7xl">
	                 Sulayman Bowles
	               </h1>
	               <p className="mt-5 font-sans text-sm leading-relaxed tracking-normal text-ink/64 md:text-base">
		                 UT Austin McCombs student building Atlas and running Void Agency across technical SEO, product, and finance research.
	               </p>
	               <div className="mt-7 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.2em] md:justify-end">
	                 <a href="/atlas" className="border-b border-ink/30 pb-1 text-ink/70 hover:border-ink hover:text-ink">Open Atlas</a>
	                 <a href="/contact" className="border-b border-ink/30 pb-1 text-ink/70 hover:border-ink hover:text-ink">Request an audit</a>
	                 <a href="/resume" className="border-b border-ink/30 pb-1 text-ink/70 hover:border-ink hover:text-ink">Resume</a>
	               </div>
	             </div>
           </motion.div>
        </section>

        <section className="relative w-full border-y border-ink/12 bg-canvas px-4 py-14 text-ink md:px-16 md:py-20" aria-labelledby="home-proof-heading">
          <div className="mx-auto w-full max-w-[1800px]">
            <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">Proof snapshot</p>
                <h2 id="home-proof-heading" className="mt-4 font-serif text-4xl italic leading-none md:text-6xl">Current work in 30 seconds.</h2>
              </div>
              <a href="/work" className="w-fit border-b border-ink/28 pb-1 text-[10px] uppercase tracking-[0.2em] text-ink/68 hover:border-ink hover:text-ink">All selected work</a>
            </div>
            <div className="grid gap-px border border-ink/14 bg-ink/14 sm:grid-cols-2 lg:grid-cols-3">
              {homeProofHighlights.map((item, index) => (
                <a key={item.label} href={item.publicSource} className="group grid min-h-[190px] content-between bg-canvas p-5 transition-colors hover:bg-ink hover:text-canvas">
                  <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-current/60">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <time dateTime={item.asOf}>As of {item.displayDate}</time>
                  </div>
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.22em] text-current">{item.label}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-current/70">{item.claim}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* INTRODUCTION - High contrast split */}
        <section className="relative w-full border-y border-ink/10 bg-canvas px-4 py-24 text-ink md:px-16 md:py-36">
          <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-14 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7 md:col-start-2">
              <ScrollReveal blur={false}>
                <p className="mb-7 font-sans text-[10px] uppercase tracking-[0.3em] text-ink/60">Working method</p>
              </ScrollReveal>
              <StaggeredText
                text="Evidence systems for messy surfaces."
                delay={0.1}
                className="max-w-[11ch] font-serif text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl md:text-7xl lg:text-[6.6rem]"
              />
            </div>
            <div className="flex flex-col md:col-span-4 md:col-start-9">
              <ScrollReveal delay={0.25} yOffset={14} blur={false} className="md:mt-10">
                <p className="max-w-md font-sans text-sm leading-relaxed tracking-normal text-ink/64 md:text-base">
                  The work starts where the source material is still rough: crawl data, page templates, search behavior, market assumptions, and product logic. I turn that into systems people can inspect, question, and ship from.
                </p>
              </ScrollReveal>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="mt-14 h-[1px] w-full origin-left transform bg-ink/20"
              />
              <ScrollReveal delay={0.45} yOffset={15} blur={false} className="grid gap-5 pt-8 font-sans text-[10px] uppercase tracking-[0.22em] text-ink/56">
                <div className="grid grid-cols-[6.5rem_1fr] gap-5 border-b border-ink/10 pb-5">
                  <span className="text-ink/60">Collect</span>
                  <span className="text-ink">Crawls, templates, queries, assumptions</span>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-5 border-b border-ink/10 pb-5">
                  <span className="text-ink/60">Structure</span>
                  <span className="text-ink">Evidence, states, constraints, gaps</span>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-5">
                  <span className="text-ink/60">Ship</span>
                  <span className="text-ink">Fixes, reports, dashboards, pages</span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* TEXT MARQUEE */}
        <TextMarquee />

         {/* SELECTED WORKS - EDITORIAL GRID */}
        <section id="selected-works" className="w-full py-32 bg-ink text-canvas selection:bg-canvas selection:text-ink relative flex flex-col border-t border-canvas/10">
           <div className="px-4 md:px-16 flex items-center justify-between mb-24 md:mb-48 pt-16 max-w-[1800px] mx-auto w-full">
             <ScrollReveal blur={false}>
               <h3 className="font-sans tracking-[0.3em] text-xs md:text-sm uppercase font-medium text-canvas/50">Selected Work</h3>
             </ScrollReveal>
             <ScrollReveal blur={false} delay={0.2}>
               <span className="font-serif italic text-xl text-canvas/60">2024 — 2026</span>
             </ScrollReveal>
           </div>            {/* Project 01 */}
           <div className="order-1 max-w-[1800px] mx-auto w-full px-4 md:px-16 mb-48 md:mb-64 relative pt-16">
             <div className="flex justify-between items-start w-full sticky top-32 z-20 px-0 font-sans uppercase tracking-widest text-canvas/50 pointer-events-none">
               <div className="flex flex-col gap-1 text-[10px]">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">PROJECT 01</span>
                  <span className="opacity-60">Technical SEO Audit Console</span>
               </div>
               <div className="hidden md:flex flex-col gap-1 text-[10px] text-right">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">PROJECT</span>
                  <span className="opacity-60"><ScrambleText text="Atlas SEO Audit Console" trigger="once" /></span>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 items-stretch pt-24">
               
               {/* Left Column Text */}
               <div className="md:col-span-4 flex flex-col pt-12 md:pt-0 md:pr-8 lg:pr-16 relative z-10 order-2 md:order-1 mt-12 md:mt-0">
                 
                 <div className="flex flex-col text-xs font-sans tracking-widest uppercase text-canvas/60 h-full justify-start">
                   <ScrollReveal><span className="text-canvas text-xl font-serif italic mb-6">( 01 )</span></ScrollReveal>
                   
                   <ScrollReveal delay={0.2} blur={false}>
                     <p className="leading-tight normal-case tracking-normal font-serif italic text-xl md:text-3xl lg:text-4xl text-canvas/90 max-w-sm mb-16 md:mb-0">
		                       A crawl system for indexation, internal links, canonicals, structured data, and raw/rendered HTML.
                     </p>
                   </ScrollReveal>
                   
                   <div className="flex-grow"></div>
                   
                   <ScrollReveal delay={0.6}>
                     <div className="flex flex-col border-t border-canvas/20 pt-4 text-[10px] uppercase font-sans tracking-widest text-canvas/60 gap-4 w-full md:max-w-xs">
                       <div className="flex justify-between">
                         <span className="opacity-60">Role</span>
                         <span className="text-canvas">Builder / Operator</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="opacity-60">Output</span>
                         <span className="text-canvas">Crawl Data, Issue Logic, Reports</span>
                       </div>
                     </div>
                   </ScrollReveal>
                 </div>
               </div>

               {/* Right Column Canvas */}
               <a href="/atlas" id="work-link-atlas" className="md:col-span-8 block overflow-hidden relative h-[60vh] md:h-[90vh] border border-canvas/20 order-1 md:order-2 origin-right group/atlas">
                 <div className="hidden md:block absolute left-0 top-0 w-[1px] h-full bg-canvas/20 z-10" />
                 
                 {/* Corner brackets */}
                 <div className="absolute top-4 left-4 text-canvas/50 text-[10px] pointer-events-none z-10">⌜</div>
                 <div className="absolute top-4 right-4 text-canvas/50 text-[10px] pointer-events-none z-10">⌝</div>
                 <div className="absolute bottom-4 left-4 text-canvas/50 text-[10px] pointer-events-none z-10">⌞</div>
                 <div className="absolute bottom-4 right-4 text-canvas/50 text-[10px] pointer-events-none z-10">⌟</div>

                 {!prefersReducedMotion && <Suspense fallback={null}>
                   <FlowField className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen" density={80} />
                 </Suspense>}
                 <div className="absolute left-6 bottom-6 z-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.28em] text-canvas/70 transition-colors group-hover/atlas:text-canvas">
                   <span className="h-8 w-8 rounded-full border border-canvas/30 transition-colors group-hover/atlas:bg-canvas group-hover/atlas:text-ink" />
                   <span>Atlas SEO Audit Console</span>
                   <span aria-hidden="true">↗</span>
                 </div>
                 
                 {/* Title overlapping canvas */}
                 <ScrollReveal delay={0.2} className="absolute bottom-8 right-4 pointer-events-none z-10 md:right-8 lg:right-10">
                   <h4 
	                      style={{ viewTransitionName: 'atlas-title' } as CSSProperties}
                      className="text-[4rem] md:text-[6rem] lg:text-[7rem] font-serif text-canvas leading-[0.85] font-light uppercase tracking-normal text-right"
                   >
                     <span className="block"><ScrambleText text="AT" trigger="hover" /></span>
                     <span className="block italic"><ScrambleText text="LAS" trigger="hover" /></span>
                   </h4>
                 </ScrollReveal>
                 
                 {/* VIEW Button */}
               </a>
               
             </div>
            </div>
                    {/* PROJECT 03 - TEXAS TOLL-ROAD RESEARCH */}
         <div className="order-3 w-full relative py-20 bg-ink" id="systems">
            <div className="max-w-[1800px] mx-auto w-full px-4 md:px-16 mb-48 md:mb-64 relative pt-16">
             <div className="flex justify-between items-start w-full sticky top-32 z-20 px-0 font-sans uppercase tracking-widest text-canvas/50 pointer-events-none">
               <div className="flex flex-col gap-1 text-[10px]">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">PROJECT 03</span>
                  <span className="opacity-60">Infrastructure Ownership Research</span>
               </div>
               <div className="hidden md:flex flex-col gap-1 text-[10px] text-right">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">PUBLISHED RESEARCH</span>
                  <span className="opacity-60">Ownership, Operators, Economics</span>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 items-stretch pt-24 pb-48">
               
               {/* Left Column Canvas */}
               <a href="/markets/who-owns-texas-toll-roads" id="work-link-markets" className="md:col-span-8 overflow-hidden relative block h-[60vh] md:h-[90vh] border border-canvas/20 origin-left group">
                 <div className="hidden md:block absolute right-0 top-0 w-[1px] h-full bg-canvas/20 z-10" />
                 
                 {/* Corner markers */}
                 <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-canvas/50 pointer-events-none z-10 m-4" />
                 <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-canvas/50 pointer-events-none z-10 m-4" />

                 <Suspense fallback={null}>
                   <CandlestickChart className="absolute inset-0 w-full h-full transform transition-transform duration-[2000ms] group-hover:scale-105" />
                 </Suspense>
                 
                 {/* Title overlapping canvas */}
                 <ScrollReveal delay={0.2} className="absolute top-8 left-4 pointer-events-none z-10 text-canvas mix-blend-difference select-none md:left-8 lg:left-10">
                   <h4 className="text-[4.5rem] md:text-[6rem] lg:text-[7rem] font-serif leading-[0.85] font-light uppercase tracking-normal text-left">
                     <span className="block opacity-90"><ScrambleText text="TEXAS" trigger="hover" /></span>
                     <span className="block italic opacity-70"><ScrambleText text="TOLLS" trigger="hover" /></span>
                   </h4>
                 </ScrollReveal>
               </a>

               <div className="md:col-span-4 flex flex-col justify-between pt-12 md:pt-0">
                 <div className="flex flex-col text-xs font-sans tracking-widest uppercase text-canvas/60 h-full justify-start items-start md:items-end md:text-right">
                   <ScrollReveal><span className="text-canvas text-xl font-serif italic mb-6 block">( 03 )</span></ScrollReveal>
                   
                   <ScrollReveal delay={0.2} blur={false}>
                     <p className="leading-tight normal-case tracking-normal font-serif italic text-xl md:text-3xl lg:text-4xl text-canvas/90 max-w-sm mb-16 md:mb-0">
                        A source-led map of who owns Texas toll roads, who controls revenue, who gets paid first, and how finite concessions can be valued.
                     </p>
                   </ScrollReveal>
                   
                   <div className="flex-grow"></div>
                   
                   <ScrollReveal delay={0.4} className="w-full">
                     <div className="flex flex-col md:items-end border-t border-canvas/20 pt-4 text-[10px] uppercase font-sans tracking-widest text-canvas/60 gap-4 w-full md:ml-auto md:max-w-xs">
                        <div className="flex justify-between w-full">
                          <span className="text-left opacity-60">Focus</span>
                          <span className="text-right text-canvas">Infrastructure Ownership</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-left opacity-60">Output</span>
                          <span className="text-right text-canvas">Source Ledger, Tables, DCF</span>
                        </div>
                     </div>
                   </ScrollReveal>
                 </div>
               </div>
               
             </div>
           </div>
         </div>
           
           {/* Project 02 - Void */}
           <a href="/method" id="work-link-void" className="order-2 w-full mt-32 md:mt-64 pt-32 pb-48 relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center border-t border-b border-canvas/10 my-32 bg-ink overflow-hidden group">
              {!prefersReducedMotion && <Suspense fallback={null}><GeometricPattern /></Suspense>}
              <div className="relative z-10 flex flex-col items-center">
                <ScrollReveal>
                  <span className="text-canvas font-serif italic text-2xl md:text-4xl mb-8 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">( 02 )</span>
                </ScrollReveal>
                <ScrollReveal delay={0.2} blur={false}>
                  <h4 
	                    style={{ viewTransitionName: 'void-title' } as CSSProperties}
                    className="text-[5rem] md:text-[8rem] lg:text-[10rem] leading-none font-serif tracking-normal uppercase text-canvas pb-8 opacity-90 transition-opacity duration-1000"
                  >
                    <ScrambleText text="VOID" trigger="hover" />
                  </h4>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
	                  <p className="font-sans text-xs uppercase tracking-widest max-w-sm text-center text-canvas/50 group-hover:text-canvas transition-colors duration-1000">Void Agency is the service branch of my technical SEO, crawlability, structured content, analytics, and search visibility work.</p>
                </ScrollReveal>
                <ScrollReveal delay={0.6}>
                  <MagneticButton className="mt-16">
                    <span className="inline-block text-canvas border border-canvas/20 rounded-full px-8 py-4 uppercase font-sans text-xs tracking-widest group-hover:bg-canvas group-hover:text-ink transition-colors backdrop-blur-sm">Void Agency Technical SEO Method</span>
                  </MagneticButton>
                </ScrollReveal>
              </div>
           </a>
        </section>

        {/* EXPERTISE SECTION */}
        <section className="py-32 md:py-48 px-4 md:px-16 bg-canvas text-ink border-t border-ink/10 relative">
           <div className="max-w-[1800px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
              <div className="md:col-span-3 sticky top-32">
                <ScrollReveal blur={false}>
                  <h3 className="font-sans text-xs uppercase tracking-[0.3em] mb-16 text-ink/50">Disciplines</h3>
                </ScrollReveal>
                <ScrollReveal delay={0.2} blur={false}>
                  <p className="font-serif italic text-2xl md:text-3xl text-ink max-w-sm leading-snug">
		                    Four lanes, one habit: inspect the source material before trusting the answer.
                  </p>
                </ScrollReveal>
              </div>
              <div className="md:col-span-9 flex flex-col w-full text-ink">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 md:gap-y-32 group">
                 {homeDisciplineItems.map((item, i) => (
                    <div key={item.num}>
                      <ScrollReveal delay={i % 2 === 0 ? 0.2 : 0.4} blur={false}>
                        <motion.div 
                          initial="initial"
                          whileHover="hover"
                          className="relative overflow-hidden flex flex-col border-t border-ink/20 pt-8 transition-opacity duration-500 hover:!opacity-100 group-hover:opacity-20 group/discipline min-h-[220px]" 
                          style={{ perspective: 1000 }}
                        >
                          <div className="relative z-10 flex flex-col pointer-events-none w-full">
                            <span className="font-sans text-[10px] tracking-widest uppercase opacity-60 mb-6 md:mb-8">{item.num}</span>
                            <h4 className="text-4xl md:text-4xl lg:text-5xl font-serif tracking-normal uppercase font-light leading-none mb-6 md:mb-8">
                              {item.title}
                            </h4>
                            <p className="font-sans text-sm tracking-normal leading-relaxed opacity-[0.62] max-w-[90%] md:max-w-[78%]">
                              {item.desc}
                            </p>
                          </div>

                          {/* Interactive background SVGs based on card number */}
                          {item.num === '01' && (
                            <svg
                              className="hidden md:block absolute right-0 bottom-0 w-44 h-44 pointer-events-none z-0 text-ink/10 group-hover/discipline:text-ink/30 transition-colors duration-500"
                              viewBox="0 0 200 200"
                              fill="none"
                            >
                              {/* Connection Paths */}
                              <motion.path
                                d="M 30 100 L 80 60"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { pathLength: 0.3 },
                                  hover: { pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } }
                                }}
                              />
                              <motion.path
                                d="M 30 100 L 80 140"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { pathLength: 0.3 },
                                  hover: { pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } }
                                }}
                              />
                              <motion.path
                                d="M 80 60 L 140 40"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { pathLength: 0.1 },
                                  hover: { pathLength: 1, transition: { duration: 1, ease: "easeInOut", delay: 0.1 } }
                                }}
                              />
                              <motion.path
                                d="M 80 60 L 140 80"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { pathLength: 0.1 },
                                  hover: { pathLength: 1, transition: { duration: 1, ease: "easeInOut", delay: 0.1 } }
                                }}
                              />
                              <motion.path
                                d="M 80 140 L 140 120"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { pathLength: 0.1 },
                                  hover: { pathLength: 1, transition: { duration: 1, ease: "easeInOut", delay: 0.1 } }
                                }}
                              />
                              <motion.path
                                d="M 80 140 L 140 160"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { pathLength: 0.1 },
                                  hover: { pathLength: 1, transition: { duration: 1, ease: "easeInOut", delay: 0.1 } }
                                }}
                              />

                              {/* Root Node */}
                              <motion.circle
                                cx="30"
                                cy="100"
                                r="6"
                                className="fill-canvas stroke-ink/30"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { scale: 1 },
                                  hover: { scale: 1.25, transition: { duration: 0.4 } }
                                }}
                              />

                              {/* Mid Nodes */}
                              <motion.circle
                                cx="80"
                                cy="60"
                                r="5"
                                className="fill-canvas stroke-ink/30"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { scale: 1 },
                                  hover: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 2, delay: 0.1 } }
                                }}
                              />
                              <motion.circle
                                cx="80"
                                cy="140"
                                r="5"
                                className="fill-canvas stroke-ink/30"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { scale: 1 },
                                  hover: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 2, delay: 0.3 } }
                                }}
                              />

                              {/* Leaf Nodes */}
                              <motion.circle
                                cx="140"
                                cy="40"
                                r="4"
                                className="fill-canvas stroke-ink/20"
                                strokeWidth="1"
                                variants={{
                                  initial: { scale: 1 },
                                  hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.5, delay: 0.2 } }
                                }}
                              />
                              <motion.circle
                                cx="140"
                                cy="80"
                                r="4"
                                className="fill-canvas stroke-ink/20"
                                strokeWidth="1"
                                variants={{
                                  initial: { scale: 1 },
                                  hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.5, delay: 0.4 } }
                                }}
                              />
                              <motion.circle
                                cx="140"
                                cy="120"
                                r="4"
                                className="fill-canvas stroke-ink/20"
                                strokeWidth="1"
                                variants={{
                                  initial: { scale: 1 },
                                  hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.5, delay: 0.6 } }
                                }}
                              />
                              <motion.circle
                                cx="140"
                                cy="160"
                                r="4"
                                className="fill-canvas stroke-ink/20"
                                strokeWidth="1"
                                variants={{
                                  initial: { scale: 1 },
                                  hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.5, delay: 0.8 } }
                                }}
                              />
                            </svg>
                          )}

                          {item.num === '02' && (
                            <svg
                              className="hidden md:block absolute right-0 bottom-0 w-44 h-44 pointer-events-none z-0 text-ink/10 group-hover/discipline:text-ink/30 transition-colors duration-500"
                              viewBox="0 0 200 200"
                              fill="none"
                            >
                              {/* Orbital Rings with motion.g to rotate them cleanly */}
                              <motion.g
                                variants={{
                                  initial: { rotate: 0 },
                                  hover: { rotate: 360, transition: { repeat: Infinity, duration: 15, ease: "linear" } }
                                }}
                                style={{ transformOrigin: "100px 100px" }}
                              >
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="35"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  strokeDasharray="4 4"
                                />
                                <circle
                                  cx="100"
                                  cy="65"
                                  r="3"
                                  className="fill-canvas stroke-ink/30"
                                  strokeWidth="1"
                                />
                              </motion.g>

                              <motion.g
                                variants={{
                                  initial: { rotate: 0 },
                                  hover: { rotate: -360, transition: { repeat: Infinity, duration: 20, ease: "linear" } }
                                }}
                                style={{ transformOrigin: "100px 100px" }}
                              >
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="60"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  strokeDasharray="6 3"
                                />
                                <circle
                                  cx="160"
                                  cy="100"
                                  r="3"
                                  className="fill-canvas stroke-ink/30"
                                  strokeWidth="1"
                                />
                              </motion.g>

                              <motion.g
                                variants={{
                                  initial: { rotate: 0 },
                                  hover: { rotate: 180, transition: { repeat: Infinity, duration: 25, ease: "linear" } }
                                }}
                                style={{ transformOrigin: "100px 100px" }}
                              >
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="80"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  strokeDasharray="2 6"
                                />
                              </motion.g>

                              {/* Central Citation Node */}
                              <motion.circle
                                cx="100"
                                cy="100"
                                r="10"
                                className="fill-canvas stroke-ink/40"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { scale: 1, opacity: 0.7 },
                                  hover: { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
                                }}
                              />

                              {/* Micro labels */}
                              <text x="115" y="103" className="fill-ink/30 font-sans text-[7px] tracking-widest uppercase pointer-events-none select-none">[ENTITY]</text>
                              <text x="50" y="145" className="fill-ink/30 font-sans text-[7px] tracking-widest uppercase pointer-events-none select-none">[CONTEXT]</text>
                              <text x="85" y="50" className="fill-ink/30 font-sans text-[7px] tracking-widest uppercase pointer-events-none select-none">[REF]</text>
                            </svg>
                          )}

                          {item.num === '03' && (
                            <svg
                              className="hidden md:block absolute right-0 bottom-0 w-44 h-44 pointer-events-none z-0 text-ink/10 group-hover/discipline:text-ink/30 transition-colors duration-500"
                              viewBox="0 0 200 200"
                              fill="none"
                            >
                              {/* Grid Lines */}
                              <line x1="20" y1="160" x2="180" y2="160" stroke="currentColor" strokeWidth="1" />
                              <line x1="20" y1="30" x2="20" y2="160" stroke="currentColor" strokeWidth="1" />
                              <line x1="20" y1="120" x2="180" y2="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                              <line x1="20" y1="80" x2="180" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                              <line x1="20" y1="40" x2="180" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />

                              {/* Spline Curve */}
                              <motion.path
                                d="M 20 150 Q 60 130 90 90 T 170 50"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                variants={{
                                  initial: { pathLength: 0 },
                                  hover: { pathLength: 1, transition: { duration: 1.5, ease: "easeInOut" } }
                                }}
                              />

                              {/* Candlestick 1 */}
                              <g className="text-ink/40">
                                {/* Wick */}
                                <motion.line
                                  x1="80"
                                  y1="70"
                                  x2="80"
                                  y2="130"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  variants={{
                                    initial: { scaleY: 0 },
                                    hover: { scaleY: 1, transition: { duration: 0.8, ease: "easeOut" } }
                                  }}
                                  style={{ transformOrigin: "80px 100px" }}
                                />
                                {/* Body (filled) */}
                                <motion.rect
                                  x="75"
                                  y="85"
                                  width="10"
                                  height="30"
                                  className="fill-ink/10 stroke-ink/30"
                                  strokeWidth="1"
                                  variants={{
                                    initial: { scaleY: 0 },
                                    hover: { scaleY: 1, transition: { duration: 1, ease: "easeOut", delay: 0.2 } }
                                  }}
                                  style={{ transformOrigin: "80px 115px" }}
                                />
                              </g>

                              {/* Candlestick 2 */}
                              <g className="text-ink/40">
                                {/* Wick */}
                                <motion.line
                                  x1="130"
                                  y1="40"
                                  x2="130"
                                  y2="110"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  variants={{
                                    initial: { scaleY: 0 },
                                    hover: { scaleY: 1, transition: { duration: 0.8, ease: "easeOut" } }
                                  }}
                                  style={{ transformOrigin: "130px 75px" }}
                                />
                                {/* Body (hollow) */}
                                <motion.rect
                                  x="125"
                                  y="55"
                                  width="10"
                                  height="35"
                                  className="fill-canvas stroke-ink/30"
                                  strokeWidth="1"
                                  variants={{
                                    initial: { scaleY: 0 },
                                    hover: { scaleY: 1, transition: { duration: 1, ease: "easeOut", delay: 0.2 } }
                                  }}
                                  style={{ transformOrigin: "130px 90px" }}
                                />
                              </g>

                              <text x="145" y="150" className="fill-ink/30 font-sans text-[7px] tracking-widest uppercase pointer-events-none select-none">[DATA_SET]</text>
                            </svg>
                          )}

                          {item.num === '04' && (
                            <svg
                              className="hidden md:block absolute right-0 bottom-0 w-44 h-44 pointer-events-none z-0 text-ink/10 group-hover/discipline:text-ink/30 transition-colors duration-500"
                              viewBox="0 0 200 200"
                              fill="none"
                            >
                              {/* Browser Window mockup */}
                              <motion.rect
                                x="25"
                                y="45"
                                width="150"
                                height="110"
                                rx="3"
                                stroke="currentColor"
                                strokeWidth="1"
                                variants={{
                                  initial: { pathLength: 0.4 },
                                  hover: { pathLength: 1, transition: { duration: 1, ease: "easeInOut" } }
                                }}
                              />
                              {/* Title bar line */}
                              <line x1="25" y1="58" x2="175" y2="58" stroke="currentColor" strokeWidth="0.8" />
                              {/* Window buttons */}
                              <circle cx="33" cy="51" r="2" stroke="currentColor" strokeWidth="0.5" />
                              <circle cx="39" cy="51" r="2" stroke="currentColor" strokeWidth="0.5" />
                              <circle cx="45" cy="51" r="2" stroke="currentColor" strokeWidth="0.5" />

                              {/* Address bar */}
                              <rect x="55" y="48" width="90" height="6" rx="1.5" stroke="currentColor" strokeWidth="0.5" />

                              {/* Column layout guides inside window */}
                              <motion.g
                                variants={{
                                  initial: { opacity: 0.2, y: 5 },
                                  hover: { opacity: 0.6, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                                }}
                              >
                                {/* Grid Content Blocks */}
                                <rect x="35" y="68" width="40" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
                                <rect x="80" y="68" width="40" height="55" rx="1" stroke="currentColor" strokeWidth="0.8" />
                                <rect x="125" y="68" width="40" height="25" rx="1" stroke="currentColor" strokeWidth="0.8" />
                                
                                <line x1="35" y1="110" x2="75" y2="110" stroke="currentColor" strokeWidth="0.8" />
                                <line x1="35" y1="115" x2="60" y2="115" stroke="currentColor" strokeWidth="0.8" />
                              </motion.g>

                              {/* Crop marks (corners) */}
                              <motion.path
                                d="M 15 45 L 15 35 L 25 35 M 15 35 L 20 40"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                variants={{
                                  initial: { x: 0, y: 0 },
                                  hover: { x: -3, y: -3, transition: { duration: 0.5, ease: "easeOut" } }
                                }}
                              />
                              <motion.path
                                d="M 185 45 L 185 35 L 175 35 M 185 35 L 180 40"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                variants={{
                                  initial: { x: 0, y: 0 },
                                  hover: { x: 3, y: -3, transition: { duration: 0.5, ease: "easeOut" } }
                                }}
                              />

                              {/* Pixel Resolution Label */}
                              <text x="25" y="170" className="fill-ink/30 font-sans text-[6px] tracking-widest uppercase pointer-events-none select-none">[W:1920 PX | H:1080 PX]</text>
                            </svg>
                          )}
                        </motion.div>
                      </ScrollReveal>
                    </div>
                  ))}
                            </div>
                  <div className="pt-32 w-full flex justify-start md:justify-end">
                    <a href="#selected-works" id="discipline-view-work-link" className="text-ink text-[10px] font-sans tracking-widest uppercase border-b border-ink/30 pb-2 inline-block hover:border-ink transition-colors">View Work ↘</a>
                  </div>
               </div>
            </div>
         </section>

        {/* INTERSTITIAL SECTION */}
        <section className="w-full h-[50vh] md:h-[80vh] overflow-hidden relative">
           {!prefersReducedMotion && <KineticTypography />}
        </section>

        {/* FOOTER */}
        <footer id="contact" className="relative w-full overflow-hidden bg-ink pt-32 text-canvas selection:bg-canvas selection:text-ink before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-gradient-to-b before:from-canvas/10 before:to-transparent">
           <Suspense fallback={null}><FooterM /></Suspense>

           <div className="px-4 md:px-16 relative z-10 w-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-b border-canvas/20 pb-16 md:pb-32">
                 <div className="md:col-span-8 flex flex-col items-start justify-end">
                    <ScrollReveal blur={false}>
                      <span className="text-canvas/50 font-sans tracking-[0.2em] text-xs uppercase mb-8 block flex items-center gap-4">
                        <span className="status-dot" /> Projects, roles, and technical work
                      </span>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={0.1} blur={false}>
                      <h4 className="mb-12 font-serif text-[4rem] font-light uppercase leading-[0.8] tracking-normal md:text-[6rem] lg:text-[7rem]">
                         <span className="block italic opacity-90">Send</span>
                         <span className="block opacity-80">The Brief</span>
                      </h4>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={0.2} blur={false}>
                      <AuditIntakeForm />
                    </ScrollReveal>
                 </div>
                 
                 <div className="md:col-span-4 flex flex-col justify-end items-start md:items-end w-full space-y-16">
                    <ScrollReveal delay={0.3} yOffset={10} blur={false}>
                      <Suspense fallback={null}><LocalTime /></Suspense>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={0.4} blur={false}>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[10px] uppercase font-sans tracking-[0.2em] opacity-70 w-full">
                           {[...primaryNav.filter((item) => item.label !== 'Work'), ...utilityNav].map((item) => (
                             <a
                               key={item.href}
                               href={item.href}
                               id={navItemId('home-footer-link', item)}
                               className="hover:text-canvas/100 hover:opacity-100 transition-opacity border-b border-transparent hover:border-canvas pb-1"
                             >
                               {navLabel(item)}
                             </a>
                           ))}
                           <a href="mailto:sulayman.bowles@gmail.com" id="footer-link-email" className="hover:text-canvas/100 hover:opacity-100 transition-opacity border-b border-transparent hover:border-canvas pb-1">EMAIL</a>
                        </div>
                     </ScrollReveal>
                 </div>
              </div>
              
           </div>
        </footer>
      </main>
    </div>
  );
}
