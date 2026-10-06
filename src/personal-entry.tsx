import { createRoot } from 'react-dom/client'
import PersonalSite from './personal/PersonalSite'
import SiteRefinements from './personal/refinements/SiteRefinements'
import './personal/site-composition.css'
import './personal/structure-typography.css'
import './personal/text-placement.css'
import { prepareRouteResources } from './personal/route-preparation'
import { prepareRoutePage } from './personal/route-pages'
import { prepareArticleArrival } from './personal/editorial/article-arrival'
import { resolveRoute } from './personal/editorial/routes'
import catalog from './personal/editorial/data/catalog.json'
import type { ArticleSummary } from './personal/editorial/types'
const root = document.getElementById('root')
if (!root) throw new Error('Site root not found')
if (import.meta.env.DEV && new URLSearchParams(location.search).has('fluidity-profile')) {
  const { installFluidityProbe } = await import('../tests/fluidity-probe')
  const disposeProbe = installFluidityProbe()
  if (import.meta.hot) import.meta.hot.dispose(disposeProbe)
}
// Prepare only the requested destination before mounting the shell. Its CSS and
// manuscript arrive together, so a deep link cannot flash a footer or empty reader.
// Failed resources still reach the route boundary or the article's retry UI.
const initialPath = () => resolveRoute(location.hash, location.pathname, catalog as ArticleSummary[])
let initialRoute: string
do {
  initialRoute = initialPath()
  await prepareRouteResources(initialRoute, prepareRoutePage, slug => prepareArticleArrival(slug, location.hash, location.pathname))
} while (initialPath() !== initialRoute)
createRoot(root).render(<><PersonalSite /><SiteRefinements /></>)
