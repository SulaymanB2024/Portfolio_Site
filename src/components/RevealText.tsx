import { motion } from 'motion/react';
import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RevealTextProps {
  text: string;
  delay?: number;
  className?: string;
  elementType?: keyof React.JSX.IntrinsicElements;
}

export function RevealText({ text, delay = 0, className = '', elementType = 'div' }: RevealTextProps) {
  const prefersReducedMotion = useReducedMotion();
  // Split text into words for staggered animation
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.008,
        delayChildren: prefersReducedMotion ? 0 : delay * i,
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.001 : 0.38,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 4,
    },
  };

  const MotionComponent = motion[elementType as keyof typeof motion] || motion.div;

  return (
    // @ts-ignore dynamic tag
    <MotionComponent
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-flex flex-wrap ${className}`}
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: '0.25em', display: 'inline-block' }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
}
