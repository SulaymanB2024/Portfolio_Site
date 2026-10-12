export const personalizedOpeningIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
export const personalizedOpeningIdMeta = 'outreach-opening-id'
export const personalizedOpeningCopyElement = 'outreach-opening-copy'

export type OpeningLines = [string, string, string, string]
export interface PersonalizedOpeningContext { id: string; lines: OpeningLines }

export function validOpeningLines(value: unknown): value is OpeningLines {
  return Array.isArray(value) && value.length === 4 && value.every(line => typeof line === 'string'
    && line === line.trim() && line.length > 0 && line.length <= 112
    && !/[\x00-\x1f\x7f]|https?:\/\/|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\{\{|\}\}/i.test(line))
    && value.join(' ').split(/\s+/).length <= 44
}

export function personalizedOpeningPath(id: string) {
  if (!personalizedOpeningIdPattern.test(id)) throw new Error('Invalid opening ID')
  return `/for/${id}`
}

export function personalizedOpeningId(pathname: string): string | undefined {
  const id = pathname.replace(/\/$/, '').slice('/for/'.length)
  return pathname.startsWith('/for/') && personalizedOpeningIdPattern.test(id) ? id : undefined
}
