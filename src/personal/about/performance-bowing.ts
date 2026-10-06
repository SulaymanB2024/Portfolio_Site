export type PerformanceBowing = { offset: number; energy: number; active: boolean; position: number }
export type PerformanceBowingSource = () => PerformanceBowing

/** Inferred strokes from the recording envelope, advanced only by native media time. */
export function createBowingTracker() {
  let previous: number | undefined, energy = 0, offset = 0, direction = 1, lastAttack = -Infinity
  return {
    sample(position: number, amplitude: number, active: boolean): PerformanceBowing {
      const time = Number.isFinite(position) ? Math.max(0, position) : 0
      if (!active) { previous = time; energy = 0; return { offset, energy, active: false, position: time } }
      const jump = previous !== undefined && (time < previous || time - previous > .3)
      if (jump) { offset = 0; direction = 1; energy = 0; lastAttack = time }
      const dt = previous === undefined || jump ? 0 : Math.max(0, Math.min(.1, time - previous))
      previous = time
      const target = Math.max(0, Math.min(1, (amplitude - .008) / .11))
      if (target - energy > .22 && time - lastAttack > .35) { direction *= -1; lastAttack = time }
      energy += (target - energy) * (1 - Math.exp(-dt * (target > energy ? 22 : 12)))
      // Keep the bow still in quiet passages; dynamics control the stroke speed.
      if (target > .02 && dt > 0) {
        offset += direction * dt * (.08 + .40 * energy)
        if (offset >= .18) { offset = .18; direction = -1 }
        else if (offset <= -.18) { offset = -.18; direction = 1 }
      }
      return { offset, energy: target > .02 ? energy : 0, active: true, position: time }
    },
    reset() { previous = undefined; energy = 0; offset = 0; direction = 1; lastAttack = -Infinity }
  }
}

/** Unity audio path: the analyser observes the unchanged native recording. */
export function createPerformanceBowing(media: HTMLAudioElement) {
  const tracker = createBowingTracker()
  let context: AudioContext | undefined, analyser: AnalyserNode | undefined, source: MediaElementAudioSourceNode | undefined, disposed = false
  const samples = new Float32Array(1024)
  let preparing: Promise<void> | undefined
  return {
    prepare() {
      if (disposed) return Promise.resolve()
      if (analyser) return context!.resume().catch(() => {})
      if (preparing) return preparing
      // Resume in the initiating click; connect only after a successful resume.
      context ??= new AudioContext()
      preparing = context.resume().then(() => {
        if (disposed || analyser) return
        analyser = context!.createAnalyser(); analyser.fftSize = 1024
        source = context!.createMediaElementSource(media)
        source.connect(analyser); analyser.connect(context!.destination)
      }).catch(() => {}).finally(() => { preparing = undefined })
      return preparing
    },
    sample(): PerformanceBowing {
      const active = !media.paused && !media.ended && !media.seeking && media.readyState >= 3 && !!analyser && context?.state === 'running'
      let amplitude = 0
      if (active) {
        analyser!.getFloatTimeDomainData(samples)
        let sum = 0
        for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i]
        amplitude = Math.sqrt(sum / samples.length)
      }
      return tracker.sample(media.currentTime, amplitude, active)
    },
    reset() { tracker.reset() },
    dispose() {
      if (disposed) return
      disposed = true; source?.disconnect(); analyser?.disconnect()
      void context?.close().catch(() => {})
    }
  }
}
