import { portfolioRenderPolicy } from '../mobile-render-policy.ts'

/** Type stays at canvas resolution; the four 3D buffers share a smaller budget. */
export function landingRenderBudget(width: number, height: number, deviceRatio: number, coarse = false) {
  const policy = portfolioRenderPolicy(width, height, coarse)
  const pixels = Math.max(1, width * height)
  const canvasRatio = Math.min(Math.max(1, deviceRatio), 1.25, Math.sqrt(policy.pixels / pixels))
  const sceneRatio = Math.min(canvasRatio, Math.sqrt((policy.mobile ? 230_000 : 1_200_000) / pixels))
  return { canvasRatio, sceneRatio, mobile: policy.mobile }
}
