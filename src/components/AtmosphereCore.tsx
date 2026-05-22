import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';

export default function AtmosphereCore({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const xTrans1 = useTransform(smoothX, v => v * 80);
  const yTrans1 = useTransform(smoothY, v => v * 80);
  const scale1 = useTransform(smoothX, [-1, 1], [0.9, 1.1]);
  
  const xTrans2 = useTransform(smoothX, v => v * -50);
  const yTrans2 = useTransform(smoothY, v => v * -50);
  const scale2 = useTransform(smoothY, [-1, 1], [1.1, 0.9]);

  const xTrans3 = useTransform(smoothX, v => v * 30);
  const yTrans3 = useTransform(smoothY, v => v * -30);

  return (
    <div ref={containerRef} className={`relative overflow-hidden w-full h-full bg-ink ${className}`} aria-hidden="true">
      {/* Dynamic light bursts simulating fluid depth */}
      <motion.div 
        style={{ x: xTrans1, y: yTrans1, scale: scale1, willChange: 'transform' }}
        className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full opacity-20 mix-blend-screen pointer-events-none bg-canvas blur-[100px]"
      />
      <motion.div 
        style={{ x: xTrans2, y: yTrans2, scale: scale2, willChange: 'transform' }}
        className="absolute bottom-[0%] right-[0%] w-[90%] h-[90%] rounded-full opacity-10 mix-blend-screen pointer-events-none bg-canvas blur-[120px]"
      />
      <motion.div 
        style={{ x: xTrans3, y: yTrans3, willChange: 'transform' }}
        className="absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full opacity-[0.15] mix-blend-screen pointer-events-none bg-canvas blur-[80px]"
      />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />
      
      {/* Vignette / dark edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070707_100%)] opacity-80 pointer-events-none" />
    </div>
  );
}
