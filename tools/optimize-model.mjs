/** Preserve the scanned helmet's seams and visor relief in the live web asset. */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions'
import { getBounds, reorder, simplify, draco as compress } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import draco from 'draco3dgltf'
import validator from 'gltf-validator'
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

await Promise.all([MeshoptEncoder.ready, MeshoptSimplifier.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco.createDecoderModule(),
  'draco3d.encoder': await draco.createEncoderModule(),
})
const root = resolve(import.meta.dirname, '..')
const source = resolve(root, 'public/jousting_helmet-transformed.glb')
const destination = resolve(root, 'public/helmet-balanced.glb')
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const triangleCount = doc => doc.getRoot().listMeshes().flatMap(mesh => mesh.listPrimitives()).reduce((total, p) => total + p.getIndices().getCount()/3, 0)
const doc = await io.read(source)
const originalBounds = getBounds(doc.getRoot().listScenes()[0])
const textureHashes = doc.getRoot().listTextures().map(texture => hash(texture.getImage()))
const sourceHash = hash(await readFile(source))
const originalTriangles = triangleCount(doc)
doc.getRoot().listExtensionsUsed().find(ext => ext.extensionName === KHRDracoMeshCompression.EXTENSION_NAME)?.dispose()
await doc.transform(
  simplify({ simplifier: MeshoptSimplifier, ratio: .30, error: .00035, lockBorder: true }),
  reorder({ encoder: MeshoptEncoder, target: 'performance' }),
  compress({ method: 'edgebreaker', encodeSpeed: 5, decodeSpeed: 5, quantizePosition: 18, quantizeNormal: 14, quantizeTexcoord: 16 }),
)
const bytes = await io.writeBinary(doc)
const decoded = await io.readBinary(bytes)
const triangles = triangleCount(decoded)
if (triangles > 360000 || bytes.byteLength > 2500000) throw new Error(`Helmet exceeds web budget: ${triangles} triangles, ${bytes.byteLength} bytes`)
if (!decoded.getRoot().listNodes().some(node => node.getName() === 'Object_2')) throw new Error('Live helmet node missing')
for (const accessor of decoded.getRoot().listAccessors()) if (!accessor.getArray()?.every(Number.isFinite)) throw new Error('Nonfinite decoded helmet accessor')
const bounds = getBounds(decoded.getRoot().listScenes()[0])
for (const side of ['min', 'max']) for(let axis=0;axis<3;axis++) {
  const span=originalBounds.max[axis]-originalBounds.min[axis]
  if(Math.abs(bounds[side][axis]-originalBounds[side][axis])>span*.002) throw new Error('Helmet silhouette bounds changed')
}
if (decoded.getRoot().listTextures().some((texture,i)=>hash(texture.getImage())!==textureHashes[i])) throw new Error('Original scan texture changed')
const compressedValidation=await validator.validateBytes(bytes,{uri:'helmet-balanced.glb',maxIssues:100})
decoded.getRoot().listExtensionsUsed().find(ext=>ext.extensionName===KHRDracoMeshCompression.EXTENSION_NAME)?.dispose()
const decodedValidation=await validator.validateBytes(await io.writeBinary(decoded),{uri:'helmet-decoded.glb',maxIssues:100})
if(compressedValidation.issues.numErrors||decodedValidation.issues.numErrors) throw new Error('Invalid helmet GLB')
if(hash(await readFile(source))!==sourceHash) throw new Error('Original helmet scan changed')
await writeFile(destination,bytes)
const report={source:'public/jousting_helmet-transformed.glb',sourceHash,originalTriangles,path:'public/helmet-balanced.glb',bytes:bytes.byteLength,sha256:hash(bytes),triangles,bounds,textureHashes,sourcePreserved:true,compressedValidation:compressedValidation.issues,decodedValidation:decodedValidation.issues,settings:{ratio:.30,error:.00035,lockBorder:true,quantizePosition:18,quantizeNormal:14,quantizeTexcoord:16},credit:'Jousting Helmet by The Royal Armoury, CC BY 4.0; existing site attribution retained.'}
await mkdir(resolve(root,'evidence/model-refinement'),{recursive:true})
await writeFile(resolve(root,'evidence/model-refinement/helmet-validation.json'),JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({triangles,bytes:bytes.byteLength,compressedErrors:compressedValidation.issues.numErrors,decodedErrors:decodedValidation.issues.numErrors,sourcePreserved:true},null,2))
