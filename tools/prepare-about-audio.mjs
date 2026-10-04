/** Download a small, pinned CC0 double-bass multisample set. No audio dependencies. */
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const destination = path.join(root, 'public/audio/double-bass')
const sourceCommit = '440300901dfe9275fd84e0b7763af1f8443ae62e'
const mappingCommit = '6dd651d55dde97fd4028699be9d4481f26917891'
const raw = `https://raw.githubusercontent.com/sgossner/VSCO-2-CE/${sourceCommit}/`
const solo = process.argv.includes('--solo')
const roots = solo ? [['G#2', 'G-sharp3', 56], ['B2', 'B3', 59]] : [
  ['E0', 'E1', 28], ['G0', 'G1', 31], ['C1', 'C2', 36],
  ['E1', 'E2', 40], ['A1', 'A2', 45], ['C#2', 'C-sharp3', 49], ['E2', 'E3', 52],
]
const sha = value => createHash('sha256').update(value).digest('hex')
const run = promisify(execFile)

async function download(url) {
  // macOS ships curl; avoid requiring a separate audio or networking dependency.
  const { stdout } = await run('curl', ['--fail', '--location', '--silent', '--show-error', '--max-time', '30', url], { encoding: 'buffer', maxBuffer: 12 * 1024 * 1024 })
  return stdout
}

function decodeWav(bytes) {
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WAVE') throw new Error('Expected PCM WAV')
  let format, data
  for (let position = 12; position + 8 <= bytes.length;) {
    const size = bytes.readUInt32LE(position + 4)
    const chunk = bytes.subarray(position + 8, position + 8 + size)
    const name = bytes.toString('ascii', position, position + 4)
    if (name === 'fmt ') format = chunk
    if (name === 'data') data = chunk
    position += 8 + size + size % 2
  }
  if (!format || !data || format.readUInt16LE(0) !== 1 || format.readUInt16LE(14) !== 16) throw new Error('Expected original 16-bit PCM')
  const channels = format.readUInt16LE(2), rate = format.readUInt32LE(4)
  const count = data.length / (channels * 2)
  const samples = new Float64Array(count)
  for (let frame = 0; frame < count; frame++) {
    for (let channel = 0; channel < channels; channel++) samples[frame] += data.readInt16LE((frame * channels + channel) * 2) / (32768 * channels)
  }
  return { samples, rate, channels, duration: count / rate }
}

/** Verify the SFZ's sounding pitch against the waveform, with sub-frame interpolation. */
function measurePitch(samples, rate, expected) {
  const downsample = 4
  const start = Math.round(rate * .28), count = Math.min(Math.round(rate * .7), samples.length - start)
  const wave = new Float64Array(Math.floor(count / downsample))
  let mean = 0
  for (let i = 0; i < wave.length; i++) {
    for (let j = 0; j < downsample; j++) wave[i] += samples[start + i * downsample + j] / downsample
    mean += wave[i] / wave.length
  }
  for (let i = 0; i < wave.length; i++) wave[i] -= mean
  const period = rate / downsample / expected
  const first = Math.max(2, Math.floor(period * .94)), last = Math.ceil(period * 1.06)
  const correlations = new Map()
  let best = first, score = -Infinity
  for (let lag = first - 1; lag <= last + 1; lag++) {
    let dot = 0, left = 0, right = 0
    for (let i = 0; i + lag < wave.length; i++) { dot += wave[i] * wave[i + lag]; left += wave[i] ** 2; right += wave[i + lag] ** 2 }
    const correlation = dot / Math.sqrt(left * right)
    correlations.set(lag, correlation)
    if (lag >= first && lag <= last && correlation > score) { best = lag; score = correlation }
  }
  const a = correlations.get(best - 1), b = correlations.get(best), c = correlations.get(best + 1)
  const offset = Math.max(-.5, Math.min(.5, .5 * (a - c) / (a - 2 * b + c)))
  const frequency = rate / downsample / (best + offset)
  const cents = 1200 * Math.log2(frequency / expected)
  if (!Number.isFinite(frequency) || score < .68 || Math.abs(cents) > 80) throw new Error(`Pitch verification failed: ${frequency} Hz, ${score} confidence, ${cents} cents`)
  return { frequency: Number(frequency.toFixed(5)), correlation: Number(score.toFixed(5)), cents: Number(cents.toFixed(3)) }
}

function encodeExcerpt(samples, rate, seconds) {
  // Preserve recorded attack; trim only excess sustain/tail. Gentle edges prevent clicks.
  let first = 0
  while (first < samples.length && Math.abs(samples[first]) < .001) first++
  first = Math.max(0, first - Math.round(rate * .004))
  const length = Math.min(samples.length - first, Math.round(seconds * rate))
  let peak = 0
  for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(samples[first + i]))
  const normalizationGain = peak ? .75 / peak : 1
  const output = Buffer.alloc(44 + length * 2)
  output.write('RIFF'); output.writeUInt32LE(output.length - 8, 4); output.write('WAVEfmt ', 8)
  output.writeUInt32LE(16, 16); output.writeUInt16LE(1, 20); output.writeUInt16LE(1, 22)
  output.writeUInt32LE(rate, 24); output.writeUInt32LE(rate * 2, 28); output.writeUInt16LE(2, 32); output.writeUInt16LE(16, 34)
  output.write('data', 36); output.writeUInt32LE(length * 2, 40)
  const fade = Math.round(rate * .06), attack = Math.round(rate * .002)
  for (let i = 0; i < length; i++) {
    const envelope = Math.min(1, i / attack, (length - 1 - i) / fade)
    output.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[first + i] * envelope * normalizationGain * 32767))), 44 + i * 2)
  }
  return { bytes: output, trimStartSeconds: first / rate, durationSeconds: length / rate, normalizationGain }
}

await mkdir(destination, { recursive: true })
const licenseUrl = raw + 'LICENSE'
const license = await download(licenseUrl)
if (!solo) await writeFile(path.join(destination, 'VSCO-2-CE-LICENSE.txt'), license)
const samples = []
for (const [articulation, sourceArticulation] of solo ? [['arco', 'SusNV']] : [['pizzicato', 'Pizz'], ['arco', 'SusNV']]) {
  for (const [label, note, midi] of roots) {
    const layer = articulation === 'arco' || ['E0', 'G0', 'C1', 'E1'].includes(label) ? 'v3' : 'v1'
    const sourcePath = `Strings/Solo Contrabass/${sourceArticulation}/BKCtbss_${sourceArticulation}_${label}_${layer}_rr1.wav`
    const sourceUrl = raw + sourcePath.split('/').map(encodeURIComponent).join('/')
    const original = await download(sourceUrl)
    const decoded = decodeWav(original)
    const equalTemperamentHz = 440 * 2 ** ((midi - 69) / 12)
    const measured = measurePitch(decoded.samples, decoded.rate, equalTemperamentHz)
    const excerpt = encodeExcerpt(decoded.samples, decoded.rate, articulation === 'arco' ? 3.4 : 3.8)
    const file = `${articulation}-${note}.wav`
    await writeFile(path.join(destination, file), excerpt.bytes)
    samples.push({ file, articulation, soundingMidi: midi, soundingNote: note.replace('-sharp', '#'), equalTemperamentHz, measuredHz: measured.frequency, pitchCorrelation: measured.correlation, tuningCents: measured.cents, sourcePath, sourceUrl, sourceBytes: original.length, sourceSha256: sha(original), sourceDurationSeconds: decoded.duration, sourceChannels: decoded.channels, sha256: sha(excerpt.bytes), bytes: excerpt.bytes.length, sampleRate: decoded.rate, channels: 1, bitsPerSample: 16, trimStartSeconds: excerpt.trimStartSeconds, durationSeconds: excerpt.durationSeconds, normalizationGain: excerpt.normalizationGain })
    console.log(`${file}: ${excerpt.bytes.length} bytes, ${measured.frequency} Hz (MIDI ${midi}), ${measured.cents} cents`)
  }
}
const manifest = { library: 'VSCO 2 Community Edition — Solo Contrabass', license: 'CC0-1.0', libraryUrl: 'https://versilian-studios.com/vsco-community/', repositoryUrl: 'https://github.com/sgossner/VSCO-2-CE', sourceCommit, licenseUrl, licenseSha256: sha(license), attribution: 'Recorded by Sam Gossner & Simon Dalzell; sample cutting by Elan Hickler / Soundemote.', recordingIdentity: 'Library musicians; these samples are not performances by Sulayman Bowles.', mapping: { source: `https://github.com/sgossner/VSCO-2-CE/blob/${mappingCommit}/ContrabassPizz.sfz`, arcoSource: `https://github.com/sgossner/VSCO-2-CE/blob/${mappingCommit}/ContrabassSusNV.sfz`, note: 'Source octave labels use C3 for middle C; use SFZ pitch_keycenter MIDI numbers, verified against waveform autocorrelation. A file labeled E0 sounds standard E1 (MIDI 28).' }, transformations: 'Original stereo PCM averaged to mono, shortened to at most 3.8s pizzicato / 3.4s arco, leading near-silence trimmed with 4ms preroll, peak normalized to 0.75, 2ms attack / 60ms tail edge fades. Original recorded timbre retained; no synthesized replacement.', totalBytes: samples.reduce((sum, sample) => sum + sample.bytes, 0), samples }
await writeFile(path.join(destination, solo ? 'solo-manifest.json' : 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
await writeFile(path.join(destination, solo ? 'SOLO-README.md' : 'README.md'), `# Double-bass samples\n\nA small real-instrument subset of [VSCO 2 Community Edition](${manifest.libraryUrl}), licensed [CC0-1.0](${licenseUrl}).\n\n${manifest.attribution}\n\n${manifest.recordingIdentity}\n\n${manifest.transformations}\n\nSource octave labels differ from standard scientific pitch notation. Native sounding pitches are taken from the author's SFZ MIDI mappings and checked against the recording, then recorded in ${solo ? 'solo-manifest.json' : 'manifest.json'} with original / adapted SHA-256 hashes.\n\nRegenerate with \`node tools/prepare-about-audio.mjs${solo ? ' --solo' : ''}\`. ${solo ? 'These upper-register bowed samples load only when a repertoire preview is requested. The composer keeps its E1–G3 range.' : 'The web player lazily loads the nearest sample and tunes using its measured native pitch.'}\n`)
const runtime = `/** Real CC0 VSCO 2 CE samples; generated by tools/prepare-about-audio.mjs${solo ? ' --solo' : ''}. */\nexport const ${solo ? 'bassSoloSamples' : 'bassSamples'} = ${JSON.stringify(samples.map(({ file, articulation, soundingMidi, measuredHz }) => ({ file, articulation, midi: soundingMidi, frequency: measuredHz })), null, 2)} as const\n`
await writeFile(path.join(root, solo ? 'src/personal/about/bass-solo-samples.ts' : 'src/personal/about/double-bass-samples.ts'), runtime)
console.log(`Prepared ${samples.length} samples, ${manifest.totalBytes} bytes total.`)
