/// <reference lib="webworker" />
import { createArtworkWorkerHost } from './artwork-worker-host';
import { createOffscreenCanvasSketch } from './generative/canvas-runtime';
import { GpuArtworkPool, createGpuCanvasSketch } from './generative/gpu-runtime';
import { GENERATED_SKETCH_LOADERS } from './generative/generatedSketchLoaders';
import type { P5SketchLoader } from './generative/types';
import type { ArtworkWorkerCommand } from './artwork-worker-protocol';
import { createPreviewScheduler } from './preview-scheduler';

const scope = globalThis as unknown as DedicatedWorkerGlobalScope;
// Original factories only read window.devicePixelRatio in their creation prelude.
Object.defineProperty(globalThis, 'window', { value: { devicePixelRatio: 1 } });

const hasFrameApi = typeof scope.requestAnimationFrame === 'function';
const scheduler = createPreviewScheduler({
  now: () => performance.now(),
  requestFrame: callback => hasFrameApi ? scope.requestAnimationFrame(callback) : scope.setTimeout(() => callback(performance.now()), 16),
  cancelFrame: id => hasFrameApi ? scope.cancelAnimationFrame(id) : scope.clearTimeout(id),
  setDelay: (callback, milliseconds) => scope.setTimeout(callback, milliseconds),
  cancelDelay: id => scope.clearTimeout(id),
}, 10);

let gpu: GpuArtworkPool | null = null;
let gpuSupported = true;

const host = createArtworkWorkerHost({
  scheduler,
  load(id) {
    const loader = (GENERATED_SKETCH_LOADERS as Record<string, P5SketchLoader>)[id];
    if (!loader) throw new Error('Unknown artwork source.');
    return loader();
  },
  create(factory, canvas, options) {
    if (gpuSupported) {
      try {
        if (!gpu || gpu.unavailable) gpu = new GpuArtworkPool();
        return createGpuCanvasSketch(factory, canvas, gpu, options);
      } catch {
        gpuSupported = false;
        // The display canvas only uses Canvas2D, so fallback does not need another transfer.
        if (gpu?.unavailable) gpu.dispose();
      }
    }
    return createOffscreenCanvasSketch(factory, canvas, options);
  },
  send: reply => scope.postMessage(reply),
});

scope.addEventListener('message', (event: MessageEvent<ArtworkWorkerCommand>) => {
  const command = event.data;
  if (!command || !Number.isSafeInteger(command.id) || command.id < 1) return;
  if (command.type === 'register' || command.type === 'active' || command.type === 'remove') host.receive(command);
});
