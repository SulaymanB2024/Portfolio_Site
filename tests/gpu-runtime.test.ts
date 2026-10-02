import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { GpuArtworkPool, GpuSketch, createGpuCanvasSketch, type GpuSurface, type GpuTarget } from '../src/personal/editorial/generative/gpu-runtime.ts';
import type { CanvasSketch } from '../src/personal/editorial/generative/canvas-runtime';

class DisplayCanvas {
  width = 400; height = 400;
  constructor(width = 400, height = 400) { this.width = width; this.height = height; }
  context = { globalCompositeOperation: 'source-over', drawImage() {} };
  getContext() { return this.context; }
}

function fixture() {
  const targets = new Set<GpuTarget>();
  const batches: Float32Array[] = [];
  const events: { kind: string; args: unknown[] }[] = [];
  let leases = 0;
  const record = (kind: string, ...args: unknown[]) => events.push({ kind, args });
  const surface: GpuSurface = {
    points: new Float32Array(65536 * 6),
    createTarget(width, height) { const target = { width, height, texture: {}, framebuffer: {} } as GpuTarget; targets.add(target); record('create', target); return target; },
    removeTarget(target) { assert(targets.delete(target), 'each texture must be released exactly once'); record('remove', target); },
    begin: target => record('begin', target), end: target => record('end', target),
    discs(target, points, count) { batches.push(points.slice(0, count * 6)); record('discs', target, count); },
    background: (target, gray, alpha) => record('background', target, gray, alpha),
    clear: target => record('clear', target), copy: (source, destination) => record('copy', source, destination),
    image: (target, source, rectangle, transform, logical) => record('image', target, source, [...rectangle], [...transform], [...logical]),
    present: target => record('present', target), retain() { leases++; }, release() { leases--; },
  };
  return { surface, targets, batches, events, get leases() { return leases; }, canvas: new DisplayCanvas() as unknown as OffscreenCanvas };
}

test('GPU points retain independent alpha, ordering, normalized weights, and edge intersections', () => {
  const f = fixture(), sketch = new GpuSketch(f.canvas, f.surface);
  sketch.createCanvas(400, 400);
  sketch.draw = () => {
    sketch.stroke(400, 96).point(10.5, 10.5).point(10.5, 10.5);
    sketch.strokeWeight(5).stroke(400, 480).point(20, 20).point(-1, 20);
    sketch.strokeWeight().strokeWeight(0).point(30, 30).point(NaN, 1).point(1, Infinity);
  };
  sketch.renderFrame();
  assert.equal(f.batches.length, 1, 'the source sequence should become one ordered GPU draw');
  const data = f.batches[0];
  assert.deepEqual(Array.from(data.slice(0, 12)), Array.from(new Float32Array([10.5, 10.5, .5, 0, 1, 96 / 255, 10.5, 10.5, .5, 0, 1, 96 / 255])));
  assert.deepEqual(Array.from(data.slice(12, 24)), [20, 20, 2.5, 0, 1, 1, -1, 20, 2.5, 0, 1, 1]);
  assert.equal(data[26], Math.fround(.00005));
  assert.equal(data.length, 30, 'nonfinite points are safe and an offscreen center with visible radius must survive');
  sketch.remove(); sketch.remove(); assert.equal(f.targets.size, 0); assert.equal(f.leases, 0);
});

test('trail backgrounds ignore transforms while each frame resets point transforms and preserves its texture', () => {
  const f = fixture(), sketch = new GpuSketch(f.canvas, f.surface, { physicalSize: 320 });
  sketch.createCanvas(400, 400);
  f.events.length = 0;
  sketch.draw = () => sketch.translate(100, 200).background(6, 96).stroke(255, 46).point(20, 30);
  sketch.renderFrame(); sketch.renderFrame();
  assert(f.batches.every(batch => batch[0] === 96 && batch[1] === 184 && batch[2] === Math.fround(.4)));
  const backgrounds = f.events.filter(event => event.kind === 'background');
  assert.equal(backgrounds.length, 2);
  assert.equal(backgrounds[0].args[0], backgrounds[1].args[0], 'trails must stay in the same retained texture');
  assert.deepEqual(backgrounds[0].args.slice(1), [6 / 255, 96 / 255]);
  assert(!f.events.some(event => event.kind === 'clear'), 'translucent backgrounds must not clear frame history');
  assert.deepEqual([sketch.width, sketch.height, f.canvas.width, f.canvas.height], [400, 400, 320, 320]);
  sketch.remove();
});

test('snapshots flush prior points, remain independent within a frame, reuse bounded textures, and preserve transformed image copies', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas');
  Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: DisplayCanvas });
  try {
    const f = fixture(), sketch = new GpuSketch(f.canvas, f.surface);
    sketch.createCanvas(400, 400); f.events.length = 0;
    sketch.draw = () => {
      sketch.stroke(255, 46).point(20, 30);
      const first = sketch.get(); sketch.point(30, 40); const second = sketch.get();
      assert.notEqual(first, second);
      sketch.background(9).translate(200, 200).rotate(Math.PI / 7).image(first, -200, -200).image(second, -200, -200);
    };
    for (let frame = 0; frame < 5; frame++) sketch.renderFrame();
    assert.equal(f.targets.size, 3, 'one retained study and two reusable snapshots must not grow per frame');
    const firstDisc = f.events.findIndex(event => event.kind === 'discs'), firstCopy = f.events.findIndex(event => event.kind === 'copy');
    assert(firstDisc >= 0 && firstDisc < firstCopy, 'get() must snapshot already-composited point batches');
    const images = f.events.filter(event => event.kind === 'image');
    assert.equal(images.length, 10);
    assert.deepEqual(images[0].args[2], [-200, -200, 400, 400]);
    const transform = images[0].args[3] as number[];
    assert(Math.abs(transform[0] - Math.cos(Math.PI / 7)) < 1e-12);
    assert.deepEqual(transform.slice(4), [200, 200]);
    sketch.remove(); assert.equal(f.targets.size, 0); assert.equal(f.leases, 0);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'OffscreenCanvas', descriptor);
    else delete (globalThis as { OffscreenCanvas?: unknown }).OffscreenCanvas;
  }
});

function reference() {
  let width = 100, height = 100, weight = 1, gray = 0, alpha = 1, fillGray = 1, fillAlpha = 1, enabled = true;
  let transform = [1, 0, 0, 1, 0, 0];
  const values: number[] = [];
  const disc = (x: number, y: number, radius: number, inner: number, color: number, opacity: number) => {
    if (!opacity || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const [a, b, c, d, e, f] = transform, cx = x * a + y * c + e, cy = x * b + y * d + f;
    if (cx + radius + .5 < 0 || cy + radius + .5 < 0 || cx - radius - .5 > width || cy - radius - .5 > height) return;
    values.push(cx, cy, radius, inner, color, opacity);
  };
  const api = {
    PI: Math.PI, abs: Math.abs, atan2: Math.atan2, cos: Math.cos, sin: Math.sin, mag: Math.hypot, draw: undefined as (() => void) | undefined,
    createCanvas(w: number, h: number) { width = w; height = h; gray = 0; alpha = 1; fillGray = 1; fillAlpha = 1; weight = 1; enabled = true; transform = [1, 0, 0, 1, 0, 0]; return api; },
    pixelDensity: () => 1,
    background: () => api, clear: () => api,
    stroke(g: number, a = 255) { enabled = true; gray = Math.round(Math.max(0, Math.min(255, g))) / 255; alpha = Math.max(0, Math.min(1, a / 255)); return api; },
    strokeWeight(w?: number) { const value = w === undefined || w === 0 ? .0001 : w; if (Number.isFinite(value) && value > 0) weight = value; return api; },
    fill(g: number, a = 255) { fillGray = Math.round(Math.max(0, Math.min(255, g))) / 255; fillAlpha = Math.max(0, Math.min(1, a / 255)); return api; },
    noStroke() { enabled = false; return api; },
    point(x: number, y: number) { if (enabled) disc(x, y, weight / 2, 0, gray, alpha); return api; },
    circle(x: number, y: number, diameter: number) { disc(x, y, Math.abs(diameter) / 2, 0, fillGray, fillAlpha); if (enabled) disc(x, y, Math.abs(diameter) / 2 + weight / 2, Math.max(0, Math.abs(diameter) / 2 - weight / 2), gray, alpha); return api; },
    translate(x: number, y: number) { const [a, b, c, d, e, f] = transform; transform[4] = e + a * x + c * y; transform[5] = f + b * x + d * y; return api; },
    rotate(angle: number) { const [a, b, c, d, e, f] = transform, cosine = Math.cos(angle), sine = Math.sin(angle); transform = [a * cosine + c * sine, b * cosine + d * sine, c * cosine - a * sine, d * cosine - b * sine, e, f]; return api; },
    get: () => ({ canvas: {}, width, height }), image: () => api,
  };
  return { api: api as unknown as CanvasSketch, frame() { values.length = 0; transform = [1, 0, 0, 1, 0, 0]; api.draw?.(); return new Float32Array(values); } };
}

test('all 44 untouched formulas produce the same ordered point geometry, sizes, and alpha through the GPU API', async () => {
  const directory = new URL('../src/personal/editorial/generative/sketches/', import.meta.url);
  const files = (await readdir(directory)).filter(file => /^yuru-\d+\.ts$/.test(file)).sort();
  assert.equal(files.length, 44);
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window'), offscreenDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { devicePixelRatio: 1 } });
  Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: DisplayCanvas });
  try {
    for (const file of files) {
      const { default: factory } = await import(new URL(file, directory).href);
      const f = fixture(), expected = reference();
      factory(expected.api);
      const runtime = createGpuCanvasSketch(factory, f.canvas, f.surface);
      for (let frame = 0; frame < 2; frame++) {
        f.batches.length = 0;
        const geometry = expected.frame(); runtime.draw();
        const actual = new Float32Array(f.batches.reduce((count, batch) => count + batch.length, 0));
        let offset = 0; for (const batch of f.batches) { actual.set(batch, offset); offset += batch.length; }
        assert.equal(actual.length, geometry.length, `${file}: point count`);
        for (let value = 0; value < geometry.length; value++) assert.equal(actual[value], geometry[value], `${file}: ordered geometry field ${value}`);
      }
      runtime.remove(); assert.equal(f.targets.size, 0, `${file}: release all textures`);
    }
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor); else delete (globalThis as { window?: unknown }).window;
    if (offscreenDescriptor) Object.defineProperty(globalThis, 'OffscreenCanvas', offscreenDescriptor); else delete (globalThis as { OffscreenCanvas?: unknown }).OffscreenCanvas;
  }
});

test('one actual GPU pool serves multiple display canvases and releases contexts, textures, buffers, and lost resources', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas');
  const assets = new Set<object>(), calls: { kind: string; args: unknown[] }[] = [];
  let contexts = 0, lost = false, loseCount = 0, constant = 1;
  const listeners = new Set<unknown>();
  const allocate = () => { const asset = {}; assets.add(asset); return asset; };
  const release = (asset: object) => { assets.delete(asset); };
  const gl = new Proxy<Record<string, unknown>>({
    createShader: allocate, createProgram: allocate, createBuffer: allocate, createVertexArray: allocate, createTexture: allocate, createFramebuffer: allocate,
    deleteShader: release, deleteProgram: release, deleteBuffer: release, deleteVertexArray: release, deleteTexture: release, deleteFramebuffer: release,
    getShaderParameter: () => true, getProgramParameter: () => true, getUniformLocation: () => ({}), isContextLost: () => lost,
    getExtension: (name: string) => name === 'WEBGL_lose_context' ? { loseContext() { loseCount++; } } : null,
    checkFramebufferStatus: () => gl.FRAMEBUFFER_COMPLETE,
  }, { get(target, key) {
    if (key in target) return target[key as string];
    if (typeof key === 'string' && /^[A-Z_0-9]+$/.test(key)) return target[key] = constant++;
    return (...args: unknown[]) => calls.push({ kind: String(key), args });
  } });
  class GpuCanvas extends DisplayCanvas {
    getContext(kind?: string) { if (kind === 'webgl2') { contexts++; return gl as unknown as typeof this.context; } return this.context; }
    addEventListener(_kind: string, listener: unknown) { listeners.add(listener); }
    removeEventListener(_kind: string, listener: unknown) { listeners.delete(listener); }
  }
  Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: GpuCanvas });
  try {
    const pool = new GpuArtworkPool();
    const jobs = Array.from({ length: 16 }, () => createGpuCanvasSketch(api => {
      api.createCanvas(400, 400); api.draw = () => api.background(9).stroke(255, 96).point(20, 30).point(20, 30);
    }, new GpuCanvas() as unknown as OffscreenCanvas, pool, { physicalSize: 320 }));
    jobs.forEach(job => job.draw());
    assert.equal(contexts, 1, 'adding art must never allocate a WebGL context per placement');
    const batches = calls.filter(call => call.kind === 'drawArraysInstanced');
    assert.equal(batches.length, 16); assert(batches.every(call => call.args[3] === 2), 'each alpha overlap remains a separate ordered instance');
    assert(calls.some(call => call.kind === 'blendFunc' && call.args[0] === gl.ONE && call.args[1] === gl.ONE_MINUS_SRC_ALPHA));
    assert(calls.some(call => call.kind === 'blitFramebuffer' && call.args[5] === 80 && call.args[7] === 400), '320px display copies must crop the shared canvas correctly');
    jobs.slice(0, 15).forEach(job => job.remove()); assert.equal(loseCount, 0);
    lost = true;
    assert.throws(() => jobs[15].draw(), /lost|unavailable/);
    jobs[15].remove(); pool.dispose();
    assert.equal(assets.size, 0, 'last removal must release every texture/program/buffer');
    assert.equal(loseCount, 1); assert.equal(listeners.size, 0);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'OffscreenCanvas', descriptor);
    else delete (globalThis as { OffscreenCanvas?: unknown }).OffscreenCanvas;
  }
});
