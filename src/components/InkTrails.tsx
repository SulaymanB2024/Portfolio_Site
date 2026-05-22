import { useEffect, useRef } from 'react';

export function InkTrails() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: width / 2, y: height / 2 };
    let lastMouse = { x: width / 2, y: height / 2 };
    let points: { x: number, y: number, lifetime: number, maxLifetime: number, size: number, vx: number, vy: number }[] = [];
    let animationFrameId: number | null = null;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.lifetime++;
        
        if (p.lifetime > p.maxLifetime) {
          points.splice(i, 1);
          i--;
          continue;
        }

        const opacity = 1 - (p.lifetime / p.maxLifetime);
        const currentSize = p.size * opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(7, 7, 7, ${opacity * 0.2})`;
        ctx.fill();

        // Slight drift
        p.x += p.vx;
        p.y += p.vy; // Drift down slightly like ink bleeding
      }

      if (points.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
      }
    };

    const startRenderLoop = () => {
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouse = { ...mouse };
      mouse = { x: e.clientX, y: e.clientY };
      
      const distance = Math.hypot(mouse.x - lastMouse.x, mouse.y - lastMouse.y);
      if (distance > 0.5) {
        // Add multiple points for a broader stroke
        const count = Math.min(Math.floor(distance / 2) + 1, 10);
        for(let i=0; i<count; i++) {
          const spread = Math.random() * 15;
          const theta = Math.random() * Math.PI * 2;
          points.push({
            x: mouse.x + Math.cos(theta) * spread,
            y: mouse.y + Math.sin(theta) * spread,
            lifetime: 0,
            maxLifetime: 150 + Math.random() * 150,
            size: (Math.random() * 3 + 1) + (distance * 0.05),
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 + 0.2
          });
        }
        startRenderLoop();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
      <div className="w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" role="presentation" aria-hidden="true" />
      </div>
    </div>
  );
}
