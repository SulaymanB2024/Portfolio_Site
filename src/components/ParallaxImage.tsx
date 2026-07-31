import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export function ParallaxImage({ src, alt, className = '', speed = 0.2 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calculate transform values based on speed
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={prefersReducedMotion ? false : { opacity: 0, clipPath: 'inset(7% 0 7% 0)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
        viewport={{ once: true, margin: '-5%' }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          style={prefersReducedMotion ? { scale: 1 } : { y, scale: 1 + speed * 2 }}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute -inset-[20%] w-[140%] h-[140%] object-cover grayscale brightness-90 contrast-[1.2]"
        />
        <div className="absolute inset-0 bg-ink/10 mix-blend-overlay pointer-events-none" />
      </motion.div>
    </div>
  );
}
