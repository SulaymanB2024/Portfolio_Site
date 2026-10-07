import * as THREE from 'three'
import type { ChessSceneState } from './ChessGame'
import { bindChessBatchPicking } from './chess-batching.ts'

/** Every piece clones a baked GLB template; material and game state remain native. */
export function createChessSet(parent: THREE.Group, knight: THREE.Object3D, tiles: Map<string,THREE.Vector3>, geometries: Set<THREE.BufferGeometry>, materials: Set<THREE.Material>, pieces: THREE.Object3D) {
  const root=new THREE.Group(); root.name='complete-chess-set'; parent.add(root)
  const templates=new Map<string,THREE.Object3D>()
  const white=new THREE.MeshStandardMaterial({color:0xbdb8aa,roughness:.48,metalness:.04})
  const black=new THREE.MeshStandardMaterial({color:0x35322f,roughness:.44,metalness:.04})
  const surfaces=new Set<THREE.Material>([white,black])
  materials.add(white);materials.add(black)
  for(const color of ['w','b'] as const)for(const type of ['p','n','b','r','q','k'] as const){
    let object:THREE.Object3D
    if(type==='n'){
      // The gallery knight is hidden while the game is shown. Its four playable
      // clones must own visibility rather than inherit that presentation state.
      object=knight.clone(true);object.visible=true;object.position.set(0,0,0);object.scale.setScalar(.70);object.rotation.y=color==='w'?Math.PI:0
      object.traverse(node=>{if(node instanceof THREE.Mesh){const original=Array.isArray(node.material)?node.material:[node.material];const next=original.map(material=>{const copy=material.clone() as THREE.MeshStandardMaterial;const detail=node.name.includes('relief');copy.color.setHex(color==='w'?(detail?0x282828:0xbdb8aa):(detail?0x757575:0x35322f));copy.opacity=1;copy.transparent=false;materials.add(copy);surfaces.add(copy);return copy});node.material=Array.isArray(node.material)?next:next[0]}})
    } else {
      const source=pieces.getObjectByName(`piece-template-${type}`)
      if(!source)throw new Error(`Missing GLB chess piece: ${type}`)
      object=source.clone(true)
      object.traverse(node=>{if(node instanceof THREE.Mesh){geometries.add(node.geometry);node.material=node.userData.finish==='contrast'?(color==='w'?black:white):(color==='w'?white:black)}})
    }
    templates.set(`${color}${type}`,object)
  }
  // Shared GLB buffers and finishes fade together, including double-sided knight parts.
  for(const material of surfaces){material.transparent=true;material.forceSinglePass=true}
  type Entry={group:THREE.Group;kind:string;target:THREE.Vector3;from:THREE.Vector3;elapsed:number;release:()=>void}
  const entries=new Map<string,Entry>()
  let previousMove=''
  function moveEntry(from:string,to:string){
    const entry=entries.get(from);if(!entry)return
    const captured=entries.get(to);if(captured){captured.release();root.remove(captured.group)}
    entries.delete(to);entries.delete(from);entries.set(to,entry)
    entry.from.copy(entry.group.position);entry.elapsed=0
  }
  function update(state:ChessSceneState){
    const move=state.lastMove.join(',')
    if(move!==previousMove)finishMotion()
    if(move&&move!==previousMove){
      const[from,to]=state.lastMove,entry=entries.get(from)
      const color=entry?.kind[0],rank=color==='w'?'1':'8'
      const castling=entry?.kind===`${color}k`&&from===`e${rank}`&&(to===`g${rank}`||to===`c${rank}`)
      if(castling){
        const kingSide=to[0]==='g',rookFrom=`${kingSide?'h':'a'}${rank}`,rookTo=`${kingSide?'f':'d'}${rank}`
        const clear=(kingSide?['f','g']:['b','c','d']).every(file=>!entries.has(`${file}${rank}`))
        // The legal game supplies lastMove. Require its complete rook transition
        // as well as the king's home-rank move before remapping the rook motion.
        if(clear&&entries.get(rookFrom)?.kind===`${color}r`
          &&!state.pieces.some(piece=>piece.square===rookFrom||piece.square===from)
          &&state.pieces.some(piece=>piece.square===rookTo&&piece.type==='r'&&piece.color===color)
          &&state.pieces.some(piece=>piece.square===to&&piece.type==='k'&&piece.color===color))moveEntry(rookFrom,rookTo)
      }
      moveEntry(from,to)
    }
    previousMove=move
    const squares=new Set(state.pieces.map(piece=>piece.square))
    for(const[square,entry]of entries)if(!squares.has(square)){entry.release();root.remove(entry.group);entries.delete(square)}
    for(const piece of state.pieces){
      const point=tiles.get(piece.square);if(!point)continue
      const kind=`${piece.color}${piece.type}`
      let entry=entries.get(piece.square)
      if(entry?.kind!==kind){const motion=entry&&{from:entry.from.clone(),elapsed:entry.elapsed};if(entry){entry.release();root.remove(entry.group)}const group=new THREE.Group();group.add(templates.get(kind)!.clone(true));const release=bindChessBatchPicking(group);group.position.copy(point);root.add(group);entry={group,kind,target:point.clone(),from:motion?.from??point.clone(),elapsed:motion?.elapsed??1,release};entries.set(piece.square,entry)}
      entry.target.copy(point);entry.group.userData.chessSquare=piece.square;entry.group.name=`chess-${piece.square}-${kind}`
    }
  }
  function tick(dt:number,reduced:boolean){
    let moving=false
    for(const entry of entries.values()){
      entry.elapsed=reduced?1:Math.min(1,entry.elapsed+Math.max(0,dt)/.36)
      const t=entry.elapsed,smooth=t*t*(3-2*t);entry.group.position.lerpVectors(entry.from,entry.target,smooth)
      if(entry.kind[1]==='n'&&t<1)entry.group.position.y+=Math.sin(t*Math.PI)*.14
      if(t<1)moving=true
    }
    return moving
  }
  function finishMotion(){for(const entry of entries.values()){entry.elapsed=1;entry.group.position.copy(entry.target)}}
  let opacity=1
  function setOpacity(value:number){
    const next=Math.max(0,Math.min(1,value));if(opacity===next)return
    opacity=next;for(const material of surfaces)material.opacity=next
  }
  return {root,update,tick,setOpacity,finishMotion}
}
