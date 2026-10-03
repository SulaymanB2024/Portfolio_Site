import test from 'node:test';
import assert from 'node:assert/strict';
import { createPreviewScheduler, createPreviewTelemetry } from '../src/personal/editorial/preview-scheduler.ts';

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

function deadlineFixture(sleeping: boolean) {
  let time = 0, next = 1, rafs = 0, timers = 0;
  const pending = new Map<number, { at: number; frame: boolean; callback: (time: number) => void }>();
  const interval = 1000 / 60;
  const delayDriver = sleeping ? {
    setDelay(callback: () => void, milliseconds: number) {
      const id = next++; pending.set(id, { at: time + milliseconds, frame: false, callback }); return id;
    },
    cancelDelay(id: number) { pending.delete(id); },
  } : {};
  const scheduler = createPreviewScheduler({
    now: () => time,
    requestFrame(callback) {
      const id = next++; pending.set(id, { at: Math.ceil((time + 1e-7) / interval) * interval, frame: true, callback }); return id;
    },
    cancelFrame(id) { pending.delete(id); },
    ...delayDriver,
  }, 10);
  return { scheduler, pending,
    get rafs() { return rafs; }, get timers() { return timers; },
    spend(milliseconds: number) { time += milliseconds; },
    advance(end: number) {
      while (pending.size) {
        const [id, event] = [...pending].sort((a, b) => a[1].at - b[1].at)[0];
        if (event.at > end) break;
        pending.delete(id); time = Math.max(time, event.at);
        if (event.frame) rafs++; else timers++;
        event.callback(time);
      }
      time = Math.max(time, end);
    },
  };
}

test('deadline sleeps cut native8Hz callbacks while preserving exact fractional18Hz and30Hz cadence', t => {
  for (const [cost, maxFps, expected] of [[.5, 18, 18], [8, 18, 8], [4, 30, 30]]) {
    const baseline = deadlineFixture(false), sleeping = deadlineFixture(true);
    const handles = [baseline, sleeping].map(f => f.scheduler.add({ maxFps, minFps: maxFps === 30 ? 24 : 8, draw() { f.spend(cost); } }));
    baseline.advance(10000); sleeping.advance(10000);
    assert.equal(handles[0].getStats().targetFps, expected);
    assert.equal(handles[1].getStats().targetFps, expected);
    assert(Math.abs(handles[0].getStats().frames - handles[1].getStats().frames) <= 1, `${expected}Hz must keep the same source phase`);
    t.diagnostic(JSON.stringify({ fps: expected, baseline: { frames: handles[0].getStats().frames, rafs: baseline.rafs, timers: baseline.timers }, updated: { frames: handles[1].getStats().frames, rafs: sleeping.rafs, timers: sleeping.timers } }));
    assert(sleeping.rafs <= baseline.rafs * .7, `RAF callbacks ${sleeping.rafs} versus ${baseline.rafs} at ${expected}Hz`);
    if (expected === 8) assert(sleeping.rafs + sleeping.timers < (baseline.rafs + baseline.timers) * .55, 'expensive8Hz sources avoid both repeated scans and most event-loop wakeups');
    handles.forEach(handle => handle.remove());
    assert.equal(sleeping.pending.size, 0);
    baseline.scheduler.dispose(); sleeping.scheduler.dispose();
  }
});

test('activation interrupts an existing sleep immediately and pause/remove/dispose cancel every delayed callback', () => {
  const f = deadlineFixture(true);
  let first = 0, second = 0;
  const active = f.scheduler.add({ draw() { first++; f.spend(8); } });
  const dormant = f.scheduler.add({ active: false, draw() { second++; f.spend(.5); } });
  f.advance(20);
  assert.equal(first, 1); assert.equal(second, 0); assert.equal(f.pending.size, 1);
  dormant.setActive(true);
  f.advance(40);
  assert.equal(second, 1, 'activation paints at the next display frame, without waiting for the sleeping study');
  active.setActive(false); dormant.setActive(false);
  assert.equal(f.pending.size, 0);
  f.advance(1000); assert.equal(first, 1); assert.equal(second, 1);
  active.setActive(true); f.advance(1020); assert.equal(first, 2);
  assert.equal(active.getStats().observedFps, 0, 'a suspension gap never contaminates cadence');
  active.remove(); dormant.remove(); assert.equal(f.pending.size, 0);
  f.scheduler.add({ draw() { f.spend(8); } }); f.advance(1040);
  f.scheduler.dispose(); f.scheduler.dispose(); assert.equal(f.pending.size, 0);
});

test('deadline sleeping keeps fair budget arbitration for an overloaded cohort', () => {
  const f = deadlineFixture(true);
  const baseline = deadlineFixture(false);
  const baselineFrames = Array.from({ length: 12 }, () => 0);
  const baselineHandles = baselineFrames.map((_, index) => baseline.scheduler.add({ draw() { baselineFrames[index]++; baseline.spend(4); } }));
  const frames = Array.from({ length: 12 }, () => 0);
  const handles = frames.map((_, index) => f.scheduler.add({ draw() { frames[index]++; f.spend(4); } }));
  f.advance(2000); baseline.advance(2000);
  assert(frames.every(count => count >= 8), String(frames));
  assert.deepEqual(frames, baselineFrames, 'sleeping cannot change round-robin arbitration under continuous demand');
  assert(Math.max(...frames) - Math.min(...frames) <= 2, String(frames));
  assert(f.scheduler.getStats().worstFrameDrawMs <= 10);
  handles.forEach(handle => handle.remove()); assert.equal(f.pending.size, 0);
  baselineHandles.forEach(handle => handle.remove()); assert.equal(baseline.pending.size, 0);
});

test('diagnostics publish at750ms without timers, force final state updates, and do no production work', () => {
  const published: number[] = [];
  let frames = 0;
  const telemetry = createPreviewTelemetry(() => published.push(frames), true);
  for (let time = 0; time <= 3000; time += 25) { frames++; telemetry(time); }
  assert.deepEqual(published, [1, 31, 61, 91, 121]);
  frames++; telemetry(3020, true); assert.equal(published.at(-1), 122);
  telemetry(3050); assert.equal(published.length, 6);
  const production = createPreviewTelemetry(() => assert.fail('production diagnostics must not write'), false);
  production(0); production(800); production(900, true);
});
