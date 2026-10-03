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

import { pairedPopulation } from './work-models/population.mjs'

const output = resolve(import.meta.dirname, '../public/work-studies')
const io = new NodeIO()
// These modules are the authoritative source; no legacy inline model builders.
const studies = [
  { "id": "internshipdeadlines", "project": "InternshipDeadlines", "title": "Opportunity instrument", "concept": "Twelve chamfered calendar plates with graphite ordinal inlays, binding eyes and recessed wells sit in an open carriage with fitted retention shoes. Recessed annular rail channels, seated scale marks, tapered gear spokes, stepped bored hubs and a hinged pendulum connect dates, data and opportunity.", rotation: [0.08, -0.2, -0.12], make: opportunityInstrument },
  { "id": "sapien", "project": "Sapien", "title": "Paired population instrument", "concept": "Two interleaved chamfered metal ribbons follow one continuous spindle. Flush indexed inserts, fine recessed tracers, return lips and seated terminal fittings give the paired population concept an abstract, non-anatomical form. Both bands articulate around the same supported shaft.", rotation: [0.10, -0.22, -0.17], make: pairedPopulation },
  { "id": "investing-markets", "project": "Investing & Markets", "title": "Market observatory", "concept": "Smooth continent reliefs with coastal sidewalls, seventeen generalized land outlines, selected low terrain ranges and a sparse graticule sit on a continuous steel ocean shell. Grooved meridian and equatorial rails, stepped polar bearings, a partial indexed vernier and counterbored tapered geographic terminals carry four raised routes.", rotation: [0.12, -0.13, -0.13], make: marketObservatory },
  { "id": "miscellaneous", "project": "Miscellaneous", "title": "Unfinished mechanism", "concept": "Five pierced folded sheets with rounded lightening windows and return lips form an open mechanism. Crease-aligned shafts, grooved hinge knuckles, slotted fasteners, two tension springs with fitted lead attachments and a geared core with tapered spokes and stepped bored hubs give the experimental form coherent construction.", rotation: [0.08, -0.21, 0.09], make: unfinishedMechanism },
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
    return merged
  })
  const normalized=normalize(geometries,study.rotation)
  const document=new Document()
  const buffer=document.createBuffer('Original project instrument geometry')
  const scene=document.createScene(study.title)
  document.getRoot().setDefaultScene(scene)
  document.getRoot().getAsset().generator='Sulayman Bowles · original procedural project instruments'
  const materials=Object.fromEntries(Object.entries(materialStyles).map(([name,style])=>[name,document.createMaterial(name).setBaseColorFactor(style.color).setMetallicFactor(style.metal).setRoughnessFactor(style.roughness).setDoubleSided(true)]))
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
    const array=geometry.index.array
    const indices=document.createAccessor(`${part.name} indices`).setType('SCALAR').setArray(geometry.getAttribute('position').count>65535?new Uint32Array(array):new Uint16Array(array)).setBuffer(buffer)
    const primitive=document.createPrimitive().setAttribute('POSITION',position).setAttribute('NORMAL',normal).setIndices(indices).setMaterial(materials[part.material])
    const node=document.createNode(part.name).setMesh(document.createMesh(part.name).addPrimitive(primitive))
    if(pivot)node.setTranslation(pivot.toArray()).setExtras({articulationAxis:axis.toArray(),articulationPivot:pivot.toArray(),articulation:'shaft rotation'})
    scene.addChild(node)
    geometry.dispose()
  }
  return document
}

/** Exact vertex radii over the renderer's shaft-angle interval, plus safe burst. */
function framingEnvelope(document,bounds) {
  const center=vec(...bounds.min).add(vec(...bounds.max)).multiplyScalar(.5)
  let rest=0,fullArticulation=0,fullArticulationPlusBurst=0,phaseIndex=0
  const articulation=[]
  for(const node of document.getRoot().getDefaultScene().listChildren()){
    const mesh=node.getMesh()
    if(!mesh)continue
    const pivot=vec(...node.getTranslation()).sub(center),hover=node.getName().startsWith('hover-')
    const axis=hover?vec(...node.getExtras().articulationAxis):null
    let restRadius=0,articulatedRadius=0
    for(const primitive of mesh.listPrimitives()){
      const positions=primitive.getAttribute('POSITION').getArray()
      for(let i=0;i<positions.length;i+=3){
        const v=vec(...positions.slice(i,i+3)),radius=pivot.clone().add(v).length()
        restRadius=Math.max(restRadius,radius)
        if(!hover){articulatedRadius=Math.max(articulatedRadius,radius);continue}
        const parallel=axis.clone().multiplyScalar(axis.dot(v)),perpendicular=v.clone().sub(parallel),cross=axis.clone().cross(v)
        const a=pivot.dot(perpendicular),b=pivot.dot(cross)
        const base=pivot.lengthSq()+v.lengthSq()+2*pivot.dot(parallel)
        const peak=Math.atan2(b,a),angles=[-.18,.18]
        if(peak>=-.18&&peak<=.18)angles.push(peak)
        for(const angle of angles)articulatedRadius=Math.max(articulatedRadius,Math.sqrt(Math.max(0,base+2*(a*Math.cos(angle)+b*Math.sin(angle)))))
      }
    }
    const burstTranslationBound=hover?Math.hypot(.07,.04*Math.sin(phaseIndex++*1.4*.6)):0
    rest=Math.max(rest,restRadius)
    fullArticulation=Math.max(fullArticulation,articulatedRadius)
    fullArticulationPlusBurst=Math.max(fullArticulationPlusBurst,articulatedRadius+burstTranslationBound)
    if(hover)articulation.push({name:node.getName(),restRadius,articulatedRadius,burstTranslationBound,articulatedPlusBurstRadius:articulatedRadius+burstTranslationBound})
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
    const {articulationAxis:axis,articulationPivot:pivot}=node.getExtras()
    if(!Array.isArray(axis)||axis.length!==3||!axis.every(Number.isFinite)||Math.abs(Math.hypot(...axis)-1)>1e-6)throw new Error(`${path}: invalid articulation axis for ${node.getName()}`)
    if(!Array.isArray(pivot)||pivot.length!==3||!pivot.every(Number.isFinite)||pivot.some((value,i)=>Math.abs(value-node.getTranslation()[i])>1e-9))throw new Error(`${path}: missing or inconsistent articulation pivot for ${node.getName()}`)
  }
  const bounds = getBounds(document.getRoot().listScenes()[0])
  const spans = bounds.max.map((value, axis) => value - bounds.min[axis])
  const centered = bounds.min.every((value, axis) => Math.abs(value + bounds.max[axis]) < 0.00001)
  if (!centered || Math.abs(Math.max(...spans) - 2) > 0.00001) throw new Error(`${path}: invalid normalization`)
  if (minimumNormalLength < 0.999 || maximumNormalLength > 1.001 || degenerateTriangles) throw new Error(`${path}: invalid normals or degenerate triangles`)
  if (triangles < 5000 || triangles > 60000 || bytes.byteLength >= 1500000 || document.getRoot().listMeshes().length > 12) throw new Error(`${path}: asset exceeds geometry or byte budget (${triangles} triangles, ${bytes.byteLength} bytes)`)
  if (document.getRoot().listTextures().length || document.getRoot().listExtensionsRequired().length) throw new Error(`${path}: texture or decoder dependency`)
  return {
    bytes: bytes.byteLength,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    vertices,
    triangles,
    meshes: document.getRoot().listMeshes().length,
    materials: document.getRoot().listMaterials().length,
    articulation: document.getRoot().listNodes().filter(node=>node.getName().startsWith('hover-')).map(node=>({name:node.getName(),pivot:node.getTranslation(),axis:node.getExtras().articulationAxis})),
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
  version: 6,
  generator: 'tools/build-work-models.mjs',
  ownership: 'Original procedural geometry created for Sulayman Bowles. No third-party model or texture inputs.',
  license: 'LicenseRef-Site-Owner',
  licenseNote: 'Original site assets. The site owner retains the rights; no third-party model or texture licenses apply.',
  unit: 'Each sculpture is centered at the origin and normalized to a maximum span of 2 units.',
  sources: ['tools/work-models/geometry.mjs', 'tools/work-models/instruments.mjs', 'tools/work-models/organic.mjs', 'tools/work-models/population.mjs'],
  material: 'Four texture-free monochrome materials: satin silver, dark steel, graphite inlays and pale porcelain. Smooth analytical surfaces, rounded machined bevels and recessed cavities retain readable construction through halftone.',
  geometryBudget: { maximumBytesPerModel: 1500000, maximumTrianglesPerModel: 60000, maximumMeshesPerModel: 12, compression: 'Lossless bitwise vertex welding; no decoder required.' },
  animation: 'Independent components named hover-* export centered local shaft/hinge pivots with unit articulationAxis vectors in GLTF node extras. Structural assemblies remain static. These support renderer-driven articulation. No embedded animation, extensions, textures or decoder required.',
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
