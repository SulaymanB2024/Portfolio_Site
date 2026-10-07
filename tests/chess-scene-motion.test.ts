import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { createChessSet } from '../src/personal/about/chess-scene.ts'
import type { ChessSceneState } from '../src/personal/about/ChessGame'
import { chessModel } from './fixtures/chess-model.ts'
import { Chess } from '../src/personal/about/vendor/chess.js'

async function fixture(boardTiles?:Map<string,THREE.Vector3>) {
  const geometry=new THREE.SphereGeometry(.05,8,6),material=new THREE.MeshStandardMaterial()
  const knight=new THREE.Group();knight.add(new THREE.Mesh(geometry,material))
  const geometries=new Set<THREE.BufferGeometry>([geometry]),materials=new Set<THREE.Material>([material])
  const tiles=boardTiles??new Map([['e7',new THREE.Vector3(0,0,.6)],['e5',new THREE.Vector3(0,0,0)],['e4',new THREE.Vector3(0,0,-.3)]])
  const parent=new THREE.Group()
  const set=createChessSet(parent,knight,tiles,geometries,materials,await chessModel())
  const state:ChessSceneState={pieces:[{square:'e7',type:'p',color:'b'}],selected:null,legal:[],lastMove:[],check:null,flipped:false}
  const moved:ChessSceneState={...state,pieces:[{square:'e5',type:'p',color:'b'}],lastMove:['e7','e5']}
  const dispose=()=>{for(const item of geometries)item.dispose();for(const item of materials)item.dispose()}
  return {set,parent,geometries,materials,tiles,state,moved,dispose}
}

test('chess moves travel directly and allocate no auxiliary scene or render resources', async () => {
  const {set,parent,geometries,materials,tiles,state,moved,dispose}=await fixture()
  try {
    set.update(state)
    const buffers=[...geometries],finishes=[...materials]
    set.update(moved)
    assert.equal(set.tick(.18,false),true)
    assert.deepEqual(set.root.children[0].position.toArray(),[0,0,.3])
    assert.equal(set.tick(.18,false),false)
    assert.deepEqual(set.root.children[0].position.toArray(),tiles.get('e5')!.toArray())
    assert.deepEqual(parent.children,[set.root],'the board has no hand or auxiliary scene')
    assert.deepEqual([...geometries],buffers)
    assert.deepEqual([...materials],finishes)
    set.update(moved)
    assert.equal(set.tick(.1,false),false,'repeated records do not replay a move')
  } finally { dispose() }
})

const boardTiles=()=>new Map(Array.from({length:64},(_,index)=>[`${'abcdefgh'[index%8]}${1+Math.floor(index/8)}`,new THREE.Vector3(index%8,0,Math.floor(index/8))] as const))
const sceneState=(game:Chess,lastMove:string[]=[]):ChessSceneState=>({pieces:game.board().flat().filter(piece=>piece!==null),selected:null,legal:[],lastMove,check:null,flipped:false})

for(const color of ['w','b'] as const)for(const side of ['king','queen'] as const){
  test(`${color==='w'?'White':'Black'} ${side}-side castling moves the original rook and king on one clock`,async()=>{
    const {set,parent,tiles,geometries,materials,dispose}=await fixture(boardTiles())
    try{
      const game=new Chess(`r3k2r/8/8/8/8/8/8/R3K2R ${color} KQkq - 0 1`)
      set.update(sceneState(game))
      const rank=color==='w'?'1':'8',kingFrom=`e${rank}`,kingTo=`${side==='king'?'g':'c'}${rank}`
      const rookFrom=`${side==='king'?'h':'a'}${rank}`,rookTo=`${side==='king'?'f':'d'}${rank}`
      const king=set.root.getObjectByName(`chess-${kingFrom}-${color}k`)!,rook=set.root.getObjectByName(`chess-${rookFrom}-${color}r`)!
      const groups=[...set.root.children],buffers=[...geometries],finishes=[...materials],meshes:THREE.Mesh[]=[]
      set.root.traverse(node=>{if(node instanceof THREE.Mesh)meshes.push(node)})
      const played=game.move(side==='king'?'O-O':'O-O-O')
      const after=sceneState(game,[played.from,played.to])
      set.update(after)
      assert.equal(set.root.getObjectByName(`chess-${kingTo}-${color}k`),king)
      assert.equal(set.root.getObjectByName(`chess-${rookTo}-${color}r`),rook,'castling retains the original rook/pick delegate')
      assert.deepEqual(rook.position.toArray(),tiles.get(rookFrom)!.toArray())
      assert.equal(king.userData.chessSquare,kingTo)
      assert.equal(rook.userData.chessSquare,rookTo)
      assert.equal(set.tick(.18,false),true)
      assert.deepEqual(king.position.toArray(),tiles.get(kingFrom)!.clone().lerp(tiles.get(kingTo)!,.5).toArray())
      assert.deepEqual(rook.position.toArray(),tiles.get(rookFrom)!.clone().lerp(tiles.get(rookTo)!,.5).toArray())
      assert.equal(set.tick(.18,false),false)
      assert.deepEqual(king.position.toArray(),tiles.get(kingTo)!.toArray())
      assert.deepEqual(rook.position.toArray(),tiles.get(rookTo)!.toArray())
      assert.deepEqual(set.root.children,groups)
      const afterMeshes:THREE.Mesh[]=[];set.root.traverse(node=>{if(node instanceof THREE.Mesh)afterMeshes.push(node)})
      assert.deepEqual(afterMeshes,meshes,'same piece meshes and draw resources')
      assert.deepEqual([...geometries],buffers)
      assert.deepEqual([...materials],finishes)
      assert.deepEqual(parent.children,[set.root],'no auxiliary scene objects')
      set.update(after);assert.equal(set.tick(.1,false),false,'duplicate updates do not replay either piece')
    }finally{dispose()}
  })
}

test('interrupted and reduced castling settle both original pieces at legal destinations',async()=>{
  for(const reduced of [false,true]){
    const {set,tiles,dispose}=await fixture(boardTiles())
    try{
      const game=new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
      set.update(sceneState(game));const played=game.move('O-O-O');set.update(sceneState(game,[played.from,played.to]))
      set.tick(.1,reduced);if(!reduced)set.finishMotion()
      assert.deepEqual(set.root.getObjectByName('chess-c1-wk')!.position.toArray(),tiles.get('c1')!.toArray())
      assert.deepEqual(set.root.getObjectByName('chess-d1-wr')!.position.toArray(),tiles.get('d1')!.toArray())
      assert.equal(set.tick(.1,false),false)
    }finally{dispose()}
  }
})

test('a legal two-file rook move does not move the neighboring rook as castling',async()=>{
  const {set,tiles,dispose}=await fixture(boardTiles())
  try{
    const game=new Chess('4k3/8/8/8/8/8/8/K3R2R w - - 0 1')
    set.update(sceneState(game));const neighbor=set.root.getObjectByName('chess-h1-wr')!
    const played=game.move({from:'e1',to:'g1'});set.update(sceneState(game,[played.from,played.to]));set.tick(.18,false)
    assert.equal(set.root.getObjectByName('chess-h1-wr'),neighbor)
    assert.deepEqual(neighbor.position.toArray(),tiles.get('h1')!.toArray())
    assert.equal(set.root.getObjectByName('chess-f1-wr'),undefined)
  }finally{dispose()}
})

test('a new move finishes both castling pieces before the next motion begins',async()=>{
  const {set,tiles,dispose}=await fixture(boardTiles())
  try{
    const game=new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
    set.update(sceneState(game));const white=game.move('O-O-O');set.update(sceneState(game,[white.from,white.to]));set.tick(.08,false)
    const black=game.move('O-O');set.update(sceneState(game,[black.from,black.to]))
    assert.deepEqual(set.root.getObjectByName('chess-c1-wk')!.position.toArray(),tiles.get('c1')!.toArray())
    assert.deepEqual(set.root.getObjectByName('chess-d1-wr')!.position.toArray(),tiles.get('d1')!.toArray())
    assert.deepEqual(set.root.getObjectByName('chess-g8-bk')!.position.toArray(),tiles.get('e8')!.toArray())
    assert.deepEqual(set.root.getObjectByName('chess-f8-br')!.position.toArray(),tiles.get('h8')!.toArray())
    assert.equal(set.tick(.36,false),false)
    assert.deepEqual(set.root.getObjectByName('chess-f8-br')!.position.toArray(),tiles.get('f8')!.toArray())
  }finally{dispose()}
})

test('capture promotion preserves its source motion while removing the captured piece',async()=>{
  const {set,tiles,geometries,materials,dispose}=await fixture(boardTiles())
  try{
    const game=new Chess('6rk/5P2/6K1/8/8/8/8/8 w - - 0 1')
    set.update(sceneState(game));const captured=set.root.getObjectByName('chess-g8-br')!
    const buffers=[...geometries],finishes=[...materials]
    const played=game.move({from:'f7',to:'g8',promotion:'q'});set.update(sceneState(game,[played.from,played.to]))
    const queen=set.root.getObjectByName('chess-g8-wq')!
    assert.equal(captured.parent,null)
    assert.equal(set.root.getObjectByName('chess-f7-wp'),undefined)
    assert.equal(set.root.children.length,3)
    assert.equal(set.tick(.18,false),true)
    assert.deepEqual(queen.position.toArray(),tiles.get('f7')!.clone().lerp(tiles.get('g8')!,.5).toArray())
    assert.equal(set.tick(.18,false),false)
    assert.deepEqual(queen.position.toArray(),tiles.get('g8')!.toArray())
    assert.deepEqual([...geometries],buffers)
    assert.deepEqual([...materials],finishes)
  }finally{dispose()}
})

test('interrupted and reduced-motion moves settle at the legal destination', async () => {
  const {set,tiles,state,moved,dispose}=await fixture()
  try {
    set.update(state);set.update(moved);set.tick(.1,false)
    set.finishMotion()
    assert.deepEqual(set.root.children[0].position.toArray(),tiles.get('e5')!.toArray())
    assert.equal(set.tick(.1,false),false)
    set.update({...state,pieces:[{square:'e4',type:'p',color:'b'}],lastMove:['e5','e4']})
    assert.equal(set.tick(.1,true),false)
    assert.deepEqual(set.root.children[0].position.toArray(),tiles.get('e4')!.toArray())
  } finally { dispose() }
})
