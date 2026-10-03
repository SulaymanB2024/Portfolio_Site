import { PORTFOLIO_DITHER_GLSL } from './dither-kernel'
import { STUDY_INK_GLSL } from './work-study-ink'

export const WORK_STUDY_VERTEX = /* glsl */ `
  varying vec2 studyUv;
  void main() {
    studyUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const WORK_STUDY_FRAGMENT = /* glsl */ `
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
  float inkTone(vec4 model) {
    return portfolioDisplayLuminance(model.rgb);
  }
  void main() {
    vec4 model = texture2D(studyColor, studyUv);
    // Preserve coarse silhouette samples during flight; empty resting paper
    // needs neither ordered thresholds nor animated grain.
    if (model.a <= .0001 && studyFlight.y <= 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    float hover = 0.0;
    float burst = 0.0;
    vec4 region = vec4(0.0);
    for (int i = 0; i < 4; i++) {
      vec4 r = studyRegions[i];
      if (gl_FragCoord.x >= r.x && gl_FragCoord.y >= r.y && gl_FragCoord.x < r.x + r.z && gl_FragCoord.y < r.y + r.w) { hover = studyHover[i]; burst = studyBursts[i]; region = r; }
    }
    // Attach CSS-sized cells to the same rounded viewport as the model. Native
    // scrolling then moves the sculpture and its grain together, including
    // fractional slot positions and unequal backing scales on each axis.
    vec2 localPixel = studyUv * studyCssResolution;
    float localV = studyUv.y;
    if (region.z > 0.0 && region.w > 0.0) {
      localPixel = (gl_FragCoord.xy - region.xy) * studyCssResolution / studyResolution.xy;
      localV = (gl_FragCoord.y - region.y) / region.w;
    }
    vec2 pixel = floor(localPixel);
    float gray = inkTone(model);
    float threshold = portfolioBayer8(pixel);
    // Wrap the ordered pattern during interaction to retain its tonal range.
    // Blending threshold distributions makes bright bevels disappear on hover.
    float mark;
    float burstMask = 1.0;
    if (hover > 0.0 || burst > 0.0) {
      float fine = portfolioLiveThreshold(threshold, pixel, studyTime, .025);
      float grain = portfolioHash(floor(pixel / 2.0));
      float sweep = .5 + .5 * sin(localV * 12.0 - studyTime * 1.8);
      float hoverPattern = fract(fine + hover * (.24 + .08 * sweep) * (grain - .5));
      mark = step(hoverPattern, gray);
      burstMask = step(burst * .45, grain);
    } else {
      // Only tones close to this cell's threshold need animated grain work.
      mark = portfolioDitherMark(gray, threshold, pixel, studyTime, .025);
    }
    float coverage = model.a * (1.0 - mark) * burstMask;
    if (studyFlight.y > 0.0 && region.z > 0.0) {
      // A traveling band exposes coarse ink just before the surface releases it.
      // Final pixels and landed grains exchange ownership without an opacity dip.
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
