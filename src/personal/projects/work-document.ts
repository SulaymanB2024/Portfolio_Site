export interface WorkLink {
  label: string
  href: string
  description: string
  download?: boolean
}

export interface WorkChapter {
  id: string
  label: string
  title: string
  body: string[]
  table?: { caption: string; columns: string[]; rows: string[][]; note?: string }
  links?: WorkLink[]
  artifact?: 'system' | 'atlas' | 'payroll' | 'viral'
  note?: string
}

export interface WorkDocument {
  role: string
  deck: string
  summary: string
  chapters: WorkChapter[]
  links: WorkLink[]
}

export function workLinkHref(href: string, base = '/') {
  return href.startsWith('./') ? `${base}${href.slice(2)}` : href
}
