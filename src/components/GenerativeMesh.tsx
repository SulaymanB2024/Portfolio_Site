import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface GenerativeMeshProps {
  className?: string;
  color?: string;
  bgColor?: string;
}

export function GenerativeMesh({ className = '', color = 'rgba(7, 7, 7, 0.4)', bgColor = '#EBE8E1' }: GenerativeMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, -20]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? 12 : 25;
    const rows = isMobile ? 12 : 25;
    
    let time = 0;
    let animationFrameId: number;

    const drawGrid = (currentTime: number) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      
      const gridWidth = width * 1.5;
      const gridHeight = height * 1.5;
      const startX = (width - gridWidth) / 2;
      const startY = (height - gridHeight) / 2;
      const cellW = gridWidth / cols;
      const cellH = gridHeight / rows;

      ctx.beginPath();
      
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = startX + i * cellW;
          const y = startY + j * cellH;
          
          const distortX = Math.sin(x * 0.005 + currentTime) * 30;
          const distortY = Math.cos(y * 0.005 + currentTime) * 30;
          
          const px = x + distortX;
          const py = y + distortY;

          if (i < cols) {
            const nextX = startX + (i + 1) * cellW;
            const nextY = y;
            const nextDistortX = Math.sin(nextX * 0.005 + currentTime) * 30;
            const nextDistortY = Math.cos(nextY * 0.005 + currentTime) * 30;
            ctx.moveTo(px, py);
            ctx.lineTo(nextX + nextDistortX, nextY + nextDistortY);
          }
          
          if (j < rows) {
            const nextX = x;
            const nextY = startY + (j + 1) * cellH;
            const nextDistortX = Math.sin(nextX * 0.005 + currentTime) * 30;
            const nextDistortY = Math.cos(nextY * 0.005 + currentTime) * 30;
            ctx.moveTo(px, py);
            ctx.lineTo(nextX + nextDistortX, nextY + nextDistortY);
          }
        }
      }
      
      ctx.stroke();
    };

    const render = () => {
      if (prefersReducedMotion) {
        drawGrid(0);
        return;
      }
      if (!isInView) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      time += 0.01;
      drawGrid(time);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (prefersReducedMotion) {
        drawGrid(0);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, bgColor, isInView, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-canvas ${className}`} style={{ perspective: 1000 }}>
      {/* motion.div that animates 3d rotation based on scroll */}
      <motion.div 
        style={{ y: scrollY, rotateX, willChange: 'transform' }} 
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <canvas ref={canvasRef} className="w-full h-full block origin-center" role="presentation" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
