import { useRef } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'motion/react';

export function TextMarquee() {
  const containerRef = useRef<HTMLAnchorElement>(null);
  
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map the scroll velocity to a skew value. Usually between -1000 and 1000
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-30, 30], { clamp: false });

  return (
    <a
      ref={containerRef}
      href="/about"
      aria-label="Technical SEO, Atlas, and finance research. Go to About Sulayman Bowles"
      data-cursor-text="ABOUT ME"
      className="relative mt-24 mb-0 flex w-full overflow-hidden whitespace-nowrap border-y border-canvas/10 bg-ink py-12 text-canvas md:mt-32 md:py-20 hover-target group cursor-none perspective-1000"
    >
      <motion.div
        aria-hidden="true"
        className="flex w-max flex-nowrap group-hover:opacity-60 group-hover:text-outline-light group-hover:text-transparent transition-all duration-700"
        style={{ skewX }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ x: { repeat: Infinity, ease: "linear", duration: 25 } }}
      >
        <span className="text-[10vw] font-serif italic font-light uppercase tracking-tighter shrink-0 inline-block align-middle pr-16 md:pr-32">Technical SEO <span className="font-sans normal-case text-[2vw] opacity-30 ml-16 md:ml-32">—</span></span><span className="text-[10vw] font-serif italic font-light uppercase tracking-tighter shrink-0 inline-block align-middle pr-16 md:pr-32">Atlas <span className="font-sans normal-case text-[2vw] opacity-30 ml-16 md:ml-32">—</span></span><span className="text-[10vw] font-serif italic font-light uppercase tracking-tighter shrink-0 inline-block align-middle pr-16 md:pr-32">Finance Research <span className="font-sans normal-case text-[2vw] opacity-30 ml-16 md:ml-32">—</span></span><span className="text-[10vw] font-serif italic font-light uppercase tracking-tighter shrink-0 inline-block align-middle pr-16 md:pr-32">Technical SEO <span className="font-sans normal-case text-[2vw] opacity-30 ml-16 md:ml-32">—</span></span><span className="text-[10vw] font-serif italic font-light uppercase tracking-tighter shrink-0 inline-block align-middle pr-16 md:pr-32">Atlas <span className="font-sans normal-case text-[2vw] opacity-30 ml-16 md:ml-32">—</span></span><span className="text-[10vw] font-serif italic font-light uppercase tracking-tighter shrink-0 inline-block align-middle pr-16 md:pr-32">Finance Research <span className="font-sans normal-case text-[2vw] opacity-30 ml-16 md:ml-32">—</span></span>
      </motion.div>
      <span className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-3 border border-canvas/20 bg-ink/70 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-canvas/0 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:text-canvas/80 group-hover:opacity-100 md:right-16 md:top-8">
        About Me
        <span aria-hidden="true">↗</span>
      </span>
    </a>
  );
}
