import { createRoot } from 'react-dom/client'
import PersonalSite from './personal/PersonalSite'
import SiteRefinements from './personal/refinements/SiteRefinements'
import './personal/site-composition.css'
const root = document.getElementById('root')
if (!root) throw new Error('Site root not found')
if (import.meta.env.DEV && new URLSearchParams(location.search).has('fluidity-profile')) {
  const { installFluidityProbe } = await import('../tests/fluidity-probe')
  const disposeProbe = installFluidityProbe()
  if (import.meta.hot) import.meta.hot.dispose(disposeProbe)
}
createRoot(root).render(<><PersonalSite /><SiteRefinements /></>)
