import { isArtworkWorkerReply, type ArtworkWorkerCommand } from './artwork-worker-protocol.ts';
import type { SketchId } from './generative/types';
import type { PreviewFrameStats, PreviewHandle } from './preview-scheduler';

export type ArtworkWorkerTransport = {
  post(command: ArtworkWorkerCommand, transfer?: Transferable[]): void;
  onMessage(callback: (reply: unknown) => void): () => void;
  onError(callback: (error: unknown) => void): () => void;
  terminate(): void;
};

type WorkerArtworkOptions = {
  host: HTMLElement;
  sketchId: SketchId;
  physicalSize: number;
  active: boolean;
  onFrame(stats: Readonly<PreviewFrameStats>): void;
  onError(error: unknown): void;
  onJobs?(count: number): void;
};

type Entry = {
  id: number;
  options: WorkerArtworkOptions;
  canvas: HTMLCanvasElement;
  active: boolean;
  stats: PreviewFrameStats;
};

function supported(): boolean {
  return typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined'
    && typeof HTMLCanvasElement !== 'undefined'
    && typeof HTMLCanvasElement.prototype.transferControlToOffscreen === 'function';
}

function connect(): ArtworkWorkerTransport {
  const worker = new Worker(new URL('./artwork-worker.ts', import.meta.url), { type: 'module' });
  return {
    post: (command, transfer = []) => worker.postMessage(command, transfer),
    onMessage(callback) {
      const listener = (event: MessageEvent<unknown>) => callback(event.data);
      worker.addEventListener('message', listener);
      return () => worker.removeEventListener('message', listener);
    },
    onError(callback) {
      const error = (event: ErrorEvent) => { event.preventDefault(); callback(new Error(event.message || 'Artwork worker failed.')); };
      const messageError = () => callback(new Error('Artwork worker transport failed.'));
      worker.addEventListener('error', error);
      worker.addEventListener('messageerror', messageError);
      return () => {
        worker.removeEventListener('error', error);
        worker.removeEventListener('messageerror', messageError);
      };
    },
    terminate: () => worker.terminate(),
  };
}

/** One lazy worker and direct canvas transfer for the entire article-art cohort. */
export function createArtworkWorkerBackend(createTransport = connect, isSupported = supported) {
  const entries = new Map<number, Entry>();
  let transport: ArtworkWorkerTransport | null = null;
  let removeMessageListener: (() => void) | null = null;
  let removeErrorListener: (() => void) | null = null;
  let nextId = 1;
  let disabled = false;

  function terminate() {
    removeMessageListener?.();
    removeErrorListener?.();
    removeMessageListener = removeErrorListener = null;
    const previous = transport;
    transport = null;
    previous?.terminate();
  }

  function notifyJobs() {
    for (const entry of entries.values()) entry.options.onJobs?.(entries.size);
  }

  function failTransport(error: unknown) {
    // Do not start one failing replacement worker per visible placement.
    disabled = true;
    const failed = [...entries.values()];
    entries.clear();
    terminate();
    for (const entry of failed) {
      entry.canvas.remove();
      entry.options.onJobs?.(0);
      entry.options.onError(error);
    }
  }

  function remove(entry: Entry) {
    if (entries.get(entry.id) !== entry) return;
    entries.delete(entry.id);
    // The DOM placeholder no longer owns its backing store after transfer.
    entry.canvas.remove();
    entry.options.onJobs?.(0);
    if (!entries.size) terminate();
    else {
      try { transport?.post({ type: 'remove', id: entry.id }); }
      catch (error) { failTransport(error); }
      notifyJobs();
    }
  }

  function ensureTransport(): boolean {
    if (transport) return true;
    try {
      transport = createTransport();
      removeMessageListener = transport.onMessage(reply => {
        if (!isArtworkWorkerReply(reply)) return;
        const entry = entries.get(reply.id);
        if (!entry) return;
        if (reply.type === 'error') {
          remove(entry);
          entry.options.onError(new Error(reply.reason));
        } else {
          entry.stats = { ...reply.stats };
          // Ignore a final queued frame when the main thread has already paused.
          if (entry.active) entry.options.onFrame(entry.stats);
        }
      });
      removeErrorListener = transport.onError(failTransport);
      return true;
    } catch (error) {
      failTransport(error);
      return false;
    }
  }

  return {
    register(options: WorkerArtworkOptions): PreviewHandle | null {
      if (disabled || !isSupported() || !ensureTransport()) return null;
      const canvas = options.host.ownerDocument.createElement('canvas');
      canvas.width = canvas.height = options.physicalSize;
      canvas.style.width = canvas.style.height = '100%';
      canvas.setAttribute('aria-hidden', 'true');
      let offscreen: OffscreenCanvas;
      try { offscreen = canvas.transferControlToOffscreen(); }
      catch {
        canvas.remove();
        if (!entries.size) terminate();
        return null;
      }
      const entry: Entry = {
        id: nextId++, options, canvas, active: options.active,
        stats: { frames: 0, drawMs: 0, averageMs: 0, targetFps: 18 },
      };
      entries.set(entry.id, entry);
      options.host.appendChild(canvas);
      try {
        transport!.post({ type: 'register', id: entry.id, sketchId: options.sketchId, canvas: offscreen, physicalSize: options.physicalSize, active: options.active }, [offscreen]);
      } catch (error) {
        failTransport(error);
        return null;
      }
      notifyJobs();
      return {
        setActive(active) {
          if (entries.get(entry.id) !== entry || active === entry.active) return;
          entry.active = active;
          try { transport?.post({ type: 'active', id: entry.id, active }); }
          catch (error) { failTransport(error); }
        },
        remove: () => remove(entry),
        getStats: () => ({ ...entry.stats }),
      };
    },
    getStats: () => ({ registered: entries.size, workerCount: transport ? 1 : 0, disabled }),
    dispose() {
      for (const entry of entries.values()) { entry.canvas.remove(); entry.options.onJobs?.(0); }
      entries.clear();
      terminate();
    },
  };
}

export const artworkWorkerBackend = createArtworkWorkerBackend();

if (import.meta.hot) import.meta.hot.dispose(() => artworkWorkerBackend.dispose());
