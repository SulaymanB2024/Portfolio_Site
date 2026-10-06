import { articleHref, safeHref } from './links.ts'
import type { ArticleSummary } from './types.ts'

const tags = new Set(['div', 'p', 'strong', 'section', 'h2', 'figure', 'img', 'figcaption', 'table', 'thead', 'tr', 'th', 'tbody', 'td', 'ul', 'li', 'a', 'span', 'small', 'ol'])
const attributes = new Set(['class', 'id', 'aria-labelledby', 'aria-label', 'src', 'alt', 'width', 'height', 'loading', 'decoding', 'role', 'tabindex', 'scope', 'href', 'target', 'rel'])
const classes: Record<string, string> = {
  opening: 'article-lede', figure: 'reader-research-figure', 'figure-label': 'eyebrow',
  'data-table': 'reader-table', 'table-scroll': 'article-table-wrap',
  sources: 'reader-sources',
}
const escapeAttribute = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')

/** Fixed, recovered manuscript HTML only; never accept fetched or user HTML. */
export function restoredArticleHtml(html: string, catalog: ArticleSummary[], baseUrl = '/') {
  return html.replace(/<([^>]+)>/g, (tag, contents: string) => {
    const name = contents.match(/^\/?([a-z0-9]+)/i)?.[1]?.toLowerCase()
    if (!name || !tags.has(name)) throw new Error(`Unexpected original article element: ${name}`)
    if (contents.startsWith('/')) return tag
    const rawAttributes = contents.slice(name.length).replace(/\/$/, '')
    const downloadable = name === 'a' && /(?:^|\s)download(?:\s|$)/.test(rawAttributes)
    const quotedAttributes = downloadable ? rawAttributes.replace(/(?:^|\s)download(?=\s|$)/, ' ') : rawAttributes
    const pairs = [...quotedAttributes.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)]
    if (quotedAttributes.replace(/([\w:-]+)\s*=\s*"([^"]*)"/g, '').trim()) throw new Error('Unexpected original article attribute syntax')
    const adapted = pairs.map(([, key, value]) => {
      if (!attributes.has(key)) throw new Error(`Unexpected original article attribute: ${key}`)
      if ((key === 'href' || key === 'src') && (!safeHref(value) || /&(?:#|colon)/i.test(value))) throw new Error('Unsafe original article URL')
      if (key === 'href') value = escapeAttribute(articleHref(value.replaceAll('&amp;', '&'), catalog, baseUrl))
      if (key === 'src' && value.startsWith('/')) value = `${baseUrl}${value.slice(1)}`
      if (key === 'class') value = [...value.split(/\s+/).map(token => classes[token] || token), ...(name === 'section' ? ['reader-section'] : [])].join(' ')
      return `${key}="${value}"`
    })
    if (name === 'section' && !pairs.some(([, key]) => key === 'class')) adapted.push('class="reader-section"')
    if (downloadable) adapted.push('download')
    const element = `<${name}${adapted.length ? ` ${adapted.join(' ')}` : ''}${name === 'img' ? ' /' : ''}>`
    if (name === 'img') {
      const label = pairs.find(([, key]) => key === 'alt')?.[2] || 'Article figure'
      return `<div class="reader-figure-viewport" role="region" aria-label="${label}" tabindex="0">${element}</div>`
    }
    return element
  })
}
