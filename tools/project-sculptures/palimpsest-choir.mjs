/** Time, mapping and counterfactuals: three original, deliberately different forms. */
import { group, put, machinedRing, vec, TAU, jewel } from '../work-models/geometry.mjs'
import { THREE, thickSurface, pipe, seam, sampleCurve } from './parametric.mjs'

function temporalAperture() {
  const ivory=group('Thirty-one lifted intervals','porcelain'),metal=group('Milled interval shoulders','silver')
  const shadow=group('Cut registers and recessed seams','steel'),body=group('Open spiral spine','pewter')
  // A growing, interrupted fan: every interval has a sculpted face and a visible gap.
  for(let i=0;i<31;i++) {
    const a=-2.52+i/30*5.10,outer=.68+.34*i/30,span=.104+.027*i/30
    const sheet=(u,v)=>{
      const r=.255+u*(outer-.255),angle=a+(v-.5)*span*(.78+.22*u)
      return vec(Math.cos(angle)*r,Math.sin(angle)*r,.07+.29*u*u+.12*Math.sin(angle*1.6)+.07*Math.sin(v*Math.PI))
    }
    thickSurface(i%4===0?body:ivory,sheet,36,5,.035)
    seam(metal,sheet,.05,.006,36,.06,.95,.022)
    seam(metal,sheet,.95,.006,36,.06,.95,.022)
    if(i%3===0) for(const v of [.34,.65]) seam(shadow,sheet,v,.004,28,.55,.96,.024)
  }
  // A cut spiral has a beginning and an end; it is not a closed clock bezel.
  const spine=t=>{const a=-2.66+t*5.45,r=.205+t*.033;return vec(Math.cos(a)*r,Math.sin(a)*r,-.015+.12*Math.sin(a*1.6))}
  pipe(body,sampleCurve(spine,70),.034,100,12)
  pipe(metal,sampleCurve(t=>spine(t).add(vec(0,0,.033)),70),.006,100,6)
  const rotor=group('hover-temporal-index','silver',vec(0,0,-.03),vec(0,0,1))
  rotor.motion={kind:'continuous',angularVelocity:.085,ratio:1}
  const cuts=group('Index cuts','steel',rotor.pivot.clone(),rotor.axis.clone());cuts.parent=rotor.name
  const rotorSheet=(u,v)=>{
    const a=-2.1+u*4.6,r=.073+v*(.17+.017*Math.sin(a*3))
    return vec(Math.cos(a)*r,Math.sin(a)*r,.055+.04*Math.cos(a))
  }
  thickSurface(rotor,rotorSheet,84,5,.038)
  for(let i=0;i<17;i++) {
    const a=-2+i/16*4.3
    pipe(cuts,[vec(Math.cos(a)*.136,Math.sin(a)*.136,.109),vec(Math.cos(a)*.169,Math.sin(a)*.169,.109)],.004,2,6)
  }
  // The lower fold finishes with nested ribs rather than a decorative pedestal.
  for(let k=0;k<5;k++) pipe(body,[vec(-.07-k*.05,-.25,-.02),vec(-.16-k*.045,-.43,-.05-k*.04),vec(-.03-k*.036,-.64,-.06-k*.04),vec(.18-k*.035,-.74,-.09)],.014+k*.001,40,8)
  return [ivory,metal,shadow,body,rotor,cuts]
}

function palimpsest() {
  const skin=group('Lifted topographic strata','porcelain'),edge=group('Strata shoulders','silver')
  const engraved=group('Contour relief','steel'),connectors=group('Archive spine and sutures','pewter')
  // Seven open annular maps rise into an uneven saddle. The central wound and
  // the missing wedge let light pass through every layer, from front to rear.
  const surfaces=[]
  for(let k=0;k<7;k++) {
    const sheet=(u,v)=>{
      const a=-2.63+u*5.42+.038*k,inner=.37+.04*Math.sin(a*2+.35*k)
      const r=inner+v*(.86+.065*Math.sin(a*3+.25*k)-inner)
      return vec(r*Math.cos(a),-.53+k*.15+.38*Math.sin(a)*r+.23*Math.cos(a*2+.3*k)*v*v,r*Math.sin(a)*.66+.10*k/6*Math.cos(a))
    }
    surfaces.push(sheet);thickSurface(k%3===0?edge:skin,sheet,108,9,.026)
    for(const v of [.08,.32,.59,.88]) seam(engraved,sheet,v,.0045,85,.03,.97,.020)
    seam(edge,sheet,.98,.009,108,.01,.99,.018)
  }
  // Each layer terminates into a fitted transverse rib; no disconnected lines.
  for(const u of [.04,.97]) {
    for(const v of [.15,.83]) pipe(connectors,surfaces.map(s=>s(u,v)),.017,32,8)
  }
  for(let k=0;k<6;k++) {
    const s=surfaces[k]
    for(let j=0;j<3;j++) {
      const u=.12+j*.35,p=s(u,.94),q=surfaces[k+1](u,.94)
      pipe(connectors,[p,q],.008,3,6)
    }
  }
  return [skin,edge,engraved,connectors]
}

function counterfactualChoir() {
  const body=group('Three counterfactual vessels','pewter'),porcelain=group('Split inner membranes','porcelain')
  const highlights=group('Sculpted lip and filament relief','silver'),dark=group('Recessed inner ribs','steel')
  const stations=[{x:-.60,h:1.23,lean:-.20,depth:-.16,phase:.3},{x:.02,h:1.67,lean:.13,depth:.13,phase:1.8},{x:.63,h:1.12,lean:.28,depth:-.06,phase:3.1}]
  for(const [index,s] of stations.entries()) {
    // Each vessel is an open, swollen seed shell with a narrow rooted throat.
    // Unequal halves expose the interior and frame the alternative beside it.
    for(const side of [-1,1]) {
      const sheet=(u,v)=>{
        const fullness=.035+.34*Math.pow(Math.sin(Math.PI*u),.82)
        const a=side*1.42+(v-.5)*1.68+.20*Math.sin(u*Math.PI+s.phase)
        return vec(s.x+s.lean*u+fullness*Math.sin(a),-.82+s.h*u+.018*Math.sin(v*Math.PI),s.depth+fullness*Math.cos(a)*.86+.09*Math.sin(u*Math.PI+s.phase))
      }
      thickSurface(side===1?porcelain:body,sheet,90,12,.028)
      for(const v of [.05,.94]) seam(highlights,sheet,v,.009,82,.015,.985,.022)
      // Relief ribs fan out from the common throat and meet the open crown.
      for(const v of [.22,.39,.57,.76]) seam(side===1?dark:highlights,sheet,v,.006,80,.09,.94,.024)
    }
    const stem=t=>vec(s.x+s.lean*t,-.82+s.h*t,s.depth+.09*Math.sin(t*Math.PI+s.phase))
    pipe(highlights,sampleCurve(stem,30),t=>.018+.009*Math.sin(t*Math.PI),60,10)
    // Fitted branching terminals sit inside each vessel instead of floating beads.
    for(let j=0;j<5;j++) {
      const t=.35+j*.1,p=stem(t),side=j%2?-1:1
      const q=p.clone().add(vec(side*.14,.04,.14*Math.sin(j*1.3+s.phase)))
      pipe(dark,[p,p.clone().lerp(q,.65).add(vec(0,.07,0)),q],.012,20,8)
      jewel(highlights,q,.039,1,[1,.78,1])
    }
  }
  // Three braided roots share one origin, then diverge into different vessels.
  for(const [i,s]of stations.entries()) {
    const start=vec(.07,-.98,.06),end=vec(s.x,-.81,s.depth)
    pipe(body,[start,start.clone().add(vec(-.11+i*.1,.04,-.1)),end],t=>.021+.011*Math.sin(t*Math.PI),48,10)
  }
  return [body,porcelain,highlights,dark]
}

export const conceptualSculptures=[
  {id:'internshipdeadlines',title:'Temporal aperture',concept:'Thirty-one lifted intervals fan around an interrupted spiral. A slow, open index moves within the central wound: timing as an opening rather than a clock face.',rotation:[.12,-.15,-.12],make:temporalAperture},
  {id:'atlas',title:'Palimpsest',concept:'Seven pierced topographic strata rise into an uneven saddle and share one stitched archive spine. Open contour membranes express the layering and retrieval of a research atlas.',rotation:[.56,-.14,-.05],make:palimpsest},
  {id:'sapien',title:'Counterfactual choir',concept:'Three unequal, split seed vessels grow from a shared braided root. Internal branching filaments expose different possible responses within one common structure.',rotation:[.08,-.13,.035],make:counterfactualChoir},
]
