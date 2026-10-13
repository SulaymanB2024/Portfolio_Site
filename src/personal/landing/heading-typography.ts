import type { LandingChapter } from './sequence.ts'

export interface HeadingRow { text: string; scale: number; leading: number }
export interface HeadingLayout { rows: HeadingRow[]; fit: number; height: number }

/** Leave the original desktop sculpture band clear when it holds longer copy. */
export function headingFitWidth(chapter: LandingChapter, columnWidth: number, stageWidth: number) {
  return chapter.id === 'helmet' && chapter.lines.length === 4 && stageWidth > 700
    ? Math.min(columnWidth, stageWidth * .45) : columnWidth
}

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
  let rows = headingRows(chapter)
  const measured = rows.map(measure)
  const customOpening = chapter.id === 'helmet' && chapter.lines.length === 4
  const allowance = Math.max(1, width - 2)
  const longest = Math.max(...measured.filter((_, index) => !customOpening || index % 2 === 1))
  const fit = Math.min(1, allowance / Math.max(1, longest))
  if (customOpening && fontSize > 0) {
    // A long display row must not also make readable supporting copy tiny.
    // Fit the quiet pair separately, keeping all four rows inside the column.
    const quietFit = Math.min(1, allowance / Math.max(1, measured[0], measured[2]))
    const quietFont = Math.min(fontSize * .49 * quietFit, Math.max(14, fontSize * .49 * fit), fontSize * fit * .8)
    rows = rows.map((row, index) => index % 2 === 0 ? { ...row, scale: quietFont / (fontSize * fit) } : row)
  }
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
