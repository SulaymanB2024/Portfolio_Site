import { metadataTags, ownsMetadataKey, searchMetadata, serializeSchema } from './search-metadata.ts'
import { documentOutreachCompany } from './outreach-context.ts'
import { recruiterMetadata } from './recruiter/landing.ts'

export function updateSearchHead(document: Document, route: string) {
  const company = documentOutreachCompany(document, document.location?.pathname || '/')
  const metadata = company ? recruiterMetadata(company, route) : searchMetadata(route)
  document.title = metadata.title
  const wanted = metadataTags(metadata)
  // Reuse head elements and discard superseded article fields and duplicates.
  const existing = new Map<string, HTMLMetaElement>()
  for (const element of document.head.querySelectorAll<HTMLMetaElement>('meta[name], meta[property]')) {
    const key = element.getAttribute('name') || element.getAttribute('property') || ''
    if (!ownsMetadataKey(key)) continue
    if (!wanted.some(tag => tag.key === key) || existing.has(key)) element.remove()
    else existing.set(key, element)
  }
  for (const tag of wanted) {
    const element = existing.get(tag.key) || document.createElement('meta')
    element.setAttribute(tag.attribute, tag.key)
    element.setAttribute('content', tag.value)
    if (!element.isConnected) document.head.append(element)
  }
  const canonicals = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')]
  const canonical = canonicals.shift() || document.createElement('link')
  canonicals.forEach(element => element.remove())
  canonical.rel = 'canonical'
  canonical.href = metadata.canonical
  if (!canonical.isConnected) document.head.append(canonical)
  let schema = document.head.querySelector<HTMLScriptElement>('#page-schema')
  if (!metadata.schema) { schema?.remove(); return }
  if (!schema) {
    schema = document.createElement('script')
    schema.id = 'page-schema'
    schema.type = 'application/ld+json'
    document.head.append(schema)
  }
  schema.dataset.route = metadata.route
  schema.textContent = serializeSchema(metadata.schema)
}
