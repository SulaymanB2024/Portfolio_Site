/** Closed, thick sculptural surfaces. All units are in the author's object space. */
import * as THREE from 'three'
import { put, vec } from '../work-models/geometry.mjs'

/** A sampled sheet with real edge walls, separate face normals and no zero-width tips. */
export function thickSurface(part, sample, uSteps = 100, vSteps = 8, thickness = .022) {
  const positions = [], indices = [], normals = []
  const point = (u,v) => sample(Math.max(0,Math.min(1,u)),Math.max(0,Math.min(1,v)))
  const frame = (u,v) => {
    const du=point(u+.0001,v).sub(point(u-.0001,v))
    const dv=point(u,v+.0001).sub(point(u,v-.0001))
    const n=du.cross(dv).normalize()
    if(n.lengthSq()<.9) throw new Error(`${part.name}: singular surface at ${u},${v}`)
    return n
  }
  const vertex = (p,n) => { const i=positions.length/3;positions.push(...p.toArray());normals.push(...n.toArray());return i }
  for(const side of [1,-1]) {
    const base=positions.length/3
    for(let i=0;i<=uSteps;i++) for(let j=0;j<=vSteps;j++) {
      const u=i/uSteps,v=j/vSteps,n=frame(u,v)
      vertex(point(u,v).addScaledVector(n,side*thickness/2),n.multiplyScalar(side))
    }
    for(let i=0;i<uSteps;i++) for(let j=0;j<vSteps;j++) {
      const a=base+i*(vSteps+1)+j,b=a+vSteps+1,c=b+1,d=a+1
      indices.push(...(side===1?[a,b,d,b,c,d]:[a,d,b,b,d,c]))
    }
  }
  // Separate wall vertices keep the profile crisp beside the smooth face.
  for(const [count,uv] of [
    [uSteps,t=>[t,0]],[vSteps,t=>[1,t]],[uSteps,t=>[1-t,1]],[vSteps,t=>[0,1-t]],
  ]) {
    for(let i=0;i<count;i++) {
      const [u0,v0]=uv(i/count),[u1,v1]=uv((i+1)/count)
      const p=point(u0,v0),q=point(u1,v1),n0=frame(u0,v0),n1=frame(u1,v1)
      const topP=p.clone().addScaledVector(n0,thickness/2),bottomP=p.clone().addScaledVector(n0,-thickness/2)
      const topQ=q.clone().addScaledVector(n1,thickness/2),bottomQ=q.clone().addScaledVector(n1,-thickness/2)
      const outward=bottomP.clone().sub(topP).cross(topQ.clone().sub(topP)).normalize()
      const base=vertex(topP,outward);vertex(bottomP,outward);vertex(topQ,outward);vertex(bottomQ,outward)
      indices.push(base,base+1,base+2,base+2,base+1,base+3)
    }
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setIndex(indices)
  put(part,geometry)
}

/** Use a supplied width vector to author a ruled ribbon, without Frenet-frame flips. */
export function ribbon(part, center, width, steps=120, across=6, thickness=.022) {
  thickSurface(part,(u,v)=>center(u).addScaledVector(width(u),v-.5),steps,across,thickness)
}

/** A capped, continuously tapering pipe; smooth radial normals, deliberate endpoints. */
export function pipe(part, points, radius=.018, steps=64, sides=10) {
  const curve=points instanceof THREE.Curve?points:new THREE.CatmullRomCurve3(points,false,'centripetal')
  const frames=curve.computeFrenetFrames(steps,false),positions=[],indices=[]
  for(let i=0;i<=steps;i++) {
    const t=i/steps,p=curve.getPointAt(t),r=typeof radius==='function'?radius(t):radius
    for(let j=0;j<=sides;j++) {
      const a=j/sides*Math.PI*2
      positions.push(...p.clone().addScaledVector(frames.normals[i],Math.cos(a)*r).addScaledVector(frames.binormals[i],Math.sin(a)*r).toArray())
      if(i<steps&&j<sides){const k=i*(sides+1)+j;indices.push(k,k+sides+1,k+1,k+1,k+sides+1,k+sides+2)}
    }
  }
  for(const end of [0,steps]) {
    const center=positions.length/3;positions.push(...curve.getPointAt(end/steps).toArray())
    for(let j=0;j<sides;j++) {
      const a=end*(sides+1)+j,b=a+1;indices.push(...(end?[center,a,b]:[center,b,a]))
    }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();put(part,geometry)
}

export function sampleCurve(sample,count=40,start=0,end=1) {return Array.from({length:count+1},(_,i)=>sample(start+(end-start)*i/count))}

/** Thin relief follows the same authored sheet, rather than floating in front of it. */
export function seam(part, sample, v, radius=.006, steps=100, start=.015, end=.985, lift=.017) {
  pipe(part,sampleCurve(u=>{
    const p=sample(u,v),du=sample(Math.min(1,u+.0001),v).sub(sample(Math.max(0,u-.0001),v))
    const dv=sample(u,Math.min(1,v+.0001)).sub(sample(u,Math.max(0,v-.0001)))
    return p.addScaledVector(du.cross(dv).normalize(),lift)
  },40,start,end),radius,steps,6)
}

export { THREE, vec }
