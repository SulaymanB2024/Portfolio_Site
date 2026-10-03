import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { Chess } from '../src/personal/about/chess-game.ts'
import { createChessSet } from '../src/personal/about/chess-scene.ts'

test('board disclosure fades every piece without changing source finishes, picks, or geometry', () => {
  const source=new THREE.MeshStandardMaterial({color:0xbdb8aa,opacity:.7,side:THREE.DoubleSide})
  const geometry=new THREE.SphereGeometry(.05,12,8)
  const knight=new THREE.Group();knight.add(new THREE.Mesh(geometry,source))
  const parent=new THREE.Group(),tiles=new Map<string,THREE.Vector3>()
  for(const file of 'abcdefgh')for(let rank=1;rank<=8;rank++)tiles.set(`${file}${rank}`,new THREE.Vector3(file.charCodeAt(0)-97,0,rank-1))
  const geometries=new Set<THREE.BufferGeometry>([geometry]),materials=new Set<THREE.Material>([source])
  const scene=createChessSet(parent,knight,tiles,geometries,materials)
  scene.update({pieces:new Chess().board().flat().filter(piece=>piece!==null),selected:null,legal:[],lastMove:[],check:null,flipped:false})
  const before=scene.root.children.map(node=>({position:node.position.toArray(),square:node.userData.chessSquare}))
  const retainedBuffers=[...geometries],retainedMaterials=[...materials]
  for(const opacity of [0,.1,.5,1,.25,1]) {
    scene.setOpacity(opacity)
    scene.root.traverse(node=>{
      if(!(node instanceof THREE.Mesh))return
      for(const material of Array.isArray(node.material)?node.material:[node.material]) {
        assert.equal(material.opacity,opacity)
        assert.equal(material.transparent,true)
        assert.equal(material.forceSinglePass,true,'a double-sided source cannot double fade draw calls')
      }
    })
    assert.equal(source.opacity,.7,'gallery finish stays owned by the original GLB')
    assert.deepEqual([...geometries],retainedBuffers)
    assert.deepEqual([...materials],retainedMaterials)
    assert.deepEqual(scene.root.children.map(node=>({position:node.position.toArray(),square:node.userData.chessSquare})),before)
  }
  for(const item of geometries)item.dispose();for(const item of materials)item.dispose()
})
