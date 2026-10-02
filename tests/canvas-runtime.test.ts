import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { CanvasSketch, createCanvasSketch, createOffscreenCanvasSketch } from '../src/personal/editorial/generative/canvas-runtime.ts';

type Operation = { kind: string; args: unknown[]; color: string; transform: number[] };

class RecordingContext {
  private currentFillStyle = '#000000';
  fillStyleWrites = 0;
  get fillStyle() { return this.currentFillStyle; }
  set fillStyle(value: string) { this.currentFillStyle = value; this.fillStyleWrites++; }
  strokeStyle = '#000000';
  private currentLineWidth = 1;
  lineWidthWrites = 0;
  get lineWidth() { return this.currentLineWidth; }
  set lineWidth(value: number) { this.currentLineWidth = value; this.lineWidthWrites++; }
  lineCap = 'butt';
  globalAlpha = 1;
  globalCompositeOperation = 'source-over';
  transform = [1, 0, 0, 1, 0, 0];
  operations: Operation[] = [];
  counts: Record<string, number> = {};
  capture = true;
  private stack: { transform: number[]; fill: string; stroke: string }[] = [];

  record(kind: string, ...args: unknown[]) {
    this.counts[kind] = (this.counts[kind] ?? 0) + 1;
    if (this.capture) this.operations.push({ kind, args, color: this.fillStyle, transform: [...this.transform] });
  }
  setTransform(...values: number[]) { this.transform = values; this.record('setTransform', ...values); }
  save() { this.stack.push({ transform: [...this.transform], fill: this.fillStyle, stroke: this.strokeStyle }); }
  restore() {
    const state = this.stack.pop();
    assert(state);
    this.transform = state.transform;
    this.fillStyle = state.fill;
    this.strokeStyle = state.stroke;
  }
  translate(x: number, y: number) {
    const [a, b, c, d, e, f] = this.transform;
    this.transform = [a, b, c, d, e + a * x + c * y, f + b * x + d * y];
    this.record('translate', x, y);
  }
  rotate(angle: number) {
    const [a, b, c, d, e, f] = this.transform;
    const cosine = Math.cos(angle), sine = Math.sin(angle);
    this.transform = [a * cosine + c * sine, b * cosine + d * sine, c * cosine - a * sine, d * cosine - b * sine, e, f];
    this.record('rotate', angle);
  }
  beginPath() { this.record('beginPath'); }
  closePath() { this.record('closePath'); }
  arc(...args: number[]) { assert(args.every(Number.isFinite)); this.record('arc', ...args); }
  ellipse(...args: number[]) { assert(args.every(Number.isFinite)); this.record('ellipse', ...args); }
  fill() { this.record('fill'); }
  stroke() { this.record('stroke'); }
  fillRect(...args: number[]) { this.record('fillRect', ...args); }
  clearRect(...args: number[]) { this.record('clearRect', ...args); }
  drawImage(...args: unknown[]) { this.record('drawImage', ...args); }
}

function fixture(capture = true) {
  const canvases: FakeCanvas[] = [];
  const children: FakeCanvas[] = [];
  class FakeCanvas {
    width = 300;
    height = 150;
    style = { width: '', height: '' };
    context = new RecordingContext();
    constructor() { this.context.capture = capture; }
    getContext(kind: string) { assert.equal(kind, '2d'); return this.context; }
    setAttribute() {}
    remove() { const index = children.indexOf(this); if (index >= 0) children.splice(index, 1); }
  }
  const host = {
    ownerDocument: {
      createElement(kind: string) { assert.equal(kind, 'canvas'); const canvas = new FakeCanvas(); canvases.push(canvas); return canvas; },
    },
    appendChild(canvas: FakeCanvas) { children.push(canvas); },
  };
  return { host: host as unknown as HTMLElement, canvases, children, FakeCanvas };
}

test('points remain individual round alpha composites, with grayscale and alpha clamped', () => {
  const { host, canvases } = fixture();
  const sketch = new CanvasSketch(host);
  const writesBefore = canvases[0].context.fillStyleWrites;
  sketch.stroke(400, 96).point(10.5, 10.5).point(10.5, 10.5);
  const context = canvases[0].context;
  assert.equal(context.counts.fill, 2, 'overlapping translucent points must not collapse into one fill');
  assert.equal(context.fillStyleWrites - writesBefore, 1, 'a point batch should not restore/reapply the same paint for every point');
  assert.deepEqual(context.operations.filter(o => o.kind === 'arc').map(o => o.args.slice(0, 3)), [[10.5, 10.5, 0.5], [10.5, 10.5, 0.5]]);
  assert(context.operations.filter(o => o.kind === 'fill').every(o => o.color === `rgba(255,255,255,${96 / 255})`));
  sketch.strokeWeight(5).stroke(400, 480).point(20, 20);
  assert.equal(context.operations.findLast(o => o.kind === 'arc')?.args[2], 2.5);
  assert.equal(context.operations.findLast(o => o.kind === 'fill')?.color, 'rgba(255,255,255,1)');
  sketch.stroke(-10, -1).point(25, 25);
  assert.equal(context.operations.findLast(o => o.kind === 'fill')?.color, 'rgba(0,0,0,0)');
  const count = context.counts.arc;
  sketch.point(NaN, 1).point(1, Infinity);
  assert.equal(context.counts.arc, count, 'singular formula coordinates must not reach Canvas arc');
});

test('repeated normalized stroke weights avoid native assignments while radius changes preserve p5 defaults', () => {
  const { host, canvases } = fixture();
  const sketch = new CanvasSketch(host);
  const context = canvases[0].context;
  const initialWrites = context.lineWidthWrites;
  sketch.strokeWeight(1).strokeWeight(1).point(10, 10);
  assert.equal(context.lineWidthWrites, initialWrites, 'the initial default weight is already applied');
  assert.equal(context.operations.findLast(o => o.kind === 'arc')?.args[2], .5);
  sketch.strokeWeight(5).strokeWeight(5).point(10, 10);
  assert.equal(context.lineWidthWrites, initialWrites + 1);
  assert.equal(context.lineWidth, 5);
  assert.equal(context.operations.findLast(o => o.kind === 'arc')?.args[2], 2.5);
  sketch.strokeWeight().strokeWeight(0).strokeWeight(-0).strokeWeight().point(10, 10);
  assert.equal(context.lineWidthWrites, initialWrites + 2, 'undefined and zero share the same tiny positive weight');
  assert.equal(context.lineWidth, .0001);
  assert.equal(context.operations.findLast(o => o.kind === 'arc')?.args[2], .00005);
  sketch.strokeWeight(-1).strokeWeight(NaN).strokeWeight(Infinity);
  assert.equal(context.lineWidthWrites, initialWrites + 2, 'invalid weights retain the previous native state');
  sketch.strokeWeight(1).strokeWeight(1).point(10, 10);
  assert.equal(context.lineWidthWrites, initialWrites + 3);
  assert.equal(context.lineWidth, 1);
  assert.equal(context.operations.findLast(o => o.kind === 'arc')?.args[2], .5);
  sketch.createCanvas(400, 400);
  const resetWrites = context.lineWidthWrites;
  sketch.strokeWeight(1).point(10, 10);
  assert.equal(context.lineWidthWrites, resetWrites, 'canvas creation restores both the native and cached default');
  assert.equal(context.operations.findLast(o => o.kind === 'arc')?.args[2], .5);
});

test('backgrounds and clear ignore transforms, translucent backgrounds retain trails, and frame transforms reset', () => {
  const { host, canvases } = fixture();
  const runtime = createCanvasSketch(sketch => {
    sketch.draw = () => { sketch.translate(200, 200); sketch.background(6, 96); sketch.point(1, 2); };
  }, host);
  runtime.draw(); runtime.draw();
  const context = canvases[0].context;
  const backgrounds = context.operations.filter(o => o.kind === 'fillRect');
  assert.equal(backgrounds.length, 2);
  assert(backgrounds.every(o => o.color === `rgba(6,6,6,${96 / 255})`));
  assert(backgrounds.every(o => o.transform.join() === '1,0,0,1,0,0'));
  assert.equal(context.counts.clearRect ?? 0, 0, 'alpha backgrounds must not clear the history');
  assert(context.operations.filter(o => o.kind === 'arc').every(o => o.transform.join() === '1,0,0,1,200,200'));
  const sketch = new CanvasSketch(host);
  sketch.translate(10, 20).clear(200);
  const clear = canvases[1].context.operations.find(o => o.kind === 'clearRect');
  assert.deepEqual(clear?.transform, [1, 0, 0, 1, 0, 0]);
  assert.deepEqual(canvases[1].context.transform, [1, 0, 0, 1, 10, 20]);
});

test('snapshot copies are independent and transformed image copies preserve the symmetry sketch contract', () => {
  const { host, canvases } = fixture();
  const sketch = new CanvasSketch(host);
  sketch.createCanvas(400, 400).stroke(255, 46).point(20, 30);
  const first = sketch.get(), second = sketch.get();
  assert.notEqual(first.canvas, sketch.canvas);
  assert.notEqual(first.canvas, second.canvas);
  assert.deepEqual([first.width, first.height], [400, 400]);
  assert.equal(canvases[1].context.operations.find(o => o.kind === 'drawImage')?.args[0], sketch.canvas);
  sketch.background(9).translate(200, 200).rotate(Math.PI / 7).image(first, -200, -200);
  const copy = canvases[0].context.operations.findLast(o => o.kind === 'drawImage');
  assert.equal(copy?.args[0], first.canvas);
  assert.deepEqual(copy?.args.slice(1), [0, 0, 400, 400, -200, -200, 400, 400]);
  assert(Math.abs((copy?.transform[0] ?? 0) - Math.cos(Math.PI / 7)) < 1e-12);
  assert.deepEqual(copy?.transform.slice(4), [200, 200]);
});

test('small previews retain 400-unit formulas while scaling transforms and snapshot copies to physical pixels', () => {
  const { host, canvases } = fixture();
  const sketch = new CanvasSketch(host, { physicalSize: 160 });
  sketch.createCanvas(400, 400).stroke(255, 96).point(200, 200);
  assert.deepEqual([sketch.width, sketch.height], [400, 400]);
  assert.deepEqual([sketch.canvas.width, sketch.canvas.height], [160, 160]);
  const point = canvases[0].context.operations.findLast(o => o.kind === 'arc');
  assert.deepEqual(point?.args.slice(0, 3), [200, 200, .5]);
  assert.deepEqual(point?.transform, [.4, 0, 0, .4, 0, 0]);
  const snapshot = sketch.get();
  assert.deepEqual([snapshot.width, snapshot.height], [400, 400]);
  assert.deepEqual([snapshot.canvas.width, snapshot.canvas.height], [160, 160]);
  sketch.background(9).translate(200, 200).rotate(Math.PI / 7).image(snapshot, -200, -200);
  const background = canvases[0].context.operations.findLast(o => o.kind === 'fillRect');
  assert.deepEqual(background?.args, [0, 0, 400, 400]);
  assert.deepEqual(background?.transform, [.4, 0, 0, .4, 0, 0]);
  const copy = canvases[0].context.operations.findLast(o => o.kind === 'drawImage');
  assert.deepEqual(copy?.args.slice(1), [0, 0, 160, 160, -200, -200, 400, 400]);
  assert.deepEqual(copy?.transform.slice(4), [80, 80]);
  assert.throws(() => new CanvasSketch(host, { physicalSize: NaN }), /finite/);
});

test('default circles, noStroke, fixed density and teardown remain usable without a scheduler', () => {
  const { host, canvases, children } = fixture();
  const sketch = new CanvasSketch(host);
  sketch.circle(10, 10, 2);
  assert.equal(canvases[0].context.counts.fill, 1);
  assert.equal(canvases[0].context.counts.stroke, 1);
  sketch.noStroke().fill(400, 116).circle(15, 15, 1).point(20, 20);
  assert.equal(canvases[0].context.counts.fill, 2);
  assert.equal(canvases[0].context.counts.stroke, 1);
  assert.equal(sketch.pixelDensity(3), 1);
  sketch.remove();
  const runtime = createCanvasSketch(instance => { instance.draw = () => instance.createCanvas(400, 400); }, host);
  assert.equal(runtime.draw(), true);
  assert.deepEqual([runtime.width, runtime.height], [400, 400]);
  runtime.remove(); runtime.remove();
  assert.equal(runtime.draw(), false);
  assert.equal(children.length, 0);
  assert.deepEqual([runtime.canvas.width, runtime.canvas.height], [0, 0]);
  assert.throws(() => createCanvasSketch(() => { throw new Error('factory failure'); }, host), /factory failure/);
  assert.equal(children.length, 0, 'failed factories must not leave an owned canvas behind');
});

test('the injected offscreen surface preserves default 400px draw operations, alpha overlap, and snapshot transforms', () => {
  const dom = fixture(), off = fixture();
  class FakeOffscreenCanvas extends off.FakeCanvas {
    constructor(width: number, height: number) { super(); this.width = width; this.height = height; off.canvases.push(this); }
  }
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas');
  Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: FakeOffscreenCanvas });
  try {
    const factory = (sketch: CanvasSketch) => {
      sketch.createCanvas(400, 400);
      let phase = 0;
      sketch.draw = () => {
        sketch.background(6, 96).translate(200, 200).stroke(255, 96).strokeWeight(5);
        sketch.point(20 + phase, 30).point(20 + phase, 30).fill(100, 116).circle(30, 40, 5);
        const copy = sketch.get();
        sketch.clear().rotate(Math.PI / 7).image(copy, -200, -200);
        phase++;
      };
    };
    const native = createCanvasSketch(factory, dom.host);
    const background = new FakeOffscreenCanvas(400, 400);
    const worker = createOffscreenCanvasSketch(factory, background as unknown as OffscreenCanvas);
    native.draw(); native.draw(); worker.draw(); worker.draw();
    const normalize = (operations: Operation[]) => operations.map(operation => ({ ...operation,
      args: operation.args.map(argument => argument && typeof argument === 'object' && 'getContext' in argument
        ? { width: (argument as { width: number }).width, height: (argument as { height: number }).height } : argument),
    }));
    assert.deepEqual([worker.width, worker.height, worker.canvas.width, worker.canvas.height], [400, 400, 400, 400]);
    assert.equal(off.children.length, 0, 'offscreen rendering must never append to the DOM');
    assert.equal(off.canvases.length, dom.canvases.length, 'only source-requested snapshots allocate extra canvases');
    for (let index = 0; index < dom.canvases.length; index++) {
      assert.deepEqual(normalize(off.canvases[index].context.operations), normalize(dom.canvases[index].context.operations));
    }
    assert.equal(background.context.counts.arc, 4, 'translucent point overlaps still composite independently');
    worker.remove(); worker.remove(); native.remove();
    assert.equal(worker.draw(), false);
    assert.deepEqual([background.width, background.height], [0, 0]);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'OffscreenCanvas', descriptor);
    else delete (globalThis as { OffscreenCanvas?: unknown }).OffscreenCanvas;
  }
});

test('all 44 unchanged artist factories execute multiple frames through both DOM and offscreen surfaces', async () => {
  const directory = new URL('../src/personal/editorial/generative/sketches/', import.meta.url);
  const files = (await readdir(directory)).filter(file => /^yuru-\d+\.ts$/.test(file)).sort();
  assert.equal(files.length, 44);
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const offscreenDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { devicePixelRatio: 3 } });
  try {
    for (const file of files) {
      const { default: factory } = await import(new URL(file, directory).href);
      const { host, canvases, children } = fixture(false);
      const runtime = createCanvasSketch(factory, host);
      assert.equal(runtime.draw(), true, `${file}: first frame`);
      assert.equal(runtime.draw(), true, `${file}: next frame`);
      assert.deepEqual([runtime.width, runtime.height], [400, 400], file);
      assert((canvases[0].context.counts.fill ?? 0) > 0, `${file}: real geometric paint`);
      assert.equal(children.length, 1, `${file}: one owned canvas`);
      const off = fixture(false);
      class FakeOffscreenCanvas extends off.FakeCanvas {
        constructor(width: number, height: number) { super(); this.width = width; this.height = height; off.canvases.push(this); }
      }
      Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: FakeOffscreenCanvas });
      const canvas = new FakeOffscreenCanvas(400, 400);
      const worker = createOffscreenCanvasSketch(factory, canvas as unknown as OffscreenCanvas);
      assert.equal(worker.draw(), true, `${file}: worker first frame`);
      assert.equal(worker.draw(), true, `${file}: worker next frame`);
      assert.deepEqual(canvas.context.counts, canvases[0].context.counts, `${file}: both surfaces must perform the same drawing`);
      worker.remove();
      assert.deepEqual([canvas.width, canvas.height], [0, 0], `${file}: worker releases its bitmap`);
      runtime.remove();
      assert.equal(children.length, 0, `${file}: clean teardown`);
    }
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else delete (globalThis as { window?: unknown }).window;
    if (offscreenDescriptor) Object.defineProperty(globalThis, 'OffscreenCanvas', offscreenDescriptor);
    else delete (globalThis as { OffscreenCanvas?: unknown }).OffscreenCanvas;
  }
});
