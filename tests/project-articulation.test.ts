import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { projectPartAngle, projectPartMotion } from '../src/personal/projects/project-articulation.ts'

function nodes(slug:string, original=false) {
  const bytes=readFileSync(new URL(original?`../public/work-studies/${slug}.glb`:`../public/portfolio-models/work-${slug}.glb`,import.meta.url))
  return JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString()).nodes as {name:string;extras?:Record<string,any>}[]
}

test('the retained gear train conserves tooth phase and keeps its engraving on the driver',()=>{
  const parts=nodes('miscellaneous',true).filter(node=>node.extras?.articulationMotion)
  assert.equal(parts.length,6)
  const driver=parts.find(node=>node.name==='hover-experimental-central-wheel')!
  const engraving=parts.find(node=>node.name==='hover-experimental-wheel-engraving')!
  const driverMotion=projectPartMotion(driver.name,driver.extras!.articulationMotion)!
  for(const seconds of [.25,2.1,16,107,731]) {
    const driverAngle=projectPartAngle(driverMotion,seconds,true)
    for(const part of parts) {
      const motion=projectPartMotion(part.name,part.extras!.articulationMotion)!
      const angle=projectPartAngle(motion,seconds,true)
      const teeth=part.extras!.articulationMotion.teeth
      if(teeth) assert.ok(Math.abs(Math.cos(angle*teeth)-Math.cos(driverAngle*36))<1e-8,`${part.name}: tooth phase`)
      assert.equal(projectPartAngle(motion,seconds,false),0,`${part.name}: reduced motion`)
    }
    assert.equal(projectPartAngle(projectPartMotion(engraving.name,engraving.extras!.articulationMotion)!,seconds,true),driverAngle)
  }
})

test('the actual clock hinge stays bounded and settles under reduced motion',()=>{
  const node=nodes('internshipdeadlines',true).find(node=>node.name==='hover-register-escapement-pendulum')!
  assert.ok(node.extras?.articulationAxis)
  const motion=projectPartMotion(node.name,node.extras!.articulationMotion)!
  assert.equal(motion.kind,'pendulum')
  const angles=Array.from({length:100},(_,i)=>projectPartAngle(motion,i*.073,true))
  assert.ok(Math.min(...angles)<-.08 && Math.max(...angles)>.08)
  assert.ok(angles.every(angle=>Math.abs(angle)<=.09))
  assert.equal(projectPartAngle(motion,19,false),0)
})

test('unsupported, non-finite and oversized shaft records do not start motion',()=>{
  for(const motion of [null,{kind:'other'}, {kind:'continuous',angularVelocity:Infinity,ratio:1}, {kind:'continuous',angularVelocity:.46,ratio:0}, {kind:'continuous',angularVelocity:1,ratio:12}]) {
    assert.equal(projectPartMotion('unknown-part',motion),undefined)
  }
})

test('new authored shafts retain their fitted detail and settle under reduced motion',()=>{
  for(const slug of ['internshipdeadlines','miscellaneous','payrollpro']) {
    const all=nodes(slug)
    const moving=all.filter(node=>node.name.startsWith('hover-'))
    assert.ok(moving.length,`${slug}: missing authored motion`)
    for(const node of moving) {
      const axis=node.extras?.articulationAxis as number[]
      assert.ok(Array.isArray(axis)&&Math.abs(Math.hypot(...axis)-1)<1e-6,`${slug}: invalid local axis`)
      const motion=projectPartMotion(node.name,node.extras?.articulationMotion)
      assert.ok(motion,`${slug}: unsupported declared motion`)
      assert.equal(projectPartAngle(motion,17,false),0)
      assert.notEqual(projectPartAngle(motion,17,true),0)
      // The separately shaded inlays are physical children, not independently
      // animated copies that can drift out of the rotor's carved channels.
      const children=(node as typeof node & {children?:number[]}).children??[]
      assert.ok(children.length,`${slug}: fitted detail must follow its physical parent`)
      for(const child of children) assert.ok(!all[child].name.startsWith('hover-'))
    }
  }
})
