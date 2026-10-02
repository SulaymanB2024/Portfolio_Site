import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { bassSamples } from '../src/personal/about/double-bass-samples.ts'
import { prepareSustainLoop } from '../src/personal/about/interest-audio.ts'

test('the shipped real-recording library has valid WAVs, verified hashes, and CC0 provenance', async () => {
  const directory = new URL('../public/audio/double-bass/', import.meta.url)
  const manifest = JSON.parse(await readFile(new URL('manifest.json', directory), 'utf8'))
  const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')
  assert.equal(manifest.license, 'CC0-1.0')
  assert.equal(manifest.sourceCommit, '440300901dfe9275fd84e0b7763af1f8443ae62e')
  assert.equal(manifest.samples.length, bassSamples.length)
  assert.ok(manifest.totalBytes < 5 * 1024 * 1024)
  const license = await readFile(new URL('VSCO-2-CE-LICENSE.txt', directory))
  assert.equal(hash(license), manifest.licenseSha256)
  assert.match(license.toString(), /CC0 1.0 Universal/)
  let totalBytes = 0
  for (const sample of manifest.samples) {
    const bytes = await readFile(new URL(sample.file, directory))
    const runtime = bassSamples.find(item => item.file === sample.file)
    assert.ok(runtime)
    assert.equal(runtime.frequency, sample.measuredHz)
    assert.equal(runtime.midi, sample.soundingMidi)
    assert.equal(hash(bytes), sample.sha256)
    assert.match(sample.sourceUrl, /^https:\/\/raw\.githubusercontent\.com\/sgossner\/VSCO-2-CE\/440300901dfe9275fd84e0b7763af1f8443ae62e\//)
    assert.match(sample.sourceSha256, /^[a-f0-9]{64}$/)
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF')
    assert.equal(bytes.toString('ascii', 8, 16), 'WAVEfmt ')
    assert.equal(bytes.readUInt16LE(20), 1, 'PCM format')
    assert.equal(bytes.readUInt16LE(22), 1, 'mono')
    assert.equal(bytes.readUInt32LE(24), 44100)
    assert.equal(bytes.readUInt16LE(34), 16)
    assert.equal(bytes.toString('ascii', 36, 40), 'data')
    assert.equal(bytes.readUInt32LE(40), bytes.length - 44)
    assert.ok(sample.pitchCorrelation > .68)
    assert.ok(Math.abs(sample.tuningCents) < 25)
    let peak = 0, squared = 0
    for (let offset = 44; offset < bytes.length; offset += 2) {
      const value = bytes.readInt16LE(offset) / 32768
      peak = Math.max(peak, Math.abs(value)); squared += value * value
    }
    assert.ok(peak > .5 && peak <= .751, 'audible but unclipped normalized recording')
    assert.ok(Math.sqrt(squared / ((bytes.length - 44) / 2)) > .005, 'actual recording contains sound')
    assert.equal(bytes.readInt16LE(44), 0)
    assert.equal(bytes.readInt16LE(bytes.length - 2), 0)
    totalBytes += bytes.length
  }
  assert.equal(totalBytes, manifest.totalBytes)
})

test('actual low and high arco recordings retain their attacks and have continuous sustain-loop joins', async () => {
  for (const file of ['arco-E1.wav', 'arco-E3.wav']) {
    const bytes = await readFile(new URL(`../public/audio/double-bass/${file}`, import.meta.url))
    const sampleRate = bytes.readUInt32LE(24)
    const data = Float32Array.from({ length: (bytes.length - 44) / 2 }, (_, index) => bytes.readInt16LE(44 + index * 2) / 32768)
    const attack = data.slice(0, Math.floor(.8 * sampleRate))
    const loop = prepareSustainLoop({ sampleRate, duration: data.length / sampleRate, numberOfChannels: 1, getChannelData: () => data } as unknown as AudioBuffer)!
    assert.deepEqual(data.slice(0, attack.length), attack)
    const start = Math.round(loop.start * sampleRate), end = Math.round(loop.end * sampleRate)
    assert.equal(data[end - 1], data[start - 1])
    assert.equal(Math.abs(data[end - 1] - data[start]), Math.abs(data[start - 1] - data[start]))
    assert.ok(data.slice(end - Math.round(sampleRate * .06), end).some(value => Math.abs(value) > .01))
  }
})
