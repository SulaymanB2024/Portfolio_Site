import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface StaggeredTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function StaggeredText({ text, className = '', delay = 0 }: StaggeredTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.008,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.001 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.h2
      className={`flex flex-wrap m-0 p-0 ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      style={{ perspective: 1000 }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block whitespace-pre origin-bottom mr-[0.25em] mb-[0.1em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}
