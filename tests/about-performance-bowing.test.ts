import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createBowingTracker } from '../src/personal/about/performance-bowing.ts'
test('performance bow advances with media time and remains still during silence',()=>{
 const tracker=createBowingTracker();tracker.sample(0,.09,true)
 const first=tracker.sample(.05,.09,true);assert.notEqual(first.offset,0);assert.ok(first.energy>0)
 const silent=tracker.sample(.1,0,true);assert.equal(silent.offset,first.offset);assert.equal(silent.energy,0)
})
test('pause and buffering retain bow position without wall-clock drift',()=>{
 const tracker=createBowingTracker();tracker.sample(3,.09,true);const bow=tracker.sample(3.05,.09,true)
 assert.equal(tracker.sample(3.05,.09,false).offset,bow.offset)
 assert.equal(tracker.sample(3.05,.09,false).offset,bow.offset)
 assert.equal(tracker.sample(3.05,.09,true).offset,bow.offset)
})
test('seeking and track reset discard stale stroke direction and accumulated motion',()=>{
 const tracker=createBowingTracker();tracker.sample(0,.09,true);tracker.sample(.1,.09,true)
 assert.equal(tracker.sample(50,.09,true).offset,0)
 tracker.sample(50.05,.09,true);assert.equal(tracker.sample(2,.09,true).offset,0)
 tracker.reset();assert.equal(tracker.sample(0,0,false).offset,0)
})
test('stroke remains inside the physical travel bounds across a long performance',()=>{
 const tracker=createBowingTracker()
 for(let n=0;n<18000;n++){const value=tracker.sample(n/30,.08+.03*Math.sin(n*.04),true);assert.ok(value.offset>=-.18&&value.offset<=.18);assert.ok(value.energy>=0&&value.energy<=1)}
})
