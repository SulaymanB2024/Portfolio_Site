import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { bassExcerptSchedule, bassRepertoire, DEFAULT_BASS_EXCERPT, type BassExcerpt } from '../src/personal/about/bass-repertoire.ts'
import { bassSoloSamples } from '../src/personal/about/bass-solo-samples.ts'
import { resolveBassSoloSample } from '../src/personal/about/interest-audio.ts'

const excerpt = (id: string) => bassRepertoire.find(item => item.id === id)!
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`)
const soundingMidi = (frequency: number | null) => frequency === null ? null : Math.round(69 + 12 * Math.log2(frequency / 440))

test('Koussevitzky defaults to the source-checked Alla breve theme in solo tuning', () => {
  assert.equal(DEFAULT_BASS_EXCERPT, 'koussevitzky')
  const score = excerpt(DEFAULT_BASS_EXCERPT)
  assert.match(score.passage, /Alla breve/)
  const events = bassExcerptSchedule(score)
  assert.deepEqual(events.slice(0, 6).map(event => soundingMidi(event.frequency)), [54, null, 54, 54, 56, 57])
  near(events[1].delay, 1.5) // Dotted half followed by a quarter rest.
  near(events[3].delay, 3.5)
  near(events[5].delay + events[5].duration, 4) // Three triplets complete bar 2.
  const tied = events.find(event => Math.abs(event.delay - 5) < 1e-9)!
  near(tied.duration, 1.5) // One attack crosses the barline at 6 seconds.
  assert.ok(!events.some(event => Math.abs(event.delay - 6) < 1e-9))
  near(events.at(-1)!.delay + events.at(-1)!.duration, 8)
})

test('Bottesini retains the B-minor manuscript register and expressive grace timing', () => {
  const score = excerpt('bottesini')
  const events = bassExcerptSchedule(score)
  assert.deepEqual(events.slice(0, 6).map(event => soundingMidi(event.frequency)), [54, 56, 58, 59, 61, 62])
  near(events[0].duration, 1.75) // Half tied to the first triplet eighth.
  near(events[6].delay, 3)
  near(events[10].delay, 5.15625)
  near(events[10].duration, .046875)
  near(events[11].duration, .046875)
  near(events[12].delay, 5.25) // Grace time does not push the landing off beat 4.
  assert.equal(soundingMidi(events[12].frequency), 53)
  assert.equal(score.spellings?.[53], 'E♯3')
  near(events.at(-1)!.delay + events.at(-1)!.duration, 12)
})

test('The Elephant retains eight complete 3/8 bars and its sounding bass octave', () => {
  const score = excerpt('saint-saens')
  const events = bassExcerptSchedule(score)
  assert.deepEqual(events.slice(0, 3).map(event => soundingMidi(event.frequency)), [34, 39, 39])
  const barStarts = [0, 3, 8, 11, 13, 17, 21, 25]
  barStarts.forEach((event, bar) => near(events[event].delay, bar * .9375))
  near(events.at(-1)!.delay + events.at(-1)!.duration, 7.5)
  assert.equal(score.spellings?.[34], 'B♭1')
})

test('solo schedules reject invalid register, rhythm, tempo and unbounded pieces', () => {
  const base = excerpt('koussevitzky')
  const invalid: Partial<BassExcerpt>[] = [
    { tempo: 0 }, { tempo: NaN }, { notes: [] },
    { notes: [{ midi: 63, beats: 1 }] }, { notes: [{ midi: 27, beats: 1 }] },
    { notes: [{ midi: 54.5, beats: 1 }] }, { notes: [{ midi: 54, beats: 0 }] },
    { notes: [{ midi: null, beats: Infinity }] },
    { notes: Array.from({ length: 65 }, () => ({ midi: 54, beats: 1 })) },
    { tempo: 40, notes: Array.from({ length: 11 }, () => ({ midi: 54, beats: 8 })) },
  ]
  invalid.forEach(change => assert.throws(() => bassExcerptSchedule({ ...base, ...change }), RangeError))
})

test('the added upper-register recordings are audible PCM with pinned CC0 provenance', async () => {
  const directory = new URL('../public/audio/double-bass/', import.meta.url)
  const manifest = JSON.parse(await readFile(new URL('solo-manifest.json', directory), 'utf8'))
  assert.equal(manifest.license, 'CC0-1.0')
  assert.equal(manifest.sourceCommit, '440300901dfe9275fd84e0b7763af1f8443ae62e')
  assert.equal(manifest.samples.length, 2)
  let total = 0
  for (const sample of manifest.samples) {
    const runtime = bassSoloSamples.find(item => item.file === sample.file)!
    assert.ok(runtime)
    assert.equal(runtime.midi, sample.soundingMidi)
    assert.equal(runtime.frequency, sample.measuredHz)
    const bytes = await readFile(new URL(sample.file, directory))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), sample.sha256)
    assert.match(sample.sourceUrl, /^https:\/\/raw\.githubusercontent\.com\/sgossner\/VSCO-2-CE\/440300901dfe9275fd84e0b7763af1f8443ae62e\//)
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF')
    assert.equal(bytes.toString('ascii', 8, 16), 'WAVEfmt ')
    assert.equal(bytes.readUInt16LE(20), 1)
    assert.equal(bytes.readUInt16LE(22), 1)
    assert.equal(bytes.readUInt32LE(24), 44100)
    assert.equal(bytes.readUInt16LE(34), 16)
    assert.equal(bytes.readUInt32LE(40), bytes.length - 44)
    let peak = 0, squared = 0
    for (let offset = 44; offset < bytes.length; offset += 2) {
      const value = bytes.readInt16LE(offset) / 32768
      peak = Math.max(peak, Math.abs(value)); squared += value * value
    }
    assert.ok(peak > .5 && peak <= .751)
    assert.ok(Math.sqrt(squared / ((bytes.length - 44) / 2)) > .005)
    assert.ok(sample.pitchCorrelation > .9 && Math.abs(sample.tuningCents) < 10)
    total += bytes.length
  }
  assert.equal(total, manifest.totalBytes)
  assert.ok(total < 600000)
  for (let midi = 28; midi <= 62; midi++) {
    const frequency = 440 * 2 ** ((midi - 69) / 12)
    const resolved = resolveBassSoloSample(frequency)
    assert.ok(Math.abs(12 * Math.log2(resolved.playbackRate)) < 3.1)
    near(resolved.sample.frequency * resolved.playbackRate, frequency)
  }
})
