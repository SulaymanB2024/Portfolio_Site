import { motion, useScroll, useSpring } from 'motion/react';

type ScrollProgressProps = {
  tone?: 'light' | 'dark';
};

export function ScrollProgress({ tone = 'light' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const trackClass = tone === 'dark' ? 'bg-ink/15' : 'bg-canvas/20';
  const barClass = tone === 'dark' ? 'bg-ink' : 'bg-canvas';
  const textClass = tone === 'dark' ? 'text-ink/45' : 'text-canvas/50';

  return (
    <div className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-[1px] h-32 ${trackClass} z-50 pointer-events-none hidden md:block`}>
      <motion.div
        className={`w-full ${barClass} origin-top`}
        style={{ scaleY, height: '100%' }}
      />
      <div
        data-visual-label="Top"
        className={`visual-label absolute -left-2 top-0 mt-3 font-sans text-[8px] transform -translate-x-full ${textClass} uppercase tracking-[0.3em]`}
      />
      <div
        data-visual-label="End"
        className={`visual-label absolute -left-2 bottom-0 mb-3 font-sans text-[8px] transform -translate-x-full ${textClass} uppercase tracking-[0.3em]`}
      />
    </div>
  );
}
