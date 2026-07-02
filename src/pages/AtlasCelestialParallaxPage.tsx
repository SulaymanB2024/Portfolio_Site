import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.js';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, type CSSProperties } from 'react';
import InternalHeader from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const PAGE_SEO = getSeoRoute('/atlas/celestial-parallax')!;
const ATLAS_ARTWORK = '/images/atlas-coelifer.svg';

const artworkMaskStyle: CSSProperties = {
  maskImage:
    'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.86) 10%, rgba(0,0,0,0.98) 58%, rgba(0,0,0,0.88) 92%, transparent 100%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.96) 8%, rgba(0,0,0,0.98) 82%, transparent 100%)',
  maskComposite: 'intersect',
  WebkitMaskImage:
    'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.86) 10%, rgba(0,0,0,0.98) 58%, rgba(0,0,0,0.88) 92%, transparent 100%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.96) 8%, rgba(0,0,0,0.98) 82%, transparent 100%)',
  WebkitMaskComposite: 'source-in',
};

const annotations = [
  {
    label: 'query',
    detail: 'intent classification',
    className: 'left-[58%] top-[25%]',
    line: 'right-full mr-3 w-20 border-t',
  },
  {
    label: 'retrieved page',
    detail: 'content signal',
    className: 'right-[8%] top-[35%]',
    line: 'left-full ml-3 w-16 border-t',
  },
  {
    label: 'citation',
    detail: 'source authority',
    className: 'left-[52%] top-[55%]',
    line: 'right-full mr-3 w-24 border-t',
  },
  {
    label: 'vector match',
    detail: 'semantic alignment',
    className: 'right-[10%] top-[55%]',
    line: 'left-full ml-3 w-20 border-t',
  },
  {
    label: 'confidence',
    detail: 'evidence strength',
    className: 'right-[26%] bottom-[19%]',
    line: 'right-full mr-3 w-16 border-t',
  },
];

function PhaseNote({
  id,
  title,
  copy,
  opacity,
}: {
  id: string;
  title: string;
  copy: string;
  opacity?: MotionValue<number>;
}) {
  return (
    <motion.article style={opacity ? { opacity } : undefined} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-4">
      <p className="font-serif text-xl leading-none text-ink/70">{id}</p>
      <div className="min-w-0">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.34em] text-ink/72">{title}</h2>
        <p className="mt-3 font-serif text-sm italic leading-5 text-ink/58">{copy}</p>
      </div>
    </motion.article>
  );
}

export default function AtlasCelestialParallaxPage() {
  useSEO(PAGE_SEO);

  const prefersReducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end start'],
  });

  const artworkX = useTransform(scrollYProgress, [0, 0.38, 0.72, 1], ['18%', '11%', '4%', '2%']);
  const artworkY = useTransform(scrollYProgress, [0, 0.38, 0.72, 1], ['4%', '-5%', '-18%', '-22%']);
  const artworkScale = useTransform(scrollYProgress, [0, 0.45, 0.78, 1], [1.16, 1.05, 0.86, 0.8]);
  const artworkOpacity = useTransform(scrollYProgress, [0, 0.36, 0.72, 1], [0.14, 0.18, 0.22, 0.2]);
  const artworkRotate = useTransform(scrollYProgress, [0, 0.55, 1], [0, -1.8, 2.4]);
  const copyY = useTransform(scrollYProgress, [0, 0.46, 1], ['0rem', '0.65rem', '-1.75rem']);
  const copyScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.96, 0.94]);
  const annotationOpacity = useTransform(scrollYProgress, [0.18, 0.36, 0.92], [0, 1, 1]);
  const annotationY = useTransform(scrollYProgress, [0.18, 0.36], ['0.6rem', '0rem']);
  const methodOpacity = useTransform(scrollYProgress, [0.58, 0.78], [0, 1]);
  const methodY = useTransform(scrollYProgress, [0.58, 0.78], ['1.1rem', '0rem']);
  const phaseOne = useTransform(scrollYProgress, [0, 0.2, 0.36], [1, 1, 0.34]);
  const phaseTwo = useTransform(scrollYProgress, [0.18, 0.36, 0.58, 0.74], [0.34, 1, 1, 0.34]);
  const phaseThree = useTransform(scrollYProgress, [0.58, 0.76], [0.34, 1]);

  const artworkStyle = prefersReducedMotion
    ? { opacity: 0.2, x: '2%', y: '-18%', scale: 0.86 }
    : {
        x: artworkX,
        y: artworkY,
        scale: artworkScale,
        opacity: artworkOpacity,
        rotate: artworkRotate,
      };

  return (
    <main className="relative min-h-screen bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas">
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/atlas" tone="light" variant="home" />

      <section ref={stageRef} className="relative h-[330svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-canvas px-4 pt-28 md:px-8 md:pt-32 xl:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-[0.42]" aria-hidden="true">
            <div className="absolute inset-x-0 top-0 h-px bg-ink/8" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-ink/8" />
          </div>

          <div className="relative mx-auto h-[calc(100svh-8rem)] w-full max-w-[1480px] overflow-hidden border border-ink/14 bg-canvas/65 shadow-[0_18px_60px_color-mix(in_srgb,var(--color-ink)_3.5%,transparent)]">
            <div className="pointer-events-none absolute inset-5 z-20 hidden md:block" aria-hidden="true">
              <div className="absolute left-0 top-0 h-3 w-px bg-ink/18" />
              <div className="absolute left-0 top-0 h-px w-3 bg-ink/18" />
              <div className="absolute right-0 top-0 h-3 w-px bg-ink/18" />
              <div className="absolute right-0 top-0 h-px w-3 bg-ink/18" />
              <div className="absolute bottom-0 left-0 h-3 w-px bg-ink/18" />
              <div className="absolute bottom-0 left-0 h-px w-3 bg-ink/18" />
              <div className="absolute bottom-0 right-0 h-3 w-px bg-ink/18" />
              <div className="absolute bottom-0 right-0 h-px w-3 bg-ink/18" />
            </div>

            <motion.div
              className="pointer-events-none absolute inset-y-0 right-[-32rem] z-0 w-[96rem] max-w-none md:right-[-24rem] lg:right-[-16rem]"
              style={artworkMaskStyle}
              aria-hidden="true"
            >
              <motion.img
                src={ATLAS_ARTWORK}
                alt=""
                className="h-full w-full object-contain object-center"
                style={artworkStyle}
                decoding="async"
              />
            </motion.div>

            <motion.div
              className="pointer-events-none absolute inset-0 z-10 hidden md:block"
              style={prefersReducedMotion ? { opacity: 1 } : { opacity: annotationOpacity, y: annotationY }}
              aria-hidden="true"
            >
              {annotations.map((annotation) => (
                <div
                  key={annotation.label}
                  className={`absolute max-w-[10rem] text-[9px] leading-tight text-ink/52 ${annotation.className}`}
                >
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/28 bg-canvas shadow-[0_0_0_5px_color-mix(in_srgb,var(--color-ink)_3.5%,transparent)]" />
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 border-dashed border-ink/20 ${annotation.line}`}
                  />
                  <span className="block font-serif text-xs italic text-ink/58">{annotation.label}</span>
                  <span className="mt-1 block text-[8px] uppercase tracking-[0.1em] text-ink/36">
                    {annotation.detail}
                  </span>
                </div>
              ))}
            </motion.div>

            <div className="relative z-10 grid h-full items-end px-5 pb-16 pt-12 md:px-10 md:pb-20 lg:px-14">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[23rem] md:max-w-[33rem]"
                style={prefersReducedMotion ? undefined : { y: copyY, scale: copyScale, transformOrigin: 'left center' }}
              >
                <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.42em] text-ink/42">
                  ATLAS ENGINE
                </p>
                <h1 className="font-serif text-[3rem] font-light leading-[0.9] tracking-normal text-ink md:text-[4.25rem] xl:text-[5.1rem]">
                  To see the{' '}
                  <br />
                  whole structure.
                </h1>
                <p className="mt-6 max-w-[25rem] text-sm leading-7 text-ink/54">
                  Technical audits for websites, search, and systems.
                </p>
                <div className="mt-8 grid gap-3 text-[10px] uppercase tracking-[0.2em] text-ink/48">
                  <a
                    href="#celestial-methodology"
                    className="w-fit border-b border-ink/18 pb-1 font-serif text-sm italic normal-case tracking-normal text-ink/48 transition-colors hover:border-ink/45 hover:text-ink/72"
                  >
                    View methodology
                  </a>
                  <a href="/atlas/sample-crawl" className="w-fit border-b border-ink/18 pb-1 transition-colors hover:border-ink/45 hover:text-ink/72">
                    See an Atlas sample crawl run
                  </a>
                  <a
                    href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-"
                    target="_blank"
                    rel="noreferrer"
                    className="w-fit border-b border-ink/18 pb-1 transition-colors hover:border-ink/45 hover:text-ink/72"
                  >
                    View the GitHub repo for the audit CLI
                  </a>
                  <a href="/contact" className="w-fit border-b border-ink/18 pb-1 transition-colors hover:border-ink/45 hover:text-ink/72">
                    Request an audit
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              id="celestial-methodology"
              className="absolute inset-x-0 bottom-0 z-20 grid border-t border-ink/14 bg-canvas/82 text-ink backdrop-blur-md md:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.45fr)_4.5rem]"
              style={prefersReducedMotion ? { opacity: 1 } : { opacity: methodOpacity, y: methodY }}
            >
              <div className="border-b border-ink/12 px-5 py-5 md:border-b-0 md:border-r md:px-10">
                <p className="text-[9px] uppercase tracking-[0.38em] text-ink/40">Methodology</p>
                <p className="mt-3 font-serif text-lg italic leading-none text-ink/62">How Atlas works.</p>
              </div>
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-5 px-5 py-5 md:px-10">
                <p className="text-[10px] uppercase tracking-[0.24em] text-ink/46">01</p>
                <div>
                  <h2 className="font-serif text-xl leading-none text-ink/82">Crawl</h2>
                  <p className="mt-3 max-w-xl text-xs leading-6 text-ink/54">
                    We discover URLs the way modern systems do: rendering, sitemaps, logs, and links.
                  </p>
                </div>
              </div>
              <a
                href="/method"
                aria-label="Open the full methodology page"
                className="hidden min-h-full items-center justify-center border-l border-ink/12 text-3xl text-ink/44 transition-colors hover:bg-ink hover:text-canvas md:grid"
              >
                <ArrowDown aria-hidden="true" size={24} strokeWidth={1} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-ink/12 bg-canvas px-4 py-10 md:px-8 xl:px-10">
        <div className="mx-auto grid w-full max-w-[1480px] gap-8 md:grid-cols-3 md:gap-12 lg:px-10">
          <PhaseNote
            id="01"
            title="Hero at rest"
            copy="The page at initial load, with the Atlas figure set back into the paper."
            opacity={prefersReducedMotion ? undefined : phaseOne}
          />
          <PhaseNote
            id="02"
            title="First scroll moment"
            copy="Atlas and the celestial globe drift upward more slowly than the page. Query arcs begin to appear."
            opacity={prefersReducedMotion ? undefined : phaseTwo}
          />
          <PhaseNote
            id="03"
            title="Further scroll"
            copy="The globe becomes a retrieval map with connected annotations, then hands off to methodology."
            opacity={prefersReducedMotion ? undefined : phaseThree}
          />
        </div>
      </section>
    </main>
  );
}
