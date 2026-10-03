import type { PreviewFrameStats } from './preview-scheduler';
import type { SketchId } from './generative/types';

export type ArtworkWorkerCommand =
  | { type: 'register'; id: number; sketchId: SketchId; canvas: OffscreenCanvas; physicalSize: number; active: boolean; maxFps?: number; minFps?: number }
  | { type: 'active'; id: number; active: boolean }
  | { type: 'remove'; id: number };

export type ArtworkWorkerReply =
  | { type: 'frame'; id: number; stats: PreviewFrameStats }
  | { type: 'error'; id: number; reason: string };

export function isArtworkWorkerReply(value: unknown): value is ArtworkWorkerReply {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ArtworkWorkerReply>;
  if (!Number.isSafeInteger(candidate.id) || (candidate.id ?? 0) < 1) return false;
  if (candidate.type === 'error') return typeof candidate.reason === 'string';
  if (candidate.type !== 'frame' || !candidate.stats) return false;
  const stats = candidate.stats;
  return Number.isSafeInteger(stats.frames) && stats.frames > 0
    && [stats.drawMs, stats.averageMs, stats.targetFps].every(Number.isFinite);
}
