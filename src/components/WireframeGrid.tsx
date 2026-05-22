import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';

interface WireframeGridProps {
  className?: string;
  cols?: number;
  rows?: number;
}

export function WireframeGrid({ className = '', cols = 12, rows = 12 }: WireframeGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  const animX = useTransform(smoothX, v => v * -10);
  const animY = useTransform(smoothY, v => v * -10);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize from -1 to 1
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [mouseX, mouseY]);

  const actualCols = isMobile ? Math.floor(cols / 2) : cols;
  const actualRows = isMobile ? Math.floor(rows / 2) : rows;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} aria-hidden="true">
      {/* Grid Lines */}
      <div 
        className="absolute inset-0 flex justify-between"
        style={{ width: '100%', height: '100%' }}
      >
        {Array.from({ length: actualCols + 1 }).map((_, i) => (
          <motion.div
            key={`col-${i}`}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 1.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-[1px] bg-canvas/30 origin-top flex flex-col justify-between items-center py-2"
          >
            {i % 3 === 0 && (
              <>
                <motion.span 
                  style={{ x: animX, y: animY }}
                  className="text-[8px] font-sans text-canvas/40 -translate-x-1/2 rotate-90 origin-left mt-4 block"
                >
                  C.{i.toString().padStart(2, '0')}
                </motion.span>
                <motion.span 
                  style={{ x: animX, y: animY }}
                  className="text-[8px] font-sans text-canvas/40 -translate-x-1/2 rotate-90 origin-left mb-8 block"
                >
                  C.{i.toString().padStart(2, '0')}
                </motion.span>
              </>
            )}
          </motion.div>
        ))}
      </div>
      <div 
        className="absolute inset-0 flex flex-col justify-between"
        style={{ width: '100%', height: '100%' }}
      >
        {Array.from({ length: actualRows + 1 }).map((_, i) => (
          <motion.div
            key={`row-${i}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 1.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-[1px] bg-canvas/30 origin-left flex justify-between items-center px-2"
          >
           {i % 3 === 0 && (
              <>
                <motion.span 
                  style={{ x: animX, y: animY }}
                  className="text-[8px] font-sans text-canvas/40 mt-[12px] block"
                >
                  R.{i.toString().padStart(2, '0')}
                </motion.span>
                <motion.span 
                  style={{ x: animX, y: animY }}
                  className="text-[8px] font-sans text-canvas/40 mt-[12px] block"
                >
                  R.{i.toString().padStart(2, '0')}
                </motion.span>
              </>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Target Crosshairs in corners */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-canvas/50" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-canvas/50" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-canvas/50" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-canvas/50" />
      
      <div className="absolute top-1/2 left-1/2 w-6 h-6 border border-canvas/30 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center">
         <div className="w-[1px] h-2 bg-canvas/50" />
      </div>
    </div>
  );
}
