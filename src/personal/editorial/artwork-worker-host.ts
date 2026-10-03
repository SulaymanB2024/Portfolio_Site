import type { ArtworkWorkerCommand, ArtworkWorkerReply } from './artwork-worker-protocol';
import type { P5SketchLoader, SketchId } from './generative/types';
import type { CanvasSketchOptions, OffscreenSketchController } from './generative/canvas-runtime';
import type { createPreviewScheduler, PreviewHandle } from './preview-scheduler';

type Scheduler = ReturnType<typeof createPreviewScheduler>;
type HostDependencies = {
  scheduler: Scheduler;
  load: (id: SketchId) => ReturnType<P5SketchLoader>;
  create: (factory: Awaited<ReturnType<P5SketchLoader>>['default'], canvas: OffscreenCanvas, options: CanvasSketchOptions) => OffscreenSketchController;
  send: (reply: ArtworkWorkerReply) => void;
};

type Entry = {
  command: Extract<ArtworkWorkerCommand, { type: 'register' }>;
  active: boolean;
  cancelled: boolean;
  sketch: OffscreenSketchController | null;
  job: PreviewHandle | null;
  factory: Awaited<ReturnType<P5SketchLoader>>['default'] | null;
};

/** Worker lifecycle independent of transport so cancelled imports can be tested. */
export function createArtworkWorkerHost(dependencies: HostDependencies) {
  const entries = new Map<number, Entry>();
  let disposed = false;

  function remove(id: number) {
    const entry = entries.get(id);
    if (!entry) return;
    entry.cancelled = true;
    entry.factory = null;
    entry.job?.remove();
    entry.sketch?.remove();
    if (!entry.sketch) { entry.command.canvas.width = 0; entry.command.canvas.height = 0; }
    entries.delete(id);
  }

  function fail(entry: Entry, error: unknown) {
    if (entry.cancelled || entries.get(entry.command.id) !== entry || disposed) return;
    const id = entry.command.id;
    remove(id);
    dependencies.send({ type: 'error', id, reason: error instanceof Error ? error.message : 'Artwork worker failed.' });
  }

  function start(entry: Entry) {
    if (!entry.factory || entry.sketch || !entry.active || disposed || entry.cancelled || entries.get(entry.command.id) !== entry) return;
    const command = entry.command;
    try {
      entry.sketch = dependencies.create(entry.factory, command.canvas, { physicalSize: command.physicalSize });
      entry.factory = null;
      entry.job = dependencies.scheduler.add({
        active: entry.active,
        maxFps: entry.sketch.engine === 'gpu' ? 30 : 18,
        minFps: entry.sketch.engine === 'gpu' ? 24 : 8,
        draw: () => entry.sketch?.draw() ?? false,
        onFrame: stats => {
          if (!entry.cancelled && !disposed) dependencies.send({ type: 'frame', id: command.id, stats: { ...stats, ...entry.sketch?.getRenderStats?.(), engine: entry.sketch?.engine ?? 'canvas' } });
        },
        onError: error => fail(entry, error),
      });
    } catch (error) { fail(entry, error); }
  }

  function register(command: Extract<ArtworkWorkerCommand, { type: 'register' }>) {
    remove(command.id);
    const entry: Entry = { command, active: command.active, cancelled: false, sketch: null, job: null, factory: null };
    entries.set(command.id, entry);
    Promise.resolve().then(() => disposed || entry.cancelled ? undefined : dependencies.load(command.sketchId)).then(module => {
      if (!module || disposed || entry.cancelled || entries.get(command.id) !== entry) return;
      entry.factory = module.default;
      start(entry);
    }).catch(error => fail(entry, error));
  }

  return {
    receive(command: ArtworkWorkerCommand) {
      if (disposed) return;
      if (command.type === 'register') register(command);
      else if (command.type === 'remove') remove(command.id);
      else {
        const entry = entries.get(command.id);
        if (!entry) return;
        entry.active = command.active;
        if (command.active) start(entry);
        entry.job?.setActive(command.active);
      }
    },
    getStats: () => ({ ...dependencies.scheduler.getStats(), registered: entries.size }),
    dispose() {
      disposed = true;
      for (const id of entries.keys()) remove(id);
      dependencies.scheduler.dispose();
    },
  };
}
