import * as THREE from 'three'
import type { ChessSceneState } from './ChessGame'
import type { PieceSymbol } from './vendor/chess.js'
import { batchChessTemplate, bindChessBatchPicking } from './chess-batching.ts'

/** Reuses the carved GLB knight; turned companions share bounded geometry. */
export function createChessSet(parent: THREE.Group, knight: THREE.Object3D, tiles: Map<string,THREE.Vector3>, geometries: Set<THREE.BufferGeometry>, materials: Set<THREE.Material>) {
  const root=new THREE.Group(); root.name='complete-chess-set'; parent.add(root)
  const templates=new Map<string,THREE.Object3D>()
  const white=new THREE.MeshStandardMaterial({color:0xbdb8aa,roughness:.58,metalness:.04})
  const black=new THREE.MeshStandardMaterial({color:0x151515,roughness:.56,metalness:.04})
  materials.add(white);materials.add(black)
  function mesh(group:THREE.Group,geometry:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0){
    geometries.add(geometry);const node=new THREE.Mesh(geometry,material);node.position.set(x,y,z);group.add(node);return node
  }
  function turned(type:PieceSymbol,color:'w'|'b') {
    const material=color==='w'?white:black, contrast=color==='w'?black:white
    const group=new THREE.Group()
    const height=type==='p'?.24:type==='r'?.30:type==='b'?.36:type==='q'?.40:.43
    const profile=[[0,0],[.090,0],[.101,.010],[.100,.025],[.086,.035],[.085,.045],[.095,.052],[.090,.067],[.067,.087],[.042,.12],[.035,height*.63],[.048,height*.74],[.063,height*.79],[.055,height*.85],[0,height*.85]].map(point=>new THREE.Vector2(point[0],point[1]))
    mesh(group,new THREE.LatheGeometry(profile,40),material)
    const ring=mesh(group,new THREE.TorusGeometry(.086,.0026,6,40),contrast,0,.043);ring.rotation.x=Math.PI/2
    if(type==='p')mesh(group,new THREE.SphereGeometry(.045,24,16),material,0,height*.90)
    if(type==='b'){
      const head=mesh(group,new THREE.SphereGeometry(.050,24,18),material,0,height*.90);head.scale.set(.75,1.24,.75)
      const cut=mesh(group,new THREE.BoxGeometry(.006,.045,.013),contrast,0,height*.94,.034);cut.rotation.z=-.40
      mesh(group,new THREE.SphereGeometry(.012,16,10),material,0,height*1.09)
    }
    if(type==='r'){
      mesh(group,new THREE.CylinderGeometry(.068,.055,.056,32),material,0,height*.88)
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const merlon=mesh(group,new THREE.BoxGeometry(.029,.028,.020),material,Math.sin(a)*.055,height*.99,Math.cos(a)*.055);merlon.rotation.y=a}
    }
    if(type==='q'){
      mesh(group,new THREE.CylinderGeometry(.057,.038,.050,32),material,0,height*.90)
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;mesh(group,new THREE.SphereGeometry(.009,12,8),material,Math.sin(a)*.048,height*.98,Math.cos(a)*.048)}
      mesh(group,new THREE.SphereGeometry(.017,16,10),material,0,height*1.02)
    }
    if(type==='k'){
      mesh(group,new THREE.SphereGeometry(.037,24,16),material,0,height*.90)
      mesh(group,new THREE.BoxGeometry(.015,.064,.015),material,0,height*1.03)
      mesh(group,new THREE.BoxGeometry(.049,.015,.015),material,0,height*1.045)
    }
    return group
  }
  for(const color of ['w','b'] as const)for(const type of ['p','n','b','r','q','k'] as const){
    let object:THREE.Object3D
    if(type==='n'){
      object=knight.clone(true);object.position.set(0,0,0);object.scale.setScalar(.70);object.rotation.y=color==='w'?Math.PI:0
      object.traverse(node=>{if(node instanceof THREE.Mesh){const original=Array.isArray(node.material)?node.material:[node.material];const next=original.map(material=>{const copy=material.clone() as THREE.MeshStandardMaterial;const detail=node.name.includes('relief');copy.color.setHex(color==='w'?(detail?0x282828:0xbdb8aa):(detail?0x757575:0x151515));copy.opacity=1;copy.transparent=false;materials.add(copy);return copy});node.material=Array.isArray(node.material)?next:next[0]}})
    } else {object=turned(type,color);batchChessTemplate(object,geometries)}
    templates.set(`${color}${type}`,object)
  }
  type Entry={group:THREE.Group;kind:string;target:THREE.Vector3;from:THREE.Vector3;elapsed:number;release:()=>void}
  const entries=new Map<string,Entry>()
  let previousMove=''
  function update(state:ChessSceneState){
    const move=state.lastMove.join(',')
    if(move&&move!==previousMove){const[from,to]=state.lastMove,entry=entries.get(from);if(entry){const captured=entries.get(to);if(captured){captured.release();root.remove(captured.group)}entries.delete(to);entries.delete(from);entries.set(to,entry);entry.from.copy(entry.group.position);entry.elapsed=0}}
    previousMove=move
    const squares=new Set(state.pieces.map(piece=>piece.square))
    for(const[square,entry]of entries)if(!squares.has(square)){entry.release();root.remove(entry.group);entries.delete(square)}
    for(const piece of state.pieces){
      const point=tiles.get(piece.square);if(!point)continue
      const kind=`${piece.color}${piece.type}`
      let entry=entries.get(piece.square)
      if(entry?.kind!==kind){if(entry){entry.release();root.remove(entry.group)}const group=new THREE.Group();group.add(templates.get(kind)!.clone(true));const release=bindChessBatchPicking(group);group.position.copy(point);root.add(group);entry={group,kind,target:point.clone(),from:point.clone(),elapsed:1,release};entries.set(piece.square,entry)}
      entry.target.copy(point);entry.group.userData.chessSquare=piece.square;entry.group.name=`chess-${piece.square}-${kind}`
    }
  }
  function tick(dt:number,reduced:boolean){
    let moving=false
    for(const entry of entries.values()){
      entry.elapsed=reduced?1:Math.min(1,entry.elapsed+dt/.36)
      const t=entry.elapsed,smooth=t*t*(3-2*t);entry.group.position.lerpVectors(entry.from,entry.target,smooth)
      if(entry.kind[1]==='n'&&t<1)entry.group.position.y+=Math.sin(t*Math.PI)*.14
      if(t<1)moving=true
    }
    return moving
  }
  return {root,update,tick}
}
