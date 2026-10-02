import test from 'node:test'
import assert from 'node:assert/strict'
import { allKnightChallenges,challengeRoute,advanceChallenge,challengeResult } from '../src/personal/about/knight-puzzle.ts'
test('advanced hints collect every checkpoint and avoid blocked squares within budget',()=>{
  for(const challenge of allKnightChallenges){
    let path=[challenge.start];const route=challengeRoute(path,challenge)
    assert.equal(route.length-1,challenge.limit,challenge.id)
    for(const square of route.slice(1)){path=advanceChallenge(path,square,challenge);assert.ok(!challenge.blocked?.includes(square))}
    assert.equal(challengeResult(path,challenge),'solved')
    assert.deepEqual(advanceChallenge(path,'b3',challenge),path)
  }
})
test('the finish alone does not solve a checkpoint mission and illegal targets do not advance',()=>{
  const challenge=allKnightChallenges.find(item=>item.id==='checkpoints')!
  assert.equal(challengeResult(['a1','h8'],challenge),'playing')
  const detour=allKnightChallenges.find(item=>item.id==='detour')!
  assert.deepEqual(advanceChallenge(['a1','b3'],'d4',detour),['a1','b3'])
  const route=challengeRoute(['a1','b3','c5','c4'],challenge)
  assert.ok(route.includes('f6'));assert.equal(route.at(-1),'h8')
})
