import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

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

  useEffect(() => {
    if (trigger === 'always') {
      const interval = setInterval(() => {
        scramble();
      }, 3000);
      return () => clearInterval(interval);
    } else if (trigger === 'once' && !hasAnimated) {
      scramble();
    }
  }, [trigger, hasAnimated]);

  const scramble = () => {
    if (isAnimating) return;
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
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      onMouseEnter={() => trigger === 'hover' && scramble()}
      aria-label={text}
    >
      {displayText}
    </motion.span>
  );
}
