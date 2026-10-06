import * as THREE from 'three'
import { CHAPTERS, textSequence, type LandingChapter, type TextSequence } from './sequence.ts'
import { headingSurface } from './heading-surface.ts'
import { isStackedLanding } from './mobile-layout.ts'
import type { ScrollInkUniforms } from './scroll-dither.ts'
import { HEADING_RESERVE_EM, layoutHeading, renderHeading, type HeadingLayout } from './heading-typography.ts'
export { textSequence } from './sequence.ts'
export const HEADLINES = CHAPTERS.map(chapter => chapter.lines)

export interface DitheredTextUniforms extends ScrollInkUniforms {
  textEnabled: { value: number }
  textAtlas: { value: THREE.Texture | null }
  textBox: { value: THREE.Vector4 }
  textPixels: { value: THREE.Vector2 }
  textState: { value: THREE.Vector2[] }
  textMeasure: { value: THREE.Vector2[] }
  textGrid: { value: number }
}
export interface DitheredTextOptions {
  headline: HTMLHeadingElement
  stage: HTMLElement
  uniforms: DitheredTextUniforms
  pixelRatio(): number
  onChapter(chapter: LandingChapter, index: number, height: number): void
  isAlive(): boolean
}

// Preserve the antialiased silhouette and encode depth inside the printed stroke.
export function encodeStrokeDepth(pixels: Uint8ClampedArray, width: number, height: number, depth: number){
  const distances=new Float32Array(width*height),diagonal=Math.SQRT2
  for(let i=0;i<distances.length;i++)distances[i]=pixels[i*4+3]>127?10000:0
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const i=y*width+x;if(!distances[i])continue
    distances[i]=Math.min(distances[i],x?distances[i-1]+1:1,y?distances[i-width]+1:1,x&&y?distances[i-width-1]+diagonal:1,y&&x<width-1?distances[i-width+1]+diagonal:1)
  }
  for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){
    const i=y*width+x;if(!distances[i])continue
    distances[i]=Math.min(distances[i],x<width-1?distances[i+1]+1:1,y<height-1?distances[i+width]+1:1,x<width-1&&y<height-1?distances[i+width+1]+diagonal:1,x&&y<height-1?distances[i+width-1]+diagonal:1)
  }
  for(let i=0;i<distances.length;i++)pixels[i*4]=Math.round(Math.min(1,distances[i]/Math.max(1,depth))*255)
  return pixels
}

export const textDitherShader=/*glsl*/`
uniform sampler2D textAtlas;
uniform vec4 textBox;
uniform vec2 textPixels;
uniform vec2 textState[${CHAPTERS.length}];
uniform vec2 textMeasure[${CHAPTERS.length}];
uniform float textEnabled;
uniform float textGrid;
float textHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float textBayer(vec2 p){
  vec2 cell=floor(p/textGrid),q=mod(cell,4.);float rank;
  if(q.x<1.){if(q.y<1.)rank=16.;else if(q.y<2.)rank=5.;else if(q.y<3.)rank=13.;else rank=1.;}
  else if(q.x<2.){if(q.y<1.)rank=8.;else if(q.y<2.)rank=12.;else if(q.y<3.)rank=4.;else rank=9.;}
  else if(q.x<3.){if(q.y<1.)rank=14.;else if(q.y<2.)rank=2.;else if(q.y<3.)rank=15.;else rank=3.;}
  else{if(q.y<1.)rank=6.;else if(q.y<2.)rank=10.;else if(q.y<3.)rank=7.;else rank=11.;}
  vec2 halfCell=mod(floor(cell/4.),2.);
  float fine=halfCell.x*2.+halfCell.y*3.-halfCell.x*halfCell.y*4.;
  return ((rank-1.)*4.+fine+.5)/64.;
}
vec4 textSample(vec2 uv,float row){
  if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return vec4(0.);
  return texture2D(textAtlas,vec2(uv.x,(uv.y+float(${CHAPTERS.length-1})-row)/float(${CHAPTERS.length})));
}
float printedHeading(vec2 local,vec2 state,vec2 measure,float row,float threshold){
  if(state.x<.0001||state.y>.9999)return 0.;
  vec4 resting=textSample(local,row);
  // Keep reading holds fully inked, even while the adjacent sculpture responds.
  if(state.x>.9999&&state.y<.0001)return resting.a;
  vec2 grainCell=floor(local*textPixels/3.);
  float grain=textHash(grainCell);
  float field=clamp(local.x/max(.001,measure.x),0.,1.)*.62+clamp((1.-local.y)/max(.001,measure.y),0.,1.)*.08+resting.r*.22+grain*.08;
  float formed=clamp((state.x*1.45-field)/.45,0.,1.);
  float released=clamp((state.y*1.45-field)/.45,0.,1.);
  float density=min(formed,1.-released);
  float looseness=max(1.-formed,released);
  float phase=max(1.-state.x,state.y),moving=4.*phase*(1.-phase);
  // Coherent grain paths depend only on scroll position, and retrace in reverse.
  vec2 stream=vec2(12.+4.*sin(local.y*29.+scrollPhase*.04),2.*sin(local.x*24.+local.y*12.)+2.*(grain-.5));
  vec2 source=local-stream/textPixels*looseness*moving;
  source.y+=sin(grainCell.x*.7+grainCell.y*.5)*1.5/textPixels.y*moving*looseness;
  vec4 ink=textSample(source,row);
  return ink.a*step(threshold,density);
}
float printedText(vec2 uv){
  if(textEnabled<.5)return 0.;
  vec2 local=(uv-textBox.xy)/textBox.zw;
  if(local.x<0.||local.y<0.||local.x>1.||local.y>1.)return 0.;
  vec2 pixel=gl_FragCoord.xy;
  float threshold=textBayer(pixel),alpha=0.;
  if(scrollInk>0.||scrollPassage>0.){
    float movingInk=inkSweep(uv);
    threshold=clamp(mix(threshold,textBayer(pixel/2.),movingInk*.42)+inkWave(pixel)*movingInk*.035,0.,1.);
  }
  // The incoming ink belongs inside the GLB aperture; the rim occludes both titles.
  float aperture=portalEnabled>.5?texture2D(portalMask,uv).r:0.;
  float rim=portalEnabled>.5?texture2D(portalFrame,uv).a*portalRim:0.;
  ${CHAPTERS.map((_,index)=>`alpha=max(alpha,printedHeading(local,textState[${index}],textMeasure[${index}],${index}.,threshold)*(portalEnabled>.5?(${index}.>portalTextLeg+.5?aperture:1.-aperture):1.)*(1.-rim));`).join('\n  ')}
  return alpha;
}`

export function createDitheredText({ headline, stage, uniforms, pixelRatio, onChapter, isAlive }: DitheredTextOptions) {
  const atlas = document.createElement('canvas')
  const context = atlas.getContext('2d', { willReadFrequently: true })
  if (!context) throw Error('Heading canvas is unavailable')
  let texture: THREE.CanvasTexture | null = null, active = -1, disposed = false, atlasKey = ''
  let layouts: HeadingLayout[] = []
  let currentSequence: TextSequence | undefined
  function resize(force = false) {
    if (disposed || !isAlive()) return
    const style = getComputedStyle(headline), box = headline.getBoundingClientRect(), scene = stage.getBoundingClientRect()
    if (!box.width || !scene.width || !scene.height) return
    const ratio = pixelRatio(), fontSize = parseFloat(style.fontSize), pad = 20
    const frameHeight = Math.ceil((fontSize * HEADING_RESERVE_EM + pad * 2) * ratio)
    const key = [box.width, ratio, style.fontSize, style.fontWeight, style.fontFamily, style.letterSpacing].join('|')
    if (!force && texture && key === atlasKey) {
      uniforms.textBox.value.set((box.left - scene.left - pad) / scene.width, 1 - (box.top - scene.top - pad + frameHeight / ratio) / scene.height, atlas.width / ratio / scene.width, frameHeight / ratio / scene.height)
      if (active >= 0) onChapter(CHAPTERS[active], active, layouts[active].height)
      return
    }
    atlasKey = key
    stage.dataset.atlasBuilds = String(Number(stage.dataset.atlasBuilds || 0) + 1)
    atlas.width = Math.ceil((box.width + pad * 2) * ratio)
    atlas.height = frameHeight * CHAPTERS.length
    context!.scale(ratio, ratio)
    context!.fillStyle = 'white'
    context!.textBaseline = 'alphabetic'
    context!.fontKerning = 'normal'
    const tracking = parseFloat(style.letterSpacing) || 0, tracked = 'letterSpacing' in context!
    const setFont = (scale: number, fit = 1) => {
      context!.font = `${style.fontWeight} ${fontSize * scale * fit}px ${style.fontFamily}`
      if (tracked) context!.letterSpacing = `${scale < 1 ? 0 : tracking * fit}px`
    }
    layouts = CHAPTERS.map(chapter => layoutHeading(chapter, fontSize, box.width, row => {
      setFont(row.scale)
      return context!.measureText(row.text).width + (tracked || row.scale < 1 ? 0 : (row.text.length - 1) * tracking)
    }))
    CHAPTERS.forEach((chapter, index) => {
      const layout = layouts[index]
      let longest = 0, rowTop = 0
      layout.rows.forEach(row => {
        setFont(row.scale, layout.fit)
        const line = row.text, size = fontSize * row.scale * layout.fit, height = size * row.leading
        const metrics = context!.measureText('Mg'), ascent = metrics.fontBoundingBoxAscent ?? size * .9, descent = metrics.fontBoundingBoxDescent ?? size * .25
        const y = index * frameHeight / ratio + pad + rowTop + (height - ascent - descent) / 2 + ascent
        const rowTracking = row.scale < 1 ? 0 : tracking * layout.fit
        longest = Math.max(longest, context!.measureText(line).width + (tracked ? 0 : (line.length - 1) * rowTracking))
        if (tracked) context!.fillText(line, pad, y)
        else for (let i = 0; i < line.length; i++) context!.fillText(line[i], pad + context!.measureText(line.slice(0, i)).width + i * rowTracking, y)
        rowTop += height
      })
      uniforms.textMeasure.value[index].set((longest + pad) / (atlas.width / ratio), (layout.height + pad) / (frameHeight / ratio))
    })
    const pixels = context!.getImageData(0, 0, atlas.width, atlas.height)
    encodeStrokeDepth(pixels.data, atlas.width, atlas.height, fontSize * .065 * ratio)
    context!.putImageData(pixels, 0, 0)
    const nextTexture = new THREE.CanvasTexture(atlas)
    nextTexture.generateMipmaps = false
    nextTexture.minFilter = THREE.LinearFilter
    nextTexture.magFilter = THREE.LinearFilter
    const previousTexture = texture
    texture = nextTexture
    uniforms.textAtlas.value = nextTexture
    previousTexture?.dispose()
    uniforms.textBox.value.set((box.left - scene.left - pad) / scene.width, 1 - (box.top - scene.top - pad + frameHeight / ratio) / scene.height, atlas.width / ratio / scene.width, frameHeight / ratio / scene.height)
    uniforms.textPixels.value.set(atlas.width / ratio, frameHeight / ratio)
    uniforms.textGrid.value = ratio * .9
    if (active >= 0) {
      renderHeading(headline, layouts[active])
      onChapter(CHAPTERS[active], active, layouts[active].height)
    }
  }
  function update(progress: number, reduced: boolean) {
    const sequence = textSequence(progress, 'threshold', reduced, isStackedLanding(stage.clientWidth, stage.clientHeight))
    if (disposed || !isAlive()) return sequence
    currentSequence = sequence
    stage.dataset.textDither = 'ready'
    sequence.states.forEach((state, index) => uniforms.textState.value[index].set(state.reveal, state.erase))
    if (sequence.active !== active) {
      active = sequence.active
      renderHeading(headline, layouts[active])
      onChapter(CHAPTERS[active], active, layouts[active].height)
    }
    const state = sequence.states[active], phase = state.reveal < 1 ? 'printing' : state.erase > 0 ? 'dissolving' : 'held'
    if (stage.dataset.textPhase !== phase) stage.dataset.textPhase = phase
    return sequence
  }
  function surface(portal: boolean) {
    const value = currentSequence ? headingSurface(currentSequence, portal) : 'shader'
    if (stage.dataset.textSurface !== value) stage.dataset.textSurface = value
    uniforms.textEnabled.value = Number(value === 'shader')
  }
  function dispose() {
    if (disposed) return
    disposed = true
    texture?.dispose()
    texture = null
    uniforms.textAtlas.value = null
    atlas.width = atlas.height = 0
  }
  function blockHeight(chapter: LandingChapter) {
    return layouts[CHAPTERS.indexOf(chapter)]?.height ?? parseFloat(getComputedStyle(headline).fontSize) * HEADING_RESERVE_EM
  }
  return { resize, update, surface, dispose, blockHeight }
}
