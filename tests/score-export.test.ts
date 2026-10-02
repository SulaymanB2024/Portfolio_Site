import test from 'node:test'
import assert from 'node:assert/strict'
import { exportMidi, exportMusicXml } from '../src/personal/about/score-export.ts'
import type { PhraseNote } from '../src/personal/about/music-phrase.ts'

function parseMidi(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  assert.equal(new TextDecoder().decode(bytes.slice(0, 4)), 'MThd')
  assert.equal(view.getUint32(4), 6)
  assert.equal(view.getUint16(8), 0)
  assert.equal(view.getUint16(10), 1)
  assert.equal(view.getUint16(12), 480)
  assert.equal(new TextDecoder().decode(bytes.slice(14, 18)), 'MTrk')
  assert.equal(view.getUint32(18), bytes.length - 22)
  let cursor = 22, tick = 0
  const events: Array<{ tick: number; status: number; type?: number; data: number[] }> = []
  const quantity = () => {
    let value = 0, count = 0, byte = 0
    do { byte = bytes[cursor++]; value = value * 128 + (byte & 127); assert.ok(++count <= 4) } while (byte & 128)
    return value
  }
  while (cursor < bytes.length) {
    tick += quantity()
    const status = bytes[cursor++]
    assert.ok(status >= 128)
    if (status === 255) {
      const type = bytes[cursor++], count = quantity()
      events.push({ tick, status, type, data: Array.from(bytes.slice(cursor, cursor + count)) }); cursor += count
    } else {
      const count = (status & 240) === 192 ? 1 : 2
      const data = Array.from(bytes.slice(cursor, cursor + count)); cursor += count
      assert.ok(data.every(value => value < 128))
      events.push({ tick, status, data })
    }
  }
  assert.equal(cursor, bytes.length)
  return events
}

test('MIDI preserves exact sounding pitches, note lengths, rests, tempo and final silent duration', () => {
  const notes: PhraseNote[] = [{ midi: null, beats: .25 }, { midi: 28, beats: .5 }, { midi: null, beats: 1 }, { midi: 55, beats: 2 }, { midi: null, beats: 4 }]
  const events = parseMidi(exportMidi(notes, { title: 'A small & quiet piece', tempo: 120 }))
  assert.deepEqual(events.filter(event => event.status === 144 || event.status === 128).map(event => [event.tick, event.status, event.data[0]]), [[120, 144, 28], [360, 128, 28], [840, 144, 55], [1800, 128, 55]])
  assert.deepEqual(events.find(event => event.type === 81)!.data, [7, 161, 32])
  assert.deepEqual(events.find(event => event.type === 88)!.data, [4, 2, 24, 8])
  assert.deepEqual(events.find(event => event.status === 192)!.data, [43])
  assert.equal(new TextDecoder().decode(Uint8Array.from(events.find(event => event.type === 3)!.data)), 'A small & quiet piece')
  assert.equal(events.at(-1)!.type, 47)
  assert.equal(events.at(-1)!.tick, 3720)
})

test('MIDI releases a repeated pitch before retriggering it at the same tick', () => {
  const events = parseMidi(exportMidi([{ midi: 43, beats: 1 }, { midi: 43, beats: 1 }]))
  assert.deepEqual(events.filter(event => event.tick === 480).map(event => event.status), [128, 144])
  assert.equal(events.at(-1)!.tick, 960)
})

test('full-capacity and all-rest MIDI exports retain the entire piece without dummy notes', () => {
  const notes = Array.from({ length: 64 }, (_, index) => ({ midi: index % 2 ? null : 28, beats: 2 }))
  const events = parseMidi(exportMidi(notes, { tempo: 40, title: 'Étude ♯1' }))
  assert.equal(events.filter(event => event.status === 144).length, 32)
  assert.equal(events.at(-1)!.tick, 61440)
  const rests = parseMidi(exportMidi([{ midi: null, beats: 4 }, { midi: null, beats: 4 }]))
  assert.ok(rests.every(event => event.status !== 144 && event.status !== 128))
  assert.equal(rests.at(-1)!.tick, 3840)
  assert.equal(parseMidi(exportMidi([])).at(-1)!.tick, 0)
})

test('MusicXML escapes titles, writes contrabass pitches correctly, and preserves all rhythmic values', () => {
  const xml = exportMusicXml([{ midi: 28, beats: .25 }, { midi: 42, beats: .5 }, { midi: null, beats: 1 }, { midi: 41, beats: 2 }, { midi: null, beats: 4 }], { title: '<Etude & "echo">\u0001', tempo: 96 })
  assert.match(xml, /<work-title>&lt;Etude &amp; &quot;echo&quot;&gt;<\/work-title>/)
  assert.ok(!xml.includes('\u0001'))
  assert.match(xml, /<clef><sign>F<\/sign><line>4<\/line><\/clef>/)
  assert.match(xml, /<transpose><diatonic>0<\/diatonic><chromatic>0<\/chromatic><octave-change>-1<\/octave-change><\/transpose>/)
  assert.match(xml, /<pitch><step>E<\/step><octave>2<\/octave><\/pitch><duration>1<\/duration>/)
  assert.match(xml, /<pitch><step>F<\/step><alter>1<\/alter><octave>3<\/octave><\/pitch>/)
  assert.match(xml, /<accidental>sharp<\/accidental>/)
  assert.match(xml, /<accidental>natural<\/accidental>/)
  assert.match(xml, /<sound tempo="96"\/>/)
  assert.match(xml, /<midi-program>44<\/midi-program>/)
  const durations = [...xml.matchAll(/<duration>(\d+)<\/duration>/g)].map(match => Number(match[1]))
  assert.equal(durations.reduce((sum, value) => sum + value, 0), 31)
  assert.ok(xml.includes('<type>16th</type>') && xml.includes('<type>eighth</type>') && xml.includes('<type>half</type>'))
})

test('MusicXML ties written fragments across bars without rearticulating or tying rests', () => {
  const xml = exportMusicXml([{ midi: null, beats: 2 }, { midi: null, beats: 1 }, { midi: null, beats: .5 }, { midi: 33, beats: 4 }])
  const notes = [...xml.matchAll(/<note>(.*?)<\/note>/g)].map(match => match[1])
  const pitched = notes.filter(note => note.includes('<pitch>'))
  assert.deepEqual(pitched.map(note => Number(note.match(/<duration>(\d+)<\/duration>/)![1])), [2, 8, 4, 2])
  assert.equal(pitched.filter(note => note.includes('<tie type="start"/>')).length, 3)
  assert.equal(pitched.filter(note => note.includes('<tie type="stop"/>')).length, 3)
  assert.equal(pitched.filter(note => note.includes('<tied type="start"/>')).length, 3)
  assert.equal(pitched.filter(note => note.includes('<tied type="stop"/>')).length, 3)
  assert.ok(notes.filter(note => note.includes('<rest/>')).every(note => !note.includes('<tie ')))
  assert.match(xml, /<measure number="2" implicit="yes">/)
})

test('MusicXML keeps all 32 bars and encodes the same eight-measure page structure', () => {
  const xml = exportMusicXml(Array.from({ length: 64 }, () => ({ midi: 43, beats: 2 })))
  assert.equal([...xml.matchAll(/<measure /g)].length, 32)
  assert.equal([...xml.matchAll(/<print new-page="yes"\/>/g)].length, 3)
  assert.equal([...xml.matchAll(/<print new-system="yes"\/>/g)].length, 12)
  assert.equal([...xml.matchAll(/<duration>/g)].length, 64)
  assert.match(exportMusicXml([]), /<measure number="1" implicit="yes">/)
  assert.throws(() => exportMidi([{ midi: 75, beats: 1 }]), RangeError)
  assert.throws(() => exportMusicXml([{ midi: null, beats: .75 }]), RangeError)
})
