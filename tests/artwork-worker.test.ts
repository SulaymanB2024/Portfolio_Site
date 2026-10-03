import test from 'node:test';
import assert from 'node:assert/strict';
import { createArtworkWorkerBackend, type ArtworkWorkerTransport } from '../src/personal/editorial/artwork-worker-backend.ts';
import { createArtworkWorkerHost } from '../src/personal/editorial/artwork-worker-host.ts';
import { createPreviewScheduler } from '../src/personal/editorial/preview-scheduler.ts';
import type { ArtworkWorkerCommand, ArtworkWorkerReply } from '../src/personal/editorial/artwork-worker-protocol';
import type { P5SketchFactory, SketchId } from '../src/personal/editorial/generative/types';

const source: P5SketchFactory = () => {};
const frame = { frames: 1, drawMs: 2, averageMs: 2, targetFps: 12 };

function bridgeFixture(enabled = true) {
  const messages: { command: ArtworkWorkerCommand; transfer: Transferable[] }[] = [];
  const listeners = new Set<(reply: unknown) => void>();
  const errors = new Set<(error: unknown) => void>();
  const children: FakeCanvas[] = [];
  let connections = 0, terminations = 0;
  class FakeCanvas {
    private physicalWidth = 300;
    private physicalHeight = 150;
    transferred = false;
    style = { width: '', height: '' };
    get width() { return this.physicalWidth; }
    set width(value: number) { assert(!this.transferred, 'a transferred DOM canvas cannot be resized during teardown'); this.physicalWidth = value; }
    get height() { return this.physicalHeight; }
    set height(value: number) { assert(!this.transferred, 'a transferred DOM canvas cannot be resized during teardown'); this.physicalHeight = value; }
    setAttribute() {}
    transferControlToOffscreen() {
      assert(!this.transferred, 'canvas must transfer once');
      this.transferred = true;
      return { width: this.width, height: this.height } as OffscreenCanvas;
    }
    remove() { const index = children.indexOf(this); if (index >= 0) children.splice(index, 1); }
  }
  const host = {
    ownerDocument: { createElement() { return new FakeCanvas(); } },
    appendChild(canvas: FakeCanvas) { children.push(canvas); },
  } as unknown as HTMLElement;
  const transport: ArtworkWorkerTransport = {
    post(command, transfer = []) { messages.push({ command, transfer }); },
    onMessage(callback) { listeners.add(callback); return () => listeners.delete(callback); },
    onError(callback) { errors.add(callback); return () => errors.delete(callback); },
    terminate() { terminations++; },
  };
  const backend = createArtworkWorkerBackend(() => { connections++; return transport; }, () => enabled);
  return {
    backend, host, children, messages, transport, listeners, errors,
    get connections() { return connections; }, get terminations() { return terminations; },
    reply(reply: unknown) { for (const listener of [...listeners]) listener(reply); },
    fail(error: unknown) { for (const callback of [...errors]) callback(error); },
  };
}

test('all artwork placements share one worker, transfer once, gate queued frames, and terminate after the last removal', () => {
  const f = bridgeFixture();
  const received: number[] = [], jobs: number[][] = [[], []];
  const first = f.backend.register({ host: f.host, sketchId: 'yuru-06', physicalSize: 400, active: true,
    onFrame: stats => received.push(stats.frames), onError: error => assert.fail(String(error)), onJobs: count => jobs[0].push(count) });
  const second = f.backend.register({ host: f.host, sketchId: 'yuru-42', physicalSize: 192, active: true,
    onFrame: () => {}, onError: error => assert.fail(String(error)), onJobs: count => jobs[1].push(count) });
  assert(first && second);
  assert.equal(f.connections, 1);
  assert.deepEqual(f.backend.getStats(), { registered: 2, workerCount: 1, disabled: false });
  const registrations = f.messages.filter(item => item.command.type === 'register');
  assert.equal(registrations.length, 2);
  for (const message of registrations) {
    assert.equal(message.transfer.length, 1);
    assert.equal(message.transfer[0], (message.command as Extract<ArtworkWorkerCommand, { type: 'register' }>).canvas);
  }
  assert.deepEqual(f.children.map(canvas => [canvas.width, canvas.height]), [[400, 400], [192, 192]]);
  f.reply({ type: 'frame', id: 1, stats: frame });
  assert.deepEqual(received, [1]);
  first.setActive(false); first.setActive(false);
  f.reply({ type: 'frame', id: 1, stats: { ...frame, frames: 2 } });
  assert.deepEqual(received, [1], 'pause must reject an already queued frame callback');
  first.setActive(true);
  f.reply({ type: 'frame', id: 1, stats: { ...frame, frames: 3 } });
  assert.deepEqual(received, [1, 3]);
  f.reply({ type: 'frame', id: 1, stats: { ...frame, frames: NaN } });
  f.reply({ type: 'frame', id: 100, stats: frame });
  assert.equal(first.getStats().frames, 3);
  first.remove(); first.remove();
  f.reply({ type: 'frame', id: 1, stats: { ...frame, frames: 4 } });
  assert.deepEqual(received, [1, 3], 'a removed placement cannot be resurrected by a late reply');
  assert.equal(f.terminations, 0);
  assert.equal(f.children.length, 1);
  assert.equal(jobs[1].at(-1), 1);
  assert(f.messages.some(item => item.command.type === 'remove' && item.command.id === 1));
  second.remove(); second.setActive(true);
  assert.equal(f.terminations, 1);
  assert.equal(f.children.length, 0);
  assert.equal(f.listeners.size + f.errors.size, 0);
  assert.deepEqual(f.backend.getStats(), { registered: 0, workerCount: 0, disabled: false });
  const third = f.backend.register({ host: f.host, sketchId: 'yuru-01', physicalSize: 240, active: false, onFrame() {}, onError() {} });
  assert(third);
  assert.equal(f.connections, 2, 'a later route may create one fresh worker');
  f.backend.dispose();
  assert.equal(f.terminations, 2);
  assert.equal(f.children.length, 0);
});

test('unsupported platforms stay native and a broken worker recovers every placement without replacement-worker loops', () => {
  const unsupported = bridgeFixture(false);
  assert.equal(unsupported.backend.register({ host: unsupported.host, sketchId: 'yuru-01', physicalSize: 240, active: true, onFrame() {}, onError() {} }), null);
  assert.equal(unsupported.connections, 0);
  assert.equal(unsupported.children.length, 0);
  const f = bridgeFixture();
  let recoveries = 0;
  const options = { host: f.host, sketchId: 'yuru-01' as SketchId, physicalSize: 240, active: true, onFrame() {}, onError() { recoveries++; } };
  const first = f.backend.register(options), second = f.backend.register(options);
  assert(first && second);
  f.fail(new Error('module failed'));
  assert.equal(recoveries, 2);
  assert.equal(f.terminations, 1);
  assert.equal(f.children.length, 0);
  first.remove(); second.remove();
  assert.equal(f.backend.register(options), null);
  assert.equal(f.connections, 1, 'native recovery must not retry a failed worker for each component');
  assert.equal(f.backend.getStats().disabled, true);
});

test('one source error isolates its canvas and transport failure during registration clears all ownership', () => {
  const f = bridgeFixture();
  let errors = 0, frames = 0;
  const options = { host: f.host, sketchId: 'yuru-01' as SketchId, physicalSize: 240, active: true, onFrame() { frames++; }, onError() { errors++; } };
  f.backend.register(options); const healthy = f.backend.register(options);
  assert(healthy);
  f.reply({ type: 'error', id: 1, reason: 'bad factory' });
  f.reply({ type: 'frame', id: 2, stats: frame });
  assert.equal(errors, 1); assert.equal(frames, 1);
  assert.equal(f.backend.getStats().registered, 1);
  assert.equal(f.connections, 1); assert.equal(f.terminations, 0);
  f.transport.post = () => { throw new Error('cannot transfer'); };
  assert.equal(f.backend.register(options), null);
  assert.equal(errors, 3, 'both the active sibling and new placement need native recovery');
  assert.equal(f.children.length, 0);
  assert.equal(f.terminations, 1);
  healthy.remove();
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((success, failure) => { resolve = success; reject = failure; });
  return { promise, resolve, reject };
}

async function settle() { for (let i = 0; i < 5; i++) await Promise.resolve(); }

function workerFixture() {
  let time = 0, nextFrame = 1, created = 0, removed = 0, draws = 0;
  const pending = new Map<number, (timestamp: number) => void>();
  const loads = new Map<SketchId, ReturnType<typeof deferred<{ default: P5SketchFactory }>>>();
  const replies: ArtworkWorkerReply[] = [];
  const scheduler = createPreviewScheduler({ now: () => time,
    requestFrame(callback) { const id = nextFrame++; pending.set(id, callback); return id; },
    cancelFrame(id) { pending.delete(id); } });
  const host = createArtworkWorkerHost({ scheduler,
    load(id) { const loading = deferred<{ default: P5SketchFactory }>(); loads.set(id, loading); return loading.promise; },
    create(factory, canvas) {
      created++;
      return { canvas, width: 400, height: 400,
        draw() { draws++; time += 2; if (factory !== source) throw new Error('bad draw'); return true; },
        remove() { removed++; canvas.width = canvas.height = 0; } };
    },
    send: reply => replies.push(reply),
  });
  const register = (id: number, sketchId: SketchId, active = true) => {
    const canvas = { width: 400, height: 400 } as OffscreenCanvas;
    host.receive({ type: 'register', id, sketchId, canvas, physicalSize: 400, active });
    return canvas;
  };
  return { host, scheduler, pending, loads, replies, register,
    get created() { return created; }, get removed() { return removed; }, get draws() { return draws; },
    step(timestamp: number) {
      const scheduled = pending.entries().next().value;
      if (!scheduled) return;
      assert.equal(pending.size, 1, 'worker must share one callback among all sources');
      pending.delete(scheduled[0]); time = timestamp; scheduled[1](timestamp);
    },
  };
}

test('cancelled lazy imports and disposal cannot create canvases, callbacks, or late frames', async () => {
  const f = workerFixture();
  const removedCanvas = f.register(1, 'yuru-01');
  await settle();
  f.host.receive({ type: 'remove', id: 1 });
  f.loads.get('yuru-01')!.resolve({ default: source });
  await settle();
  assert.equal(f.created, 0);
  assert.equal(f.host.getStats().registered, 0);
  assert.equal(f.pending.size, 0);
  assert.deepEqual([removedCanvas.width, removedCanvas.height], [0, 0]);
  const disposedCanvas = f.register(2, 'yuru-02');
  await settle();
  f.host.dispose();
  f.loads.get('yuru-02')!.resolve({ default: source });
  await settle();
  f.register(3, 'yuru-03');
  assert.equal(f.created, 0); assert.equal(f.pending.size, 0); assert.equal(f.replies.length, 0);
  assert.deepEqual([disposedCanvas.width, disposedCanvas.height], [0, 0]);
});

test('visibility and pause received during lazy loading control the shared worker without idle timers', async () => {
  const f = workerFixture();
  f.register(1, 'yuru-01'); f.register(2, 'yuru-02');
  f.host.receive({ type: 'active', id: 1, active: false });
  f.host.receive({ type: 'active', id: 2, active: false });
  await settle();
  for (const loading of f.loads.values()) loading.resolve({ default: source });
  await settle();
  assert.equal(f.created, 0, 'inactive imports must not set up GPU/Canvas factories'); assert.equal(f.pending.size, 0);
  f.host.receive({ type: 'active', id: 1, active: true });
  f.host.receive({ type: 'active', id: 2, active: true });
  assert.equal(f.created, 2, 'first activation creates each ready factory once');
  f.step(0); f.step(16);
  assert.equal(f.draws, 2);
  assert.deepEqual(f.replies.map(reply => reply.id).sort(), [1, 2]);
  assert(f.replies.every(reply => reply.type === 'frame' && !('canvas' in reply)), 'frame transport carries metrics, never image copies');
  f.host.receive({ type: 'active', id: 1, active: false });
  f.host.receive({ type: 'active', id: 2, active: false });
  assert.equal(f.pending.size, 0, 'inactive cohorts must retain no requestAnimationFrame or timer');
  f.step(1000); assert.equal(f.draws, 2);
  f.host.dispose();
  assert.equal(f.removed, 2); assert.equal(f.pending.size, 0);
});

test('ready inactive factories release without renderer setup, while pause/resume retains one renderer and phase', async () => {
  const f = workerFixture();
  const unused = f.register(1, 'yuru-01', false);
  f.register(2, 'yuru-02', false);
  await settle();
  for (const loading of f.loads.values()) loading.resolve({ default: source });
  await settle();
  assert.equal(f.created, 0); assert.equal(f.draws, 0); assert.equal(f.pending.size, 0);
  f.host.receive({ type: 'remove', id: 1 });
  assert.deepEqual([unused.width, unused.height], [0, 0]);
  f.host.receive({ type: 'active', id: 1, active: true });
  assert.equal(f.created, 0, 'removed cached factories cannot return');
  f.host.receive({ type: 'active', id: 2, active: true });
  f.step(0); assert.equal(f.created, 1); assert.equal(f.draws, 1);
  f.host.receive({ type: 'active', id: 2, active: false });
  assert.equal(f.pending.size, 0);
  f.host.receive({ type: 'active', id: 2, active: true });
  f.step(1000); assert.equal(f.created, 1); assert.equal(f.draws, 2);
  f.register(3, 'yuru-03', false); await settle();
  f.loads.get('yuru-03')!.resolve({ default: source }); await settle();
  f.host.dispose();
  f.host.receive({ type: 'active', id: 3, active: true });
  assert.equal(f.created, 1); assert.equal(f.removed, 1); assert.equal(f.pending.size, 0);
});

test('superseded imports cannot create stale jobs after replacing an inactive placement', async () => {
  const f = workerFixture();
  const oldCanvas = f.register(1, 'yuru-01', false); await settle();
  const old = f.loads.get('yuru-01')!;
  f.register(1, 'yuru-02', false); await settle();
  old.resolve({ default: source }); await settle();
  assert.equal(f.created, 0); assert.deepEqual([oldCanvas.width, oldCanvas.height], [0, 0]);
  f.loads.get('yuru-02')!.resolve({ default: source }); await settle();
  assert.equal(f.created, 0);
  f.host.receive({ type: 'active', id: 1, active: true });
  f.step(0); assert.equal(f.created, 1); assert.equal(f.draws, 1);
  f.host.dispose(); assert.equal(f.pending.size, 0);
});

test('loading and drawing errors recover only their sources while healthy jobs keep moving and dispose cleanly', async () => {
  const f = workerFixture();
  const badImport = f.register(1, 'yuru-01');
  f.register(2, 'yuru-02'); f.register(3, 'yuru-03');
  await settle();
  f.loads.get('yuru-01')!.reject(new Error('bad import'));
  f.loads.get('yuru-02')!.resolve({ default: () => {} });
  f.loads.get('yuru-03')!.resolve({ default: source });
  await settle();
  for (let index = 0; index < 10; index++) f.step(index * 16);
  const errors = f.replies.filter(reply => reply.type === 'error');
  assert.deepEqual(errors.map(reply => reply.id).sort(), [1, 2]);
  assert(f.replies.filter(reply => reply.type === 'frame' && reply.id === 3).length >= 2);
  assert.equal(f.host.getStats().registered, 1);
  assert.deepEqual([badImport.width, badImport.height], [0, 0]);
  assert.equal(f.removed, 1);
  f.host.dispose(); f.host.dispose();
  assert.equal(f.removed, 2);
  assert.equal(f.pending.size, 0);
});
