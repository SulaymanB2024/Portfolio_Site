import assert from 'node:assert/strict';
import test from 'node:test';
import { installSmoothScrolling, type ScrollEnvironment } from './smoothScroll';

function harness(initialReduced = false, initialNative = false) {
  const media = [initialReduced, initialNative].map((matches) => {
    const listeners = new Set<() => void>();
    return { matches, listeners, addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
      set(value: boolean) { this.matches = value; for (const listener of listeners) listener(); } };
  });
  const frames = new Map<number, FrameRequestCallback>();
  const instances: { calls: number; destroyed: number; raf(): void; destroy(): void }[] = [];
  let id = 0;
  const env: ScrollEnvironment = {
    matchMedia: (query) => media[query.includes('reduced') ? 0 : 1] as unknown as MediaQueryList,
    requestAnimationFrame: (callback) => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: (frame) => { frames.delete(frame); },
  };
  const dispose = installSmoothScrolling(env, () => {
    const instance = { calls: 0, destroyed: 0, raf() { this.calls++; }, destroy() { this.destroyed++; } };
    instances.push(instance); return instance;
  });
  return { env, media, frames, instances, dispose };
}

test('desktop scrolling owns one instance and cancels on live reduced-motion change', () => {
  const h = harness();
  assert.equal(h.instances.length, 1); assert.equal(h.frames.size, 1);
  h.media[0].set(false); assert.equal(h.instances.length, 1);
  const tick = [...h.frames.values()][0];
  h.media[0].set(true);
  assert.equal(h.instances[0].destroyed, 1); assert.equal(h.frames.size, 0); assert.equal(h.env.lenis, undefined);
  tick(1); assert.equal(h.frames.size, 0); assert.equal(h.instances[0].calls, 0);
  h.dispose(); assert.equal(h.instances[0].destroyed, 1);
});
test('native device preferences start without Lenis and can return to desktop', () => {
  const h = harness(false, true); assert.equal(h.instances.length, 0);
  h.media[1].set(false); assert.equal(h.instances.length, 1);
  h.media[1].set(true); assert.equal(h.instances[0].destroyed, 1);
  h.media[1].set(false); assert.equal(h.instances.length, 2); assert.equal(h.frames.size, 1);
  h.dispose(); assert.equal(h.instances[1].destroyed, 1); assert.equal(h.frames.size, 0);
  assert.ok(h.media.every((item) => item.listeners.size === 0));
  h.media[0].set(false); assert.equal(h.instances.length, 2);
});
test('cleanup does not delete another owner and strict-mode remount stays independent', () => {
  const h = harness(); h.env.lenis = { anotherOwner: true };
  h.dispose(); assert.deepEqual(h.env.lenis, { anotherOwner: true });
  const native = harness(true, false); assert.equal(native.instances.length, 0); native.dispose();
});
