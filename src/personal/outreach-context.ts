export const outreachMetaName = 'outreach-company'
export const outreachNameMeta = 'outreach-company-name'
export const outreachSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export interface OutreachCompanyContext { slug: string; name: string }

export function validOutreachCompanyName(name: unknown): name is string {
  return typeof name === 'string' && Boolean(name.trim()) && name.length <= 160 && !/[@\x00-\x1f]|https?:\/\//i.test(name)
}

/** Only the server-approved document context for this exact arrival pathname. */
export function approvedOutreachSlug(slug: unknown, pathname: string): string | undefined {
  if (typeof slug !== 'string' || slug.length > 96 || !outreachSlugPattern.test(slug)) return undefined
  return pathname.replace(/\/$/, '') === `/${slug}` ? slug : undefined
}

export function documentOutreachSlug(document: Pick<Document, 'querySelector'>, pathname: string): string | undefined {
  return approvedOutreachSlug(document.querySelector<HTMLMetaElement>(`meta[name="${outreachMetaName}"]`)?.content, pathname)
}

/** Public labels only. A query parameter cannot establish a company context. */
export function documentOutreachCompany(document: Pick<Document, 'querySelector'>, pathname: string): OutreachCompanyContext | undefined {
  const slug = documentOutreachSlug(document, pathname)
  const name = document.querySelector<HTMLMetaElement>(`meta[name="${outreachNameMeta}"]`)?.content
  return slug && validOutreachCompanyName(name) ? { slug, name } : undefined
}
