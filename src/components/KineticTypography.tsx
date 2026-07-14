import { motion, useReducedMotion } from 'motion/react';

export function KineticTypography() {
  const prefersReducedMotion = useReducedMotion();
  const steps = ['Observe', 'Structure', 'Decide', 'Ship'];

  return (
    <div className="mx-auto grid w-full max-w-[1800px] grid-cols-2 px-4 md:grid-cols-4 md:px-16">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="flex min-h-20 items-center gap-4 border-canvas/14 py-5 odd:border-l odd:pl-5 md:min-h-24 md:border-l md:px-7 md:first:border-l-0 md:first:pl-0"
        >
          <span className="font-serif text-lg italic text-canvas/42">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-canvas/82">{step}</span>
        </motion.div>
      ))}
    </div>
  );
}
