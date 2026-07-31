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

  return (
    <div aria-hidden="true" className={`fixed right-3 top-1/2 hidden h-32 w-px -translate-y-1/2 ${trackClass} pointer-events-none z-40 md:block xl:right-4`}>
      <motion.div
        className={`w-full ${barClass} origin-top`}
        style={{ scaleY, height: '100%' }}
      />
    </div>
  );
}
