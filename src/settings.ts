export interface BloomSettings {
  enabled: boolean
  threshold: number
  intensity: number
  radius: number
  smoothing: number
}
export interface Settings {
  background: string
  highlight: string
  environment: number
  grid: number
  pixel: number
  grayscale: boolean
  invert: boolean
  dithering: boolean
  motion: boolean
  quality: 'balanced' | 'studio'
  before: BloomSettings
  after: BloomSettings
}
export const defaults: Settings = {
  background: '#ffffff',
  highlight: '#066aff',
  environment: 1.5,
  grid: 4,
  pixel: 1,
  grayscale: true,
  invert: false,
  dithering: true,
  motion: true,
  quality: 'studio',
  before: { enabled: false, threshold: 0, intensity: 2, radius: 0.6, smoothing: 0.025 },
  after: { enabled: false, threshold: 0, intensity: 0.42, radius: 0.75, smoothing: 0.22 }
}
export const presets = {
  original: { grid: 4, pixel: 1, grayscale: true, before: defaults.before, after: defaults.after },
  halftone: { grid: 2, pixel: 2, grayscale: true, before: defaults.before, after: defaults.after },
  chromatic: { grid: 3, pixel: 1, grayscale: false, before: defaults.before, after: { ...defaults.after, enabled: true, intensity: 0.25 } }
}
export type Preset = keyof typeof presets
