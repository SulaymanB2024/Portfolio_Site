import type { LandingChapter } from './sequence.ts'

export interface HeadingRow { text: string; scale: number; leading: number }
export interface HeadingLayout { rows: HeadingRow[]; fit: number; height: number }

export function headingRows(chapter: LandingChapter): HeadingRow[] {
  return chapter.id === 'helmet'
    ? [
        { text: chapter.lines.length === 4 ? chapter.lines[0] : 'The', scale: .49, leading: 1.7 },
        { text: chapter.lines.length === 4 ? chapter.lines[1] : 'frontier', scale: 1, leading: 1.01 },
        { text: chapter.lines.length === 4 ? chapter.lines[2] : 'is all that', scale: .49, leading: 1.7 },
        { text: chapter.lines.length === 4 ? chapter.lines[3] : 'matters.', scale: 1, leading: 1.01 },
      ]
    : chapter.lines.map(text => ({ text, scale: 1, leading: 1.01 }))
}

// DOM, animated atlas and mobile sculpture clearance use the same composition.
export const HEADING_RESERVE_EM = 2 * (.49 * 1.7 + 1.01)

export function layoutHeading(chapter: LandingChapter, fontSize: number, width: number, measure: (row: HeadingRow) => number): HeadingLayout {
  const rows = headingRows(chapter)
  const longest = Math.max(...rows.map(measure))
  const fit = Math.min(1, Math.max(1, width - 2) / Math.max(1, longest))
  return { rows, fit, height: rows.reduce((height, row) => height + fontSize * fit * row.scale * row.leading, 0) }
}

export function renderHeading(headline: HTMLHeadingElement, layout: HeadingLayout) {
  const children: Node[] = []
  const tracking = parseFloat(getComputedStyle(headline).letterSpacing) || 0
  for (const row of layout.rows) {
    if (children.length) children.push(document.createTextNode(' '))
    const line = document.createElement('span')
    line.className = 'landing-title-line'
    line.textContent = row.text
    line.style.fontSize = `${row.scale * layout.fit}em`
    line.style.lineHeight = String(row.leading)
    line.style.letterSpacing = `${row.scale < 1 ? 0 : tracking * layout.fit}px`
    children.push(line)
  }
  headline.replaceChildren(...children)
}
