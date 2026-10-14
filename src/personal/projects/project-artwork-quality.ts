/** One detailed project model gets a bounded retina target; the collection
 * retains its existing budget. Adaptive quality still scales both dimensions.
 */
export function projectArtworkSize(width: number, height: number, deviceRatio: number, mobile: boolean, quality = 1) {
  const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback
  const w = Math.max(1, Math.floor(finite(width, 1))), h = Math.max(1, Math.floor(finite(height, 1)))
  const budget = mobile ? 1_200_000 : 2_200_000
  const ratio = Math.min(2, Math.max(.1, finite(deviceRatio, 1)), Math.sqrt(budget / (w * h))) * Math.min(1, Math.max(.1, finite(quality, 1)))
  const renderWidth = Math.min(budget, Math.max(1, Math.floor(w * ratio)))
  const renderHeight = Math.min(Math.floor(budget / renderWidth), Math.max(1, Math.floor(h * ratio)))
  return { width: renderWidth, height: renderHeight, scaleX: renderWidth / w, scaleY: renderHeight / h }
}
