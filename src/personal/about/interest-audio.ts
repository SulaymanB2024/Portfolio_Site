/** A deliberately synthetic study, activated only by a visitor's gesture. */
export function createInterestAudio() {
  let context: AudioContext | null = null
  let stopped = false
  let generation = 0
  const voices = new Set<OscillatorNode>()

  async function play(frequency: number, delay = 0) {
    if (stopped) return
    const request = generation
    context ??= new AudioContext()
    if (context.state === 'suspended') await context.resume()
    if (stopped || request !== generation || context.state !== 'running') return
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()
    const start = context.currentTime + delay
    oscillator.type = 'triangle'
    oscillator.frequency.value = frequency
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1600, start)
    filter.frequency.exponentialRampToValueAtTime(220, start + 1.3)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(.22, start + .012)
    gain.gain.exponentialRampToValueAtTime(.001, start + 1.5)
    oscillator.connect(filter).connect(gain).connect(context.destination)
    voices.add(oscillator)
    oscillator.onended = () => { voices.delete(oscillator); oscillator.disconnect(); filter.disconnect(); gain.disconnect() }
    oscillator.start(start)
    oscillator.stop(start + 1.6)
  }

  return {
    play,
    silence() { generation++; for (const voice of voices) { try { voice.stop() } catch { /* already ended */ } } },
    dispose() {
      stopped = true
      generation++
      for (const voice of voices) { try { voice.stop() } catch { /* already ended */ } }
      voices.clear()
      void context?.close()
      context = null
    },
  }
}
