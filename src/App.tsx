import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState, lazy, Suspense, type CSSProperties, type FormEvent } from 'react';
import { SmoothCursor } from './components/SmoothCursor';
import { RevealText } from './components/RevealText';
import { StaggeredText } from './components/StaggeredText';
import { InkTrails } from './components/InkTrails';
import { ScrambleText } from './components/ScrambleText';
import { ScrollReveal } from './components/ScrollReveal';
import { ScrollProgress } from './components/ScrollProgress';
import { MagneticButton } from './components/MagneticButton';
import { KineticTypography } from './components/KineticTypography';
import { ShutterWipe } from './components/ShutterWipe';
import { useReducedMotion } from './hooks/useReducedMotion';
import { getSeoRoute, normalizePath } from './seo/routes';
import { useSEO } from './utils/seo';

const AtlasPage = lazy(() => import('./pages/AtlasPage'));
const VoidAgencyMethodPage = lazy(() => import('./pages/VoidAgencyMethodPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MarketsPage = lazy(() => import('./pages/MarketsPage'));
const MarketArticlePage = lazy(() => import('./pages/MarketArticlePage'));
const TextMarquee = lazy(() => import('./components/TextMarquee').then(m => ({ default: m.TextMarquee })));
const LocalTime = lazy(() => import('./components/LocalTime').then(m => ({ default: m.LocalTime })));
const FlowField = lazy(() => import('./components/FlowField').then(m => ({ default: m.FlowField })));
const CandlestickChart = lazy(() => import('./components/CandlestickChart').then(m => ({ default: m.default })));
const AtmosphereCore = lazy(() => import('./components/AtmosphereCore').then(m => ({ default: m.default })));
const GenerativeMesh = lazy(() => import('./components/GenerativeMesh').then(m => ({ default: m.GenerativeMesh })));
const GeometricPattern = lazy(() => import('./components/GeometricPattern').then(m => ({ default: m.GeometricPattern })));
const WireframeGrid = lazy(() => import('./components/WireframeGrid').then(m => ({ default: m.WireframeGrid })));
const FooterM = lazy(() => import('./components/FooterM').then(m => ({ default: m.FooterM })));

const CONTACT_HASH = '#contact';
const HOME_SEO = getSeoRoute('/')!;

function getCurrentCanonicalPath() {
  const canonicalPath = normalizePath(window.location.pathname);
  if (canonicalPath !== window.location.pathname) {
    window.history.replaceState({}, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
  }
  return canonicalPath;
}

function focusContactForm() {
  const firstContactField = document.querySelector<HTMLInputElement>('#contact-name');
  firstContactField?.focus({ preventScroll: true });
}

function scrollToHashTarget(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  const lenis = (window as any).lenis;
  if (lenis) {
    lenis.scrollTo(hash, { duration: 1.2, ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }

  if (hash === CONTACT_HASH) {
    window.setTimeout(focusContactForm, 450);
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentCanonicalPath);

  useEffect(() => {
    const handlePopState = () => {
      const triggerShutter = (window as any).triggerShutter;
      if (triggerShutter) {
        triggerShutter(true);
        setTimeout(() => {
          setCurrentPath(getCurrentCanonicalPath());
          setTimeout(() => {
            triggerShutter(false);
          }, 300);
        }, 800);
      } else {
        setCurrentPath(getCurrentCanonicalPath());
      }
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (
        link &&
        link.target !== '_blank' &&
        !link.hasAttribute('download') &&
        e.button === 0 && // Left click
        !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey // No modifier keys
      ) {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
          if (href.startsWith('mailto:') || (href.includes('://') && !href.startsWith(window.location.origin))) {
            return;
          }
          
          const url = new URL(href, window.location.origin);
          const canonicalPath = normalizePath(url.pathname);
          if (canonicalPath === normalizePath(window.location.pathname) && url.hash) {
            e.preventDefault();
            scrollToHashTarget(url.hash);
            return;
          }

          e.preventDefault();

          const navigateTo = () => {
            window.history.pushState({}, '', `${canonicalPath}${url.search}${url.hash}`);
            setCurrentPath(canonicalPath);
          };

          const triggerShutter = (window as any).triggerShutter;
          if (triggerShutter) {
            triggerShutter(true);
            setTimeout(() => {
              navigateTo();
              setTimeout(() => {
                triggerShutter(false);
              }, 300);
            }, 800);
          } else {
            const doc = document as any;
            if (doc.startViewTransition) {
              doc.startViewTransition(() => {
                navigateTo();
              });
            } else {
              navigateTo();
            }
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    const lenis = (window as any).lenis;
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        scrollToHashTarget(hash);
      }, 100);
      if (hash === CONTACT_HASH) {
        setTimeout(() => scrollToHashTarget(hash), 1400);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [currentPath]);

  const route = getSeoRoute(currentPath);
  if (route?.path === '/atlas') {
    return (
      <Suspense fallback={null}>
        <AtlasPage />
      </Suspense>
    );
  }

  if (route?.path === '/method') {
    return (
      <Suspense fallback={null}>
        <VoidAgencyMethodPage />
      </Suspense>
    );
  }

  if (route?.path === '/about') {
    return (
      <Suspense fallback={null}>
        <AboutPage />
      </Suspense>
    );
  }

  if (route?.section === 'research-article') {
    const slug = route.path.split('/').at(-1) ?? '';
    return (
      <Suspense fallback={null}>
        <MarketArticlePage slug={slug} />
      </Suspense>
    );
  }

  if (route?.path === '/markets') {
    return (
      <Suspense fallback={null}>
        <MarketsPage />
      </Suspense>
    );
  }

  return <HomePage />;
}

function HomePage() {
  useSEO(HOME_SEO);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Contact Form State
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !message) return;

    setFormStatus('submitting');
    const triggerShutter = (window as any).triggerShutter;
    if (triggerShutter) {
      triggerShutter(true);
    }

    try {
      const response = await fetch('https://formspree.io/f/xyzrppzo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        setTimeout(() => {
          setFormStatus('success');
          setName('');
          setEmail('');
          setMessage('');
          if (triggerShutter) {
            triggerShutter(false);
          }
        }, 800);
      } else {
        setFormStatus('error');
        if (triggerShutter) {
          triggerShutter(false);
        }
      }
    } catch (error) {
      setFormStatus('error');
      if (triggerShutter) {
        triggerShutter(false);
      }
    }
  };

  const [counter, setCounter] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 600);
          return 100;
        }
        // Speed up the count exponentially
        const increment = Math.ceil((100 - prev) * 0.15);
        return prev + increment > 100 ? 100 : prev + increment;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoaded]);

  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -150]);
  const subY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Philosophy horizontal scroll
  const philosophyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: philosophyScroll } = useScroll({
    target: philosophyRef,
    offset: ["start end", "end start"]
  });
  
  const h1Transform = useTransform(philosophyScroll, [0, 1], ["0%", "-40%"]);
  const h2Transform = useTransform(philosophyScroll, [0, 1], ["0%", "40%"]);

  return (
    <div className="relative min-h-screen bg-canvas text-ink font-sans overflow-x-hidden selection:bg-ink selection:text-canvas md:cursor-none" ref={containerRef}>
      <ShutterWipe />
      <div className="bg-noise pointer-events-none" />
      {!prefersReducedMotion && <InkTrails />}
        
        {/* Hide native cursor on desktop to use smooth cursor */}
        {!prefersReducedMotion && <div className="hidden md:block">
          <SmoothCursor />
        </div>}

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
            className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center p-8 origin-bottom text-canvas"
            exit={{ scaleY: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="w-full flex justify-between absolute pt-8 px-8 md:px-16 normal-case font-sans uppercase tracking-[0.2em] text-xs opacity-50 justify-self-start self-start top-0">
               <span>Building Evidence</span>
               <span>{counter}%</span>
            </div>
            
            <motion.div
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.4 }}
               className="font-serif text-6xl md:text-9xl font-light tracking-tighter flex items-baseline"
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

      {/* Outline Navigation */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 w-full z-50 px-4 py-6 md:px-16 md:py-12 flex justify-between items-start mix-blend-difference text-canvas pointer-events-none select-none"
      >
        <a href="/" id="nav-brand-home" className="pointer-events-auto hover-target flex flex-col items-start cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-canvas">
          <span className="text-sm font-sans font-medium tracking-[0.2em] leading-none uppercase">Sulayman Bowles</span>
          <span className="text-xs font-serif italic mt-2 text-canvas opacity-70">Technical SEO · AI Search · Finance/Data</span>
        </a>
        
        <nav aria-label="Main Navigation" className="pointer-events-auto flex flex-col items-end gap-2 text-xs font-sans tracking-[0.2em] font-medium uppercase mix-blend-difference select-none">
          <a href="#selected-works" id="nav-work" data-cursor-text="WORK" className="hover-target relative group overflow-visible p-2 -m-2">
            <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">Work</span>
            {/* Brackets that appear on hover */}
            <span className="absolute left-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">[</span>
            <span className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">]</span>
          </a>
          <a href="/method" id="nav-method" data-cursor-text="METHOD" className="hover-target relative group overflow-visible p-2 -m-2">
             <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">Method</span>
             <span className="absolute left-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">[</span>
             <span className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">]</span>
          </a>
          <a href="/about" id="nav-about" data-cursor-text="ABOUT" className="hover-target relative group overflow-visible p-2 -m-2">
             <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">About</span>
             <span className="absolute left-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">[</span>
             <span className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">]</span>
          </a>
        </nav>
      </motion.header>

      {/* Main Container */}
      <main className="w-full" id="top">
        {/* HERO SECTION - Very Editorial */}
        <section className="relative w-full h-screen flex flex-col justify-end pb-12 px-4 md:px-16 pt-32 overflow-hidden">
          {/* Background Motion */}
          {!prefersReducedMotion && <Suspense fallback={null}>
            <FlowField className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay" density={25} />
          </Suspense>}
          
          {/* Animated SVG Title "Painted" effect */}
          <motion.div 
            style={{ y: titleY, opacity: titleOpacity }} 
            className="w-full max-w-[1600px] mx-auto absolute top-[40%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
          >
            {isLoaded && (
               <svg viewBox="0 0 1000 300" className="w-[100vw] md:w-[85vw] h-auto overflow-visible" aria-hidden="true" focusable="false">
                 <defs>
                   {/* Create a sophisticated gradient stroke */}
                   <linearGradient id="paint-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="var(--color-ink)" />
                     <stop offset="50%" stopColor="var(--color-ink)" stopOpacity="0.8" />
                     <stop offset="100%" stopColor="var(--color-ink)" />
                   </linearGradient>
                 </defs>
                  <motion.text
                   x="50%"
                   y="40%"
                   textAnchor="middle"
                   dominantBaseline="middle"
                   className="font-serif italic font-light text-[140px] hover-target"
                   data-cursor-text="SYSTEMS"
                   fill="none"
                   stroke="url(#paint-grad)"
                   strokeWidth="1.5"
                   initial={{ strokeDasharray: 2500, strokeDashoffset: 2500 }}
                   animate={{ strokeDashoffset: 0 }}
                   transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
                 >
                   SULAYMAN
                 </motion.text>
                 <motion.text
                   x="50%"
                   y="40%"
                   textAnchor="middle"
                   dominantBaseline="middle"
                   className="font-serif italic font-light text-[140px] fill-ink"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 2, delay: 2.2 }}
                 >
                   SULAYMAN
                 </motion.text>
                 
                 {/* Second Line */}
                 <motion.text
                   x="50%"
                   y="85%"
                   textAnchor="middle"
                   dominantBaseline="middle"
                   className="font-sans font-medium uppercase tracking-[0.4em] text-[24px]"
                   fill="none"
                   stroke="var(--color-ink)"
                   strokeWidth="0.5"
                   initial={{ strokeDasharray: 800, strokeDashoffset: 800 }}
                   animate={{ strokeDashoffset: 0 }}
                   transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
                 >
                   BOWLES
                 </motion.text>
                 <motion.text
                   x="50%"
                   y="85%"
                   textAnchor="middle"
                   dominantBaseline="middle"
                   className="font-sans font-medium uppercase tracking-[0.4em] text-[24px] fill-ink"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 1.5, delay: 2.5 }}
                 >
                   BOWLES
                 </motion.text>
               </svg>
            )}
           </motion.div>

           <motion.div 
             style={{ y: subY }}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
             transition={{ duration: 1, delay: 2.8 }}
             className="w-full flex flex-col md:flex-row justify-between items-start md:items-end border-b border-ink/20 pb-8 gap-8 md:gap-0"
           >
             <div className="max-w-[34rem]">
               <h1 className="font-serif text-5xl font-light leading-none tracking-normal text-ink md:text-7xl">
                 Sulayman Bowles
               </h1>
               <p className="mt-5 max-w-md font-sans text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ink/70 md:text-xs">
                 Technical SEO systems, AI-search discoverability, and finance/data tools.
               </p>
             </div>
             <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40 md:text-xs">Trace the work</span>
           </motion.div>
        </section>

        {/* INTRODUCTION - High contrast split */}
        <section className="relative w-full py-32 md:py-48 px-4 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          <div className="md:col-span-8 md:col-start-2">
            <StaggeredText 
               text="I build systems for search, finance, and decision-making. The common thread is evidence."
               delay={0.1}
               className="font-serif italic font-light text-[9vw] sm:text-[8vw] md:text-6xl lg:text-[6rem] leading-[1.05] tracking-tight mb-4 md:mb-8"
            />
          </div>
          <div className="md:col-span-4 md:col-start-8 flex flex-col">
            <RevealText 
               text="My work starts with messy surfaces: crawl data, page templates, market signals, search behavior, financial assumptions, and unfinished product logic. I turn that into structured systems people can inspect, question, and use."
               elementType="p"
               delay={0.4}
               className="font-sans text-[10px] md:text-xs uppercase tracking-[0.25em] text-ink/60 leading-relax max-w-sm mt-4 md:mt-2"
            />
            
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="mt-16 w-full h-[1px] bg-ink/20 transform origin-left" 
            />
            <ScrollReveal delay={0.7} yOffset={15} className="pt-8 grid grid-cols-2 gap-8 text-[10px] uppercase font-sans tracking-widest text-ink/60">
              <ul>
                <li className="mb-2 text-ink line-through decoration-ink/40">Vanity metrics</li>
                <li className="mb-2 text-ink line-through decoration-ink/40">Black-box audits</li>
                <li className="line-through decoration-ink/40">Generic decks</li>
              </ul>
              <ul>
                <li className="mb-2 text-ink">Crawl evidence</li>
                <li className="mb-2 text-ink">Structured analysis</li>
                <li className="text-ink">Shipped systems</li>
              </ul>
            </ScrollReveal>
          </div>
        </section>

        {/* TEXT MARQUEE */}
        <Suspense fallback={null}><TextMarquee /></Suspense>

         {/* SELECTED WORKS - EDITORIAL GRID */}
        <section id="selected-works" className="w-full py-32 bg-ink text-canvas selection:bg-canvas selection:text-ink relative flex flex-col border-t border-canvas/10">
           <div className="px-4 md:px-16 flex items-center justify-between mb-24 md:mb-48 pt-16 max-w-[1800px] mx-auto w-full">
             <ScrollReveal blur={false}>
               <h3 className="font-sans tracking-[0.3em] text-xs md:text-sm uppercase font-medium text-canvas/50">Selected Work</h3>
             </ScrollReveal>
             <ScrollReveal blur={false} delay={0.2}>
               <span className="font-serif italic opacity-50 text-xl text-canvas/50">2024 — 2026</span>
             </ScrollReveal>
           </div>            {/* Project 01 */}
           <div className="max-w-[1800px] mx-auto w-full px-4 md:px-16 mb-48 md:mb-64 relative pt-16">
             <div className="flex justify-between items-start w-full sticky top-32 z-20 px-0 font-sans uppercase tracking-widest text-canvas/50 pointer-events-none">
               <div className="flex flex-col gap-1 text-[10px]">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">SYSTEM</span>
                  <span className="opacity-60">Technical SEO Audit Console</span>
               </div>
               <div className="hidden md:flex flex-col gap-1 text-[10px] text-right">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">PROJECT</span>
                  <span className="opacity-60"><ScrambleText text="Atlas / Void Agency" trigger="once" /></span>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 items-stretch pt-24">
               
               {/* Left Column Text */}
               <div className="md:col-span-4 flex flex-col pt-12 md:pt-0 md:pr-8 lg:pr-16 relative z-10 order-2 md:order-1 mt-12 md:mt-0">
                 
                 <div className="flex flex-col text-xs font-sans tracking-widest uppercase text-canvas/60 h-full justify-start">
                   <ScrollReveal><span className="text-canvas text-xl font-serif italic mb-6">( 02 )</span></ScrollReveal>
                   
                   <ScrollReveal delay={0.2} blur={false}>
                     <p className="leading-tight normal-case tracking-normal font-serif italic text-xl md:text-3xl lg:text-4xl text-canvas/90 max-w-sm mb-16 md:mb-0">
                       A crawl-based audit system for finding indexation, architecture, performance, and AI-search readiness issues across real websites.
                     </p>
                   </ScrollReveal>
                   
                   <div className="flex-grow"></div>
                   
                   <ScrollReveal delay={0.6}>
                     <div className="flex flex-col border-t border-canvas/20 pt-4 text-[10px] uppercase font-sans tracking-widest text-canvas/60 gap-4 w-full md:max-w-xs">
                       <div className="flex justify-between">
                         <span className="opacity-50">Role</span>
                         <span className="text-canvas">Builder / Operator</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="opacity-50">Output</span>
                         <span className="text-canvas">Crawl Data, Issue Logic, Reports</span>
                       </div>
                     </div>
                   </ScrollReveal>
                 </div>
               </div>

               {/* Right Column Canvas */}
               <a href="/atlas" id="work-link-atlas" className="md:col-span-8 block overflow-hidden hover-target relative h-[60vh] md:h-[90vh] border border-canvas/20 order-1 md:order-2 origin-right group/atlas" data-cursor-text="ATLAS">
                 <div className="hidden md:block absolute left-0 top-0 w-[1px] h-full bg-canvas/20 z-10" />
                 
                 {/* Corner brackets */}
                 <div className="absolute top-4 left-4 text-canvas/50 text-[10px] pointer-events-none z-10 font-mono">⌜</div>
                 <div className="absolute top-4 right-4 text-canvas/50 text-[10px] pointer-events-none z-10 font-mono">⌝</div>
                 <div className="absolute bottom-4 left-4 text-canvas/50 text-[10px] pointer-events-none z-10 font-mono">⌞</div>
                 <div className="absolute bottom-4 right-4 text-canvas/50 text-[10px] pointer-events-none z-10 font-mono">⌟</div>

                 {!prefersReducedMotion && <Suspense fallback={null}>
                   <FlowField className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen" density={80} />
                 </Suspense>}
                 <div className="absolute left-6 bottom-6 z-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.28em] text-canvas/70 transition-colors group-hover/atlas:text-canvas">
                   <span className="h-8 w-8 rounded-full border border-canvas/30 transition-colors group-hover/atlas:bg-canvas group-hover/atlas:text-ink" />
                   <span>Atlas SEO Audit Console</span>
                   <span aria-hidden="true">↗</span>
                 </div>
                 
                 {/* Title overlapping canvas */}
                 <ScrollReveal delay={0.2} className="absolute bottom-8 right-0 pointer-events-none z-10 -mr-4 md:-mr-16">
                   <h4 
	                      style={{ viewTransitionName: 'atlas-title' } as CSSProperties}
                      className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-serif text-canvas leading-[0.85] font-light uppercase tracking-tighter text-right"
                   >
                     <span className="block"><ScrambleText text="AT" trigger="hover" /></span>
                     <span className="block italic"><ScrambleText text="LAS" trigger="hover" /></span>
                   </h4>
                 </ScrollReveal>
                 
                 {/* VIEW Button */}
               </a>
               
             </div>
            </div>
                    {/* PROJECT 02 - SYSTEMS */}
         <div className="w-full relative py-20 bg-ink" id="systems">
            <div className="max-w-[1800px] mx-auto w-full px-4 md:px-16 mb-48 md:mb-64 relative pt-16">
             <div className="flex justify-between items-start w-full sticky top-32 z-20 px-0 font-sans uppercase tracking-widest text-canvas/50 pointer-events-none">
               <div className="flex flex-col gap-1 text-[10px]">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">FINANCE</span>
                  <span className="opacity-60">Market + Operating Analysis</span>
               </div>
               <div className="hidden md:flex flex-col gap-1 text-[10px] text-right">
                  <span className="text-canvas tracking-[0.3em] font-medium text-xs mb-1">PROJECT 01</span>
                  <span className="opacity-60">Models, Dashboards, Research</span>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 items-stretch pt-24 pb-48">
               
               {/* Left Column Canvas */}
               <a href="/markets" id="work-link-markets" className="md:col-span-8 overflow-hidden hover-target relative block h-[60vh] md:h-[90vh] border border-canvas/20 origin-left group" data-cursor-text="OBSERVE">
                 <div className="hidden md:block absolute right-0 top-0 w-[1px] h-full bg-canvas/20 z-10" />
                 
                 {/* Corner markers */}
                 <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-canvas/50 pointer-events-none z-10 m-4" />
                 <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-canvas/50 pointer-events-none z-10 m-4" />

                 <Suspense fallback={null}>
                   <CandlestickChart className="absolute inset-0 w-full h-full transform transition-transform duration-[2000ms] group-hover:scale-105" />
                 </Suspense>
                 
                 {/* Title overlapping canvas */}
                 <ScrollReveal delay={0.2} className="absolute top-8 left-4 md:left-0 pointer-events-none z-10 md:-ml-6 mix-blend-difference text-canvas select-none">
                   <h4 className="text-[15vw] md:text-[8vw] lg:text-[10vw] font-serif leading-[0.85] font-light uppercase tracking-tighter text-left">
                     <span className="block opacity-90"><ScrambleText text="MAR" trigger="hover" /></span>
                     <span className="block italic opacity-70"><ScrambleText text="KETS" trigger="hover" /></span>
                   </h4>
                 </ScrollReveal>
               </a>

               <div className="md:col-span-4 flex flex-col justify-between pt-12 md:pt-0">
                 <div className="flex flex-col text-xs font-sans tracking-widest uppercase text-canvas/60 h-full justify-start items-start md:items-end md:text-right">
                   <ScrollReveal><span className="text-canvas text-xl font-serif italic mb-6 block">( 01 )</span></ScrollReveal>
                   
                   <ScrollReveal delay={0.2} blur={false}>
                     <p className="leading-tight normal-case tracking-normal font-serif italic text-xl md:text-3xl lg:text-4xl text-canvas/90 max-w-sm mb-16 md:mb-0">
                        A collection of finance and data work covering valuation, market research, operating models, and decision dashboards.
                     </p>
                   </ScrollReveal>
                   
                   <div className="flex-grow"></div>
                   
                   <ScrollReveal delay={0.4} className="w-full">
                     <div className="flex flex-col md:items-end border-t border-canvas/20 pt-4 text-[10px] uppercase font-sans tracking-widest text-canvas/60 gap-4 w-full md:ml-auto md:max-w-xs">
                        <div className="flex justify-between w-full">
                          <span className="text-left opacity-50">Focus</span>
                          <span className="text-right text-canvas">Finance + Data</span>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-left opacity-50">Tools</span>
                          <span className="text-right text-canvas">Excel, Python, R, SQL</span>
                        </div>
                     </div>
                   </ScrollReveal>
                 </div>
               </div>
               
             </div>
           </div>
         </div>
           
           {/* Project 03 - Void */}
           <a href="/method" id="work-link-void" className="w-full mt-32 md:mt-64 pt-32 pb-48 relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center border-t border-b border-canvas/10 my-32 hover-target bg-ink overflow-hidden group" data-cursor-text="METHOD">
              {!prefersReducedMotion && <Suspense fallback={null}><GeometricPattern /></Suspense>}
              <div className="relative z-10 flex flex-col items-center">
                <ScrollReveal>
                  <span className="text-canvas font-serif italic text-2xl md:text-4xl mb-8 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">( 03 )</span>
                </ScrollReveal>
                <ScrollReveal delay={0.2} blur={false}>
                  <h4 
	                    style={{ viewTransitionName: 'void-title' } as CSSProperties}
                    className="text-[20vw] leading-none font-serif tracking-tighter uppercase text-canvas pb-8 opacity-90 transition-opacity duration-1000"
                  >
                    <ScrambleText text="VOID" trigger="hover" />
                  </h4>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                  <p className="font-sans text-xs uppercase tracking-widest max-w-sm text-center text-canvas/50 group-hover:text-canvas transition-colors duration-1000">Void Agency is my technical SEO and AI-search consultancy, focused on crawlability, answer-readiness, structured content, and evidence-backed website audits.</p>
                </ScrollReveal>
                <ScrollReveal delay={0.6}>
                  <MagneticButton className="mt-16">
                    <span className="inline-block text-canvas border border-canvas/20 rounded-full px-8 py-4 uppercase font-sans text-xs tracking-widest group-hover:bg-canvas group-hover:text-ink transition-colors backdrop-blur-sm">Void Agency Technical SEO Method</span>
                  </MagneticButton>
                </ScrollReveal>
              </div>
           </a>
        </section>

        {/* TYPOGRAPHY / PHILOSOPHY STATEMENT SECTION */}
        <section ref={philosophyRef} id="expertise" className="py-48 px-4 md:px-16 flex flex-col justify-center relative bg-canvas text-ink overflow-hidden border-t border-ink/10 h-screen">
          <div className="max-w-[1800px] mx-auto w-full relative h-[60vh] flex flex-col justify-center">
            
            {/* Background huge offset typography */}
            <motion.div style={{ x: h1Transform }} className="flex whitespace-nowrap mb-8 md:mb-16 -ml-[20%]">
              <span className="text-[15vw] font-serif uppercase tracking-tighter text-outline opacity-20 pr-16 select-none">
                EVIDENCE BEFORE
              </span>
            </motion.div>
            
            <motion.div style={{ x: h2Transform }} className="flex whitespace-nowrap -ml-[40%]">
               <span className="text-[15vw] font-serif uppercase tracking-tighter opacity-10 pr-16 select-none leading-none">
                 INTERPRETATION
               </span>
            </motion.div>
            
            {/* Foreground content */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md bg-canvas/80 backdrop-blur-md p-8 md:p-12 border border-ink/10">
               <h3 className="font-serif italic text-3xl md:text-5xl mb-8 font-light">Operating Method</h3>
               <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink/70 leading-tight mb-8">
                 I separate signal from presentation. First, collect the evidence. Then structure it. Then decide what it means, what risk it creates, and what should be fixed.
               </p>
               <ul className="space-y-4 font-sans text-[10px] uppercase tracking-widest border-t border-ink/10 pt-8 text-ink/50 group">
                 <li className="flex justify-between transition-opacity duration-300 hover:!opacity-100 group-hover:opacity-30 cursor-pointer"><span>01</span><span className="text-ink">Crawl before claims</span></li>
                 <li className="flex justify-between transition-opacity duration-300 hover:!opacity-100 group-hover:opacity-30 cursor-pointer"><span>02</span><span className="text-ink">Structure before scale</span></li>
                 <li className="flex justify-between transition-opacity duration-300 hover:!opacity-100 group-hover:opacity-30 cursor-pointer"><span>03</span><span className="text-ink">Evidence before polish</span></li>
               </ul>
            </div>
            
          </div>
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
                    I work across technical SEO, AI search, finance/data analysis, and web systems.
                  </p>
                </ScrollReveal>
              </div>
              <div className="md:col-span-9 flex flex-col w-full text-ink">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 md:gap-y-32 group">
                 {[
                   { num: '01', title: 'Technical SEO Systems', desc: 'Crawl architecture, indexability, internal links, page templates, metadata, structured data, performance inputs, and issue logic. Built for diagnosis, not vague scoring.' },
                   { num: '02', title: 'AI Search Discoverability', desc: 'Answer-ready pages, entity clarity, citation surfaces, crawl permissions, structured signals, and content that helps AI systems understand who or what a site represents.' },
                   { num: '03', title: 'Finance + Data Analysis', desc: 'Valuation models, market research, operating analysis, dashboards, and decision tools built around assumptions that can be inspected and challenged.' },
                   { num: '04', title: 'Web Systems + Presentation', desc: 'React interfaces, portfolio pages, audit dashboards, visual systems, and written explanations that turn raw work into something legible.' }
                 ].map((item, i) => (
                   <div key={item.num}>
                     <ScrollReveal delay={i % 2 === 0 ? 0.2 : 0.4} blur={false}>
                       <div className="flex flex-col border-t border-ink/20 pt-8 hover-target transition-opacity duration-500 hover:!opacity-100 group-hover:opacity-20" data-cursor-text="READ" style={{ perspective: 1000 }}>
                         <span className="font-sans text-[10px] tracking-widest uppercase opacity-50 mb-6 md:mb-8">{item.num}</span>
                         <h4 className="text-4xl md:text-4xl lg:text-5xl font-serif tracking-tighter uppercase font-light leading-none mb-6 md:mb-8">
                           {item.title}
                         </h4>
                         <p className="font-sans text-[10px] uppercase tracking-widest leading-tight opacity-60">
                           {item.desc}
                         </p>
                       </div>
                     </ScrollReveal>
                   </div>
                 ))}
                 </div>
                 <div className="pt-32 w-full flex justify-start md:justify-end">
                   <a href="#selected-works" id="discipline-view-work-link" className="hover-target text-ink text-[10px] font-sans tracking-widest uppercase border-b border-ink/30 pb-2 inline-block hover:border-ink transition-colors">View Work ↘</a>
                 </div>
              </div>
           </div>
        </section>

        {/* INTERSTITIAL SECTION */}
        <section className="w-full h-[50vh] md:h-[80vh] overflow-hidden hover-target relative">
           {!prefersReducedMotion && <KineticTypography />}
           <div className="absolute inset-0 flex items-center justify-center mix-blend-difference pointer-events-none">
              <div className="w-[1px] h-32 bg-canvas mb-8"></div>
           </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="w-full bg-ink text-canvas selection:bg-canvas selection:text-ink relative overflow-hidden pt-32">
           <Suspense fallback={null}><FooterM /></Suspense>

           <div className="px-4 md:px-16 relative z-10 w-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-b border-canvas/20 pb-16 md:pb-32">
                 <div className="md:col-span-8 flex flex-col items-start justify-end">
                    <ScrollReveal blur={false}>
                      <span className="text-canvas/50 font-sans tracking-[0.2em] text-xs uppercase mb-8 block flex items-center gap-4">
                        <span className="status-dot" /> Projects, roles, and technical audits
                      </span>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={0.1} blur={false}>
                      <h4 className="text-[12vw] leading-[0.8] font-serif uppercase font-light tracking-tighter mb-12 hover-target cursor-none" data-cursor-text="WRITE">
                         <span className="block italic opacity-90">Send</span>
                         <span className="block opacity-80">The Brief</span>
                      </h4>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={0.2} blur={false}>
                      {formStatus === 'success' ? (
                        <div className="text-canvas font-sans font-light tracking-widest uppercase text-base md:text-lg py-6 border border-canvas/20 px-8 rounded bg-canvas/5 max-w-lg mt-4">
                          <p className="text-[#a3e635] mb-2 font-medium">✓ Brief Received</p>
                          <p className="text-[10px] text-canvas/60 normal-case tracking-normal leading-relaxed">
                            Thank you. Your message has been sent successfully. I will review your submission and get back to you shortly.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input 
                              type="text" 
                              required
                              id="contact-name"
                              name="name"
                              placeholder="YOUR NAME" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-transparent border-b border-canvas/20 focus:border-canvas py-2 text-xs font-sans tracking-widest uppercase outline-none transition-colors placeholder:text-canvas/30 text-canvas"
                            />
                            <input 
                              type="email" 
                              required
                              id="contact-email"
                              name="email"
                              placeholder="YOUR EMAIL" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-transparent border-b border-canvas/20 focus:border-canvas py-2 text-xs font-sans tracking-widest uppercase outline-none transition-colors placeholder:text-canvas/30 text-canvas"
                            />
                          </div>
                          <textarea 
                            required
                            rows={2}
                            id="contact-message"
                            name="message"
                            placeholder="THE BRIEF (PROJECT DETAILS, TIMELINE, AUDIT REQUEST)" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-transparent border-b border-canvas/20 focus:border-canvas py-2 text-xs font-sans tracking-widest uppercase outline-none transition-colors placeholder:text-canvas/30 text-canvas resize-none"
                          />
                          <div className="flex items-center justify-between pt-2">
                            {formStatus === 'error' && (
                              <span className="text-red-400 text-[10px] font-sans tracking-widest uppercase">
                                Submission failed. Please try again.
                              </span>
                            )}
                            <button 
                              type="submit" 
                              disabled={formStatus === 'submitting'}
                              className="group flex items-center gap-6 hover-target cursor-none w-fit bg-transparent border-none outline-none text-left disabled:opacity-50"
                            >
                              <span className="text-lg md:text-xl font-sans font-light tracking-widest uppercase pb-1 border-b-2 border-canvas/20 group-hover:border-canvas transition-colors text-canvas">
                                {formStatus === 'submitting' ? 'SENDING...' : 'SUBMIT BRIEF'}
                              </span>
                              <div className="w-10 h-10 rounded-full border border-canvas/20 flex items-center justify-center group-hover:bg-canvas group-hover:text-ink transition-colors text-canvas">
                                <span className="transform -rotate-45 block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">→</span>
                              </div>
                            </button>
                          </div>
                        </form>
                      )}
                    </ScrollReveal>
                 </div>
                 
                 <div className="md:col-span-4 flex flex-col justify-end items-start md:items-end w-full space-y-16">
                    <ScrollReveal delay={0.3} yOffset={10} blur={false}>
                      <Suspense fallback={null}><LocalTime /></Suspense>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={0.4} blur={false}>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[10px] uppercase font-sans tracking-[0.2em] opacity-70 w-full">
                           <a href="/atlas" id="footer-link-atlas" className="hover-target hover:text-canvas/100 hover:opacity-100 transition-opacity border-b border-transparent hover:border-canvas pb-1">Atlas</a>
                           <a href="/markets" id="footer-link-markets" className="hover-target hover:text-canvas/100 hover:opacity-100 transition-opacity border-b border-transparent hover:border-canvas pb-1">Markets Research</a>
                           <a href="/method" id="footer-social-void" className="hover-target hover:text-canvas/100 hover:opacity-100 transition-opacity border-b border-transparent hover:border-canvas pb-1">Void Agency</a>
                           <a href="mailto:sulayman.bowles@gmail.com" id="footer-link-email" className="hover-target hover:text-canvas/100 hover:opacity-100 transition-opacity border-b border-transparent hover:border-canvas pb-1">Email</a>
                           <a href="#contact" id="footer-link-contact" className="hover-target hover:text-canvas/100 hover:opacity-100 transition-opacity border-b border-transparent hover:border-canvas pb-1">Contact</a>
                        </div>
                     </ScrollReveal>
                 </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] uppercase font-sans tracking-[0.2em] text-canvas/40 py-8 gap-4 md:gap-0">
                 <span>© 2026 Sulayman Bowles</span>
                 <a href="#top" id="footer-back-to-top" className="hover-target hover:text-canvas transition-colors flex items-center gap-2">
                    Back to top <span className="transform -rotate-90 block">→</span>
                 </a>
                 <span>Technical SEO · AI Search · Finance/Data</span>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}
