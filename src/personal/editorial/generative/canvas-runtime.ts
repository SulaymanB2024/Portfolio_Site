import type { P5SketchFactory } from './types';

export type SketchCanvas = HTMLCanvasElement | OffscreenCanvas;
type SketchContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export type CanvasSketchImage = {
  canvas: SketchCanvas;
  width: number;
  height: number;
};

export type CanvasSketchController = {
  readonly canvas: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  draw(): boolean;
  remove(): void;
};

export type CanvasSketchOptions = { physicalSize?: number };

export type SketchRenderStats = { formulaMs: number; submitMs: number; presentMs: number; points: number; drawCalls: number; gpuMs?: number };
export type OffscreenSketchController = Omit<CanvasSketchController, 'canvas'> & { readonly canvas: OffscreenCanvas; engine?: 'gpu' | 'canvas'; getRenderStats?(): SketchRenderStats };

type RenderingSurface = {
  canvas: SketchCanvas;
  createSnapshot(width: number, height: number): SketchCanvas;
  remove?(): void;
};

function grayColor(gray: number, alpha = 255): string | undefined {
  if (Number.isNaN(gray) || Number.isNaN(alpha)) return undefined;
  const channel = Math.round(Math.max(0, Math.min(255, gray)));
  const opacity = Math.max(0, Math.min(1, alpha / 255));
  return `rgba(${channel},${channel},${channel},${opacity})`;
}

/**
 * The Canvas2D subset used by the 44 reviewed artist factories, at density 1.
 * Point shape, grayscale alpha, and frame transforms follow p5 1.11.3:
 * https://github.com/processing/p5.js/tree/v1.11.3/src/core
 * Scheduling and visibility belong to the component, not this adapter.
 */
export class CanvasSketch {
  readonly PI = Math.PI;
  readonly abs = Math.abs;
  readonly atan2 = Math.atan2;
  readonly cos = Math.cos;
  readonly sin = Math.sin;
  readonly mag = Math.hypot;
  readonly canvas: SketchCanvas;
  draw: (() => void) | undefined;

  private readonly context: SketchContext;
  private readonly surface: RenderingSurface;
  private readonly renderScale: number;
  private logicalWidth = 100;
  private logicalHeight = 100;
  private strokeColor = 'rgba(0,0,0,1)';
  private fillColor = 'rgba(255,255,255,1)';
  private appliedFill = this.fillColor;
  private strokeGray = 0;
  private strokeAlpha = 255;
  private pointRadius = 0.5;
  private strokeEnabled = true;
  private removed = false;

  constructor(target: HTMLElement | RenderingSurface, options: CanvasSketchOptions = {}) {
    if (options.physicalSize !== undefined && !Number.isFinite(options.physicalSize)) {
      throw new RangeError('Physical sketch size must be finite.');
    }
    this.renderScale = options.physicalSize === undefined ? 1 : Math.max(160, Math.min(400, options.physicalSize)) / 400;
    if ('createSnapshot' in target) this.surface = target;
    else {
      const document = target.ownerDocument;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      this.surface = {
        canvas,
        createSnapshot(width, height) {
          const copy = document.createElement('canvas');
          copy.width = width;
          copy.height = height;
          return copy;
        },
        remove: () => canvas.remove(),
      };
    }
    this.canvas = this.surface.canvas;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas2D is unavailable.');
    this.context = context as SketchContext;
    this.createCanvas(100, 100);
    if (!('createSnapshot' in target)) target.appendChild(this.canvas as HTMLCanvasElement);
  }

  get width(): number { return this.logicalWidth; }
  get height(): number { return this.logicalHeight; }

  createCanvas(width: number, height: number): this {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      throw new RangeError('Sketch dimensions must be positive and finite.');
    }
    this.logicalWidth = Math.floor(width);
    this.logicalHeight = Math.floor(height);
    this.canvas.width = Math.max(1, Math.round(this.logicalWidth * this.renderScale));
    this.canvas.height = Math.max(1, Math.round(this.logicalHeight * this.renderScale));
    this.strokeColor = 'rgba(0,0,0,1)';
    this.fillColor = 'rgba(255,255,255,1)';
    this.appliedFill = this.fillColor;
    this.strokeGray = 0;
    this.strokeAlpha = 255;
    this.pointRadius = 0.5;
    this.strokeEnabled = true;
    this.context.fillStyle = this.fillColor;
    this.context.strokeStyle = this.strokeColor;
    this.context.lineWidth = 1;
    this.context.lineCap = 'round';
    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = 'source-over';
    this.context.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);
    return this;
  }

  pixelDensity(_requested?: number): number { return 1; }

  background(gray: number, alpha?: number): this {
    const color = grayColor(gray, alpha);
    if (color === undefined) return this;
    const context = this.context;
    context.save();
    context.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);
    context.fillStyle = color;
    // A translucent background preserves the previous frame's trails.
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
    return this;
  }

  clear(..._ignored: number[]): this {
    const context = this.context;
    context.save();
    context.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);
    context.clearRect(0, 0, this.width, this.height);
    context.restore();
    return this;
  }

  stroke(gray: number, alpha = 255): this {
    this.strokeEnabled = true;
    if (gray === this.strokeGray && alpha === this.strokeAlpha) return this;
    const color = grayColor(gray, alpha);
    if (color !== undefined) {
      this.strokeColor = color;
      this.strokeGray = gray;
      this.strokeAlpha = alpha;
    }
    return this;
  }

  strokeWeight(weight?: number): this {
    const normalized = weight === undefined || weight === 0 ? 0.0001 : weight;
    if (!Number.isFinite(normalized) || normalized <= 0 || normalized === this.pointRadius * 2) return this;
    this.context.lineWidth = normalized;
    this.pointRadius = normalized / 2;
    return this;
  }

  noStroke(): this { this.strokeEnabled = false; return this; }

  fill(gray: number, alpha?: number): this {
    const color = grayColor(gray, alpha);
    if (color !== undefined) this.fillColor = color;
    return this;
  }

  point(x: number, y: number): this {
    if (!this.strokeEnabled || !Number.isFinite(x) || !Number.isFinite(y)) return this;
    const context = this.context;
    if (this.appliedFill !== this.strokeColor) {
      context.fillStyle = this.strokeColor;
      this.appliedFill = this.strokeColor;
    }
    // Each point must composite separately: batching changes translucent overlaps.
    context.beginPath();
    context.arc(x, y, this.pointRadius, 0, Math.PI * 2);
    context.fill();
    return this;
  }

  circle(x: number, y: number, diameter: number): this {
    if (![x, y, diameter].every(Number.isFinite)) return this;
    const context = this.context;
    context.beginPath();
    context.ellipse(x, y, Math.abs(diameter) / 2, Math.abs(diameter) / 2, 0, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = this.fillColor;
    this.appliedFill = this.fillColor;
    context.fill();
    if (this.strokeEnabled) {
      context.strokeStyle = this.strokeColor;
      context.stroke();
    }
    return this;
  }

  translate(x: number, y: number): this {
    if (Number.isFinite(x) && Number.isFinite(y)) this.context.translate(x, y);
    return this;
  }

  rotate(angle: number): this {
    if (Number.isFinite(angle)) this.context.rotate(angle);
    return this;
  }

  get(): CanvasSketchImage {
    const canvas = this.surface.createSnapshot(this.canvas.width, this.canvas.height);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas2D snapshot is unavailable.');
    (context as SketchContext).drawImage(this.canvas, 0, 0);
    return { canvas, width: this.width, height: this.height };
  }

  image(image: CanvasSketchImage, x: number, y: number, width = image.width, height = image.height): this {
    if (![x, y, width, height].every(Number.isFinite)) return this;
    this.context.drawImage(image.canvas, 0, 0, image.canvas.width, image.canvas.height, x, y, width, height);
    return this;
  }

  renderFrame(): boolean {
    if (this.removed || !this.draw) return false;
    this.context.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);
    this.draw();
    return true;
  }

  remove(): void {
    if (this.removed) return;
    this.removed = true;
    this.draw = undefined;
    this.surface.remove?.();
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.logicalWidth = 0;
    this.logicalHeight = 0;
  }
}

export function createCanvasSketch(factory: P5SketchFactory, host: HTMLElement, options: CanvasSketchOptions = {}): CanvasSketchController {
  const instance = new CanvasSketch(host, options);
  try {
    factory(instance);
  } catch (error) {
    instance.remove();
    throw error;
  }
  return {
    canvas: instance.canvas as HTMLCanvasElement,
    get width() { return instance.width; },
    get height() { return instance.height; },
    draw: () => instance.renderFrame(),
    remove: () => instance.remove(),
  };
}

export function createOffscreenCanvasSketch(factory: P5SketchFactory, canvas: OffscreenCanvas, options: CanvasSketchOptions = {}): OffscreenSketchController {
  const instance = new CanvasSketch({
    canvas,
    createSnapshot: (width, height) => new OffscreenCanvas(width, height),
  }, options);
  try { factory(instance); }
  catch (error) { instance.remove(); throw error; }
  return {
    canvas,
    engine: 'canvas',
    get width() { return instance.width; },
    get height() { return instance.height; },
    draw: () => instance.renderFrame(),
    remove: () => instance.remove(),
  };
}
