/** Portfolio-only shading. The original shader experiment remains independent. */
export const PORTFOLIO_DITHER_GLSL = /* glsl */ `
float portfolioBayer2(vec2 p) {
  return p.x * 2.0 + p.y * 3.0 - p.x * p.y * 4.0;
}
float portfolioBayer4(vec2 cell) {
  vec2 p = mod(floor(cell), 4.0);
  return (4.0 * portfolioBayer2(mod(p, 2.0)) + portfolioBayer2(floor(p / 2.0)) + .5) / 16.0;
}
float portfolioBayer8(vec2 cell) {
  vec2 p = mod(floor(cell), 8.0);
  return (16.0 * portfolioBayer2(mod(p, 2.0)) + 4.0 * portfolioBayer2(mod(floor(p / 2.0), 2.0)) + portfolioBayer2(floor(p / 4.0)) + .5) / 64.0;
}
float portfolioLinearLuminance(vec3 rgb) {
  return dot(max(rgb, vec3(0.0)), vec3(.2126, .7152, .0722));
}
float portfolioDisplayLuminance(vec3 rgb) {
  float linear = clamp(portfolioLinearLuminance(rgb), 0.0, 1.0);
  return linear <= .0031308 ? linear * 12.92 : 1.055 * pow(linear, 1.0 / 2.4) - .055;
}
float portfolioHash(vec2 cell) {
  return fract(sin(dot(floor(cell), vec2(127.1, 311.7))) * 43758.5453);
}
float portfolioLiveThreshold(float threshold, vec2 cell, float seconds, float amount) {
  // A fixed spatial seed and continuous clock replace periodic grain reshuffling.
  float phase = portfolioHash(cell) * 6.28318530718;
  return clamp(threshold + sin(seconds * .65 + phase) * amount, .0078125, .9921875);
}
`;
