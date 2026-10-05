import { portfolioRenderPolicy } from '../mobile-render-policy.ts'

/** Type stays at canvas resolution; the four 3D buffers share a smaller budget. */
export function landingRenderBudget(width: number, height: number, deviceRatio: number, coarse = false, resolution = 1) {
  const policy = portfolioRenderPolicy(width, height, coarse)
  const pixels = Math.max(1, width * height)
  const canvasRatio = Math.min(Math.max(1, deviceRatio), 1.25, Math.sqrt(policy.pixels / pixels))
  const resolutionScale = Math.max(.8, Math.min(1, Number.isFinite(resolution) ? resolution : 1))
  const sceneRatio = Math.min(canvasRatio, Math.sqrt((policy.mobile ? 230_000 : 1_200_000) / pixels)) * resolutionScale
  return { canvasRatio, sceneRatio, mobile: policy.mobile, resolutionScale }
}
