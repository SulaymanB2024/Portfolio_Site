/** Original spatial abstractions for Markets and Experiments. No model inputs. */
import {
  TAU, group, put, machinedRing, rod,
} from '../work-models/geometry.mjs'
import { THREE, vec, thickSurface, pipe, seam, sampleCurve } from './parametric.mjs'

const Z = vec(0, 0, 1)

function liftedPoint(sample, u, v, lift) {
  const point=sample(u,v)
  const du=sample(Math.min(1,u+.0001),v).sub(sample(Math.max(0,u-.0001),v))
  const dv=sample(u,Math.min(1,v+.0001)).sub(sample(u,Math.max(0,v-.0001)))
  return point.addScaledVector(du.cross(dv).normalize(),lift)
}

function equilibrium() {
  const spine=group('Sinuous bifurcated load spine','silver')
  const upper=group('Ascending anticlastic pressure lamella','porcelain')
  const lower=group('Descending anticlastic pressure lamella','silver')
  const edges=group('Rolled pressure shoulders and counterpoises','pewter')
  const contours=group('Integrated pressure ribs and incised contours','steel')
  const tension=group('Opposing tension bridges and fitted seats','silver')
  const dark=group('Counterpoise flutes and tension eyes','steel')

  const axisCurve=new THREE.CatmullRomCurve3([
    vec(-.46,-.87,.19),vec(-.16,-.46,.31),vec(.055,-.12,.015),
    vec(.14,.23,-.30),vec(.32,.67,-.15),vec(.51,.90,.09),
  ],false,'centripetal')
  const axis=u=>axisCurve.getPointAt(u)
  const upperCurve=new THREE.CatmullRomCurve3([
    axis(.365),vec(-.37,-.025,.24),vec(-.70,.285,.37),
    vec(-.76,.57,.15),vec(-.56,.79,-.16),
  ],false,'centripetal')
  const lowerCurve=new THREE.CatmullRomCurve3([
    axis(.635),vec(.53,.115,-.19),vec(.76,-.185,.04),
    vec(.80,-.50,.31),vec(.585,-.73,.325),
  ],false,'centripetal')
  const skinFor=(curve,widthAt,twistAt,billow)=> (u,v)=>{
    const tangent=curve.getTangentAt(u).normalize()
    const lateral=vec(-tangent.y,tangent.x,0).normalize().applyAxisAngle(tangent,twistAt(u))
    const normal=tangent.clone().cross(lateral).normalize()
    // The concave transverse section adds compound curvature instead of a
    // merely twisted flat strip. Thickness and rounded returns remain real.
    return curve.getPointAt(u).addScaledVector(lateral,(v-.5)*widthAt(u))
      .addScaledVector(normal,-billow*Math.sin(Math.PI*v)*Math.sin(Math.PI*u))
  }
  const centerSkin=skinFor(axisCurve,u=>.13+.235*Math.sin(Math.PI*u),
    u=>-.60+1.15*u+.23*Math.sin(TAU*u),.087)
  const upperSkin=skinFor(upperCurve,u=>.071+.285*Math.pow(Math.sin(Math.PI*u),.72),
    u=>-.58+1.28*u+.20*Math.sin(TAU*u),.083)
  const lowerSkin=skinFor(lowerCurve,u=>.081+.333*Math.pow(Math.sin(Math.PI*u),.8),
    u=>.66-1.38*u-.19*Math.sin(TAU*u),.109)
  const skins=[centerSkin,upperSkin,lowerSkin]
  thickSurface(spine,centerSkin,150,22,.042)
  thickSurface(upper,upperSkin,138,20,.037)
  thickSurface(lower,lowerSkin,146,20,.044)

  for(const [index,skin]of skins.entries()) {
    // Richer structure belongs to the skin: one rolled edge on either side,
    // integrated fluted pressure ribs at the back, restrained carved fronts.
    for(const v of [.018,.982]) seam(edges,skin,v,.014,144,.009,.991,.023)
    for(const v of [.27,.63,.85]) {
      seam(contours,skin,v,index===0?.005:.0058,116,.035,.965,.028)
      seam(contours,skin,v,.0092,116,.026,.974,-.027)
    }
    for(const u of [0,1]) pipe(edges,sampleCurve(v=>skin(u,v),18),.012,26,10)
  }

  // Two open lobes are joined only by tension bridges. Unequal lengths and
  // section widths preserve a visible balance without a bilateral icon.
  const bridges=[
    [upperCurve.getPointAt(.965),axis(.92),-.085],
    [lowerCurve.getPointAt(.962),axis(.055),.080],
  ]
  for(const [a,b,bow]of bridges) for(const offset of [-.026,.026]) {
    const start=a.clone().add(vec(0,0,offset)),end=b.clone().add(vec(0,0,offset))
    const mid=start.clone().lerp(end,.51).add(vec(0,bow,.035))
    pipe(tension,[start,mid,end],.0095,64,10)
    const direction=end.clone().sub(start).normalize()
    const e=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(Z,direction))
    for(const p of [start,end]) {
      machinedRing(tension,.023,.012,.022,0,TAU,p,[e.x,e.y,e.z],24)
      rod(dark,p.clone().addScaledVector(direction,-.025),p.clone().addScaledVector(direction,.025),.008,10)
    }
  }

  // These tapered load masses are seated around the two extreme spine ends.
  // Curved shoulder profiles replace the earlier stacks of rectangular slabs.
  for(const [u,scale]of [[.032,1],[.958,.72]]) {
    const center=axis(u),tangent=axisCurve.getTangentAt(u).normalize()
    const q=new THREE.Quaternion().setFromUnitVectors(vec(0,1,0),tangent)
    const e=new THREE.Euler().setFromQuaternion(q)
    const profile=[
      [.019,-.128],[.070,-.119],[.104,-.090],[.119,-.048],[.121,-.010],
      [.112,.035],[.091,.079],[.056,.116],[.019,.132],
    ].map(([r,h])=>new THREE.Vector2(r*scale,h*scale))
    put(edges,new THREE.LatheGeometry(profile,64),center,[e.x,e.y,e.z],[1,1,.82])
    for(const height of [-.128,.132]) {
      const p=vec(0,height*scale,0).applyQuaternion(q).add(center)
      put(edges,new THREE.SphereGeometry(.0195*scale,20,10),p)
    }
    // Six broad sculpted flutes follow the mass's true revolved shoulder.
    for(let flute=0;flute<6;flute++) {
      const a=flute/6*TAU
      pipe(dark,profile.slice(1,-1).map(p=>vec(
        (p.x+.002)*Math.cos(a),p.y,(p.x*.82+.002)*Math.sin(a),
      ).applyQuaternion(q).add(center)),.0048*scale,32,6)
    }
  }
  return [spine,upper,lower,edges,contours,tension,dark]
}

/** A thick ribbon with actual through-slots and closed machined slot walls. */
function piercedCast(part, sample, uSteps, vSteps, thickness, slots) {
  const positions=[],normals=[],indices=[]
  const point=(u,v)=>sample(Math.max(0,Math.min(1,u)),Math.max(0,Math.min(1,v)))
  const normal=(u,v)=>{
    const du=point(u+.0001,v).sub(point(u-.0001,v))
    const dv=point(u,v+.0001).sub(point(u,v-.0001))
    const n=du.cross(dv).normalize()
    if(n.lengthSq()<.9)throw new Error(`${part.name}: singular casting surface at ${u},${v}`)
    return n
  }
  const present=(i,j)=>i>=0&&i<uSteps&&j>=0&&j<vSteps&&
    !slots.some(s=>i>=s[0]&&i<s[1]&&j>=s[2]&&j<s[3])
  const vertex=(p,n)=>{const i=positions.length/3;positions.push(...p.toArray());normals.push(...n.toArray());return i}
  const row=vSteps+1,faceSize=(uSteps+1)*row
  for(const side of [1,-1]) {
    for(let i=0;i<=uSteps;i++)for(let j=0;j<=vSteps;j++) {
      const u=i/uSteps,v=j/vSteps,n=normal(u,v)
      vertex(point(u,v).addScaledVector(n,side*thickness/2),n.multiplyScalar(side))
    }
    const base=side===1?0:faceSize
    for(let i=0;i<uSteps;i++)for(let j=0;j<vSteps;j++)if(present(i,j)) {
      const a=base+i*row+j,b=a+row,c=b+1,d=a+1
      indices.push(...(side===1?[a,b,d,b,c,d]:[a,d,b,b,d,c]))
    }
  }
  const wall=(a,b)=>{
    const p=point(a[0]/uSteps,a[1]/vSteps),q=point(b[0]/uSteps,b[1]/vSteps)
    const np=normal(a[0]/uSteps,a[1]/vSteps),nq=normal(b[0]/uSteps,b[1]/vSteps)
    const topP=p.clone().addScaledVector(np,thickness/2),bottomP=p.clone().addScaledVector(np,-thickness/2)
    const topQ=q.clone().addScaledVector(nq,thickness/2),bottomQ=q.clone().addScaledVector(nq,-thickness/2)
    const outward=bottomP.clone().sub(topP).cross(topQ.clone().sub(topP)).normalize()
    const base=vertex(topP,outward);vertex(bottomP,outward);vertex(topQ,outward);vertex(bottomQ,outward)
    indices.push(base,base+1,base+2,base+2,base+1,base+3)
  }
  for(let i=0;i<uSteps;i++)for(let j=0;j<vSteps;j++)if(present(i,j)) {
    if(!present(i,j-1))wall([i,j],[i+1,j])
    if(!present(i+1,j))wall([i+1,j],[i+1,j+1])
    if(!present(i,j+1))wall([i+1,j+1],[i,j+1])
    if(!present(i-1,j))wall([i,j+1],[i,j])
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setIndex(indices)
  put(part,geometry)
}

function unfinishedContinuum() {
  const casting=group('Pierced folded continuum casting','porcelain')
  const shoulders=group('Rolled continuum shoulders','silver')
  const cuts=group('Fold registers and slotted cut lips','steel')
  const support=group('Rear cantilever and seated phase bearing','pewter')
  const bearing=group('Phase bearing collar and exposed end seats','silver')
  const pivot=vec(.025,-.07,.025)
  const rotor=group('hover-three-phase-rotor','silver',pivot.clone(),Z.clone())
  rotor.motion={kind:'continuous',angularVelocity:.12,ratio:1}
  const rotorCuts=group('Phase rotor edge inlays','steel',pivot.clone(),Z.clone())
  rotorCuts.parent=rotor.name

  // Closely spaced corner controls keep long faces angular; the change in
  // depth makes the final return pass in front of the initial casting.
  const path=new THREE.CatmullRomCurve3([
    vec(-.68,-.62,-.16),vec(-.46,-.65,-.13),vec(.53,-.65,.055),
    vec(.72,-.60,.07),vec(.73,-.44,.015),vec(.31,.52,-.335),
    vec(.19,.77,-.34),vec(.025,.80,-.245),vec(-.61,.065,.295),
    vec(-.78,-.24,.51),vec(-.70,-.43,.585),vec(-.49,-.49,.64),
  ],false,'centripetal')
  const center=u=>path.getPointAt(u)
  const width=u=>{
    const tangent=path.getTangentAt(u).normalize()
    const lateral=vec(-tangent.y,tangent.x,0).normalize()
    const twist=-.17+.46*Math.sin(Math.PI*u)+.29*Math.sin(TAU*u)
    return lateral.applyAxisAngle(tangent,twist).multiplyScalar(.25+.083*Math.sin(Math.PI*u))
  }
  const skin=(u,v)=>center(u).addScaledVector(width(u),v-.5)
  const uSteps=272,vSteps=20
  const slots=[.105,.177,.249,.408,.471,.622,.694,.846].map(u=>[
    Math.round(u*uSteps),Math.round((u+.027)*uSteps),7,13,
  ])
  piercedCast(casting,skin,uSteps,vSteps,.057,slots)
  for(const v of [.06,.94]) seam(shoulders,skin,v,.012,220,.008,.992,.031)
  for(const v of [.18,.82]) seam(cuts,skin,v,.0049,180,.020,.980,.033)
  // The pierced lip is dark on the rear too; all eight slots retain actual
  // daylight through them from either face.
  for(const [start,end,left,right]of slots) {
    const u0=start/uSteps,u1=end/uSteps,v0=left/vSteps,v1=right/vSteps
    for(const v of [v0,v1]) {
      pipe(cuts,sampleCurve(u=>liftedPoint(skin,u,v,.033),12,u0,u1),.0046,20,6)
    }
  }

  // A three-blade phase object occupies the generous inner opening. Its full
  // sweep is below radius .30; the fixed cast inner shoulders sit beyond it.
  for(let blade=0;blade<3;blade++) {
    const angle=blade/3*TAU+.16
    const sample=(u,v)=>{
      const radius=.087+.195*u
      const theta=angle+.64*u+(v-.5)*(.70+.23*u)
      return pivot.clone().add(vec(radius*Math.cos(theta),radius*Math.sin(theta),
        .065*Math.sin(Math.PI*u)*(v-.5)*2+.025*u))
    }
    thickSurface(rotor,sample,90,14,.027)
    for(const v of [.09,.91]) seam(rotorCuts,sample,v,.0047,84,.02,.98,.018)
  }
  machinedRing(rotor,.077,.031,.075,0,TAU,pivot,[0,0,0],72)
  machinedRing(rotorCuts,.081,.008,.008,0,TAU,pivot.clone().add(vec(0,0,.042)),[0,0,0],64)

  // The stationary bearing is behind the turning plane, with two seated
  // tapered braces joining the casting instead of unsupported floating parts.
  const back=pivot.clone().add(vec(0,0,-.155))
  machinedRing(bearing,.105,.038,.080,0,TAU,back,[0,0,0],80)
  rod(support,back.clone().add(vec(0,0,-.006)),pivot.clone().add(vec(0,0,-.044)),.026,20)
  for(const u of [.17,.46]) {
    const end=center(u).add(vec(0,0,-.11))
    pipe(support,[back.clone().add(vec(0,0,-.049)),back.clone().lerp(end,.40).add(vec(0,0,-.09)),end],
      t=>.028-.009*t,56,12)
    machinedRing(bearing,.047,.024,.043,0,TAU,end,[0,0,0],36)
  }

  // Open ends expose broad polished returns and a pair of fitted collars,
  // suggesting another iteration can join the genuinely unfinished path.
  for(const u of [0,1]) {
    const tangent=path.getTangentAt(u).normalize(),p=center(u)
    const q=new THREE.Quaternion().setFromUnitVectors(Z,tangent)
    const e=new THREE.Euler().setFromQuaternion(q)
    machinedRing(bearing,.057,.021,.021,0,TAU,p,[e.x,e.y,e.z],48)
    for(const v of [.13,.87]) {
      const point=liftedPoint(skin,u,v,.036)
      put(cuts,new THREE.SphereGeometry(.014,16,8),point)
    }
  }
  return [casting,shoulders,cuts,support,bearing,rotor,rotorCuts]
}

export const mechanicalSculptures=[
  {
    id:'investing-markets',title:'Equilibrium',rotation:[.14,-.48,-.085],
    concept:'A sinuous load spine bifurcates into opposing anticlastic lamellae, enclosing two unequal flowing voids. Compound curvature, pinched return edges, integrated rear pressure ribs and incised front contours give the broad cast skins depth. Paired tension bridges connect their open extremities, while tapered fluted counterpoises are seated around the ends of the spine.',
    make:equilibrium,
  },
  {
    id:'miscellaneous',title:'Unfinished Continuum',rotation:[.09,-.64,.06],
    concept:'A broad cast path folds through three planes, returning in front of its own beginning without closing the gap. Eight true through-slots and polished shoulders reveal its construction. A seated three-blade phase rotor turns slowly inside the triangular void, while the exposed end seats leave the continuum open to a further iteration.',
    make:unfinishedContinuum,
  },
]
