export const outreachMetaName = 'outreach-company'
export const outreachSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Only the server-approved document context for this exact arrival pathname. */
export function approvedOutreachSlug(slug: unknown, pathname: string): string | undefined {
  if (typeof slug !== 'string' || slug.length > 96 || !outreachSlugPattern.test(slug)) return undefined
  return pathname.replace(/\/$/, '') === `/${slug}` ? slug : undefined
}

export function documentOutreachSlug(document: Pick<Document, 'querySelector'>, pathname: string): string | undefined {
  return approvedOutreachSlug(document.querySelector<HTMLMetaElement>(`meta[name="${outreachMetaName}"]`)?.content, pathname)
}
