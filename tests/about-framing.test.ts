import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { interestFraming, interestPixelRatio } from '../src/personal/about/interest-layout.ts'
import { createChessSet } from '../src/personal/about/chess-scene.ts'
import { Chess } from '../src/personal/about/chess-game.ts'
import { chessModel } from './fixtures/chess-model.ts'

test('gallery centers remain aligned with the three CSS columns on resize', () => {
  for (const [width,height,stacked] of [[1140,324,false],[1600,420,false],[338,320,true],[760,430,true]] as const) {
    const frame=interestFraming(width,height,stacked,null)
    const pixelsPerWorldUnit=height/(2*Math.tan(16*Math.PI/180)*frame.cameraZ)
    assert(Math.abs(frame.columnSpacing*pixelsPerWorldUnit-width/3)<1e-10)
    assert(Math.abs(frame.focusX-(stacked?0:-frame.columnSpacing*3*.165))<1e-10)
    assert(frame.scoreScale>0&&frame.knightScale>0&&frame.bassScale>0)
  }
})

test('phone and desktop backing surfaces stay inside their pixel limits at high DPR', () => {
  for(const touch of [false,true])for(const [width,height] of [[338,430],[800,430],[1600,640],[5000,3000]])for(const deviceRatio of [1,1.5,2,3]) {
    const ratio=interestPixelRatio(width,height,deviceRatio,touch)
    assert(width*height*ratio*ratio<=(touch?400_000:2_200_000))
    const subdivision=Math.min(deviceRatio,1.5)/ratio
    assert(Math.abs(subdivision-Math.round(subdivision))<1e-10,'grain lands on integer pixel subdivisions')
  }
})

test('selected phone views retain their fitted camera and centered interaction surface', () => {
  assert.equal(interestFraming(338,430,true,'knight').cameraZ,8)
  assert.equal(interestFraming(338,430,true,'bass').cameraZ,7.5)
  assert.equal(interestFraming(338,430,true,'score').cameraZ,6.2)
  for(const selected of ['bass','score','knight'] as const)assert.equal(interestFraming(338,430,true,selected).focusX,0)
})

test('the complete authored chess set fits the table at phone and desktop sizes, both orientations and drag limits', async () => {
  const bytes = await readFile(new URL('../public/about-objects/knight.glb', import.meta.url))
  const model = (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene
  const bounds = new THREE.Box3().setFromObject(model), center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3())
  const factor = 2.4 / Math.max(size.x, size.y, size.z)
  const tiles = new Map<string, THREE.Vector3>()
  model.traverse(node => {
    if (/^tile-[a-h][1-8]$/.test(node.name)) {
      const tile = new THREE.Box3().setFromObject(node), point = tile.getCenter(new THREE.Vector3())
      point.y = tile.max.y
      tiles.set(node.name.slice(5), point)
    }
  })
  const knight = model.getObjectByName('knight')!
  knight.visible = false
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
  const set = createChessSet(model, knight, tiles, geometries, materials, await chessModel())
  set.update({ pieces: new Chess().board().flat().filter(piece => piece !== null), selected: null, legal: [], lastMove: [], check: null, flipped: false })
  model.position.copy(center).multiplyScalar(-factor)
  model.scale.setScalar(factor)
  const pose = new THREE.Group(), group = new THREE.Group()
  pose.add(model); group.add(pose)
  const visibleMeshes: THREE.Mesh[] = []
  model.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    geometries.add(node.geometry)
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material)
    for (let parent: THREE.Object3D | null = node; parent; parent = parent.parent) if (!parent.visible) return
    node.geometry.computeBoundingBox()
    visibleMeshes.push(node)
  })
  const point = new THREE.Vector3()
  for (const [width, height, stacked] of [[282, 320, true], [322, 360, true], [335, 350, true], [552, 440, true], [900, 360, false], [1124, 520, false], [1600, 520, false]] as const) {
    const frame = interestFraming(width, height, stacked, 'knight', true)
    const camera = new THREE.PerspectiveCamera(32, width / height, .1, 100)
    camera.position.z = frame.cameraZ; camera.updateMatrixWorld()
    group.position.set(frame.focusX, frame.focusY, 0); group.scale.setScalar(frame.focusedKnightScale)
    for (const flip of [0, Math.PI]) for (const yaw of [-.727, 0, .727]) for (const pitch of [-.16, 0, .16]) {
      pose.rotation.set(.67 + pitch, flip - .22 + yaw, 0); group.updateMatrixWorld(true)
      for (const mesh of visibleMeshes) {
        const box = mesh.geometry.boundingBox!
        for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
          point.set(x, y, z).applyMatrix4(mesh.matrixWorld).project(camera)
          assert(point.x > -1 && point.x < (stacked ? 1 : .32), `${mesh.name} stays within ${width}px at yaw ${yaw}`)
          assert(Math.abs(point.y) < 1, `${mesh.name} stays within ${width}×${height}px at pitch ${pitch}, y=${point.y}`)
        }
      }
    }
  }
  for (const geometry of geometries) geometry.dispose()
  for (const material of materials) material.dispose()
})
