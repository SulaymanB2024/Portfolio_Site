import { publicPages } from '../../src/personal/public-pages.ts'
import hosting from '../../vercel.json' with { type: 'json' }

export function reservedOutreachSlugs() {
  const reserved = new Set(['api', 'assets', 'fonts', 'static', 'machine', '404', 'sitemap', 'robots', 'health', 'healthz', 'shader', 'models',
    'about-objects', 'art', 'audio', 'draco', 'engines', 'images', 'landing', 'portfolio-models',
    'research', 'resume-knight', 'resume-objects', 'resume-sculptures', 'work-studies'])
  for (const page of publicPages) { const top = page.path.split('/')[1]; if (top) reserved.add(top) }
  for (const route of hosting.routes) {
    const top = route.src?.split('/')[1]?.replace(/\\/g, '')
    if (top && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(top)) reserved.add(top)
  }
  return reserved
}
