import catalog from './editorial/data/catalog.json' with { type: 'json' }
import { projects } from './content.ts'
import { caseStudies } from './projects/case-studies.ts'
import { siteMetadata, withWritingCopy } from './site-copy.ts'

export const siteOrigin = 'https://sulayman-bowles.dev'
export const publicPages = [
  { route: '', path: '/', title: `${siteMetadata.homeTitle} — Sulayman Bowles`, description: siteMetadata.description },
  ...Object.entries(siteMetadata.pages).map(([route, description]) => ({ route, path: `/${route}`, title: `${route === 'resume' ? 'Résumé' : route[0].toUpperCase() + route.slice(1)} — Sulayman Bowles`, description })),
  ...projects.map(project => ({ route: `work/${project.slug}`, path: `/work/${project.slug}`, title: `${project.name} — Sulayman Bowles`, description: project.summary })),
  ...caseStudies.map(study => ({ route: `work/${study.slug}`, path: `/work/${study.slug}`, title: `${study.name} — Sulayman Bowles`, description: study.summary })),
  ...catalog.map(withWritingCopy).map(article => ({ route: `writing/${article.slug}`, path: article.path, title: `${article.displayTitle || article.title} — Sulayman Bowles`, description: article.subtitle })),
]

export function canonicalPath(route: string) {
  return publicPages.find(page => page.route === (route === 'home' ? '' : route))?.path
}
