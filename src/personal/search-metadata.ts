import catalog from './editorial/data/catalog.json' with { type: 'json' }
import { publicPages, siteOrigin } from './public-pages.ts'
import { siteMetadata } from './site-copy.ts'
import { identity } from './identity.ts'
import type { ArticleSummary } from './editorial/types.ts'
import { findReadingTopic, topicReadings } from './editorial/topics.ts'

export const personId = `${siteOrigin}/#person`
export const websiteId = `${siteOrigin}/#website`
export const indexRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

type SchemaNode = { '@id': string; '@type': string; [key: string]: unknown }
export interface SearchMetadata {
  route: string
  title: string
  description: string
  canonical: string
  robots: string
  image: { url: string; alt: string; width?: number; height?: number }
  article?: { published: string; modified?: string; section: string }
  schema: { '@context': string; '@graph': SchemaNode[] } | null
}

// Search titles explain the page; editorial headlines remain in publicPages.
const pageTitles: Record<string, string> = {
  '': 'Sulayman Bowles — Product, AI & Finance',
  work: 'Work & Projects — Sulayman Bowles',
  writing: 'Writing on AI, Software & Markets — Sulayman Bowles',
  about: 'About Sulayman Bowles — Product, Growth & Finance',
  resume: 'Sulayman Bowles Résumé — Experience & Education',
  contact: 'Contact Sulayman Bowles',
}

// Actual dimensions of the existing share assets, checked by the build gate.
const imageSizes: Record<string, [number, number]> = {
  '/og-default.png': [1200, 630],
  '/og-personal.png': [1200, 630],
  '/images/social/og-research.png': [1200, 630],
  '/images/viralbench-agent-harness-hero.png': [1672, 941],
}

export function sourceDate(value?: string) {
  if (!value) return undefined
  const date = value.replaceAll('.', '-')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined
  const parsed = new Date(`${date}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : undefined
}

export function searchMetadata(route: string): SearchMetadata {
  const normalized = route === 'home' ? '' : route
  const page = publicPages.find(page => page.route === normalized)
  if (!page) return {
    route: normalized, title: 'Page not found — Sulayman Bowles',
    description: 'This address does not exist.', canonical: `${siteOrigin}/404`,
    robots: 'noindex, follow',
    image: { url: `${siteOrigin}/og-personal.png`, alt: 'Sulayman Bowles', width: 1200, height: 630 },
    schema: null,
  }
  const article = (catalog as ArticleSummary[]).find(article => page.route === `writing/${article.slug}`)
  const description = article?.seoDescription || page.description
  const canonical = `${siteOrigin}${page.path}`
  const imagePath = article?.image || '/og-personal.png'
  const size = imageSizes[imagePath]
  const image = {
    url: `${siteOrigin}${imagePath}`,
    alt: article ? `${article.displayTitle || article.title} — Sulayman Bowles` : 'Sulayman Bowles — work and writing',
    ...(size ? { width: size[0], height: size[1] } : {}),
  }
  const published = sourceDate(article?.date)
  const modified = sourceDate(article?.dateModified)
  const reference = (id: string) => ({ '@id': id })
  const profile = normalized === 'about' || normalized === 'resume'
  const topic = normalized.startsWith('topics/') ? findReadingTopic(normalized.slice('topics/'.length)) : undefined
  const collection = normalized === 'writing' || normalized === 'work' || Boolean(topic)
  const webpageId = `${canonical}#webpage`
  const imageId = `${image.url}#image`
  const graph: SchemaNode[] = [
    {
      '@type': 'Person', '@id': personId, name: identity.name,
      givenName: identity.givenName, familyName: identity.familyName,
      url: `${siteOrigin}/about`, mainEntityOfPage: `${siteOrigin}/about`,
      description: normalized === '' ? identity.homeSummary : normalized === 'about' ? page.description : identity.summary,
      sameAs: identity.profiles.map(profile => profile.href),
      affiliation: { '@type': 'CollegeOrUniversity', name: identity.education.institution, url: 'https://www.utexas.edu/' },
    },
    {
      '@type': 'WebSite', '@id': websiteId, name: 'Sulayman Bowles',
      alternateName: ['sulayman-bowles.dev'],
      url: `${siteOrigin}/`, description: siteMetadata.description,
      inLanguage: 'en-US', publisher: reference(personId),
    },
    {
      '@type': profile ? 'ProfilePage' : collection ? 'CollectionPage' : normalized === 'contact' ? 'ContactPage' : 'WebPage',
      '@id': webpageId, url: canonical, name: page.title,
      description, inLanguage: 'en-US', isPartOf: reference(websiteId),
      primaryImageOfPage: reference(imageId),
      ...(profile ? { mainEntity: reference(personId) } : {}),
      ...(article ? { mainEntity: reference(`${canonical}#article`) } : {}),
      ...(collection ? { mainEntity: reference(`${canonical}#list`) } : {}),
    },
    {
      '@type': 'ImageObject', '@id': imageId, url: image.url,
      contentUrl: image.url, caption: image.alt,
      ...(size ? { width: size[0], height: size[1] } : {}),
    },
  ]
  if (article) graph.push({
    '@type': 'Article', '@id': `${canonical}#article`, url: canonical,
    headline: article.displayTitle || article.title, description,
    author: reference(personId), publisher: reference(personId),
    mainEntityOfPage: reference(webpageId), isPartOf: reference(websiteId),
    image: reference(imageId), inLanguage: 'en-US', articleSection: article.category,
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
  })
  if (collection) graph.push({
    '@type': 'ItemList', '@id': `${canonical}#list`,
    itemListElement: (topic ? topicReadings(topic).map(({ article }) => ({ path: article.path, title: article.displayTitle || article.title })) : publicPages.filter(item => item.route.startsWith(`${normalized}/`))).map((item, index) => ({
      '@type': 'ListItem', position: index + 1, url: `${siteOrigin}${item.path}`,
      name: item.title.replace(' — Sulayman Bowles', ''),
    })),
  })
  return {
    route: normalized,
    title: pageTitles[normalized] || (article ? `${article.seoTitle || article.title} — Sulayman Bowles` : page.title),
    description, canonical, robots: indexRobots, image,
    ...(article && published ? { article: { published, ...(modified ? { modified } : {}), section: article.category } } : {}),
    schema: { '@context': 'https://schema.org', '@graph': graph },
  }
}

export function metadataTags(metadata: SearchMetadata) {
  const tags: { attribute: 'name' | 'property'; key: string; value: string }[] = [
    { attribute: 'name', key: 'description', value: metadata.description },
    { attribute: 'name', key: 'author', value: 'Sulayman Bowles' },
    { attribute: 'name', key: 'robots', value: metadata.robots },
    { attribute: 'property', key: 'og:site_name', value: 'Sulayman Bowles' },
    { attribute: 'property', key: 'og:locale', value: 'en_US' },
    { attribute: 'property', key: 'og:type', value: metadata.article ? 'article' : 'website' },
    { attribute: 'property', key: 'og:title', value: metadata.title },
    { attribute: 'property', key: 'og:description', value: metadata.description },
    { attribute: 'property', key: 'og:url', value: metadata.canonical },
    { attribute: 'property', key: 'og:image', value: metadata.image.url },
    { attribute: 'property', key: 'og:image:alt', value: metadata.image.alt },
    { attribute: 'name', key: 'twitter:card', value: 'summary_large_image' },
    { attribute: 'name', key: 'twitter:title', value: metadata.title },
    { attribute: 'name', key: 'twitter:description', value: metadata.description },
    { attribute: 'name', key: 'twitter:image', value: metadata.image.url },
    { attribute: 'name', key: 'twitter:image:alt', value: metadata.image.alt },
  ]
  if (metadata.image.width && metadata.image.height) tags.push(
    { attribute: 'property', key: 'og:image:width', value: String(metadata.image.width) },
    { attribute: 'property', key: 'og:image:height', value: String(metadata.image.height) },
  )
  if (metadata.article) {
    tags.push(
      { attribute: 'property', key: 'article:published_time', value: metadata.article.published },
      { attribute: 'property', key: 'article:author', value: `${siteOrigin}/about` },
      { attribute: 'property', key: 'article:section', value: metadata.article.section },
    )
    if (metadata.article.modified) tags.push({ attribute: 'property', key: 'article:modified_time', value: metadata.article.modified })
  }
  return tags
}

export function serializeSchema(schema: SearchMetadata['schema']) {
  return JSON.stringify(schema).replace(/[<>&\u2028\u2029]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`)
}

export function escapeMetadata(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!))
}

export const ownsMetadataKey = (key: string) => ['description', 'author', 'robots'].includes(key) || /^(?:og:|twitter:|article:)/.test(key)

// Use the same metadata for the initial response and the browser's route updates.
export function withSearchHead(template: string, metadata: SearchMetadata) {
  const tags = metadataTags(metadata).map(tag => `<meta ${tag.attribute}="${tag.key}" content="${escapeMetadata(tag.value)}" />`).join('\n')
  const schema = metadata.schema ? `<script id="page-schema" data-route="${escapeMetadata(metadata.route)}" type="application/ld+json">${serializeSchema(metadata.schema)}</script>` : ''
  return template
    .replace(/<link\b[^>]*type=["']application\/atom\+xml["'][^>]*>/gi, '')
    .replace(/<title>[^]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*>/gi, tag => {
      const key = tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)?.[1]
      return key && ownsMetadataKey(key) ? '' : tag
    })
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, '')
    .replace(/<script\b[^>]*\bid=["']page-schema["'][^>]*>[^]*?<\/script>/gi, '')
    .replace('</head>', () => `<title>${escapeMetadata(metadata.title)}</title>\n<link rel="canonical" href="${escapeMetadata(metadata.canonical)}" />\n<link rel="alternate" type="application/atom+xml" title="Sulayman Bowles — Writing" href="${siteOrigin}/feed.xml" />\n${tags}\n${schema}\n</head>`)
}
