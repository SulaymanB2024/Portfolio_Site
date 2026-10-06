/** Reproducible original work sculptures. Run: node tools/build-work-models.mjs [study IDs] */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import * as THREE from 'three'
import { Document, NodeIO } from '@gltf-transform/core'
import { getBounds, weld } from '@gltf-transform/functions'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import validator from 'gltf-validator'
import { vec, materialStyles } from './work-models/geometry.mjs'
import { opportunityInstrument, marketObservatory } from './work-models/instruments.mjs'
import { unfinishedMechanism } from './work-models/organic.mjs'

import { audienceTheatre } from './work-models/sapien.mjs'
import { shaftVertexRadius } from './work-models/framing.mjs'
import { finishSurface } from './work-models/surface-finish.mjs'

const output = resolve(import.meta.dirname, '../public/work-studies')
const io = new NodeIO()
// These modules are the authoritative source; no legacy inline model builders.
const studies = [
  { "id": "internshipdeadlines", "project": "InternshipDeadlines", "title": "Opportunity instrument", "concept": "A dished enamel perpetual-calendar chapter carries thirty-one original serif dates fitted to its curved face inside a deep profiled barrel. A broad seated Roman bezel, fitted seven-day enamel insert and dark steel leaf hand establish a clear working face. An open three-foot movement casting reveals seated wheels beneath the register. A stepped arbor, fitted winding crowns, rear service windows and pear pendulum complete the horological instrument. Engraved case and index details inherit their mechanical parent motion.", rotation: [0.08, -0.2, -0.12], make: opportunityInstrument },
  { "id": "sapien", "project": "Sapien", "title": "Audience comparison", "concept": "Three cast pewter portraits with a dominant central sitter attend to two A/B product specimens. Individual jaw and maxillary profiles, connected nasal and cheek planes, tapered brow support, asymmetric carved lids and recessed lip cavities give each sitter distinct anatomy. Broad crowns and swept integral hair join an oblique mantle, open V drape and folded cowl above one inset plinth. Cap fluting, incised letters and seams inherit their specimen parent motion.", rotation: [0.24, -0.12, 0], make: audienceTheatre },
  { "id": "investing-markets", "project": "Investing & Markets", "title": "Market observatory", "concept": "Light cast continental massifs, connected watersheds and basins taper into coastal shoulders above a darker steel ocean. Quiet flush pewter routes and map inlays follow the relief, with selected inland-water cutouts. Polished degree scales belong to a fitted meridian yoke and horizon cradle, joined by bored saddles and fuller polar bearings. Swelled cast fork supports descend into a profiled oval foot, completing the generalized cartographic instrument.", rotation: [0.12, -0.13, -0.13], make: marketObservatory },
  { "id": "miscellaneous", "project": "Miscellaneous", "title": "Open experimental mechanism", "concept": "Five thick involute gears with flowing curved spokes mesh on seated shafts inside pierced pewter uprights mortised into a lower cradle. A fitted curved crossmember joins the upper cheeks into one continuous frame. Swelled castings, rolled rear returns, flanged oil-shoulder bearings, front retention washers, counterbored foot fixings and graduated wheel cuts establish the physical assembly. The shared tooth module, twenty-degree pressure angle and original signed drive ratios remain intact.", rotation: [0.08, -0.21, 0.09], make: unfinishedMechanism },
]

function normalize(geometries, rotation) {
  const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  const bounds = new THREE.Box3()
  for (const geometry of geometries) {
    geometry.applyQuaternion(quaternion)
    geometry.computeBoundingBox()
    bounds.union(geometry.boundingBox)
  }
  const center = bounds.getCenter(new THREE.Vector3())
  const size = bounds.getSize(new THREE.Vector3())
  const scale = 2 / Math.max(size.x, size.y, size.z)
  for (const geometry of geometries) {
    geometry.translate(-center.x, -center.y, -center.z)
    geometry.scale(scale, scale, scale)
  }
  return { quaternion, center, scale }
}

function toDocument(study) {
  const parts=study.make()
  const geometries=parts.map(part=>{
    const merged=mergeGeometries(part.geometries,false)
    for(const geometry of part.geometries)geometry.dispose()
    if(!merged)throw new Error(`Cannot merge ${part.name}`)
    return finishSurface(merged, part.material, part.surfaceTone ?? 1)
  })
  const normalized=normalize(geometries,study.rotation)
  const document=new Document()
  const buffer=document.createBuffer('Original project instrument geometry')
  const scene=document.createScene(study.title)
  document.getRoot().setDefaultScene(scene)
  document.getRoot().getAsset().generator='Sulayman Bowles · original procedural project instruments'
  const materials=Object.fromEntries(Object.entries(materialStyles).map(([name,style])=>[name,document.createMaterial(name).setBaseColorFactor(style.color).setMetallicFactor(style.metal).setRoughnessFactor(style.roughness).setDoubleSided(true)]))
  const exported = []
  for(const [index,geometry]of geometries.entries()){
    const part=parts[index]
    let pivot=null,axis=null
    if(part.pivot){
      pivot=part.pivot.clone().applyQuaternion(normalized.quaternion).sub(normalized.center).multiplyScalar(normalized.scale)
      axis=part.axis.clone().applyQuaternion(normalized.quaternion).normalize()
      geometry.translate(-pivot.x,-pivot.y,-pivot.z)
    }
    const position=document.createAccessor(`${part.name} positions`).setType('VEC3').setArray(geometry.getAttribute('position').array).setBuffer(buffer)
    const normal=document.createAccessor(`${part.name} normals`).setType('VEC3').setArray(geometry.getAttribute('normal').array).setBuffer(buffer)
    const color=document.createAccessor(`${part.name} surface patina`).setType('VEC3').setArray(geometry.getAttribute('color').array).setNormalized(true).setBuffer(buffer)
    const array=geometry.index.array
    const indices=document.createAccessor(`${part.name} indices`).setType('SCALAR').setArray(geometry.getAttribute('position').count>65535?new Uint32Array(array):new Uint16Array(array)).setBuffer(buffer)
    const primitive=document.createPrimitive().setAttribute('POSITION',position).setAttribute('NORMAL',normal).setAttribute('COLOR_0',color).setIndices(indices).setMaterial(materials[part.material])
    const node=document.createNode(part.name).setMesh(document.createMesh(part.name).addPrimitive(primitive))
    const motion=part.motion?{...part.motion,...(part.motion.module?{sourceModule:part.motion.module,module:part.motion.module*normalized.scale}:{})}:null
    if(pivot) {
      node.setTranslation(pivot.toArray())
      if(!part.parent)node.setExtras({articulationAxis:axis.toArray(),articulationPivot:pivot.toArray(),articulation:'shaft rotation',...(motion?{articulationMotion:motion}:{})})
    }
    exported.push({node,part})
    geometry.dispose()
  }
  for(const {node,part} of exported) {
    if(!part.parent){scene.addChild(node);continue}
    const parent = exported.find(item=>item.node.getName()===part.parent)?.node
    if(!parent || part.name.startsWith('hover-'))throw new Error(`Invalid attached finish: ${part.name}`)
    // Separate materials share their physical parent; the renderer clocks the
    // shaft once, so letters and seams cannot drift under another hover phase.
    node.setTranslation(vec(...node.getTranslation()).sub(vec(...parent.getTranslation())).toArray())
    parent.addChild(node)
  }
  return document
}

/** Exact vertex radii for hover hinges or continuous shafts, plus safe burst. */
function framingEnvelope(document,bounds) {
  const center=vec(...bounds.min).add(vec(...bounds.max)).multiplyScalar(.5)
  let rest=0,fullArticulation=0,fullArticulationPlusBurst=0,phaseIndex=0
  const articulation=[]
  for(const node of document.getRoot().getDefaultScene().listChildren()){
    const pivot=vec(...node.getTranslation()).sub(center),hover=node.getName().startsWith('hover-')
    const axis=hover?vec(...node.getExtras().articulationAxis):null
    let restRadius=0,articulatedRadius=0
    const surfaces=[node]
    for(let index=0;index<surfaces.length;index++)surfaces.push(...surfaces[index].listChildren())
    for(const surface of surfaces)for(const primitive of surface.getMesh()?.listPrimitives()??[]){
      const positions=primitive.getAttribute('POSITION').getArray()
      const world=new THREE.Matrix4().fromArray(surface.getWorldMatrix())
      for(let i=0;i<positions.length;i+=3){
        const v=vec(...positions.slice(i,i+3)).applyMatrix4(world).sub(vec(...node.getTranslation())),radius=pivot.clone().add(v).length()
        restRadius=Math.max(restRadius,radius)
        if(!hover){articulatedRadius=Math.max(articulatedRadius,radius);continue}
        articulatedRadius=Math.max(articulatedRadius,shaftVertexRadius(v,pivot,axis,node.getExtras().articulationMotion?.kind==='continuous'))
      }
    }
    const burstTranslationBound=hover?Math.hypot(.07,.04*Math.sin(phaseIndex++*1.4*.6)):0
    rest=Math.max(rest,restRadius)
    fullArticulation=Math.max(fullArticulation,articulatedRadius)
    fullArticulationPlusBurst=Math.max(fullArticulationPlusBurst,articulatedRadius+burstTranslationBound)
    if(hover)articulation.push({name:node.getName(),range:node.getExtras().articulationMotion?.kind==='continuous'?'full rotation':'hover hinge',restRadius,articulatedRadius,burstTranslationBound,articulatedPlusBurstRadius:articulatedRadius+burstTranslationBound})
  }
  const paddingRequired=Math.max(0,fullArticulationPlusBurst-rest)
  if(paddingRequired>.16)throw new Error(`Articulated envelope requires ${paddingRequired} padding, beyond the renderer's .16 reserve`)
  return{rest,fullArticulation,fullArticulationPlusBurst,paddingRequired,paddingSlackAtPoint16:.16-paddingRequired,articulation}
}

async function inspect(path) {
  const bytes = await readFile(path)
  const validation = await validator.validateBytes(new Uint8Array(bytes), { uri: path.split('/').pop(), maxIssues: 100 })
  if (validation.issues.numErrors || validation.issues.numWarnings) {
    throw new Error(`${path}: glTF validation failed: ${JSON.stringify(validation.issues)}`)
  }
  const document = await io.read(path)
  let vertices = 0
  let triangles = 0
  let minimumNormalLength = Infinity
  let maximumNormalLength = 0
  let degenerateTriangles = 0
  for (const mesh of document.getRoot().listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      const position = primitive.getAttribute('POSITION')
      const normal = primitive.getAttribute('NORMAL')
      const indices = primitive.getIndices()
      if (!position || !normal || !indices || position.getCount() !== normal.getCount()) throw new Error(`${path}: missing or mismatched mesh attributes`)
      const values = position.getArray()
      const normalValues = normal.getArray()
      const indexValues = indices.getArray()
      if (![values, normalValues, indexValues].every(array => array.every(Number.isFinite))) throw new Error(`${path}: non-finite accessor`)
      if (!indexValues.every(index => Number.isInteger(index) && index >= 0 && index < position.getCount())) throw new Error(`${path}: invalid index`)
      vertices += position.getCount()
      triangles += indices.getCount() / 3
      for (let index = 0; index < normalValues.length; index += 3) {
        const length = Math.hypot(...normalValues.slice(index, index + 3))
        minimumNormalLength = Math.min(minimumNormalLength, length)
        maximumNormalLength = Math.max(maximumNormalLength, length)
      }
      for (let index = 0; index < indexValues.length; index += 3) {
        const points = Array.from(indexValues.slice(index, index + 3), vertex => vertex * 3)
        const [a, b, c] = [...points].map(offset => vec(...values.slice(offset, offset + 3)))
        if (b.sub(a).cross(c.sub(a)).lengthSq() < 1e-15) degenerateTriangles++
      }
    }
  }
  for(const node of document.getRoot().listNodes()) if(node.getName().startsWith('hover-')){
    const {articulationAxis:axis,articulationPivot:pivot,articulationMotion:motion}=node.getExtras()
    if(!Array.isArray(axis)||axis.length!==3||!axis.every(Number.isFinite)||Math.abs(Math.hypot(...axis)-1)>1e-6)throw new Error(`${path}: invalid articulation axis for ${node.getName()}`)
    if(!Array.isArray(pivot)||pivot.length!==3||!pivot.every(Number.isFinite)||pivot.some((value,i)=>Math.abs(value-node.getTranslation()[i])>1e-9))throw new Error(`${path}: missing or inconsistent articulation pivot for ${node.getName()}`)
    if(motion){
      if(motion.kind!=='continuous'||!Number.isFinite(motion.angularVelocity)||!Number.isFinite(motion.ratio)||!motion.ratio||Math.abs(motion.ratio)>10||Math.abs(motion.angularVelocity*motion.ratio)>2)throw new Error(`${path}: invalid continuous shaft motion for ${node.getName()}`)
      if(motion.teeth&&(!Number.isInteger(motion.teeth)||motion.teeth<8||!Number.isFinite(motion.module)||motion.module<=0))throw new Error(`${path}: invalid gear dimensions for ${node.getName()}`)
      if(motion.driver){
        const driver=document.getRoot().listNodes().find(part=>part.getName()===motion.driver)
        const driveMotion=driver?.getExtras().articulationMotion
        if(!driveMotion||!Number.isFinite(driveMotion.angularVelocity)||Math.abs(driveMotion.angularVelocity-motion.angularVelocity)>1e-6||driveMotion.ratio!==1)throw new Error(`${path}: inconsistent shaft driver for ${node.getName()}`)
      }
    }
  }
  const bounds = getBounds(document.getRoot().listScenes()[0])
  const spans = bounds.max.map((value, axis) => value - bounds.min[axis])
  const centered = bounds.min.every((value, axis) => Math.abs(value + bounds.max[axis]) < 0.00001)
  if (!centered || Math.abs(Math.max(...spans) - 2) > 0.00001) throw new Error(`${path}: invalid normalization`)
  if (minimumNormalLength < 0.999 || maximumNormalLength > 1.001 || degenerateTriangles) throw new Error(`${path}: invalid normals or degenerate triangles`)
  if (triangles < 5000 || triangles > 125000 || bytes.byteLength >= 5000000 || document.getRoot().listMeshes().length > 12) throw new Error(`${path}: asset exceeds geometry or byte budget (${triangles} triangles, ${bytes.byteLength} bytes)`)
  if (document.getRoot().listTextures().length || document.getRoot().listExtensionsRequired().length) throw new Error(`${path}: texture or decoder dependency`)
  return {
    bytes: bytes.byteLength,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    vertices,
    triangles,
    meshes: document.getRoot().listMeshes().length,
    materials: document.getRoot().listMaterials().length,
    articulation: document.getRoot().listNodes().filter(node=>node.getName().startsWith('hover-')).map(node=>({name:node.getName(),pivot:node.getTranslation(),axis:node.getExtras().articulationAxis,...(node.getExtras().articulationMotion?{motion:node.getExtras().articulationMotion}:{})})),
    bounds,
    framing: framingEnvelope(document,bounds),
    validation: { errors: 0, warnings: 0, degenerateTriangles, minimumNormalLength, maximumNormalLength },
  }
}

const selectedIds = new Set(process.argv.slice(2))
for (const id of selectedIds) {
  if (!studies.some(study => study.id === id)) throw new Error(`Unknown study: ${id}`)
}
await mkdir(output, { recursive: true })
const manifest = {
  version: 11,
  generator: 'tools/build-work-models.mjs',
  ownership: 'Original procedural geometry created for Sulayman Bowles. No third-party model or texture inputs.',
  license: 'LicenseRef-Site-Owner',
  licenseNote: 'Original site assets. The site owner retains the rights; no third-party model or texture licenses apply.',
  unit: 'Each sculpture is centered at the origin and normalized to a maximum span of 2 units.',
  sources: ['tools/work-models/geometry.mjs', 'tools/work-models/instruments.mjs', 'tools/work-models/organic.mjs', 'tools/work-models/sapien.mjs', 'tools/work-models/framing.mjs', 'tools/work-models/surface-finish.mjs'],
  material: 'Five original texture-free materials: polished silver, dark machined steel, cast pewter, graphite engraving and glazed enamel. Restrained continuous vertex patina and normal grain follow the physical surface. Rounded cast profiles, sculpted portrait planes, broad connected terrain, fitted curved inlays, recessed scales and complete physical joints supply visible detail.',
  geometryBudget: { maximumBytesPerModel: 5000000, maximumTrianglesPerModel: 125000, maximumMeshesPerModel: 12, compression: 'Lossless bitwise vertex welding; no decoder required for originals. Runtime copies use Draco.' },
  animation: 'Independent components named hover-* export centered local shaft/hinge pivots with unit articulationAxis vectors in GLTF node extras. Continuous shafts also export articulationMotion: angularVelocity is the shared drive rate in radians/second, ratio is the signed shaft/drive ratio, and driver optionally names the main node. Angle = visible time * angularVelocity * ratio. Full-turn bounds are verified. Structural assemblies remain static. Renderer-driven motion; no embedded animation, extensions, textures or decoder required.',
  models: [],
}
for (const study of studies) {
  const path = resolve(output, `${study.id}.glb`)
  if (!selectedIds.size || selectedIds.has(study.id)) {
    const document = toDocument(study)
    await document.transform(weld())
    await io.write(path, document)
  }
  const report = await inspect(path)
  manifest.models.push({
    id: study.id,
    project: study.project,
    title: study.title,
    concept: study.concept,
    path: `work-studies/${study.id}.glb`,
    ...report,
  })
  console.log(`${study.id}: ${report.triangles.toLocaleString()} triangles, ${(report.bytes / 1000).toFixed(1)} kB, glTF validator 0 errors / 0 warnings`)
}
await writeFile(resolve(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
