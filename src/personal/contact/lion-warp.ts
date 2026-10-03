/** Source-space deformation shared by the scan and its sampled ink. */
export const lionWarpGLSL = /* glsl */ `
  float lionHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 43.231))) * 43758.5453); }
  float lionErosion(vec3 p) {
    return (.34 - p.y) * .78 + (p.x + 1.0) * .09
      + sin(p.x * 3.5 + p.z * 4.0) * .055 + sin(p.y * 11.0 + p.z * 7.0) * .018
      - exp(-p.x * p.x * 8.0 - pow((p.y + .1) * 4.0, 2.0)) * .22;
  }
  float lionRelease(vec3 p, float field) {
    float front = .91 - field * .91;
    return smoothstep(front - .055, front + .055, lionErosion(p));
  }
  vec3 lionWarp(vec3 p, float field) {
    float bend = field * field * lionRelease(p, field);
    return p + vec3(sin(p.y * 5.0 + p.z * 3.0) * .13,
      sin(p.x * 3.0 - p.z * 2.0) * .09,
      sin(p.y * 4.0 + p.x * 3.0) * .07) * bend;
  }
  // W(p) = p + field^2 * release(p) * displacement(p). The Jacobian's
  // cofactor columns transform normals with their surface orientation intact.
  void lionDeform(vec3 p, vec3 n, float field, out vec3 warped,
      out vec3 surfaceNormal, out float released) {
    vec2 erosionPhase = vec2(p.x * 3.5 + p.z * 4.0, p.y * 11.0 + p.z * 7.0);
    float gaussian = exp(-p.x * p.x * 8.0 - pow((p.y + .1) * 4.0, 2.0));
    float erosion = (.34 - p.y) * .78 + (p.x + 1.0) * .09
      + sin(erosionPhase.x) * .055 + sin(erosionPhase.y) * .018 - gaussian * .22;
    float front = .91 - field * .91;
    float lower = front - .055;
    float upper = front + .055;
    released = smoothstep(lower, upper, erosion);
    float fieldSquared = field * field;
    float bend = fieldSquared * released;
    if (bend == 0.0) {
      warped = p;
      surfaceNormal = normalize(n);
      return;
    }
    vec3 warpPhase = vec3(p.y * 5.0 + p.z * 3.0, p.x * 3.0 - p.z * 2.0,
      p.y * 4.0 + p.x * 3.0);
    vec3 displacement = sin(warpPhase) * vec3(.13, .09, .07);
    warped = p + displacement * bend;

    vec3 releaseGradient = vec3(0.0);
    if (released < 1.0) {
      vec2 erosionCos = cos(erosionPhase);
      vec3 erosionGradient = vec3(.09 + .1925 * erosionCos.x + 3.52 * p.x * gaussian,
        -.78 + .198 * erosionCos.y + 7.04 * (p.y + .1) * gaussian,
        .22 * erosionCos.x + .126 * erosionCos.y);
      float phase = clamp((erosion - lower) / (upper - lower), 0.0, 1.0);
      releaseGradient = erosionGradient * (6.0 * phase * (1.0 - phase) / (upper - lower));
    }
    vec3 warpCos = cos(warpPhase);
    vec3 dx = vec3(1.0, 0.0, 0.0) + fieldSquared *
      (released * vec3(0.0, .27 * warpCos.y, .21 * warpCos.z) + displacement * releaseGradient.x);
    vec3 dy = vec3(0.0, 1.0, 0.0) + fieldSquared *
      (released * vec3(.65 * warpCos.x, 0.0, .28 * warpCos.z) + displacement * releaseGradient.y);
    vec3 dz = vec3(0.0, 0.0, 1.0) + fieldSquared *
      (released * vec3(.39 * warpCos.x, -.18 * warpCos.y, 0.0) + displacement * releaseGradient.z);
    surfaceNormal = normalize(n.x * cross(dy, dz) + n.y * cross(dz, dx) + n.z * cross(dx, dy));
  }
  vec3 lionNormal(vec3 p, vec3 n, float field) {
    vec3 warped;
    vec3 surfaceNormal;
    float released;
    lionDeform(p, n, field, warped, surfaceNormal, released);
    return surfaceNormal;
  }
`
