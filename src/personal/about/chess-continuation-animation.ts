import { worldPieceKeyframes, type WorldPieceTrack } from './chess-worlds-model.ts'

export function continuationTiming(plies: number) {
  const count = Math.max(0, Math.min(6, Math.floor(Number.isFinite(plies) ? plies : 0)))
  const lead = 700,
    step = 1_000,
    hold = 1_800,
    fade = 400
  const duration = lead + count * step + hold + fade
  return { lead, step, hold, fade, duration, count }
}

/** Legal piece tracks share one clock, including the rook during castling. */
export function continuationPieceKeyframes(track: WorldPieceTrack) {
  const frames = worldPieceKeyframes(track)
  const timing = continuationTiming(track.squares.length - 1)
  const place = (frame: (typeof frames)[number]) => ({
    x: 16 + (frame.x / 100) * 48,
    y: 16 + (frame.y / 100) * 48,
    opacity: frame.opacity,
    promoted: frame.promoted
  })
  return [
    { percent: 0, ...place(frames[0]) },
    ...frames.map((frame) => ({ percent: ((timing.lead + (frame.percent / 100) * timing.count * timing.step) / timing.duration) * 100, ...place(frame) })),
    { percent: 100, ...place(frames.at(-1)!) }
  ]
}
