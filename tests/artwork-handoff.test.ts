import test from 'node:test'
import assert from 'node:assert/strict'
import { createArtworkHandoffs } from '../src/personal/editorial/artwork-handoff.ts'

function fixture() {
  let factories = 0
  const player = { moves: [] as string[], flying: false, disposals: 0,
    moveTo(host: string) { this.moves.push(host) },
    setTravel(value: boolean) { this.flying = value },
    dispose() { this.disposals++ },
  }
  const manager = createArtworkHandoffs<string, typeof player>()
  const create = () => { factories++; return player }
  return { manager, player, create, factories: () => factories }
}

test('a live drawing survives source unmount and arrives without another renderer', () => {
  const f = fixture(), source = {}, destination = {}
  const player = f.manager.acquire('medusa', source, 'gallery', f.create)
  const flight = f.manager.lift('medusa')!
  player.moveTo('flight')
  f.manager.release('medusa', source, player)
  assert.equal(player.disposals, 0)
  assert.equal(f.manager.acquire('medusa', destination, 'reader', f.create), player)
  assert.deepEqual(player.moves, ['gallery', 'flight'])
  flight.finish()
  assert.deepEqual(player.moves, ['gallery', 'flight', 'reader'])
  assert.equal(f.factories(), 1)
  assert.equal(player.flying, false)
  f.manager.release('medusa', destination, player)
  assert.equal(player.disposals, 1)
})

test('cancelling during preparation restores the original live placement', () => {
  const f = fixture(), source = {}
  f.manager.acquire('medusa', source, 'gallery', f.create)
  const flight = f.manager.lift('medusa')!
  flight.player.moveTo('flight')
  flight.finish(); flight.finish()
  assert.deepEqual(f.player.moves, ['gallery', 'flight', 'gallery'])
  assert.equal(f.player.disposals, 0)
})

test('a route without a destination releases the retained renderer once', () => {
  const f = fixture(), source = {}
  f.manager.acquire('medusa', source, 'gallery', f.create)
  const flight = f.manager.lift('medusa')!
  f.manager.release('medusa', source, f.player)
  flight.finish(); flight.finish()
  assert.equal(f.player.disposals, 1)
  assert.equal(f.manager.get('medusa'), undefined)
})

test('late source cleanup cannot retire an already adopted destination', () => {
  const f = fixture(), source = {}, destination = {}
  f.manager.acquire('medusa', source, 'gallery', f.create)
  const flight = f.manager.lift('medusa')!
  f.manager.acquire('medusa', destination, 'reader', f.create)
  f.manager.release('medusa', source, f.player)
  flight.finish()
  assert.equal(f.player.disposals, 0)
  assert.equal(f.player.moves.at(-1), 'reader')
})

test('an older completion cannot end a newer flight of the same drawing', () => {
  const f = fixture(), owner = {}
  f.manager.acquire('medusa', owner, 'reader', f.create)
  const earlier = f.manager.lift('medusa')!, newer = f.manager.lift('medusa')!
  earlier.finish()
  assert.equal(f.player.flying, true)
  assert.equal(f.player.moves.length, 1)
  newer.finish()
  assert.equal(f.player.flying, false)
  assert.equal(f.player.moves.length, 2)
})

test('normal placements dispose immediately and leave no retained drawing', () => {
  const f = fixture(), owner = {}
  f.manager.acquire('medusa', owner, 'reader', f.create)
  f.manager.release('medusa', owner, f.player)
  assert.equal(f.player.disposals, 1)
  assert.equal(f.manager.get('medusa'), undefined)
})
