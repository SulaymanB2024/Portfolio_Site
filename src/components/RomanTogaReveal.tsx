import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type RomanTogaRevealProps = {
  className?: string;
  assetHref?: string;
  disabled?: boolean;
  restOpacity?: number;
  revealOpacity?: number;
};

type RevealPoint = {
  x: number;
  y: number;
  age: number;
  ttl: number;
  radius: number;
};

const DEFAULT_ASSET = '/art/roman-toga/roman-toga-lines.svg';

function getContainRect(image: HTMLImageElement, width: number, height: number) {
  const naturalWidth = image.naturalWidth || 1;
  const naturalHeight = image.naturalHeight || 1;
  const scale = Math.min(width / naturalWidth, height / naturalHeight);
  const drawWidth = naturalWidth * scale;
  const drawHeight = naturalHeight * scale;

  return {
    x: (width - drawWidth) / 2,
    y: (height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  };
}

export function RomanTogaReveal({
  className = '',
  assetHref = DEFAULT_ASSET,
  disabled = false,
  restOpacity = 0.12,
  revealOpacity = 0.42,
}: RomanTogaRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<RevealPoint[]>([]);
  const frameRef = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastFrameRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }

    return window.matchMedia('(max-width: 767px)').matches;
  });

  const canReveal = !disabled && !prefersReducedMotion && !isMobile;

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const image = new Image();
    image.decoding = 'async';
    image.src = assetHref;
    imageRef.current = image;

    return () => {
      imageRef.current = null;
    };
  }, [assetHref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const image = imageRef.current;

    if (!canvas || !container || !image || !canReveal) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) {
      return;
    }

    maskCanvasRef.current = maskCanvas;

    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      maskCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      maskCtx.clearRect(0, 0, width, height);
    };

    const drawFrame = (time: number) => {
      const delta = lastFrameRef.current === 0 ? 16 : Math.min(time - lastFrameRef.current, 32);
      lastFrameRef.current = time;

      pointsRef.current = pointsRef.current
        .map((point) => ({ ...point, age: point.age + delta }))
        .filter((point) => point.age < point.ttl);

      ctx.clearRect(0, 0, width, height);
      maskCtx.clearRect(0, 0, width, height);

      for (const point of pointsRef.current) {
        const progress = point.age / point.ttl;
        const alpha = Math.max(0, 1 - progress);
        const gradient = maskCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius);

        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.42, `rgba(255, 255, 255, ${alpha * 0.74})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        maskCtx.fillStyle = gradient;
        maskCtx.fillRect(point.x - point.radius, point.y - point.radius, point.radius * 2, point.radius * 2);
      }

      if (pointsRef.current.length > 0 && image.complete) {
        const imageRect = getContainRect(image, width, height);

        ctx.save();
        ctx.globalAlpha = revealOpacity;
        ctx.filter = 'grayscale(1) contrast(1.25) brightness(0.55)';
        ctx.drawImage(image, imageRect.x, imageRect.y, imageRect.width, imageRect.height);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.filter = 'none';
        ctx.drawImage(maskCanvas, 0, 0, width, height);
        ctx.restore();
      }

      if (pointsRef.current.length > 0) {
        frameRef.current = requestAnimationFrame(drawFrame);
      } else {
        frameRef.current = null;
        lastFrameRef.current = 0;
      }
    };

    const startRender = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(drawFrame);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return;
      }

      pointsRef.current.push({
        x,
        y,
        age: 0,
        ttl: 920,
        radius: Math.max(82, Math.min(rect.width, rect.height) * 0.22),
      });

      if (pointsRef.current.length > 24) {
        pointsRef.current.splice(0, pointsRef.current.length - 24);
      }

      startRender();
    };

    const handleResize = () => {
      resizeCanvas();
      startRender();
    };

    resizeCanvas();
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      pointsRef.current = [];
      maskCanvasRef.current = null;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [assetHref, canReveal, revealOpacity]);

  return (
    <div ref={containerRef} className={`relative isolate overflow-visible ${className}`} aria-hidden="true">
      <img
        src={assetHref}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
        style={{
          opacity: restOpacity,
          filter: 'grayscale(1) contrast(1.22) brightness(0.5)',
          mixBlendMode: 'multiply',
        }}
      />
      {!canReveal && (
        <img
          src={assetHref}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
          style={{
            opacity: Math.min(revealOpacity * 0.22, 0.12),
            filter: 'grayscale(1) contrast(1.2) brightness(0.55)',
            maskImage: 'radial-gradient(circle at 50% 46%, black 0%, black 28%, transparent 66%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 46%, black 0%, black 28%, transparent 66%)',
            mixBlendMode: 'multiply',
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        role="presentation"
      />
    </div>
  );
}
