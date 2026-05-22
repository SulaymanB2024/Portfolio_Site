import { useRef, useEffect } from 'react';

export function GeometricPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    interface Particle {
      x: number;
      y: number;
      angle: number;
      radius: number;
      speed: number;
      size: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const numParticles = 800;

    const init = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: width / 2,
          y: height / 2,
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * Math.max(width, height) / 2,
          speed: 0.2 + Math.random() * 0.8,
          size: Math.random() * 1.5,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
    };

    init();
    window.addEventListener('resize', init);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = () => {
        // Draw slightly transparent black for motion trails
        ctx.fillStyle = 'rgba(7, 7, 7, 0.2)'; 
        ctx.fillRect(0, 0, width, height);

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Void center
        const centerX = mouseX;
        const centerY = mouseY;

        particles.forEach(p => {
           // Spiral towards center
           p.radius -= p.speed;
           p.angle += p.speed * 0.015; // Swirl effect

           // Reset particle if it gets too close to the singularity
           if (p.radius < 5) {
               p.radius = Math.max(width, height) / 1.2;
               p.angle = Math.random() * Math.PI * 2;
           }

           p.x = centerX + Math.cos(p.angle) * p.radius;
           p.y = centerY + Math.sin(p.angle) * p.radius;

           // Calculate pull/distortion near center
           const dist = Math.hypot(p.x - centerX, p.y - centerY);
           let finalSize = p.size;
           let currentOpacity = p.opacity;

           // Event horizon stretching
           if (dist < 150) {
              finalSize = p.size * (dist / 150);
              currentOpacity = p.opacity * (dist / 150);
           }

           ctx.fillStyle = `rgba(235, 232, 225, ${currentOpacity})`;
           ctx.beginPath();
           ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
           ctx.fill();
        });

        // Draw the pure black event horizon
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
        ctx.fillStyle = '#000000'; 
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(235, 232, 225, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden bg-ink pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" role="presentation" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#070707_100%)] opacity-60" />
    </div>
  );
}
