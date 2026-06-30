import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function KineticTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const x3 = useTransform(scrollYProgress, [0, 1], [0, -800]);

  return (
    <div ref={containerRef} className="w-full h-full bg-ink text-canvas overflow-hidden flex flex-col justify-center relative">
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
      
      <motion.div style={{ x: x1, willChange: 'transform', backfaceVisibility: 'hidden' }} className="flex whitespace-nowrap transform-gpu">
        <span className="text-[15vw] md:text-[10vw] font-sans font-black uppercase tracking-tighter mix-blend-difference opacity-20">
          CRAWL MAP FIX CRAWL MAP FIX
        </span>
      </motion.div>
      
      <motion.div style={{ x: x2, willChange: 'transform', backfaceVisibility: 'hidden' }} className="flex whitespace-nowrap -mt-[5vw] transform-gpu">
        <span className="text-[15vw] md:text-[10vw] font-serif italic uppercase tracking-tighter text-outline-light opacity-50">
          READ FILES BUILD REPORTS READ FILES BUILD REPORTS
        </span>
      </motion.div>
      
      <motion.div style={{ x: x3, willChange: 'transform', backfaceVisibility: 'hidden' }} className="flex whitespace-nowrap -mt-[5vw] transform-gpu">
        <span className="text-[15vw] md:text-[10vw] font-sans font-black uppercase tracking-tighter mix-blend-difference opacity-20">
          MODEL TEST SHIP MODEL TEST SHIP
        </span>
      </motion.div>
    </div>
  );
}
