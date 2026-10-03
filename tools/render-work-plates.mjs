/** Offline plates from the portfolio's actual GLB triangles. No browser/GPU dependency. */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import draco from 'draco3dgltf'
import sharp from 'sharp'
import { Matrix4, Matrix3, Vector3, Euler } from 'three'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'public/images/work-plates')
const requested = process.argv.slice(2).filter(arg => !arg.startsWith('--'))
const evidenceName = process.argv.slice(2).find(arg => arg.startsWith('--evidence='))?.split('=')[1] ?? 'work-art-direction'
if (!/^[a-z0-9-]+$/.test(evidenceName)) throw new Error('Invalid evidence directory')
const evidence = resolve(root, 'evidence', evidenceName)
const width = 1400, height = 1400
const allStudies = [
  { id: 'internshipdeadlines', yaw: -.45, pitch: .18, roll: -.08 },
  { id: 'sapien', yaw: -.56, pitch: -.07, roll: .04 },
  { id: 'investing-markets', yaw: -.36, pitch: .14, roll: -.09 },
  { id: 'miscellaneous', yaw: .45, pitch: .12, roll: -.13 },
]
for (const id of requested) if (!allStudies.some(study => study.id === id)) throw new Error(`Unknown plate: ${id}`)
const studies = requested.length ? allStudies.filter(study => requested.includes(study.id)) : allStudies
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco.createDecoderModule() })
const key = new Vector3(-.7, .9, 1.3).normalize()
const fill = new Vector3(.95, -.25, .45).normalize()
const half = key.clone().add(new Vector3(0, 0, 1)).normalize()
const proofs = []
await mkdir(output, { recursive: true })
await mkdir(evidence, { recursive: true })

for (const study of studies) {
  const source = resolve(root, `public/portfolio-models/work-${study.id}.glb`)
  const sourceBytes = await readFile(source)
  const document = await io.read(source)
  const rotation = new Matrix4().makeRotationFromEuler(new Euler(study.pitch, study.yaw, study.roll))
  const geometry = [], minimum = new Vector3(Infinity, Infinity, Infinity), maximum = new Vector3(-Infinity, -Infinity, -Infinity)
  let vertices = 0, triangles = 0
  for (const node of document.getRoot().listNodes()) {
    const mesh = node.getMesh()
    if (!mesh) continue
    const transform = new Matrix4().fromArray(node.getWorldMatrix()).premultiply(rotation)
    const normalTransform = new Matrix3().getNormalMatrix(transform)
    for (const primitive of mesh.listPrimitives()) {
      if (primitive.getMode() !== 4) throw new Error(`Unsupported non-triangle geometry: ${node.getName()}`)
      const positions = primitive.getAttribute('POSITION'), normals = primitive.getAttribute('NORMAL')
      const indices = primitive.getIndices()?.getArray() ?? Array.from({ length: positions.getCount() }, (_, i) => i)
      const material = primitive.getMaterial()
      const color = material?.getBaseColorFactor() ?? [.5, .5, .5, 1]
      const roughness = material?.getRoughnessFactor() ?? .45
      const p = [], n = []
      for (let i = 0; i < positions.getCount(); i++) {
        const point = new Vector3().fromArray(positions.getArray(), i * 3).applyMatrix4(transform)
        const normal = normals ? new Vector3().fromArray(normals.getArray(), i * 3).applyMatrix3(normalTransform).normalize() : new Vector3(0, 0, 1)
        p.push(point); n.push(normal); minimum.min(point); maximum.max(point)
      }
      vertices += p.length; triangles += indices.length / 3
      geometry.push({ p, n, indices, color: color[0] * .2126 + color[1] * .7152 + color[2] * .0722, roughness })
    }
  }
  const center = minimum.clone().add(maximum).multiplyScalar(.5)
  const scale = Math.min(width * .86 / (maximum.x - minimum.x), height * .87 / (maximum.y - minimum.y))
  const depth = new Float32Array(width * height).fill(-Infinity)
  const tones = new Float32Array(width * height)
  const front = new Uint8Array(width * height)
  for (const mesh of geometry) {
    const p = mesh.p.map(point => [(point.x - center.x) * scale + width * .5, -(point.y - center.y) * scale + height * .5, point.z])
    for (let i = 0; i < mesh.indices.length; i += 3) {
      const ia = mesh.indices[i], ib = mesh.indices[i + 1], ic = mesh.indices[i + 2]
      const a = p[ia], b = p[ib], c = p[ic]
      const area = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
      if (Math.abs(area) < .00001) continue
      const lowX = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0]))), highX = Math.min(width - 1, Math.ceil(Math.max(a[0], b[0], c[0])))
      const lowY = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1]))), highY = Math.min(height - 1, Math.ceil(Math.max(a[1], b[1], c[1])))
      for (let y = lowY; y <= highY; y++) for (let x = lowX; x <= highX; x++) {
        const u = ((b[1] - c[1]) * (x + .5 - c[0]) + (c[0] - b[0]) * (y + .5 - c[1])) / area
        const v = ((c[1] - a[1]) * (x + .5 - c[0]) + (a[0] - c[0]) * (y + .5 - c[1])) / area
        const w = 1 - u - v
        if (u < 0 || v < 0 || w < 0) continue
        const z = a[2] * u + b[2] * v + c[2] * w, pixel = y * width + x
        if (z <= depth[pixel]) continue
        depth[pixel] = z; front[pixel] = 1
        const na = mesh.n[ia], nb = mesh.n[ib], nc = mesh.n[ic]
        let nx = na.x * u + nb.x * v + nc.x * w, ny = na.y * u + nb.y * v + nc.y * w, nz = na.z * u + nb.z * v + nc.z * w
        const inv = 1 / Math.hypot(nx, ny, nz); nx *= inv; ny *= inv; nz *= inv
        const diffuse = Math.max(0, nx * key.x + ny * key.y + nz * key.z)
        const reflected = Math.max(0, nx * fill.x + ny * fill.y + nz * fill.z)
        const specular = Math.pow(Math.max(0, nx * half.x + ny * half.y + nz * half.z), 22 + (1 - mesh.roughness) * 22)
        // A raking key reveals relief; the weaker fill preserves dark recesses.
        tones[pixel] = Math.min(1, .09 + diffuse * .67 + reflected * .16 + specular * .48 + (mesh.color - .3) * .22)
      }
    }
  }
  const pixels = Buffer.alloc(width * height * 4)
  const angle = Math.PI / 12, cs = Math.cos(angle), sn = Math.sin(angle), cell = 5.2
  let covered = 0, ink = 0, highlights = 0
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const pixel = y * width + x
    if (!front[pixel]) continue
    covered++
    const luminance = tones[pixel]
    if (luminance > .98) { highlights++; continue }
    const darkness = Math.pow(Math.max(0, 1 - luminance), .94)
    const gx = ((x * cs - y * sn) / cell + 1000) % 1 - .5
    const gy = ((x * sn + y * cs) / cell + 1000) % 1 - .5
    const distance = Math.hypot(gx, gy), radius = Math.sqrt(darkness / Math.PI)
    const alpha = Math.round(255 * Math.round(7 * Math.max(0, Math.min(1, (radius - distance) * cell + .5))) / 7)
    // Pure black + alpha: paper highlights remain bare and CSS can recolor ink.
    pixels[pixel * 4 + 3] = alpha
    if (alpha) ink++
  }
  const path = resolve(output, `${study.id}.webp`)
  await sharp(pixels, { raw: { width, height, channels: 4 } }).webp({ lossless: true, effort: 6 }).toFile(path)
  const bytes = await readFile(path)
  const proof = { id: study.id, source: `public/portfolio-models/work-${study.id}.glb`, sourceSha256: sha(sourceBytes), plate: `public/images/work-plates/${study.id}.webp`, sha256: sha(bytes), bytes: bytes.length, width, height, vertices, triangles, silhouettePixels: covered, nonzeroInkPixels: ink, bareHighlightPixels: highlights, pose: study }
  proofs.push(proof)
  console.log(JSON.stringify(proof))
}
await writeFile(resolve(evidence, 'plates-proof.json'), JSON.stringify({ method: 'Offline orthographic triangle z-buffer, actual GLB world transforms and interpolated surface normals, raking key/fill/specular lighting, antialiased 15-degree dot screen, pure black alpha mask. No shadows/AO/texture sampling; no geometry modification.', generatedAt: new Date().toISOString(), plates: proofs }, null, 2) + '\n')
const columns = Math.min(studies.length, 2)
const rows = Math.ceil(studies.length / columns)
const tiles = await Promise.all(studies.map(async (study, i) => ({ input: await sharp(resolve(output, `${study.id}.webp`)).resize(600, 600).flatten({ background: '#f5f2ea' }).png().toBuffer(), left: (i % columns) * 600, top: Math.floor(i / columns) * 600 })))
await sharp({ create: { width: columns * 600, height: rows * 600, channels: 3, background: '#f5f2ea' } }).composite(tiles).jpeg({ quality: 92 }).toFile(resolve(evidence, 'plates-contact-sheet.jpg'))
