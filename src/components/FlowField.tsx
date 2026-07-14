import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useVelocity, useSpring } from 'motion/react';

interface FlowFieldProps {
  className?: string;
  density?: number;
}

export function FlowField({ className = '', density = 40 }: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });
  const isInViewRef = useRef(false);
  
  const { scrollYProgress, scrollY } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; vx: number; vy: number; length: number }[] = [];
    const isMobile = window.innerWidth < 768;
    const numParticles = isMobile ? density * 4 : density * 20;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        length: Math.random() * 50 + 20,
      });
    }

    let animationFrameId: number;
    let time = 0;
    let lastFrameTime = 0;

    const render = (frameTime: number) => {
      if (!isInViewRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (isMobile && frameTime - lastFrameTime < 1000 / 30) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = frameTime;
      
      const vMultiplier = 1 + (Math.abs(smoothVelocity.get()) * 0.002);
      time += 0.002 * vMultiplier; // Accelerate time progression with scroll
      
      // Clear with trailing effect
      ctx.fillStyle = 'rgba(7, 7, 7, 0.1)'; // Dark background (ink)
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = 'rgba(235, 232, 225, 0.4)'; // Light lines (canvas)
      ctx.lineWidth = 1;

      particles.forEach(p => {
        // Calculate vector field based on position and time
        const angle = Math.sin(p.x * 0.005 + time) * Math.cos(p.y * 0.005 + time) * Math.PI * 2;
        p.vx = Math.cos(angle) * 1.5 * vMultiplier;
        p.vy = Math.sin(angle) * 1.5 * vMultiplier;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        
        p.x += p.vx;
        p.y += p.vy;
        
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, smoothVelocity]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-ink ${className}`}>
      <motion.div style={{ y: yTransform, willChange: 'transform', backfaceVisibility: 'hidden' }} className="absolute inset-0 w-full h-[120%] -top-[10%] transform-gpu">
        <canvas ref={canvasRef} className="w-full h-full block" role="presentation" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
