import { publicPages, siteOrigin } from '../src/personal/public-pages.ts'

// Optional retrieval convenience, generated from the same records as the site.
// Indexability is established by HTML, canonicals, robots, and the XML sitemap.
export function discoveryText(profile: string, profileAsOf: string, evidenceNotes: string) {
  const list = (pages: typeof publicPages) => pages.map(page =>
    `- [${page.route ? page.title.replace(' — Sulayman Bowles', '') : 'Home'}](${siteOrigin}${page.path}): ${page.description}`,
  ).join('\n')
  return `# Sulayman Bowles

> Official personal site: software, AI, product, growth, and finance.

Official site: ${siteOrigin}/
Profile source snapshot: ${profileAsOf}

## Profile

${profile}

## Primary pages

${list(publicPages.filter(page => !page.route.includes('/')))}

## Work

${list(publicPages.filter(page => page.route.startsWith('work/')))}

## Writing

${list(publicPages.filter(page => page.route.startsWith('writing/')))}

## Supporting references

- [Historical July 2026 résumé PDF](${siteOrigin}/Sulayman_Bowles_Resume.pdf): the web résumé reflects the September 2026 source snapshot.
- [Professional profile](https://www.linkedin.com/in/sulayman-bowles/)
- [Code](https://github.com/SulaymanB2024)

## Evidence boundaries

${evidenceNotes.trim()}
`
}
