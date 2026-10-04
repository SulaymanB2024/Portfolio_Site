import test from 'node:test'
import assert from 'node:assert/strict'
import { createRecordingPlayer, type RecordingMedia, type RecordingState } from '../src/personal/about/recording-player.ts'
import { bassRecordings, DEFAULT_BASS_RECORDING, recordingTime } from '../src/personal/about/bass-recordings.ts'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

class Media extends EventTarget {
  src = ''; currentTime = 0; duration = NaN; paused = true; plays = 0; loads = 0; pauses = 0
  pending: { resolve(): void; reject(): void }[] = []
  play() { this.plays++; this.paused = false; return new Promise<void>((resolve, reject) => this.pending.push({ resolve, reject: () => reject(new Error('Interrupted')) })) }
  pause() { this.pauses++; this.paused = true }
  load() { this.loads++; this.paused = true; this.currentTime = 0; this.duration = NaN }
  removeAttribute(name: string) { if (name === 'src') this.src = '' }
  emit(name: string) { this.dispatchEvent(new Event(name)) }
}
function fixture() {
  const media = new Media(), seen: RecordingState[] = [], sounds: boolean[] = []
  const player = createRecordingPlayer(media as unknown as RecordingMedia, state => seen.push(state), value => sounds.push(value))
  return { media, seen, sounds, player }
}
const tick = () => new Promise<void>(resolve => setImmediate(resolve))

test('recordings stay unloaded and silent until a gesture, then track actual media time', () => {
  const { media, seen, sounds, player } = fixture()
  assert.equal(media.src, ''); assert.equal(media.plays, 0); assert.equal(media.loads, 0)
  player.play('/concert.mp3')
  assert.equal(media.plays, 1)
  assert.equal(seen.at(-1)!.phase, 'loading'); assert.deepEqual(sounds, [])
  media.duration = 351.294; media.emit('loadedmetadata'); media.emit('playing')
  assert.equal(seen.at(-1)!.phase, 'playing'); assert.deepEqual(sounds, [true])
  media.currentTime = 12.4; media.emit('timeupdate')
  assert.equal(seen.at(-1)!.position, 12.4); assert.equal(seen.at(-1)!.duration, 351.294)
  player.dispose()
})

test('pause retains position and seeking clamps within the actual complete recording', () => {
  const { media, seen, sounds, player } = fixture()
  player.play('/concert.mp3'); media.duration = 90; media.emit('playing'); media.currentTime = 32
  player.pause(); assert.equal(seen.at(-1)!.phase, 'paused'); assert.equal(media.currentTime, 32); assert.equal(sounds.at(-1), false)
  player.play('/concert.mp3'); assert.equal(media.currentTime, 32); assert.equal(media.loads, 1)
  player.seek(1000); assert.equal(media.currentTime, 90)
  player.seek(-3); assert.equal(media.currentTime, 0)
  player.seek(NaN); assert.equal(media.currentTime, 0)
  player.dispose()
})

test('native media controls pause feedback and preserve position without stale pause callbacks interrupting a new stream', async () => {
  const { media, seen, sounds, player } = fixture()
  player.play('/first.mp3'); media.duration = 90; media.currentTime = 23.4; media.emit('playing')
  media.pause(); media.emit('pause')
  assert.equal(seen.at(-1)!.phase, 'paused'); assert.equal(seen.at(-1)!.position, 23.4); assert.equal(sounds.at(-1), false)
  media.pending[0].reject(); await tick()
  assert.equal(seen.at(-1)!.phase, 'paused', 'the interrupted play promise cannot turn an external pause into an error')
  player.play('/first.mp3'); assert.equal(media.currentTime, 23.4); assert.equal(media.loads, 1)
  media.emit('pause'); assert.equal(seen.at(-1)!.phase, 'loading', 'a queued old pause is ignored once native playback resumes')
  media.emit('playing'); assert.equal(sounds.at(-1), true)
  player.play('/second.mp3'); media.emit('pause')
  assert.equal(seen.at(-1)!.phase, 'loading'); assert.equal(media.src, '/second.mp3')
  media.emit('playing'); player.stop(); media.emit('pause')
  assert.equal(seen.at(-1)!.phase, 'idle'); assert.equal(sounds.at(-1), false)
  player.dispose()
})

test('stop, switch and dispose invalidate pending play promises and later media callbacks', async () => {
  const { media, seen, sounds, player } = fixture()
  player.play('/first.mp3'); const first = media.pending[0]
  player.stop(); first.reject(); media.emit('playing'); await tick()
  assert.equal(media.src, ''); assert.equal(seen.at(-1)!.phase, 'idle'); assert.equal(sounds.at(-1), false)
  player.play('/first.mp3'); const stale = media.pending[1]
  player.play('/second.mp3'); stale.reject(); await tick()
  assert.equal(media.src, '/second.mp3'); assert.equal(seen.at(-1)!.phase, 'loading')
  media.emit('playing'); assert.equal(seen.at(-1)!.phase, 'playing')
  player.dispose(); const count = seen.length
  media.emit('playing'); media.emit('timeupdate'); media.emit('error'); media.pending[2].reject(); await tick()
  assert.equal(seen.length, count); assert.equal(media.src, ''); assert.equal(sounds.at(-1), false)
})

test('buffering freezes the bow, completion is replayable, and failed loads explicitly retry', async () => {
  const { media, seen, sounds, player } = fixture()
  player.play('/concert.mp3'); media.emit('playing'); media.emit('waiting')
  assert.equal(seen.at(-1)!.phase, 'loading'); assert.equal(sounds.at(-1), false)
  media.emit('playing'); media.currentTime = 90; media.emit('ended')
  assert.equal(seen.at(-1)!.phase, 'ended'); assert.equal(sounds.at(-1), false)
  player.play('/concert.mp3'); assert.equal(media.currentTime, 0)
  media.emit('error'); assert.equal(seen.at(-1)!.phase, 'error')
  const loads = media.loads; player.play('/concert.mp3'); assert.equal(media.loads, loads + 1)
  media.pending[1].reject(); await tick(); assert.equal(seen.at(-1)!.phase, 'loading', 'the failed resource cannot overwrite its retry')
  player.dispose()
})

test('all repertoire choices have intact downloaded performance files and visible rights credits', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/audio/bass-recordings/manifest.json', import.meta.url), 'utf8'))
  assert.equal(DEFAULT_BASS_RECORDING, 'koussevitzky')
  assert.ok(bassRecordings.some(track => track.id === 'bottesini'))
  assert.equal(manifest.recordings.length, bassRecordings.length)
  for (const track of bassRecordings) {
    const item = manifest.recordings.find((entry: { file: string }) => entry.file === track.file)
    assert.ok(item); assert.equal(item.license, track.license); assert.equal(item.performer, track.performer)
    const bytes = await readFile(new URL(`../public/audio/bass-recordings/${track.file}`, import.meta.url))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256)
    assert.equal(bytes.length, item.bytes)
    assert.ok(bytes.toString('ascii', 0, 3) === 'ID3' || bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0, 'ID3 or MPEG frame sync')
    assert.ok(item.durationSeconds > 60 && item.durationSeconds < 600)
    assert.equal(item.channels, 2); assert.equal(item.transformation, 'None. Original MP3 bytes preserved.')
    assert.ok(track.credit.includes(track.performer)); assert.match(track.licenseUrl, /^https:\/\/creativecommons.org\/licenses\//)
  }
  assert.equal(recordingTime(358.536), '5:58'); assert.equal(recordingTime(NaN), '0:00')
})
