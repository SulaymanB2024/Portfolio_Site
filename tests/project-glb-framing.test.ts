import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { NodeIO, type Node } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import draco from 'draco3dgltf'
import { Box3, Euler, Matrix4, PerspectiveCamera, Vector3 } from 'three'
import { projectGLBDistance, type ProjectShaftBounds } from '../src/personal/projects/project-glb-framing.ts'
import { projectPartAngle, projectPartMotion, type ProjectPartMotion } from '../src/personal/projects/project-articulation.ts'
import { workStudyPose } from '../src/personal/work-study-motion.ts'
import { projectSculptures } from '../src/personal/projects/project-sculptures.ts'

const definitions = Object.entries(projectSculptures).map(([slug, definition]) => ({
  slug, id: definition.asset ?? `work-${slug}`, ...definition
}))
const manifest = JSON.parse(readFileSync(new URL('../public/portfolio-models/manifest.json', import.meta.url), 'utf8'))
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco.createDecoderModule() })

test('all project presentations fill portrait and desktop slots without clipping actual GLB geometry', async () => {
  for (const { id, yaw, pitch, phase } of definitions) {
    const doc = await io.read(new URL(`../${manifest.assets[id].path}`, import.meta.url).pathname)
    const vectors: Vector3[] = [], orbitVectors: Vector3[] = [], bounds = new Box3()
    const parents = new Map<Node, Node>()
    type ShaftBinding = { motion:ProjectPartMotion; pivot:Vector3; axis:Vector3; points:Vector3[]; orbitPoints:Vector3[] }
    const moving = new Map<Node, ShaftBinding>()
    for (const node of doc.getRoot().listNodes()) {
      for (const child of node.listChildren()) parents.set(child, node)
      const motion = projectPartMotion(node.getName(), node.getExtras().articulationMotion)
      if (!motion) continue
      const transform = new Matrix4().fromArray(node.getWorldMatrix())
      moving.set(node, { motion, pivot:new Vector3().setFromMatrixPosition(transform), axis:new Vector3().fromArray(node.getExtras().articulationAxis as number[]).transformDirection(transform), points:[], orbitPoints:[] })
    }
    const bindings: (ShaftBinding | undefined)[] = []
    for (const node of doc.getRoot().listNodes()) {
      const transform = new Matrix4().fromArray(node.getWorldMatrix())
      let owner: Node | undefined = node
      while (owner && !moving.has(owner)) owner = parents.get(owner)
      const binding = owner ? moving.get(owner) : undefined
      for (const primitive of node.getMesh()?.listPrimitives() ?? []) {
        const positions = primitive.getAttribute('POSITION')!
        const box = new Box3()
        for (let i = 0; i < positions.getCount(); i++) {
          const point = new Vector3().fromArray(positions.getArray()!, i * 3)
          box.expandByPoint(point)
          point.applyMatrix4(transform)
          vectors.push(point); bounds.expandByPoint(point); bindings.push(binding)
          binding?.points.push(point)
        }
        for (const x of [box.min.x,box.max.x]) for (const y of [box.min.y,box.max.y]) for (const z of [box.min.z,box.max.z]) {
          const point = new Vector3(x,y,z).applyMatrix4(transform)
          orbitVectors.push(point); binding?.orbitPoints.push(point)
        }
      }
    }
    assert.ok(vectors.length > 1000, `${id}: actual mesh vertices`)
    const center = bounds.getCenter(new Vector3())
    const points = new Float32Array(vectors.flatMap(point => point.sub(center).toArray()))
    const radius = Math.sqrt(vectors.reduce((maximum,point)=>Math.max(maximum,point.lengthSq()),0))
    const shafts: ProjectShaftBounds[] = [...moving.values()].map(binding => {
      binding.pivot.sub(center)
      return { points:new Float32Array(binding.points.flatMap(point=>point.toArray())), pivot:binding.pivot.toArray() as [number,number,number], axis:binding.axis.toArray() as [number,number,number], ...(binding.motion.kind==='pendulum'?{range:binding.motion.amplitude}:{}) }
    })
    const orbitPoints = new Float32Array(orbitVectors.flatMap(point=>point.sub(center).toArray()))
    const orbitShafts: ProjectShaftBounds[] = [...moving.values()].map(binding=>({
      points:new Float32Array(binding.orbitPoints.flatMap(point=>point.toArray())), pivot:binding.pivot.toArray() as [number,number,number], axis:binding.axis.toArray() as [number,number,number], ...(binding.motion.kind==='pendulum'?{range:binding.motion.amplitude}:{})
    }))
    for (const aspect of [.82, .96, 1.6]) {
      const distance = projectGLBDistance(points, aspect, 17 * Math.PI / 180, yaw, pitch, shafts)
      const camera = new PerspectiveCamera(34, aspect, .01, distance + 10)
      camera.near = Math.max(.01,distance-radius*2); camera.far = distance+radius*3; camera.updateProjectionMatrix()
      camera.position.set(0, .04, 1).setLength(distance)
      camera.lookAt(0, 0, 0); camera.updateMatrixWorld()
      const pose = { yaw:0, pitch:0, roll:0, y:0, idleYaw:0 }
      const rotation = new Euler(), projected = new Vector3()
      let extent = 0
      // Sample the real motion clock, including a settled reduced-motion pose.
      for (let sample = -1; sample < 12; sample++) {
        workStudyPose(sample * 4.7, phase, 0, sample >= 0, pose)
        rotation.set(pitch + pose.pitch, yaw + pose.yaw, pose.roll)
        for (let index=0; index<vectors.length; index++) {
          projected.copy(vectors[index])
          const binding=bindings[index]
          if (binding) projected.sub(binding.pivot).applyAxisAngle(binding.axis,projectPartAngle(binding.motion,sample*4.7,sample>=0)).add(binding.pivot)
          projected.applyEuler(rotation); projected.y += pose.y; projected.project(camera)
          extent = Math.max(extent, Math.abs(projected.x), Math.abs(projected.y))
          assert.ok(Math.abs(projected.x) < .995 && Math.abs(projected.y) < .995, `${id}: clipped at aspect ${aspect}, sample ${sample}`)
          assert.ok(projected.z > -1 && projected.z < 1, `${id}: depth clipping`)
        }
      }
      assert.ok(extent > .75, `${id}: sculpture underfills its slot (${extent})`)
      // Exercise the inexpensive mesh-box fit against every real vertex,
      // including moving shafts, rear/side views and both polar limits.
      for (const direction of [[1,.04,0],[0,.04,-1],[.001,1,0],[.001,-1,0]]) {
        camera.position.fromArray(direction).normalize()
        camera.lookAt(0,0,0); camera.updateMatrixWorld()
        const orbitDistance = Math.max(distance,projectGLBDistance(orbitPoints,aspect,17*Math.PI/180,yaw,pitch,orbitShafts,camera.quaternion))
        camera.near = Math.max(.01,orbitDistance-radius*2); camera.far = orbitDistance+radius*3; camera.updateProjectionMatrix()
        camera.position.setLength(orbitDistance); camera.updateMatrixWorld()
        for (const time of [0,8.3,21.7]) {
          workStudyPose(time,phase,0,true,pose)
          rotation.set(pitch+pose.pitch,yaw+pose.yaw,pose.roll)
          for (let index=0;index<vectors.length;index++) {
            projected.copy(vectors[index])
            const binding=bindings[index]
            if(binding) projected.sub(binding.pivot).applyAxisAngle(binding.axis,projectPartAngle(binding.motion,time,true)).add(binding.pivot)
            projected.applyEuler(rotation); projected.y+=pose.y; projected.project(camera)
            assert.ok(Math.abs(projected.x)<.995&&Math.abs(projected.y)<.995,`${id}: orbit clipped at aspect ${aspect}, direction ${direction}, time ${time}`)
            assert.ok(projected.z>-1&&projected.z<1,`${id}: orbit depth clipped`)
          }
        }
      }
    }
  }
})
