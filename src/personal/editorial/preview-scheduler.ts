export type PreviewFrameStats = {
  frames: number;
  drawMs: number;
  averageMs: number;
  targetFps: number;
  observedFps?: number;
  engine?: 'gpu' | 'canvas';
  formulaMs?: number;
  submitMs?: number;
  presentMs?: number;
  points?: number;
  drawCalls?: number;
  gpuMs?: number;
};

export type PreviewTask = {
  draw(): boolean | void;
  active?: boolean;
  maxFps?: number;
  minFps?: number;
  onFrame?(stats: Readonly<PreviewFrameStats>): void;
  onError?(error: unknown): void;
};

export type PreviewHandle = {
  setActive(active: boolean): void;
  remove(): void;
  getStats(): Readonly<PreviewFrameStats>;
};

type FrameDriver = {
  now(): number;
  requestFrame(callback: (time: number) => void): number;
  cancelFrame(id: number): void;
};

type Entry = PreviewFrameStats & {
  id: number;
  task: PreviewTask;
  active: boolean;
  removed: boolean;
  lastAt: number;
  lastPaintAt: number;
  meanInterval: number;
  maxFps: number;
  minFps: number;
};

const browserDriver: FrameDriver = {
  now: () => performance.now(),
  requestFrame: callback => requestAnimationFrame(callback),
  cancelFrame: id => cancelAnimationFrame(id),
};

function snapshot(entry: Entry): PreviewFrameStats {
  return { frames: entry.frames, drawMs: entry.drawMs, averageMs: entry.averageMs, targetFps: entry.targetFps, observedFps: entry.meanInterval ? 1000 / entry.meanInterval : 0 };
}

/** One cooperative frame budget shared by every visible article artwork. */
export function createPreviewScheduler(driver: FrameDriver = browserDriver, budgetMs = 6) {
  if (!Number.isFinite(budgetMs) || budgetMs <= 0) throw new RangeError('Preview frame budget must be positive.');
  const entries = new Map<number, Entry>();
  let nextId = 1;
  let frame: number | null = null;
  let nextEntryId = 0;
  let disposed = false;
  let lastFrameDrawMs = 0;
  let worstFrameDrawMs = 0;

  const hasActive = () => [...entries.values()].some(entry => entry.active && !entry.removed);

  function reconcileFrame() {
    if (disposed || !hasActive()) {
      if (frame !== null) driver.cancelFrame(frame);
      frame = null;
    } else if (frame === null) frame = driver.requestFrame(tick);
  }

  function forget(entry: Entry) {
    entry.removed = true;
    entry.active = false;
    entries.delete(entry.id);
    reconcileFrame();
  }

  function tick(timestamp: number) {
    frame = null;
    const started = driver.now();
    const list = [...entries.values()];
    let index = Math.max(0, list.findIndex(entry => entry.id >= nextEntryId));
    let visited = 0;
    let drawn = 0;
    try {
      while (visited < list.length) {
        const entry = list[index];
        const interval = 1000 / entry.targetFps;
        const due = !Number.isFinite(entry.lastAt) || timestamp - entry.lastAt >= interval;
        if (!entry.removed && entry.active && due) {
          const elapsed = driver.now() - started;
          // A draw is synchronous. Allow one over-budget draw, then yield fairly.
          const estimatedMs = entry.frames ? entry.averageMs : budgetMs;
          if (drawn > 0 && (elapsed >= budgetMs || elapsed + estimatedMs > budgetMs)) {
            nextEntryId = entry.id;
            break;
          }
          const drawStarted = driver.now();
          try {
            if (entry.task.draw() === false) {
              forget(entry);
            } else {
              entry.drawMs = Math.max(0, driver.now() - drawStarted);
              entry.averageMs = entry.frames ? entry.averageMs * .8 + entry.drawMs * .2 : entry.drawMs;
              entry.frames++;
              if (Number.isFinite(entry.lastPaintAt)) {
                const actualInterval = timestamp - entry.lastPaintAt;
                if (actualInterval > 0) entry.meanInterval = entry.meanInterval ? entry.meanInterval * .85 + actualInterval * .15 : actualInterval;
              }
              entry.lastPaintAt = timestamp;
              if (entry.maxFps > 18) {
                const active = [...entries.values()].filter(candidate => candidate.active && !candidate.removed);
                const gpuCost = active.filter(candidate => candidate.maxFps > 18).reduce((cost, candidate) => cost + (candidate.averageMs || 1), 0);
                const otherDemand = active.filter(candidate => candidate.maxFps <= 18).reduce((cost, candidate) => cost + candidate.averageMs * candidate.targetFps, 0);
                const rate = Math.floor((budgetMs * 60 * .9 - otherDemand) / Math.max(gpuCost, .001));
                entry.targetFps = Math.max(entry.minFps, Math.min(entry.maxFps, rate));
              } else entry.targetFps = entry.averageMs > 6 ? 8 : entry.averageMs > 3 ? 10 : entry.averageMs > 1.5 ? 12 : 18;
              // Carry the fractional interval without replaying missed frames.
              entry.lastAt = Number.isFinite(entry.lastAt) ? timestamp - (timestamp - entry.lastAt) % interval : timestamp;
              entry.task.onFrame?.(snapshot(entry));
            }
          } catch (error) {
            forget(entry);
            entry.task.onError?.(error);
          }
          drawn++;
        }
        visited++;
        index = (index + 1) % list.length;
        nextEntryId = list[index]?.id ?? 0;
      }
    } finally {
      lastFrameDrawMs = Math.max(0, driver.now() - started);
      worstFrameDrawMs = Math.max(worstFrameDrawMs, lastFrameDrawMs);
      reconcileFrame();
    }
  }

  return {
    add(task: PreviewTask): PreviewHandle {
      if (disposed) throw new Error('Preview scheduler has been disposed.');
      const entry: Entry = {
        id: nextId++, task, active: task.active ?? true, removed: false, lastAt: -Infinity, lastPaintAt: -Infinity, meanInterval: 0,
        frames: 0, drawMs: 0, averageMs: 0, targetFps: task.maxFps ?? 18, maxFps: task.maxFps ?? 18, minFps: task.minFps ?? 8,
      };
      entries.set(entry.id, entry);
      reconcileFrame();
      return {
        setActive(active) {
          if (entry.removed || entry.active === active) return;
          entry.active = active;
          if (active) { entry.lastAt = -Infinity; entry.lastPaintAt = -Infinity; entry.meanInterval = 0; }
          reconcileFrame();
        },
        remove: () => forget(entry),
        getStats: () => snapshot(entry),
      };
    },
    getStats() {
      return {
        registered: entries.size,
        active: [...entries.values()].filter(entry => entry.active && !entry.removed).length,
        pendingFrame: frame !== null,
        budgetMs, lastFrameDrawMs, worstFrameDrawMs,
      };
    },
    dispose() {
      disposed = true;
      for (const entry of entries.values()) { entry.removed = true; entry.active = false; }
      entries.clear();
      reconcileFrame();
    },
  };
}

export const previewScheduler = createPreviewScheduler();

if (import.meta.hot) import.meta.hot.dispose(() => previewScheduler.dispose());
