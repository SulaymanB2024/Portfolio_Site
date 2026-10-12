import { personalizedOpeningCopyElement, personalizedOpeningIdMeta, personalizedOpeningIdPattern, personalizedOpeningPath, validOpeningLines, type PersonalizedOpeningContext } from './recruiter/personalized-copy.ts'

export const outreachMetaName = 'outreach-company'
export const outreachNameMeta = 'outreach-company-name'
export const outreachSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export interface OutreachCompanyContext { slug: string; name: string; opening?: PersonalizedOpeningContext }

export function validOutreachCompanyName(name: unknown): name is string {
  return typeof name === 'string' && Boolean(name.trim()) && name.length <= 160 && !/[@\x00-\x1f]|https?:\/\//i.test(name)
}

/** Only the server-approved document context for this exact arrival pathname. */
export function approvedOutreachSlug(slug: unknown, pathname: string, openingId?: string): string | undefined {
  if (typeof slug !== 'string' || slug.length > 96 || !outreachSlugPattern.test(slug)) return undefined
  const path = pathname.replace(/\/$/, '')
  return path === `/${slug}` || Boolean(openingId && personalizedOpeningIdPattern.test(openingId) && path === personalizedOpeningPath(openingId)) ? slug : undefined
}

export function documentOutreachOpening(document: Pick<Document, 'querySelector'>, pathname: string): PersonalizedOpeningContext | undefined {
  const id = document.querySelector<HTMLMetaElement>(`meta[name="${personalizedOpeningIdMeta}"]`)?.content
  if (!id || !personalizedOpeningIdPattern.test(id) || pathname.replace(/\/$/, '') !== personalizedOpeningPath(id)) return undefined
  try {
    const value = JSON.parse(document.querySelector<HTMLScriptElement>(`#${personalizedOpeningCopyElement}`)?.textContent || '')
    return value.id === id && validOpeningLines(value.lines) ? { id, lines: value.lines } : undefined
  } catch { return undefined }
}

export function documentOutreachSlug(document: Pick<Document, 'querySelector'>, pathname: string): string | undefined {
  return approvedOutreachSlug(document.querySelector<HTMLMetaElement>(`meta[name="${outreachMetaName}"]`)?.content, pathname, documentOutreachOpening(document, pathname)?.id)
}

/** Public labels only. A query parameter cannot establish a company context. */
export function documentOutreachCompany(document: Pick<Document, 'querySelector'>, pathname: string): OutreachCompanyContext | undefined {
  const slug = documentOutreachSlug(document, pathname)
  const name = document.querySelector<HTMLMetaElement>(`meta[name="${outreachNameMeta}"]`)?.content
  const opening = documentOutreachOpening(document, pathname)
  return slug && validOutreachCompanyName(name) ? { slug, name, ...(opening ? { opening } : {}) } : undefined
}
