import { motion, useReducedMotion } from 'motion/react';

export function TextMarquee() {
  const prefersReducedMotion = useReducedMotion();
  const sequence = ['Observe', 'Separate', 'Ship'];

  return (
    <a
      href="/about"
      aria-label="Go to About Sulayman Bowles"
      className="group relative flex w-full overflow-hidden whitespace-nowrap border-y border-canvas/14 bg-ink py-6 text-canvas md:py-8"
    >
      <motion.div
        className="flex w-max flex-nowrap items-center transition-opacity duration-500 group-hover:opacity-60"
        animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ x: { repeat: Infinity, ease: 'linear', duration: 36 } }}
      >
        {[...sequence, ...sequence].map((label, index) => (
          <span key={`${label}-${index}`} className="flex shrink-0 items-center pr-12 md:pr-20">
            <span className="mr-4 font-serif text-base italic text-canvas/48 md:mr-6 md:text-xl">
              {String((index % sequence.length) + 1).padStart(2, '0')}
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.32em] md:text-xs">{label}</span>
            <span aria-hidden="true" className="ml-12 h-px w-12 bg-canvas/24 md:ml-20 md:w-20" />
          </span>
        ))}
      </motion.div>
    </a>
  );
}
