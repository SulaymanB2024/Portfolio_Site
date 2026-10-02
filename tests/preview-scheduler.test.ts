import test from 'node:test';
import assert from 'node:assert/strict';
import { createPreviewScheduler } from '../src/personal/editorial/preview-scheduler.ts';

function fixture(budget = 6) {
  let time = 0;
  let id = 1;
  const pending = new Map<number, (timestamp: number) => void>();
  const scheduler = createPreviewScheduler({
    now: () => time,
    requestFrame(callback) { const assigned = id++; pending.set(assigned, callback); return assigned; },
    cancelFrame(assigned) { pending.delete(assigned); },
  }, budget);
  return {
    scheduler, pending,
    spend(ms: number) { time += ms; },
    step(timestamp: number) {
      const next = pending.entries().next().value;
      if (!next) return;
      assert.equal(pending.size, 1, 'all previews must share one RAF');
      pending.delete(next[0]);
      time = timestamp;
      next[1](timestamp);
    },
  };
}

test('round-robin scheduling gives every overloaded visible preview frames within the shared budget', () => {
  const f = fixture();
  const frames = Array.from({ length: 12 }, () => 0);
  const handles = frames.map((_, index) => f.scheduler.add({ draw() { frames[index]++; f.spend(4); } }));
  for (let refresh = 0; refresh < 60; refresh++) {
    f.step(refresh * 1000 / 60);
    assert(f.scheduler.getStats().lastFrameDrawMs <= 6);
  }
  assert(frames.every(count => count >= 4), `every source must keep moving: ${frames}`);
  assert(Math.max(...frames) - Math.min(...frames) <= 1, `no early-card preference: ${frames}`);
  assert(handles.every(handle => handle.getStats().targetFps === 10));
  handles.forEach(handle => handle.remove());
  assert.deepEqual(f.scheduler.getStats().registered, 0);
  assert.equal(f.pending.size, 0);
});

test('pause and resume keep the source state while removing every idle scheduler callback', () => {
  const f = fixture();
  let draws = 0;
  const handle = f.scheduler.add({ active: false, draw() { draws++; f.spend(1); } });
  assert.equal(f.pending.size, 0);
  handle.setActive(true);
  assert.equal(f.pending.size, 1);
  f.step(0);
  assert.equal(draws, 1);
  handle.setActive(false);
  assert.equal(f.pending.size, 0, 'hidden/offscreen/reduced/explicitly paused cohorts must have no RAF');
  f.step(1000);
  assert.equal(draws, 1);
  handle.setActive(true);
  f.step(1010);
  assert.equal(draws, 2, 'resumption should paint immediately without restarting the formula');
  handle.remove(); handle.remove();
  handle.setActive(true);
  assert.equal(f.pending.size, 0);
  assert.equal(f.scheduler.getStats().registered, 0);
});

test('expensive functioning sources adapt their rates and keep moving instead of becoming permanent posters', () => {
  const f = fixture();
  let cost = 18;
  let otherFrames = 0;
  const expensive = f.scheduler.add({ draw() { f.spend(cost); } });
  f.scheduler.add({ draw() { otherFrames++; f.spend(1); } });
  for (let refresh = 0; refresh < 90; refresh++) f.step(refresh * 1000 / 60);
  assert(expensive.getStats().frames >= 8);
  assert.equal(expensive.getStats().targetFps, 8);
  assert(otherFrames >= 12, 'one slow synchronous draw must not starve another artwork');
  assert.equal(f.scheduler.getStats().registered, 2, 'slow healthy sources must remain registered');
  cost = 1;
  for (let refresh = 90; refresh < 270; refresh++) f.step(refresh * 1000 / 60);
  assert.equal(expensive.getStats().targetFps, 18, 'a recovering source may regain its normal cadence');
  f.scheduler.dispose();
  assert.equal(f.pending.size, 0);
});

test('a failed or removed source cannot stop the shared loop or retain a callback', () => {
  const f = fixture();
  let failures = 0;
  let healthyFrames = 0;
  f.scheduler.add({ draw() { throw new Error('bad source'); }, onError(error) { assert.match(String(error), /bad source/); failures++; } });
  f.scheduler.add({ draw() { healthyFrames++; f.spend(1); } });
  f.scheduler.add({ draw() { return false; } });
  for (let refresh = 0; refresh < 30; refresh++) f.step(refresh * 1000 / 60);
  assert.equal(failures, 1);
  assert(healthyFrames >= 6);
  assert.equal(f.scheduler.getStats().registered, 1);
  f.scheduler.dispose(); f.scheduler.dispose();
  assert.equal(f.pending.size, 0);
  assert.equal(f.scheduler.getStats().active, 0);
  assert.throws(() => f.scheduler.add({ draw() {} }), /disposed/);
});

test('cadence carries fractional intervals instead of rounding 18 Hz down to 15 Hz', () => {
  const f = fixture();
  const handle = f.scheduler.add({ draw() { f.spend(.5); } });
  for (let refresh = 0; refresh <= 120; refresh++) f.step(refresh * 1000 / 60);
  assert(handle.getStats().frames >= 35 && handle.getStats().frames <= 37);
  assert.equal(handle.getStats().targetFps, 18);
  f.scheduler.dispose();
});

test('GPU cohorts sustain 30Hz with a healthy 4ms study, instead of inheriting the slow native thresholds', () => {
  const f = fixture(10);
  const costs = [4, 1, 1, 1, 1];
  const handles = costs.map(cost => f.scheduler.add({ maxFps: 30, minFps: 24, draw() { f.spend(cost); } }));
  for (let refresh = 0; refresh <= 180; refresh++) f.step(refresh * 1000 / 60);
  assert(handles.every(handle => handle.getStats().targetFps === 30));
  assert(handles.every(handle => handle.getStats().frames >= 87), 'all five studies should paint near 30Hz');
  assert(handles.every(handle => (handle.getStats().observedFps ?? 0) >= 28));
  assert(f.scheduler.getStats().worstFrameDrawMs <= 10);
  handles.forEach(handle => handle.setActive(false));
  assert.equal(f.pending.size, 0);
  handles.forEach(handle => handle.setActive(true));
  f.step(4000);
  assert(handles.every(handle => handle.getStats().observedFps === 0), 'resume should discard the idle gap from measured cadence');
  f.scheduler.dispose();
});
