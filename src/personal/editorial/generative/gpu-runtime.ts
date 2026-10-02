import type { CanvasSketch, CanvasSketchImage, CanvasSketchOptions, OffscreenSketchController, SketchRenderStats } from './canvas-runtime';
import type { P5SketchFactory } from './types';

export type GpuTarget = {
  width: number; height: number; texture: WebGLTexture; framebuffer: WebGLFramebuffer;
  removed?: boolean; gpuMs?: number;
};

export type GpuSurface = {
  readonly points: Float32Array;
  createTarget(width: number, height: number): GpuTarget;
  removeTarget(target: GpuTarget): void;
  begin(target: GpuTarget): void;
  end(target: GpuTarget): void;
  discs(target: GpuTarget, points: Float32Array, count: number): void;
  background(target: GpuTarget, gray: number, alpha: number): void;
  clear(target: GpuTarget): void;
  copy(source: GpuTarget, destination: GpuTarget): void;
  image(target: GpuTarget, source: GpuTarget, rectangle: number[], transform: number[], logical: number[]): void;
  present(target: GpuTarget, context: OffscreenCanvasRenderingContext2D): void;
  retain(): void;
  release(): void;
};

type SourceSketchApi = {
  [Key in keyof CanvasSketch]: CanvasSketch[Key] extends (...args: infer Arguments) => CanvasSketch
    ? (...args: Arguments) => SourceSketchApi : CanvasSketch[Key];
};

const MAX_POINTS = 65536;
const DISC_VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec2 center;
layout(location=1) in vec2 radii;
layout(location=2) in vec2 paint;
uniform vec2 logicalSize;
uniform float scale;
out vec2 local;
flat out vec2 radius;
flat out vec2 color;
void main(){
  vec2 corner=vec2(float(gl_VertexID&1),float((gl_VertexID>>1)&1))*2.0-1.0;
  float extent=radii.x+0.5/scale;
  vec2 position=center+corner*extent;
  gl_Position=vec4(position.x/logicalSize.x*2.0-1.0,1.0-position.y/logicalSize.y*2.0,0.0,1.0);
  local=corner*extent*scale;
  radius=radii*scale;
  color=paint;
}`;

// Integrate a disk over the pixel square. Tiny subpixel points retain their area
// instead of being enlarged to a one-pixel sprite; overlaps blend independently.
const DISC_FRAGMENT = `#version 300 es
precision highp float;
in vec2 local;
flat in vec2 radius;
flat in vec2 color;
out vec4 outputColor;
float primitive(float x,float r){
  return 0.5*(x*sqrt(max(0.0,r*r-x*x))+r*r*asin(clamp(x/r,0.0,1.0)));
}
float quadrant(vec2 p,float r){
  vec2 q=min(abs(p),vec2(r));
  float area;
  if(q.x>=r&&q.y>=r) area=0.7853981633974483*r*r;
  else if(dot(q,q)<=r*r) area=q.x*q.y;
  else{
    float edge=sqrt(max(0.0,r*r-q.y*q.y));
    area=q.y*edge+primitive(q.x,r)-primitive(edge,r);
  }
  return sign(p.x)*sign(p.y)*area;
}
float disk(float r){
  if(r<=0.0) return 0.0;
  vec2 nearEdge=max(abs(local)-0.5,vec2(0.0));
  if(dot(nearEdge,nearEdge)>=r*r) return 0.0;
  vec2 farEdge=abs(local)+0.5;
  if(dot(farEdge,farEdge)<=r*r) return 1.0;
  if(all(lessThanEqual(abs(local)+r,vec2(0.5)))) return 3.141592653589793*r*r;
  return clamp(quadrant(local+vec2(0.5),r)-quadrant(local+vec2(-0.5,0.5),r)
    -quadrant(local+vec2(0.5,-0.5),r)+quadrant(local-vec2(0.5),r),0.0,1.0);
}
void main(){
  float alpha=color.y*clamp(disk(radius.x)-disk(radius.y),0.0,1.0);
  if(alpha<=0.0) discard;
  outputColor=vec4(vec3(color.x*alpha),alpha);
}`;

const QUAD_VERTEX = `#version 300 es
precision highp float;
uniform vec4 rectangle;
uniform mat3 transform;
uniform vec2 logicalSize;
out vec2 uv;
void main(){
  vec2 corner=vec2(float(gl_VertexID&1),float((gl_VertexID>>1)&1));
  vec3 position=transform*vec3(rectangle.xy+corner*rectangle.zw,1.0);
  gl_Position=vec4(position.x/logicalSize.x*2.0-1.0,1.0-position.y/logicalSize.y*2.0,0.0,1.0);
  uv=vec2(corner.x,1.0-corner.y);
}`;
const QUAD_FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D source;
uniform vec4 paint;
uniform bool useTexture;
in vec2 uv;
out vec4 outputColor;
void main(){outputColor=useTexture?texture(source,uv):paint;}`;

type TimerExtension = { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number };
const IDENTITY = [1, 0, 0, 1, 0, 0];

/** One GL context, one reusable point buffer, retained textures for all studies. */
export class GpuArtworkPool implements GpuSurface {
  readonly points = new Float32Array(MAX_POINTS * 6);
  private readonly canvas: OffscreenCanvas;
  private readonly gl: WebGL2RenderingContext;
  private readonly discProgram: WebGLProgram;
  private readonly quadProgram: WebGLProgram;
  private readonly pointBuffer: WebGLBuffer;
  private readonly pointArray: WebGLVertexArrayObject;
  private readonly quadArray: WebGLVertexArrayObject;
  private readonly solidTexture: WebGLTexture;
  private readonly discUniforms: { logicalSize: WebGLUniformLocation | null; scale: WebGLUniformLocation | null };
  private readonly quadUniforms: Record<'rectangle' | 'transform' | 'logicalSize' | 'paint' | 'useTexture' | 'source', WebGLUniformLocation | null>;
  private readonly timer: TimerExtension | null;
  private pendingQueries: { query: WebGLQuery; target: GpuTarget }[] = [];
  private currentQuery: { query: WebGLQuery; target: GpuTarget } | null = null;
  private targets = new Set<GpuTarget>();
  private leases = 0;
  private lost = false;
  private disposed = false;
  private readonly onLost = (event: Event) => { event.preventDefault(); this.lost = true; };

  constructor() {
    this.canvas = new OffscreenCanvas(400, 400);
    const gl = this.canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: true });
    if (!gl) throw new Error('WebGL2 is unavailable.');
    this.gl = gl;
    const compile = (kind: number, source: string) => {
      const shader = gl.createShader(kind);
      if (!shader) throw new Error('Cannot allocate artwork shader.');
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { const reason = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(reason || 'Artwork shader failed.'); }
      return shader;
    };
    const program = (vertex: string, fragment: string) => {
      const shaders = [compile(gl.VERTEX_SHADER, vertex), compile(gl.FRAGMENT_SHADER, fragment)];
      const value = gl.createProgram();
      if (!value) { shaders.forEach(shader => gl.deleteShader(shader)); throw new Error('Cannot allocate artwork program.'); }
      shaders.forEach(shader => gl.attachShader(value, shader)); gl.linkProgram(value); shaders.forEach(shader => gl.deleteShader(shader));
      if (!gl.getProgramParameter(value, gl.LINK_STATUS)) { const reason = gl.getProgramInfoLog(value); gl.deleteProgram(value); throw new Error(reason || 'Artwork program failed.'); }
      return value;
    };
    try {
      this.discProgram = program(DISC_VERTEX, DISC_FRAGMENT);
      this.quadProgram = program(QUAD_VERTEX, QUAD_FRAGMENT);
      const pointBuffer = gl.createBuffer(), pointArray = gl.createVertexArray(), quadArray = gl.createVertexArray();
      if (!pointBuffer || !pointArray || !quadArray) throw new Error('Cannot allocate artwork batch.');
      this.pointBuffer = pointBuffer; this.pointArray = pointArray; this.quadArray = quadArray;
      const solidTexture = gl.createTexture();
      if (!solidTexture) throw new Error('Cannot allocate artwork paint.');
      this.solidTexture = solidTexture;
      gl.bindTexture(gl.TEXTURE_2D, solidTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.bindVertexArray(pointArray); gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.points.byteLength, gl.DYNAMIC_DRAW);
      for (let location = 0; location < 3; location++) {
        gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 24, location * 8); gl.vertexAttribDivisor(location, 1);
      }
      this.discUniforms = { logicalSize: gl.getUniformLocation(this.discProgram, 'logicalSize'), scale: gl.getUniformLocation(this.discProgram, 'scale') };
      this.quadUniforms = Object.fromEntries(['rectangle', 'transform', 'logicalSize', 'paint', 'useTexture', 'source'].map(name => [name, gl.getUniformLocation(this.quadProgram, name)])) as typeof this.quadUniforms;
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      this.timer = gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerExtension | null;
      this.canvas.addEventListener('webglcontextlost', this.onLost);
    } catch (error) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      throw error;
    }
  }

  get unavailable() { return this.disposed || this.lost || this.gl.isContextLost(); }
  retain() { if (this.unavailable) throw new Error('Artwork GPU context is unavailable.'); this.leases++; }
  release() { this.leases = Math.max(0, this.leases - 1); if (!this.leases) this.dispose(); }

  createTarget(width: number, height: number): GpuTarget {
    const gl = this.gl, texture = gl.createTexture(), framebuffer = gl.createFramebuffer();
    if (!texture || !framebuffer) {
      if (texture) gl.deleteTexture(texture);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
      throw new Error('Cannot allocate artwork texture.');
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { gl.deleteTexture(texture); gl.deleteFramebuffer(framebuffer); throw new Error('Artwork framebuffer is incomplete.'); }
    const target = { width, height, texture, framebuffer };
    this.targets.add(target); this.clear(target);
    return target;
  }

  removeTarget(target: GpuTarget) {
    if (target.removed) return;
    target.removed = true;
    this.targets.delete(target);
    this.gl.deleteTexture(target.texture); this.gl.deleteFramebuffer(target.framebuffer);
    this.pendingQueries = this.pendingQueries.filter(pending => {
      if (pending.target !== target) return true;
      this.gl.deleteQuery(pending.query); return false;
    });
  }

  private bind(target: GpuTarget) {
    if (this.unavailable || target.removed) throw new Error('Artwork GPU context was lost.');
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.framebuffer); this.gl.viewport(0, 0, target.width, target.height);
  }

  begin(target: GpuTarget) {
    this.bind(target);
    if (!this.timer) return;
    this.pendingQueries = this.pendingQueries.filter(pending => {
      if (!this.gl.getQueryParameter(pending.query, this.gl.QUERY_RESULT_AVAILABLE)) return true;
      if (!this.gl.getParameter(this.timer!.GPU_DISJOINT_EXT)) pending.target.gpuMs = Number(this.gl.getQueryParameter(pending.query, this.gl.QUERY_RESULT)) / 1e6;
      this.gl.deleteQuery(pending.query); return false;
    });
    if (this.pendingQueries.length >= 16) return;
    const query = this.gl.createQuery();
    if (query) { this.currentQuery = { query, target }; this.gl.beginQuery(this.timer.TIME_ELAPSED_EXT, query); }
  }

  end(_target: GpuTarget) {
    if (!this.currentQuery || !this.timer) return;
    this.gl.endQuery(this.timer.TIME_ELAPSED_EXT); this.pendingQueries.push(this.currentQuery); this.currentQuery = null;
  }

  discs(target: GpuTarget, points: Float32Array, count: number) {
    if (!count) return;
    const gl = this.gl; this.bind(target);
    gl.useProgram(this.discProgram); gl.bindVertexArray(this.pointArray); gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, points, 0, count * 6);
    gl.uniform2f(this.discUniforms.logicalSize, target.width, target.height); gl.uniform1f(this.discUniforms.scale, 1);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
  }

  private quad(target: GpuTarget, rectangle: number[], transform: number[], logical: number[], paint: number[], texture?: WebGLTexture) {
    const gl = this.gl; this.bind(target); gl.useProgram(this.quadProgram); gl.bindVertexArray(this.quadArray);
    gl.uniform4fv(this.quadUniforms.rectangle, rectangle); gl.uniform2fv(this.quadUniforms.logicalSize, logical);
    const [a, b, c, d, e, f] = transform;
    gl.uniformMatrix3fv(this.quadUniforms.transform, false, [a, b, 0, c, d, 0, e, f, 1]);
    gl.uniform4fv(this.quadUniforms.paint, paint); gl.uniform1i(this.quadUniforms.useTexture, texture ? 1 : 0);
    // Bind a complete source even for the solid branch; never sample the target.
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture ?? this.solidTexture); gl.uniform1i(this.quadUniforms.source, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  background(target: GpuTarget, gray: number, alpha: number) {
    if (alpha === 1) { this.bind(target); this.gl.clearColor(gray, gray, gray, 1); this.gl.clear(this.gl.COLOR_BUFFER_BIT); }
    else this.quad(target, [0, 0, target.width, target.height], IDENTITY, [target.width, target.height], [gray * alpha, gray * alpha, gray * alpha, alpha]);
  }
  clear(target: GpuTarget) { this.bind(target); this.gl.clearColor(0, 0, 0, 0); this.gl.clear(this.gl.COLOR_BUFFER_BIT); }
  copy(source: GpuTarget, destination: GpuTarget) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, source.framebuffer); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, destination.framebuffer);
    gl.blitFramebuffer(0, 0, source.width, source.height, 0, 0, destination.width, destination.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  }
  image(target: GpuTarget, source: GpuTarget, rectangle: number[], transform: number[], logical: number[]) {
    this.quad(target, rectangle, transform, logical, [0, 0, 0, 0], source.texture);
  }
  present(target: GpuTarget, context: OffscreenCanvasRenderingContext2D) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, target.framebuffer); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    // The shared display crop occupies the top left of the 400px scratch canvas.
    gl.blitFramebuffer(0, 0, target.width, target.height, 0, 400 - target.height, target.width, 400, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    context.drawImage(this.canvas, 0, 0, target.width, target.height, 0, 0, target.width, target.height);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.currentQuery && this.timer) { this.gl.endQuery(this.timer.TIME_ELAPSED_EXT); this.gl.deleteQuery(this.currentQuery.query); this.currentQuery = null; }
    for (const target of [...this.targets]) this.removeTarget(target);
    for (const pending of this.pendingQueries) this.gl.deleteQuery(pending.query);
    this.pendingQueries = [];
    this.gl.deleteBuffer(this.pointBuffer); this.gl.deleteVertexArray(this.pointArray); this.gl.deleteVertexArray(this.quadArray);
    this.gl.deleteProgram(this.discProgram); this.gl.deleteProgram(this.quadProgram);
    this.gl.deleteTexture(this.solidTexture);
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.canvas.width = this.canvas.height = 0;
  }
}

/** Same public source API; only painting is replaced by ordered GPU batches. */
export class GpuSketch implements SourceSketchApi {
  readonly PI = Math.PI; readonly abs = Math.abs; readonly atan2 = Math.atan2;
  readonly cos = Math.cos; readonly sin = Math.sin; readonly mag = Math.hypot;
  draw: (() => void) | undefined;
  readonly canvas: OffscreenCanvas;
  private readonly surface: GpuSurface;
  private readonly context: OffscreenCanvasRenderingContext2D;
  private readonly scale: number;
  private target: GpuTarget;
  private logicalWidth = 100; private logicalHeight = 100;
  private transform = [...IDENTITY];
  private identityTransform = true;
  private count = 0; private marks = 0; private calls = 0;
  private strokeGray = 0; private strokeAlpha = 1; private fillGray = 1; private fillAlpha = 1;
  private weight = 1; private strokeEnabled = true; private removed = false;
  private snapshots: { target: GpuTarget; image: CanvasSketchImage }[] = [];
  private snapshotCursor = 0;
  private images = new WeakMap<CanvasSketchImage, GpuTarget>();
  private stats: SketchRenderStats = { formulaMs: 0, submitMs: 0, presentMs: 0, points: 0, drawCalls: 0 };

  constructor(canvas: OffscreenCanvas, surface: GpuSurface, options: CanvasSketchOptions = {}) {
    this.canvas = canvas; this.surface = surface;
    if (options.physicalSize !== undefined && !Number.isFinite(options.physicalSize)) throw new RangeError('Physical sketch size must be finite.');
    this.scale = options.physicalSize === undefined ? 1 : Math.max(160, Math.min(400, options.physicalSize)) / 400;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas2D display is unavailable.');
    this.context = context; this.context.globalCompositeOperation = 'copy';
    this.target = surface.createTarget(Math.round(100 * this.scale), Math.round(100 * this.scale));
    this.surface.retain(); this.createCanvas(100, 100);
  }
  get width() { return this.logicalWidth; } get height() { return this.logicalHeight; }
  getRenderStats() { return { ...this.stats, gpuMs: this.target.gpuMs }; }

  createCanvas(width: number, height: number): this {
    if (![width, height].every(Number.isFinite) || width <= 0 || height <= 0) throw new RangeError('Sketch dimensions must be positive and finite.');
    this.logicalWidth = Math.floor(width); this.logicalHeight = Math.floor(height);
    const physicalWidth = Math.max(1, Math.round(this.width * this.scale)), physicalHeight = Math.max(1, Math.round(this.height * this.scale));
    if (this.target.width !== physicalWidth || this.target.height !== physicalHeight) {
      this.surface.removeTarget(this.target); this.target = this.surface.createTarget(physicalWidth, physicalHeight);
      for (const snapshot of this.snapshots) this.surface.removeTarget(snapshot.target);
      this.snapshots = []; this.images = new WeakMap();
    } else this.surface.clear(this.target);
    this.canvas.width = physicalWidth; this.canvas.height = physicalHeight;
    this.context.globalCompositeOperation = 'copy';
    this.transform = [...IDENTITY]; this.identityTransform = true; this.strokeGray = 0; this.strokeAlpha = 1; this.fillGray = 1; this.fillAlpha = 1;
    this.weight = 1; this.strokeEnabled = true; this.count = 0;
    return this;
  }
  pixelDensity(_requested?: number) { return 1; }
  private flush() { if (this.count) { this.surface.discs(this.target, this.surface.points, this.count); this.calls++; this.count = 0; } }
  background(gray: number, alpha = 255): this {
    if (Number.isNaN(gray) || Number.isNaN(alpha)) return this;
    this.flush(); this.surface.background(this.target, Math.round(Math.max(0, Math.min(255, gray))) / 255, Math.max(0, Math.min(1, alpha / 255))); this.calls++;
    return this;
  }
  clear(..._ignored: number[]): this { this.count = 0; this.surface.clear(this.target); this.calls++; return this; }
  stroke(gray: number, alpha = 255): this {
    this.strokeEnabled = true;
    if (!Number.isNaN(gray) && !Number.isNaN(alpha)) { this.strokeGray = Math.round(Math.max(0, Math.min(255, gray))) / 255; this.strokeAlpha = Math.max(0, Math.min(1, alpha / 255)); }
    return this;
  }
  strokeWeight(weight?: number): this { const value = weight === undefined || weight === 0 ? .0001 : weight; if (Number.isFinite(value) && value > 0) this.weight = value; return this; }
  noStroke(): this { this.strokeEnabled = false; return this; }
  fill(gray: number, alpha = 255): this {
    if (!Number.isNaN(gray) && !Number.isNaN(alpha)) { this.fillGray = Math.round(Math.max(0, Math.min(255, gray))) / 255; this.fillAlpha = Math.max(0, Math.min(1, alpha / 255)); }
    return this;
  }
  private disc(x: number, y: number, radius: number, inner: number, gray: number, alpha: number) {
    this.marks++;
    if (!alpha || !Number.isFinite(x) || !Number.isFinite(y)) return;
    let centerX = x * this.scale, centerY = y * this.scale;
    if (!this.identityTransform) {
      const matrix = this.transform;
      centerX = (x * matrix[0] + y * matrix[2] + matrix[4]) * this.scale;
      centerY = (x * matrix[1] + y * matrix[3] + matrix[5]) * this.scale;
    }
    const outer = radius * this.scale;
    if (centerX + outer + .5 < 0 || centerY + outer + .5 < 0 || centerX - outer - .5 > this.target.width || centerY - outer - .5 > this.target.height) return;
    if (this.count === MAX_POINTS) this.flush();
    const data = this.surface.points, at = this.count++ * 6;
    data[at] = centerX; data[at + 1] = centerY; data[at + 2] = outer; data[at + 3] = inner * this.scale; data[at + 4] = gray; data[at + 5] = alpha;
  }
  point(x: number, y: number): this { if (this.strokeEnabled) this.disc(x, y, this.weight / 2, 0, this.strokeGray, this.strokeAlpha); return this; }
  circle(x: number, y: number, diameter: number): this {
    if (![x, y, diameter].every(Number.isFinite)) return this;
    const radius = Math.abs(diameter) / 2;
    this.disc(x, y, radius, 0, this.fillGray, this.fillAlpha);
    if (this.strokeEnabled) this.disc(x, y, radius + this.weight / 2, Math.max(0, radius - this.weight / 2), this.strokeGray, this.strokeAlpha);
    return this;
  }
  translate(x: number, y: number): this {
    if (Number.isFinite(x) && Number.isFinite(y)) { const [a, b, c, d, e, f] = this.transform; this.transform[4] = e + a * x + c * y; this.transform[5] = f + b * x + d * y; this.identityTransform = false; }
    return this;
  }
  rotate(angle: number): this {
    if (Number.isFinite(angle)) { const [a, b, c, d, e, f] = this.transform, cosine = Math.cos(angle), sine = Math.sin(angle); this.transform = [a * cosine + c * sine, b * cosine + d * sine, c * cosine - a * sine, d * cosine - b * sine, e, f]; this.identityTransform = false; }
    return this;
  }
  get(): CanvasSketchImage {
    this.flush();
    let snapshot = this.snapshots[this.snapshotCursor++];
    if (!snapshot) {
      if (this.snapshots.length >= 8) throw new Error('Artwork snapshot bound exceeded.');
      snapshot = { target: this.surface.createTarget(this.target.width, this.target.height), image: { canvas: new OffscreenCanvas(this.target.width, this.target.height), width: this.width, height: this.height } };
      this.snapshots.push(snapshot); this.images.set(snapshot.image, snapshot.target);
    }
    this.surface.copy(this.target, snapshot.target); this.calls++;
    return snapshot.image;
  }
  image(image: CanvasSketchImage, x: number, y: number, width = image.width, height = image.height): this {
    if (![x, y, width, height].every(Number.isFinite)) return this;
    const source = this.images.get(image);
    if (!source) throw new Error('Unsupported artwork snapshot.');
    this.flush(); this.surface.image(this.target, source, [x, y, width, height], this.transform, [this.width, this.height]); this.calls++;
    return this;
  }
  renderFrame(): boolean {
    if (this.removed || !this.draw) return false;
    this.transform = [...IDENTITY]; this.identityTransform = true; this.count = 0; this.marks = 0; this.calls = 0; this.snapshotCursor = 0;
    this.surface.begin(this.target);
    const start = performance.now();
    try {
      this.draw();
      const formulaEnd = performance.now(); this.flush(); const submitted = performance.now();
      this.surface.present(this.target, this.context);
      this.stats = { formulaMs: formulaEnd - start, submitMs: submitted - formulaEnd, presentMs: performance.now() - submitted, points: this.marks, drawCalls: this.calls + 1 };
    } finally { this.surface.end(this.target); }
    return true;
  }
  remove() {
    if (this.removed) return;
    this.removed = true; this.draw = undefined;
    for (const snapshot of this.snapshots) { this.surface.removeTarget(snapshot.target); snapshot.image.canvas.width = snapshot.image.canvas.height = 0; }
    this.snapshots = []; this.images = new WeakMap(); this.surface.removeTarget(this.target); this.surface.release();
    this.canvas.width = this.canvas.height = 0; this.logicalWidth = this.logicalHeight = 0;
  }
}

export function createGpuCanvasSketch(factory: P5SketchFactory, canvas: OffscreenCanvas, pool: GpuSurface, options: CanvasSketchOptions = {}): OffscreenSketchController {
  const instance = new GpuSketch(canvas, pool, options);
  try { factory(instance as unknown as CanvasSketch); }
  catch (error) { instance.remove(); throw error; }
  return { canvas, engine: 'gpu', get width() { return instance.width; }, get height() { return instance.height; }, draw: () => instance.renderFrame(), remove: () => instance.remove(), getRenderStats: () => instance.getRenderStats() };
}
