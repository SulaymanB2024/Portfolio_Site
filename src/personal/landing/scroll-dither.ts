import { easeBetween, thresholdMotion } from './motion-curves.ts'

export interface ScrollInkUniforms {
  scrollInk: { value: number }
  scrollPhase: { value: number }
  scrollPassage: { value: number }
  scrollSweep: { value: number }
}

/** Grain follows visual velocity in screens/second, independent of rail length. */
export function scrollInkStrength(velocity: number, distance: number, viewport: number, reduced = false) {
  if (reduced || ![velocity, distance, viewport].every(Number.isFinite) || viewport <= 0) return 0
  const speed = Math.abs(velocity) * Math.max(0, distance) / viewport
  return .30 * -Math.expm1(-speed * .65)
}

/** Grain attacks promptly and releases smoothly without an idle noise clock. */
export function advanceScrollInk(current: number, target: number, seconds: number, reduced = false) {
  if (reduced) return 0
  const from = Number.isFinite(current) ? Math.max(0, Math.min(.3, current)) : 0
  const to = Number.isFinite(target) ? Math.max(0, Math.min(.3, target)) : 0
  const elapsed = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const next = to + (from - to) * Math.exp(-(to > from ? 24 : 14) * elapsed)
  return to === 0 && next < .001 ? 0 : next
}

/** A reversible grain sweep belongs to the passage, leaving every reading hold untouched. */
export function scrollDitherPassage(progress: number, mobile = false, reduced = false) {
  if (reduced || !Number.isFinite(progress)) return { strength: 0, sweep: 0 }
  const scaled = Math.max(0, Math.min(1, progress)) * 4
  const local = scaled - Math.min(3, Math.floor(scaled))
  return {
    strength: easeBetween(local, .10, .24) * (1 - easeBetween(local, .58, .74)) * (mobile ? .65 : 1),
    sweep: thresholdMotion(local).travel,
  }
}

/** Shared by sculpture, visor, and type. Phase comes from scroll, never a clock. */
export const scrollInkShader = /*glsl*/`
uniform float scrollInk;
uniform float scrollPhase;
uniform float scrollPassage;
uniform float scrollSweep;
float inkSweep(vec2 uv){
  float axis=uv.y+.18*(uv.x-.5);
  float center=mix(1.18,-.18,scrollSweep);
  float band=1.-smoothstep(.06,.32,abs(axis-center));
  return clamp(scrollInk*.48+scrollPassage*band*.62,0.,.72);
}
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
float sculptureThreshold(vec2 pixel,vec2 uv){
  float fine=sculptureBayer(pixel);
  if(scrollInk<=0.&&scrollPassage<=0.)return fine;
  float amount=inkSweep(uv);
  if(amount<=0.)return fine;
  float coarse=sculptureBayer(pixel/2.);
  return clamp(mix(fine,coarse,amount)+inkWave(pixel)*amount*.045,1./17.,16./17.);
}
`
