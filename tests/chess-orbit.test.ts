import test from 'node:test'
import assert from 'node:assert/strict'
import { turnChessOrbit, chessOrbitTarget, chessDragIntent } from '../src/personal/about/chess-orbit.ts'
import { settleInterestView } from '../src/personal/about/interest-motion.ts'

test('board keeps turning through a full circle and multiple revolutions in both directions', () => {
  for (const direction of [-1, 1]) {
    let control = { yaw: 0, pitch: 0 }, view = { yaw: -.22, pitch: .67 }
    for (let i = 0; i < 200; i++) {
      control = turnChessOrbit(control, direction * .08, 0)
      settleInterestView(view, chessOrbitTarget(-.22 + control.yaw, view.yaw), .67, .1)
    }
    assert.ok(direction * control.yaw > Math.PI * 4)
    assert.ok(direction * (view.yaw + .22) > Math.PI * 4, 'the displayed view follows the turns, not only the input accumulator')
    assert.equal(control.pitch, 0)
  }
})

test('tilt reaches overhead and near edge-on, without inverting the board', () => {
  const top = turnChessOrbit({yaw:0,pitch:0},0,9)
  const edge = turnChessOrbit(top,0,-9)
  assert.ok(.67 + top.pitch > 1.5 && .67 + top.pitch < Math.PI / 2)
  assert.ok(.67 + edge.pitch > 0 && .67 + edge.pitch < .1)
  assert.deepEqual(turnChessOrbit(edge,NaN,Infinity),edge)
})

test('reset after many turns takes the shortest route and preserves equivalent orientation', () => {
  for (const current of [-21, -Math.PI-.1, Math.PI+.1, 21]) {
    const target = chessOrbitTarget(-.22,current)
    assert.ok(Math.abs(target-current) <= Math.PI)
    assert.ok(Math.abs(Math.cos(target)-Math.cos(-.22)) < 1e-10)
    assert.ok(Math.abs(Math.sin(target)-Math.sin(-.22)) < 1e-10)
  }
})

test('vertical touch turns the live board while gallery objects retain page scroll', () => {
  assert.equal(chessDragIntent('touch',true,1,70),'horizontal')
  assert.equal(chessDragIntent('touch',false,1,70),'vertical')
  assert.equal(chessDragIntent('touch',false,70,1),'horizontal')
  assert.equal(chessDragIntent('mouse',false,1,70),'horizontal')
})
