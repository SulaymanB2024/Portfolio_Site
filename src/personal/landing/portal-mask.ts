import { RedFormat, WebGLRenderTarget } from 'three'

/** The aperture is an opaque white silhouette, composited from its red channel.
 * It needs neither the other color channels nor depth ordering between openings.
 */
export function createPortalMaskTarget(width: number, height: number) {
  return new WebGLRenderTarget(width, height, { format: RedFormat, depthBuffer: false })
}
