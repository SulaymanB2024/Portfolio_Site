export interface ScrollInkUniforms {
  scrollInk: { value: number }
  scrollPhase: { value: number }
}

/** Grain follows visual velocity in screens/second, independent of rail length. */
export function scrollInkStrength(velocity: number, distance: number, viewport: number, reduced = false) {
  if (reduced || ![velocity, distance, viewport].every(Number.isFinite) || viewport <= 0) return 0
  const speed = Math.abs(velocity) * Math.max(0, distance) / viewport
  return .30 * -Math.expm1(-speed * .65)
}

/** Shared by sculpture, visor, and type. Phase comes from scroll, never a clock. */
export const scrollInkShader = /*glsl*/`
uniform float scrollInk;
uniform float scrollPhase;
float inkWave(vec2 pixel){
  return .5*(sin(pixel.x*.047+pixel.y*.023+scrollPhase*1.7)
    +cos(pixel.y*.061-pixel.x*.019-scrollPhase*1.2));
}
float sculptureBayer(vec2 pixel){
  vec2 q=mod(floor(pixel),4.);float rank;
  if(q.x<1.){if(q.y<1.)rank=16.;else if(q.y<2.)rank=5.;else if(q.y<3.)rank=13.;else rank=1.;}
  else if(q.x<2.){if(q.y<1.)rank=8.;else if(q.y<2.)rank=12.;else if(q.y<3.)rank=4.;else rank=9.;}
  else if(q.x<3.){if(q.y<1.)rank=14.;else if(q.y<2.)rank=2.;else if(q.y<3.)rank=15.;else rank=3.;}
  else{if(q.y<1.)rank=6.;else if(q.y<2.)rank=10.;else if(q.y<3.)rank=7.;else rank=11.;}
  return rank/17.;
}
float sculptureThreshold(vec2 pixel){
  float fine=sculptureBayer(pixel),coarse=sculptureBayer(pixel/2.);
  return clamp(mix(fine,coarse,scrollInk*.48)+inkWave(pixel)*scrollInk*.075,1./17.,16./17.);
}
`
