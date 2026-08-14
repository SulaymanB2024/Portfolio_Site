import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';

const marqueeItems = ['Technical SEO', 'Search Systems', 'Finance Research'];

export function TextMarquee() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-30, 30], { clamp: false });

  return (
    <a
      href="/about"
      aria-label="Go to About Sulayman Bowles"
      className="perspective-1000 group relative mb-0 mt-24 flex w-full overflow-hidden whitespace-nowrap border-y border-canvas/10 bg-ink py-12 text-canvas md:mt-32 md:py-20"
    >
      <motion.div
        className="flex w-max flex-nowrap transition-all duration-700 group-hover:text-transparent group-hover:opacity-60 group-hover:text-outline-light"
        style={prefersReducedMotion ? undefined : { skewX }}
        animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ x: { repeat: Infinity, ease: 'linear', duration: 25 } }}
      >
        {[...marqueeItems, ...marqueeItems].map((label, index) => (
          <span
            key={`${label}-${index}`}
            aria-hidden={index >= marqueeItems.length ? true : undefined}
            className="flex shrink-0 items-center pr-16 font-serif text-[4rem] font-light uppercase italic tracking-normal md:pr-32 md:text-[6rem] xl:text-[8rem]"
          >
            {label}
            <span aria-hidden="true" className="ml-16 font-sans text-base normal-case opacity-30 md:ml-32 md:text-2xl">
              —
            </span>
          </span>
        ))}
      </motion.div>

      <span className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-3 border border-canvas/20 bg-ink/70 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-canvas/0 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:text-canvas/80 group-hover:opacity-100 md:right-16 md:top-8">
        About Me
        <span aria-hidden="true">↗</span>
      </span>
    </a>
  );
}
