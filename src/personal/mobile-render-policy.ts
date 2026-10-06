/** Decorative rendering must leave room for native scrolling on touch devices. */
export function portfolioRenderPolicy(width: number, height: number, coarse: boolean) {
  const mobile = coarse || width <= 600 || (width <= 950 && height <= 500)
  return {
    mobile,
    autoplay: true,
    pixels: mobile ? 400_000 : 2_200_000,
    maxRatio: mobile ? 1.5 : Infinity,
    pointScale: mobile ? .7 : 1,
  }
}

export function readPortfolioRenderPolicy() {
  return typeof window === 'undefined'
    ? portfolioRenderPolicy(1280, 800, false)
    : portfolioRenderPolicy(window.innerWidth, window.innerHeight, window.matchMedia('(pointer: coarse)').matches)
}

export function touchOrbitIntent(dx: number, dy: number): 'pending' | 'scroll' | 'orbit' {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return 'pending'
  return Math.abs(dx) > Math.abs(dy) * 1.2 ? 'orbit' : 'scroll'
}
