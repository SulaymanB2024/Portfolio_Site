import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export function FooterM() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const animX = useTransform(smoothX, v => v * -50);
  const animY = useTransform(smoothY, v => v * -50);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
            mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
            mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
            ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="absolute bottom-[-10%] right-[-5%] text-[18rem] md:text-[26rem] xl:text-[34rem] font-serif uppercase tracking-normal leading-none opacity-[0.03] pointer-events-none select-none transform-gpu"
      style={{
        x: animX,
        y: animY,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      M
    </motion.div>
  );
}
