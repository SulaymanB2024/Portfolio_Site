import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { createChessSearchArrow } from '../src/personal/about/chess-search-arrow.ts'

test('candidate arrow follows retained tile coordinates, hides stale candidates and never intercepts picks', () => {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
  const arrow = createChessSearchArrow(geometries, materials)
  const tiles = new Map<string,THREE.Vector3>()
  for (const file of 'abcdefgh') for (let rank=1;rank<=8;rank++) tiles.set(`${file}${rank}`,new THREE.Vector3(file.charCodeAt(0)-97,.1,rank-1))
  const buffers = [...geometries].map(geometry=>geometry.getAttribute('position').array)
  assert.equal(arrow.group.visible,false)
  for (const candidate of [{from:'e7',to:'e5'},{from:'b8',to:'c6'},{from:'g1',to:'f3'}]) {
    arrow.update(candidate,tiles)
    assert.equal(arrow.group.visible,true)
    for (const geometry of geometries) {
      const attr=geometry.getAttribute('position')
      for(let i=0;i<attr.count;i++) {
        assert(Number.isFinite(attr.getX(i)) && Number.isFinite(attr.getY(i)) && Number.isFinite(attr.getZ(i)))
        assert(attr.getY(i) > .1,'annotation lies above the tile surface')
      }
    }
    for(const [index,geometry] of [...geometries].entries()) assert.equal(geometry.getAttribute('position').array,buffers[index],'updates retain every buffer')
    arrow.group.updateMatrixWorld(true)
    assert.deepEqual(new THREE.Raycaster(new THREE.Vector3(4,10,5),new THREE.Vector3(0,-1,0)).intersectObject(arrow.group),[])
  }
  for(const candidate of [null,undefined,{from:'z9',to:'e5'},{from:'a1',to:'a1'}]) {
    arrow.update(candidate,tiles); assert.equal(arrow.group.visible,false)
  }
  arrow.update({from:'e7',to:'e5'},tiles);assert.equal(arrow.group.visible,true,'same candidate can return after hiding')
  assert.equal(geometries.size,2); assert.equal(materials.size,2)
  for (const material of materials) assert.equal(material.forceSinglePass,true,'flat translucent annotations use one draw per layer')
  for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose()
})

test('real candidate/depth updates trigger a finite ink pass and reduced motion stays still', () => {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
  const arrow = createChessSearchArrow(geometries, materials)
  const tiles = new Map([['e7', new THREE.Vector3(0,0,2)], ['e5',new THREE.Vector3(0,0,0)]])
  arrow.update({from:'e7',to:'e5',depth:12}, tiles)
  const positions = [...geometries].map(geometry=>Array.from(geometry.getAttribute('position').array))
  assert.equal(arrow.tick(.1,false),true)
  assert.equal(arrow.tick(.6,false),false,'the pass completes without an idle animation')
  arrow.update({from:'e7',to:'e5',depth:12}, tiles)
  assert.equal(arrow.tick(.1,false),false,'repeated records do not restart motion')
  arrow.update({from:'e7',to:'e5',depth:13}, tiles)
  assert.equal(arrow.tick(.1,false),true,'an actual new depth pulses the retained candidate')
  assert.equal(arrow.tick(.1,true),false,'reduced motion settles immediately')
  arrow.update({from:'e7',to:'e5',depth:14}, tiles)
  assert.equal(arrow.tick(.1,true),false)
  arrow.update(null, tiles)
  assert.equal(arrow.tick(.1,false),false,'hidden candidates never animate')
  assert.deepEqual([...geometries].map(geometry=>Array.from(geometry.getAttribute('position').array)),positions,'motion updates uniforms, not geometry')
  assert.equal(geometries.size,2); assert.equal(materials.size,2)
  for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose()
})
