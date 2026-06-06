import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type RomanTogaFocus = 'diagram' | 'large-figure';

type RomanTogaRevealProps = {
  className?: string;
  assetHref?: string;
  disabled?: boolean;
  fit?: 'contain' | 'cover';
  focus?: RomanTogaFocus;
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
const SOURCE_VIEW_BOX = {
  width: 535.474,
  height: 555.973,
};
const LARGE_FIGURE_CROP = {
  x: 0,
  y: 0,
  width: 218,
  height: SOURCE_VIEW_BOX.height,
};
const LARGE_FIGURE_FOCAL_POINT = {
  x: 0,
  y: 0,
};

type SourceRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getSourceRect(image: HTMLImageElement, focus: RomanTogaFocus): SourceRect {
  const naturalWidth = image.naturalWidth || 1;
  const naturalHeight = image.naturalHeight || 1;

  if (focus !== 'large-figure') {
    return {
      x: 0,
      y: 0,
      width: naturalWidth,
      height: naturalHeight,
    };
  }

  return {
    x: naturalWidth * (LARGE_FIGURE_CROP.x / SOURCE_VIEW_BOX.width),
    y: naturalHeight * (LARGE_FIGURE_CROP.y / SOURCE_VIEW_BOX.height),
    width: naturalWidth * (LARGE_FIGURE_CROP.width / SOURCE_VIEW_BOX.width),
    height: naturalHeight * (LARGE_FIGURE_CROP.height / SOURCE_VIEW_BOX.height),
  };
}

function getObjectFitRect(
  sourceRect: SourceRect,
  width: number,
  height: number,
  fit: 'contain' | 'cover',
  alignment = { x: 0.5, y: 0.5 },
) {
  const scale = fit === 'cover'
    ? Math.max(width / sourceRect.width, height / sourceRect.height)
    : Math.min(width / sourceRect.width, height / sourceRect.height);
  const drawWidth = sourceRect.width * scale;
  const drawHeight = sourceRect.height * scale;

  return {
    x: (width - drawWidth) * alignment.x,
    y: (height - drawHeight) * alignment.y,
    width: drawWidth,
    height: drawHeight,
  };
}

function drawTogaImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  fit: 'contain' | 'cover',
  focus: RomanTogaFocus,
  opacity: number,
  filter: string,
) {
  const sourceRect = getSourceRect(image, focus);
  const imageAlignment = focus === 'large-figure' ? LARGE_FIGURE_FOCAL_POINT : undefined;
  const imageRect = getObjectFitRect(sourceRect, width, height, fit, imageAlignment);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.filter = filter;
  ctx.drawImage(
    image,
    sourceRect.x,
    sourceRect.y,
    sourceRect.width,
    sourceRect.height,
    imageRect.x,
    imageRect.y,
    imageRect.width,
    imageRect.height,
  );
  ctx.restore();
}

export function RomanTogaReveal({
  className = '',
  assetHref = DEFAULT_ASSET,
  disabled = false,
  fit = 'contain',
  focus = 'diagram',
  restOpacity = 0.12,
  revealOpacity = 0.42,
}: RomanTogaRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
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
    const canvas = baseCanvasRef.current;
    const container = containerRef.current;
    const image = imageRef.current;

    if (!canvas || !container || !image) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const staticMaskCanvas = document.createElement('canvas');
    const staticMaskCtx = staticMaskCanvas.getContext('2d');
    if (!staticMaskCtx) {
      return;
    }

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
      staticMaskCanvas.width = canvas.width;
      staticMaskCanvas.height = canvas.height;

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      staticMaskCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const drawBase = () => {
      ctx.clearRect(0, 0, width, height);
      staticMaskCtx.clearRect(0, 0, width, height);

      if (!image.complete || !image.naturalWidth) {
        return;
      }

      drawTogaImage(
        ctx,
        image,
        width,
        height,
        fit,
        focus,
        restOpacity,
        'grayscale(1) contrast(1.22) brightness(0.5)',
      );

      if (!canReveal) {
        drawTogaImage(
          staticMaskCtx,
          image,
          width,
          height,
          fit,
          focus,
          Math.min(revealOpacity * 0.22, 0.12),
          'grayscale(1) contrast(1.2) brightness(0.55)',
        );

        staticMaskCtx.globalCompositeOperation = 'destination-in';
        const gradient = staticMaskCtx.createRadialGradient(
          width * 0.5,
          height * 0.46,
          0,
          width * 0.5,
          height * 0.46,
          Math.max(width, height) * 0.44,
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.28, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        staticMaskCtx.fillStyle = gradient;
        staticMaskCtx.fillRect(0, 0, width, height);
        staticMaskCtx.globalCompositeOperation = 'source-over';

        ctx.drawImage(staticMaskCanvas, 0, 0, width, height);
      }
    };

    const handleResize = () => {
      resizeCanvas();
      drawBase();
    };

    resizeCanvas();
    drawBase();
    image.addEventListener('load', drawBase);
    window.addEventListener('resize', handleResize);

    return () => {
      image.removeEventListener('load', drawBase);
      window.removeEventListener('resize', handleResize);
    };
  }, [assetHref, canReveal, fit, focus, restOpacity, revealOpacity]);

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
        drawTogaImage(
          ctx,
          image,
          width,
          height,
          fit,
          focus,
          revealOpacity,
          'grayscale(1) contrast(1.42) brightness(0.42)',
        );
        ctx.save();
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
        radius: Math.max(112, Math.min(rect.width, rect.height) * 0.28),
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
  }, [assetHref, canReveal, fit, focus, revealOpacity]);

  return (
    <div
      ref={containerRef}
      className={`relative isolate overflow-hidden ${className}`}
      data-toga-fit={fit}
      data-toga-focus={focus}
      data-toga-reveal-root="true"
      aria-hidden="true"
    >
      <canvas
        ref={baseCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
        role="presentation"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
        role="presentation"
      />
    </div>
  );
}
