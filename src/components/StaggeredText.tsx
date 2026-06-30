import { motion } from 'motion/react';
import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface StaggeredTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function StaggeredText({ text, className = '', delay = 0 }: StaggeredTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.match(/\S+/g) ?? [];

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 1,
      y: 50,
      rotateX: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.h2
      className={`flex flex-wrap m-0 p-0 ${className}`}
      variants={prefersReducedMotion ? undefined : container}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-10%' }}
      style={{ perspective: 1000 }}
    >
      {prefersReducedMotion || words.length === 0
        ? text
        : words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <motion.span
              variants={child}
              className="inline-block whitespace-pre origin-bottom mr-[0.25em] mb-[0.1em]"
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
    </motion.h2>
  );
}
