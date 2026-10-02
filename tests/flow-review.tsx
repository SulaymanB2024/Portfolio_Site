import { createRoot } from 'react-dom/client'
import { HomeScene } from '../src/personal/HomeScene'
import '../src/personal/personal.css'
createRoot(document.getElementById('root')!).render(<div className="personal-site home-site" data-appearance="light">
  <section className="home-scroll-stage"><div className="home-hero"><div className="hero-copy"><span className="eyebrow">Animation review fixture</span><h1>Ideas<br />in high<br />resolution.</h1><p className="hero-description">Scroll, rotate, reverse.<br />The original image remains intact at rest.</p><a href="#after" className="arrow-link">After the flow →</a></div><HomeScene dark={false} /></div></section>
  <section id="after" style={{ minHeight: '110vh', padding: '80px 0' }}><h2>After the flow</h2><p>Scroll back to restore the object.</p></section>
</div>)
