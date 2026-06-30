import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: 'hover' | 'always' | 'once';
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

export function ScrambleText({ text, className = '', trigger = 'hover' }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const scramble = useCallback(() => {
    if (prefersReducedMotion || isAnimating) return;
    setIsAnimating(true);
    setHasAnimated(true);

    let frame = 0;
    const maxFrames = 20;
    
    const animate = () => {
      const chars = text.split('');
      const scrambled = chars.map((char, index) => {
        if (char === ' ') return ' ';
        // Gradually reveal the correct characters from left to right
        if (frame > (index / chars.length) * maxFrames) {
          return char;
        }
        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      }).join('');
      
      setDisplayText(scrambled);
      
      if (frame < maxFrames) {
        frame++;
        requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsAnimating(false);
      }
    };
    
    animate();
  }, [isAnimating, prefersReducedMotion, text]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsAnimating(false);
      return;
    }

    if (trigger === 'always') {
      const interval = setInterval(() => {
        scramble();
      }, 3000);
      return () => clearInterval(interval);
    }

    if (trigger === 'once' && !hasAnimated) {
      scramble();
    }
  }, [hasAnimated, prefersReducedMotion, scramble, text, trigger]);

  return (
    <motion.span
      className={`scramble-text relative inline-block ${className}`}
      aria-label={text}
      data-scramble-text={displayText}
      data-scrambling={isAnimating && !prefersReducedMotion ? 'true' : 'false'}
      onMouseEnter={() => trigger === 'hover' && scramble()}
    >
      <span className="scramble-text__semantic">{text}</span>
    </motion.span>
  );
}
