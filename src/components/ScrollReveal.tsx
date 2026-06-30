import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

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
  const canUseInView =
    !prefersReducedMotion &&
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window;

  const hiddenState = {
    opacity: 1,
    y: yOffset,
    filter: blur ? 'blur(8px)' : 'blur(0px)',
  };
  const visibleState = { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <motion.div
      className={className}
      initial={canUseInView ? hiddenState : false}
      whileInView={canUseInView ? visibleState : undefined}
      animate={canUseInView ? undefined : visibleState}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
