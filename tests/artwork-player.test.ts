import test from 'node:test'
import assert from 'node:assert/strict'
import { artworkPlayers, createArtworkPlayer } from '../src/personal/editorial/artwork-player.ts'
import { artworkPlayers as registry } from '../src/personal/editorial/artwork-players.ts'
import type { GenerativeArtwork, P5SketchFactory } from '../src/personal/editorial/generative/types.ts'

async function settle() { for (let turn = 0; turn < 8; turn++) await Promise.resolve() }

function fixture(mobile = false) {
  const descriptors = new Map<string, PropertyDescriptor | undefined>()
  const pending = new Map<number, (time: number) => void>()
  const timers = new Map<number, { at: number; callback: () => void }>()
  const documentEvents = new Map<string, Set<() => void>>()
  const windowEvents = new Map<string, Set<() => void>>()
  const mediaEvents = new Set<() => void>()
  const canvases: FakeCanvas[] = []
  const phases: number[] = []
  let time = 0, nextFrame = 1, loads = 0, setups = 0
  let resolve!: (module: { default: P5SketchFactory }) => void
  const loading = new Promise<{ default: P5SketchFactory }>(success => { resolve = success })
  class FakeNode {
    ownerDocument = document
    style = { width: '', height: '' }
    children: FakeNode[] = []
    parent: FakeNode | null = null
    appendChild(node: FakeNode) { node.remove(); node.parent = this; this.children.push(node) }
    replaceChildren(...nodes: FakeNode[]) { for (const node of [...this.children]) node.remove(); for (const node of nodes) this.appendChild(node) }
    remove() { if (this.parent) { this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null } }
    setAttribute() {}
  }
  class FakeCanvas extends FakeNode {
    width = 300; height = 150
    getContext() { return { setTransform() {} } }
  }
  const document = {
    hidden: false,
    createElement(tag: string) { const node = tag === 'canvas' ? new FakeCanvas() : new FakeNode(); if (node instanceof FakeCanvas) canvases.push(node); return node },
    addEventListener(name: string, callback: () => void) { const listeners = documentEvents.get(name) ?? new Set(); listeners.add(callback); documentEvents.set(name, listeners) },
    removeEventListener(name: string, callback: () => void) { documentEvents.get(name)?.delete(callback) },
  }
  const media = {
    matches: false,
    addEventListener(_name: string, callback: () => void) { mediaEvents.add(callback) },
    removeEventListener(_name: string, callback: () => void) { mediaEvents.delete(callback) },
  }
  function install(name: string, value: unknown) { descriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name)); Object.defineProperty(globalThis, name, { configurable: true, writable: true, value }) }
  install('document', document)
  install('matchMedia', () => media)
  install('performance', { now: () => time })
  install('requestAnimationFrame', (callback: (time: number) => void) => { const id = nextFrame++; pending.set(id, callback); return id })
  install('cancelAnimationFrame', (id: number) => pending.delete(id))
  install('setTimeout', (callback: () => void, delay: number) => { const id = nextFrame++; timers.set(id, { at: time + delay, callback }); return id })
  install('clearTimeout', (id: number) => timers.delete(id))
  install('window', {
    innerWidth: mobile ? 390 : 1280, innerHeight: 844,
    matchMedia: (query: string) => query === '(pointer: coarse)' ? { matches: mobile } : media,
    setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout,
    addEventListener(name: string, callback: () => void) { const listeners = windowEvents.get(name) ?? new Set(); listeners.add(callback); windowEvents.set(name, listeners) },
    removeEventListener(name: string, callback: () => void) { windowEvents.get(name)?.delete(callback) },
  })
  const source: P5SketchFactory = instance => { setups++; let phase = 0; instance.createCanvas(400, 400); instance.draw = () => phases.push(++phase) }
  const artwork = { sketchId: 'yuru-01', factory() { loads++; return loading } } as GenerativeArtwork
  return { artwork, document, media, pending, timers, canvases, phases, documentEvents, mediaEvents, windowEvents,
    host: () => new FakeNode() as unknown as HTMLElement,
    get loads() { return loads }, get setups() { return setups },
    resolve(factory = source) { resolve({ default: factory }) },
    step(now: number) {
      time = now
      for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.callback() }
      const next = pending.entries().next().value
      if (next) { pending.delete(next[0]); next[1](now) }
    },
    hidden(value: boolean) { document.hidden = value; for (const callback of documentEvents.get('visibilitychange') ?? []) callback() },
    scroll() { for (const callback of windowEvents.get('scroll') ?? []) callback() },
    reduced(value: boolean) { media.matches = value; for (const callback of mediaEvents) callback() },
    restore() { for (const [name, descriptor] of descriptors) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else Reflect.deleteProperty(globalThis, name) } },
  }
}

test('native lazy imports defer setup while offscreen/paused and resume one retained drawing without phase reset', async t => {
  const f = fixture(), player = createArtworkPlayer(f.artwork, 240)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); assert.equal(f.loads, 1)
  player.setVisible(false); f.resolve(); await settle()
  assert.equal(f.setups, 0); assert.equal(f.canvases.length, 0); assert.equal(f.pending.size, 0)
  player.setPlayback(true, true)
  assert.equal(f.setups, 0); assert.equal(player.status.painted, false, 'the existing static poster stays ready for a first paused entry')
  player.setPlayback(true, false)
  assert.equal(f.setups, 1); assert.equal(f.canvases.length, 1); assert.equal(f.pending.size, 1)
  f.step(0); assert.deepEqual(f.phases, [1]); assert.equal(player.status.painted, true)
  player.setPlayback(true, true)
  assert.equal(f.pending.size, 0); assert.equal(player.status.active, false); assert.equal(player.status.stats.frames, 1)
  assert.equal(player.status.painted, true, 'later pause retains its painted canvas')
  player.setPlayback(true, false); f.step(1000)
  assert.equal(f.setups, 1); assert.deepEqual(f.phases, [1, 2]); assert.equal(player.status.stats.frames, 2)
})

test('hidden and reduced-motion imports stay inert, and disposal rejects both cached and unresolved factories', async t => {
  const f = fixture(), player = createArtworkPlayer(f.artwork, 240)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); f.hidden(true); await settle(); f.resolve(); await settle()
  assert.equal(f.setups, 0); assert.equal(f.pending.size, 0)
  f.reduced(true); f.hidden(false)
  assert.equal(f.setups, 0); assert.equal(player.status.active, false)
  player.dispose(); f.reduced(false); player.setPlayback(true, false)
  assert.equal(f.setups, 0); assert.equal(f.pending.size, 0)
  assert.equal(f.documentEvents.get('visibilitychange')?.size, 0); assert.equal(f.mediaEvents.size, 0)
  const late = createArtworkPlayer(f.artwork, 240); late.setPlayback(true, false); late.dispose(); await settle()
  assert.equal(f.setups, 0); assert.equal(f.pending.size, 0)
})

test('the lightweight registry lends the same live surface through route unmount and preserves paused travel', async t => {
  const f = fixture()
  assert.equal(artworkPlayers, registry)
  const owner = {}, destinationOwner = {}, host = f.host(), destination = f.host(), overlay = f.host()
  const player = registry.acquire('test-live-runtime', owner, host, () => createArtworkPlayer(f.artwork, 240))
  t.after(() => { registry.dispose(); player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); f.resolve(); await settle(); f.step(0)
  const canvas = f.canvases[0]
  const flight = registry.lift('test-live-runtime')!
  player.moveTo(overlay)
  registry.release('test-live-runtime', owner, player)
  f.step(100); assert.deepEqual(f.phases, [1, 2], 'route unmount must keep traveling artwork live')
  const adopted = registry.acquire('test-live-runtime', destinationOwner, destination, () => assert.fail('a flight must not recreate its player'))
  assert.equal(adopted, player); flight.finish(); assert.equal(f.canvases[0], canvas)
  player.setPlayback(true, true)
  const pausedFlight = registry.lift('test-live-runtime')!
  registry.release('test-live-runtime', destinationOwner, player)
  f.step(200); assert.deepEqual(f.phases, [1, 2]); assert.equal(f.pending.size, 0)
  pausedFlight.finish()
  assert.equal(registry.get('test-live-runtime'), undefined)
  assert.deepEqual([canvas.width, canvas.height], [0, 0])
})

test('failed native setup reports fallback and releases its canvas without leaving callbacks or active state', async t => {
  const f = fixture(), player = createArtworkPlayer(f.artwork, 240)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); f.resolve(() => { throw new Error('factory failure') }); await settle()
  assert.equal(player.status.failed, true); assert.equal(player.status.active, false); assert.equal(f.pending.size, 0)
  assert.equal(f.canvases.length, 1); assert.deepEqual([f.canvases[0].width, f.canvases[0].height], [0, 0])
  player.setPlayback(true, false); assert.equal(f.canvases.length, 1)
})

test('an unresolved native import completing after route disposal cannot allocate a renderer or revive listeners', async t => {
  const f = fixture(), player = createArtworkPlayer(f.artwork, 240)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); assert.equal(f.loads, 1)
  player.dispose(); f.resolve(); await settle()
  assert.equal(f.setups, 0); assert.equal(f.canvases.length, 0); assert.equal(f.pending.size + f.timers.size, 0)
  assert.equal(f.documentEvents.get('visibilitychange')?.size, 0); assert.equal(f.mediaEvents.size, 0)
})

test('mobile native playback caps frames and resumes the retained phase160ms after the final scroll', async t => {
  const f = fixture(true), player = createArtworkPlayer(f.artwork, 400)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); f.resolve(); await settle(); f.step(0)
  assert.equal(player.status.stats.targetFps, 12); assert.deepEqual(f.phases, [1])
  assert.deepEqual([f.canvases[0].width, f.canvases[0].height], [400, 400])
  f.scroll(); assert.equal(player.status.active, false); assert.equal(f.pending.size, 0)
  f.step(159); assert.deepEqual(f.phases, [1])
  f.scroll(); f.step(318); assert.deepEqual(f.phases, [1]); assert.equal(player.status.active, false)
  f.step(319); assert.deepEqual(f.phases, [1, 2]); assert.equal(player.status.active, true)
  assert.equal(f.setups, 1); assert.equal(f.canvases.length, 1)
})

test('scroll quiet periods cannot undo user pause, hidden state, or paused travel', async t => {
  const f = fixture(true), player = createArtworkPlayer(f.artwork, 400)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); f.resolve(); await settle(); f.step(0)
  f.scroll(); player.setPlayback(true, true); f.step(160)
  assert.equal(player.status.active, false); assert.deepEqual(f.phases, [1])
  player.setTravel(true); player.setPlayback(false, false); f.scroll(); f.step(320)
  assert.equal(player.status.active, false, 'travel must retain its explicit paused preference')
  player.setTravel(false); player.setPlayback(true, false); f.step(400)
  assert.deepEqual(f.phases, [1, 2])
  f.scroll(); f.hidden(true)
  assert.equal(f.timers.size + f.pending.size, 0)
  f.step(1000); assert.deepEqual(f.phases, [1, 2])
  f.hidden(false); f.step(1001)
  assert.deepEqual(f.phases, [1, 2, 3]); assert.equal(f.setups, 1)
})

test('mobile disposal removes the scroll listener and pending quiet-period timer', async t => {
  const f = fixture(true), player = createArtworkPlayer(f.artwork, 400)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); f.resolve(); await settle(); f.step(0)
  f.scroll(); assert.equal(f.timers.size, 1); assert.equal(f.windowEvents.get('scroll')?.size, 1)
  player.dispose(); f.scroll(); f.step(1000)
  assert.equal(f.windowEvents.get('scroll')?.size, 0)
  assert.equal(f.timers.size + f.pending.size, 0); assert.deepEqual(f.phases, [1])
})

test('desktop playback retains its native profile without subscribing to scroll pauses', async t => {
  const f = fixture(), player = createArtworkPlayer(f.artwork, 400)
  t.after(() => { player.dispose(); f.restore() })
  player.setPlayback(true, false); await settle(); f.resolve(); await settle(); f.step(0)
  assert.equal(player.status.stats.targetFps, 18); assert.equal(f.windowEvents.get('scroll')?.size ?? 0, 0)
  f.scroll(); assert.equal(player.status.active, true); f.step(60)
  assert.deepEqual(f.phases, [1, 2]); assert.equal(f.setups, 1)
})
