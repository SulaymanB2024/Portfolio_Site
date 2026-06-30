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
  const words = text.match(/\S+/g) ?? [];

  const container = {
    hidden: { opacity: 1 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.025, 
        delayChildren: delay * i 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    hidden: {
      opacity: 1,
      y: 12,
    },
  };

  const MotionComponent = motion[elementType as keyof typeof motion] || motion.div;

  if (prefersReducedMotion || words.length === 0) {
    return (
      // @ts-ignore dynamic tag
      <MotionComponent className={className}>
        {text}
      </MotionComponent>
    );
  }

  return (
    // @ts-ignore dynamic tag
    <MotionComponent
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <motion.span
            variants={child}
            style={{ marginRight: index === words.length - 1 ? 0 : '0.25em', display: 'inline-block' }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </MotionComponent>
  );
}
