import { settleFlow } from './flow-timing.ts'

export type HomePointerPose = { x: number; y: number; engagement: number }
export const homePointerRest: HomePointerPose = { x: 0, y: 0, engagement: 0 }

export function allowHomePointer(input: {
  fine: boolean; reduced: boolean; hidden: boolean; busy: boolean; dragging: boolean; focused: boolean;
  pointerType: string; buttons: number; selection: boolean;
}) {
  return input.fine && !input.reduced && !input.hidden && !input.busy && !input.dragging && !input.focused &&
    input.pointerType === 'mouse' && input.buttons === 0 && !input.selection
}

/** Normalize against a stationary native hit area, with a hard cap at its edges. */
export function homePointerPose(x: number, y: number, rect: { left: number; top: number; width: number; height: number }): HomePointerPose {
  if (![x, y, rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0) return { ...homePointerRest }
  const clamp = (value: number) => Math.max(-1, Math.min(1, value))
  return { x: clamp((x - rect.left) / rect.width * 2 - 1), y: clamp((y - rect.top) / rect.height * 2 - 1), engagement: 1 }
}

/** Damped, frame-rate-independent response; snaps at rest so no idle loop remains. */
export function settleHomePointer(current: HomePointerPose, target: HomePointerPose, seconds: number): HomePointerPose {
  return { x: settleFlow(current.x, target.x, seconds), y: settleFlow(current.y, target.y, seconds), engagement: settleFlow(current.engagement, target.engagement, seconds) }
}

export function homePointerSettled(current: HomePointerPose, target: HomePointerPose) {
  return current.x === target.x && current.y === target.y && current.engagement === target.engagement
}
