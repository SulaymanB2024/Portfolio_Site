import { PORTFOLIO_DITHER_GLSL } from '../../src/personal/dither-kernel.ts'
import { STUDY_INK_GLSL } from '../../src/personal/work-study-ink.ts'

// Independent full-cost reference for the slot-local threshold distribution.
// The production fastpath must agree even for translucent and flying surfaces.
export const REFERENCE_FRAGMENT = /* glsl */ `
  uniform sampler2D studyColor;
  uniform sampler2D studySurface;
  uniform vec3 studyInk;
  uniform vec4 studyRegions[4];
  uniform vec4 studyHover;
  uniform vec4 studyBursts;
  uniform float studyTime;
  uniform vec2 studyFlight;
  uniform vec3 studyResolution;
  uniform vec2 studyCssResolution;
  varying vec2 studyUv;
  ${PORTFOLIO_DITHER_GLSL}
  ${STUDY_INK_GLSL}
  void main() {
    vec4 model = texture2D(studyColor, studyUv);
    if (model.a <= .0001 && studyFlight.y <= 0.0) { gl_FragColor = vec4(0.0); return; }
    vec4 region = vec4(0.0);
    float hover = 0.0, burst = 0.0;
    for (int i = 0; i < 4; i++) {
      vec4 r = studyRegions[i];
      if (gl_FragCoord.x >= r.x && gl_FragCoord.y >= r.y && gl_FragCoord.x < r.x + r.z && gl_FragCoord.y < r.y + r.w) {
        region = r; hover = studyHover[i]; burst = studyBursts[i];
      }
    }
    vec2 localPixel = studyUv * studyCssResolution;
    float localV = studyUv.y;
    if (region.z > 0.0 && region.w > 0.0) {
      localPixel = (gl_FragCoord.xy - region.xy) * studyCssResolution / studyResolution.xy;
      localV = (gl_FragCoord.y - region.y) / region.w;
    }
    vec2 pixel = floor(localPixel);
    float threshold = portfolioLiveThreshold(portfolioBayer8(pixel), pixel, studyTime, .025);
    float burstMask = 1.0;
    if (hover > 0.0 || burst > 0.0) {
      float grain = portfolioHash(floor(pixel / 2.0));
      float sweep = .5 + .5 * sin(localV * 12.0 - studyTime * 1.8);
      threshold = fract(threshold + hover * (.24 + .08 * sweep) * (grain - .5));
      burstMask = step(burst * .45, grain);
    }
    float coverage = model.a * (1.0 - step(threshold, portfolioDisplayLuminance(model.rgb))) * burstMask;
    if (studyFlight.y > 0.0 && region.z > 0.0) {
      vec2 cell = floor((gl_FragCoord.xy - region.xy) / region.zw * inkGrid);
      vec2 uv = (cell + .5) / inkGrid;
      float mark = texture2D(studySurface, uv).a;
      float lifted = inkLifted(inkJourney(uv, studyFlight.x));
      float localGrain = inkEase((studyFlight.x - inkRelease(uv) + .045) / .045);
      float resting = coverage;
      coverage = mix(coverage, mark, localGrain) * (1.0 - lifted);
      coverage = mix(coverage, resting, inkHandoff(gl_FragCoord.xy, studyFlight.x));
    }
    gl_FragColor = vec4(studyInk, coverage);
    #include <colorspace_fragment>
  }
`
