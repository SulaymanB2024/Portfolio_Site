import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { presets, type BloomSettings, type Preset, type Settings } from './settings'
import type { ThemePreference } from './theme'
interface Props {
  settings: Settings
  setSettings: Dispatch<SetStateAction<Settings>>
  preset: Preset | null
  setPreset: (value: Preset | null) => void
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
  onReset: () => void
}
function Range({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return (
    <label className="range-field">
      <span>
        {label}
        <output>{Number(value.toFixed(2))}</output>
      </span>
      <input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="toggle-field">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  )
}
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState(value)
  useEffect(() => {
    setDraft(value)
  }, [value])
  return (
    <div className="color-field">
      <label>
        {label}
        <input type="color" aria-label={`${label} color picker`} value={value} onInput={(event) => onChange(event.currentTarget.value)} />
      </label>
      <input
        className="hex-input"
        type="text"
        aria-label={label}
        value={draft}
        spellCheck={false}
        maxLength={7}
        onChange={(event) => {
          setDraft(event.target.value)
          if (/^#[0-9a-f]{6}$/i.test(event.target.value)) onChange(event.target.value)
        }}
        onBlur={() => setDraft(value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
      />
    </div>
  )
}
function BloomControls({ label, value, onChange, after }: { label: string; value: BloomSettings; onChange: (value: BloomSettings) => void; after?: boolean }) {
  const update = (key: keyof BloomSettings, next: number | boolean) => onChange({ ...value, [key]: next })
  return (
    <div className="bloom-controls">
      <Toggle label={`${label} bloom`} checked={value.enabled} onChange={(next) => update('enabled', next)} />
      <details>
        <summary>
          {label} bloom settings<span aria-hidden="true">+</span>
        </summary>
        <Range label={`${label} threshold`} value={value.threshold} min={0} max={2} step={0.01} onChange={(next) => update('threshold', next)} />
        <Range label={`${label} intensity`} value={value.intensity} min={0} max={after ? 2 : 50} step={after ? 0.01 : 0.1} onChange={(next) => update('intensity', next)} />
        <Range label={`${label} radius`} value={value.radius} min={0} max={1} step={after ? 0.01 : 0.1} onChange={(next) => update('radius', next)} />
        {after && <Range label="After smoothing" value={value.smoothing} min={0} max={1} step={0.01} onChange={(next) => update('smoothing', next)} />}
      </details>
    </div>
  )
}
export function Controls({ settings, setSettings, preset, setPreset, theme, setTheme, onReset }: Props) {
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setPreset(null)
    setSettings((current) => ({ ...current, [key]: value }))
  }
  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Make it your own</span>
          <h2>The playground</h2>
        </div>
        <span className="panel-index">01—04</span>
      </div>
      <section className="control-section">
        <h3>
          <span>01</span> Starting points
        </h3>
        <div className="presets" aria-label="Shader presets">
          {(Object.keys(presets) as Preset[]).map((name) => (
            <button
              key={name}
              aria-pressed={preset === name}
              onClick={() => {
                setSettings((current) => ({ ...current, ...presets[name], dithering: true, invert: false }))
                setPreset(name)
              }}>
              <span aria-hidden="true" className={`preset-pattern ${name}`} />
              {name === 'original' ? 'Original' : name === 'halftone' ? 'Halftone' : 'Chromatic'}
            </button>
          ))}
        </div>
      </section>
      <section className="control-section">
        <h3>
          <span>02</span> Texture & tone
        </h3>
        <Range label="Effect resolution" value={settings.grid} min={1} max={20} onChange={(value) => update('grid', value)} />
        <Range label="Pixelation strength" value={settings.pixel} min={1} max={10} onChange={(value) => update('pixel', value)} />
        <Toggle label="Grayscale only" checked={settings.grayscale} onChange={(value) => update('grayscale', value)} />
        <Toggle label="Invert colors" checked={settings.invert} onChange={(value) => update('invert', value)} />
      </section>
      <section className="control-section">
        <h3>
          <span>03</span> Light & atmosphere
        </h3>
        <Range label="Environment intensity" value={settings.environment} min={0} max={5} step={0.1} onChange={(value) => update('environment', value)} />
        <div className="color-fields">
          <ColorField label="Highlight" value={settings.highlight} onChange={(value) => update('highlight', value)} />
          <ColorField label="Background" value={settings.background} onChange={(value) => update('background', value)} />
        </div>
        <BloomControls label="Before" value={settings.before} onChange={(value) => update('before', value)} />
        <BloomControls label="After" value={settings.after} after onChange={(value) => update('after', value)} />
      </section>
      <section className="control-section">
        <h3>
          <span>04</span> Experience
        </h3>
        <label className="select-field">
          Render quality
          <select value={settings.quality} onChange={(event) => update('quality', event.target.value as Settings['quality'])}>
            <option value="studio">Studio · original detail</option>
            <option value="balanced">Balanced · lower GPU use</option>
          </select>
        </label>
        <label className="select-field">
          Appearance
          <select value={theme} onChange={(event) => setTheme(event.target.value as ThemePreference)}>
            <option value="system">Follow system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <button className="reset-settings" onClick={onReset}>
          Reset all settings <span aria-hidden="true">↺</span>
        </button>
      </section>
      <p className="panel-note">
        Small dots. Endless possibilities.
        <br />
        Every adjustment happens in real time.
      </p>
    </>
  )
}
