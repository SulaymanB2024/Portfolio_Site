import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  blur?: boolean;
  staggerChildren?: boolean;
}

export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0, 
  yOffset = 30, 
  blur = true 
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: yOffset, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-6%' }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.78, delay: Math.min(delay, 0.35), ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
