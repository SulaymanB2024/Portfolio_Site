import { Component, Suspense, lazy, useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Controls } from './Controls'
import { defaults, type Preset } from './settings'
import { useTheme } from './theme'
import { stageColors } from './stage-colors'
import { models } from './collection'
import './styles.css'
const Scene = lazy(() => import('./Scene'))
export default function App() {
  const { dark, preference, setPreference } = useTheme()
  const [settings, setSettings] = useState(() => ({
    ...defaults,
    background: dark ? '#000000' : defaults.background,
    motion: !matchMedia('(prefers-reduced-motion: reduce)').matches
  }))
  const [preset, setPreset] = useState<Preset | null>('original')
  const [resetView, setResetView] = useState(0)
  const [rotate, setRotate] = useState(false)
  const [ready, setReady] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [credits, setCredits] = useState(false)
  const [model, setModel] = useState('jousting-helmet')
  const [loadError, setLoadError] = useState('')
  const [retry, setRetry] = useState(0)
  const selectedModel = models.find((asset) => asset.slug === model)!
  const onReady = useCallback((value: boolean, error?: string) => {
    setReady(value)
    setLoadError(error ?? '')
  }, [])
  useEffect(() => {
    setSettings((current) => ({ ...current, background: dark ? '#000000' : '#ffffff' }))
  }, [dark])
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => {
      if (query.matches) setSettings((current) => ({ ...current, motion: false }))
    }
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="#study" className="wordmark">
          <span className="brand-mark" aria-hidden="true">
            ▦
          </span>{' '}
          DITHER<span className="wordmark-sub"> / shader study</span>
        </a>
        <div className="header-actions">
          <a className="collection-link" href={`${import.meta.env.BASE_URL}models.html`}>
            Collection
          </a>
          <button className="text-button" onClick={() => setCredits((value) => !value)} aria-expanded={credits} aria-controls="credits">
            About the study <span aria-hidden="true">↗</span>
          </button>
          <button className="theme-button" aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} onClick={() => setPreference(dark ? 'light' : 'dark')}>
            {dark ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 15.2A9 9 0 018.8 4a9 9 0 1011.2 11.2z" />
              </svg>
            )}
          </button>
        </div>
      </header>
      {credits && (
        <section className="credits" id="credits" aria-label="About the study">
          <div>
            <h2>An old technique, a new perspective.</h2>
            <p>
              Ordered dithering turns continuous shading into a pattern of dots. This study applies a 4 × 4 Bayer matrix to a real-time 3D scene. Change the light, explore the
              texture, find your own composition.
            </p>
          </div>
          <div>
            <p>
              Original demo by{' '}
              <a href="https://niccolofanton.dev" target="_blank" rel="noreferrer">
                Niccolò Fanton
              </a>{' '}
              ·{' '}
              <a href="https://github.com/niccolofanton/dithering-shader" target="_blank" rel="noreferrer">
                Source on GitHub
              </a>
            </p>
            <p>
              <a href="https://sketchfab.com/3d-models/jousting-helmet-a4eea31d9d9441af9434a7da5ae46b54" target="_blank" rel="noreferrer">
                Jousting Helmet
              </a>{' '}
              by The Royal Armoury ·{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
                CC BY 4.0
              </a>
              .<br />
              Pattern by{' '}
              <a href="https://www.shadertoy.com/view/ltSSzW" target="_blank" rel="noreferrer">
                Klems
              </a>
              . Lighting inspired by{' '}
              <a href="https://x.com/0xca0a/status/1857444050707640651" target="_blank" rel="noreferrer">
                @0xca0a
              </a>
              .
            </p>
          </div>
        </section>
      )}
      <main className="workspace" id="study">
        <section className="study-stage" aria-label={`Interactive ${selectedModel.name} study`} style={stageColors(settings.background) as CSSProperties}>
          <div className="stage-meta">
            <span>
              <i className={ready ? 'live-dot ready' : 'live-dot'} />
              {ready ? 'Live render' : 'Loading study'}
            </span>
            <span>WebGL / 4 × 4 Bayer</span>
          </div>
          <div
            className="canvas-wrap"
            tabIndex={0}
            aria-label={`3D ${selectedModel.name}. Drag to orbit, scroll or pinch to zoom, right-drag to pan. Arrow keys orbit, plus and minus zoom, Home resets.`}>
            <SceneBoundary>
              <Suspense fallback={null}>
                <Scene settings={settings} resetView={resetView} rotate={rotate} onReady={onReady} model={model} retry={retry} />
              </Suspense>
            </SceneBoundary>
            {!ready && (
              <div className="loading-message" role="status">
                {loadError || 'Preparing the light & texture…'}
                {loadError && <button onClick={() => setRetry((value) => value + 1)}>Retry object</button>}
              </div>
            )}
          </div>
          <div className="stage-title">
            <span className="eyebrow">An experiment in light & texture</span>
            <h1>
              Dithering
              <br />
              Shader<span className="title-dot">.</span>
            </h1>
          </div>
          <div className="stage-tools" aria-label="Scene controls">
            <button aria-pressed={!settings.motion} onClick={() => setSettings((current) => ({ ...current, motion: !current.motion }))}>
              {settings.motion ? 'Ⅱ Pause' : '▷ Play'}
            </button>
            <button
              aria-pressed={rotate}
              onClick={() => {
                setRotate((value) => !value)
                setSettings((current) => ({ ...current, motion: true }))
              }}>
              ↻ Auto-orbit
            </button>
            <button onClick={() => setResetView((value) => value + 1)}>↺ Reset view</button>
            <button
              className={!settings.dithering ? 'active' : ''}
              aria-pressed={!settings.dithering}
              onClick={() => setSettings((current) => ({ ...current, dithering: !current.dithering }))}>
              {settings.dithering ? '◐ Compare original' : '▦ Back to dither'}
            </button>
          </div>
          <div className="stage-footer">
            <span>
              Drag to explore <span aria-hidden="true">↔</span> Scroll to zoom
            </span>
            <span className="object-caption">
              {selectedModel.name} / {model === 'jousting-helmet' ? 'The Royal Armoury' : selectedModel.creator.displayName}
            </span>
          </div>
        </section>
        <div className="mobile-panel-toggle">
          <button aria-expanded={panelOpen} aria-controls="settings-panel" onClick={() => setPanelOpen((value) => !value)}>
            The playground <span>{panelOpen ? '−' : '+'}</span>
          </button>
        </div>
        <aside className={`settings-panel ${panelOpen ? 'is-open' : ''}`} id="settings-panel" aria-label="Shader settings">
          <div className="object-picker">
            <label className="select-field">
              Study object
              <select
                value={model}
                onChange={(event) => {
                  const next = event.target.value
                  onReady(false)
                  setModel(next)
                  setResetView((value) => value + 1)
                  if (next === 'crystal-cluster-glass' || next === 'wireframe-globe') setSettings((current) => ({ ...current, background: '#202328' }))
                }}>
                {models.map((asset) => (
                  <option key={asset.slug} value={asset.slug}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="object-credit">
              {selectedModel.viewerUrl ? (
                <a href={selectedModel.viewerUrl} target="_blank" rel="noreferrer">
                  {selectedModel.creator.displayName}
                </a>
              ) : (
                selectedModel.creator.displayName
              )}
              {' · '}
              {selectedModel.license.url ? (
                <a href={selectedModel.license.url} target="_blank" rel="noreferrer">
                  {selectedModel.license.label}
                </a>
              ) : (
                selectedModel.license.label
              )}
              {selectedModel.license.slug === 'by-nc' && <span> · Non-commercial use only.</span>}
              {selectedModel.attribution && <span> · {selectedModel.attribution}</span>}
            </p>
          </div>
          <Controls
            settings={settings}
            setSettings={setSettings}
            preset={preset}
            setPreset={setPreset}
            theme={preference}
            setTheme={setPreference}
            onReset={() => {
              setSettings({ ...defaults, background: dark ? '#000000' : '#ffffff', motion: !matchMedia('(prefers-reduced-motion: reduce)').matches })
              setPreset('original')
              setRotate(false)
              if (model !== 'jousting-helmet') onReady(false)
              setModel('jousting-helmet')
              setResetView((value) => value + 1)
            }}
          />
        </aside>
      </main>
      <footer className="site-footer">
        <span>
          Made by{' '}
          <a href="https://niccolofanton.dev" target="_blank" rel="noreferrer">
            niccolofanton
          </a>
        </span>
        <a href="https://github.com/niccolofanton/dithering-shader" target="_blank" rel="noreferrer">
          Explore the source ↗
        </a>
      </footer>
    </div>
  )
}
class SceneBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  render() {
    if (this.state.error)
      return (
        <div className="scene-error" role="alert">
          The 3D study couldn’t load. Check WebGL support and try again.<button onClick={() => location.reload()}>Reload study</button>
        </div>
      )
    return this.props.children
  }
}
