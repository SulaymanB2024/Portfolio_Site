import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';

interface WireframeGridProps {
  className?: string;
  cols?: number;
  rows?: number;
  tone?: 'light' | 'dark';
}

export function WireframeGrid({ className = '', cols = 12, rows = 12, tone = 'dark' }: WireframeGridProps) {
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

  const isDark = tone === 'dark';
  const gridLineClass = isDark ? 'bg-canvas/15' : 'bg-ink/5';
  const textClass = isDark ? 'text-canvas/30' : 'text-ink/20';
  const crosshairClass = isDark ? 'border-canvas/30' : 'border-ink/15';
  const cornerCrosshairClass = isDark ? 'border-canvas/40' : 'border-ink/22';
  const centerFillClass = isDark ? 'bg-canvas/40' : 'bg-ink/30';

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
            className={`h-full w-[1px] ${gridLineClass} origin-top flex flex-col justify-between items-center py-2`}
          >
            {i % 3 === 0 && (
              <>
                <motion.span
                  style={{ x: animX, y: animY }}
                  data-visual-label={`C.${i.toString().padStart(2, '0')}`}
                  className={`visual-label text-[8px] font-sans ${textClass} -translate-x-1/2 rotate-90 origin-left mt-4 block`}
                />
                <motion.span
                  style={{ x: animX, y: animY }}
                  data-visual-label={`C.${i.toString().padStart(2, '0')}`}
                  className={`visual-label text-[8px] font-sans ${textClass} -translate-x-1/2 rotate-90 origin-left mb-8 block`}
                />
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
            className={`w-full h-[1px] ${gridLineClass} origin-left flex justify-between items-center px-2`}
          >
           {i % 3 === 0 && (
              <>
                <motion.span
                  style={{ x: animX, y: animY }}
                  data-visual-label={`R.${i.toString().padStart(2, '0')}`}
                  className={`visual-label text-[8px] font-sans ${textClass} mt-[12px] block`}
                />
                <motion.span
                  style={{ x: animX, y: animY }}
                  data-visual-label={`R.${i.toString().padStart(2, '0')}`}
                  className={`visual-label text-[8px] font-sans ${textClass} mt-[12px] block`}
                />
              </>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Target Crosshairs in corners */}
      <div className={`absolute top-8 left-8 w-4 h-4 border-t border-l ${cornerCrosshairClass}`} />
      <div className={`absolute top-8 right-8 w-4 h-4 border-t border-r ${cornerCrosshairClass}`} />
      <div className={`absolute bottom-8 left-8 w-4 h-4 border-b border-l ${cornerCrosshairClass}`} />
      <div className={`absolute bottom-8 right-8 w-4 h-4 border-b border-r ${cornerCrosshairClass}`} />
      
      <div className={`absolute top-1/2 left-1/2 w-6 h-6 border ${crosshairClass} -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center`}>
         <div className={`w-[1px] h-2 ${centerFillClass}`} />
      </div>
    </div>
  );
}
