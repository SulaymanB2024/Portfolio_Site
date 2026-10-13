import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { validateOpenings } from '../../lib/outreach/openings.ts'
import { personalizedOpeningPath, validOpeningLines } from '../../src/personal/recruiter/personalized-copy.ts'
import { openingTemplateRows, resolveOpeningTemplates } from './opening-templates.ts'

export function csvRows(text: string) {
  const rows: string[][] = [], row: string[] = []
  let field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++ }
      else if (quoted || field === '') quoted = !quoted
      else throw new Error('Unexpected quote in CSV field')
    } else if (!quoted && c === ',') { row.push(field); field = '' }
    else if (!quoted && (c === '\n' || c === '\r')) {
      row.push(field); field = ''; rows.push([...row]); row.length = 0
      if (c === '\r' && text[i + 1] === '\n') i++
    } else field += c
  }
  if (quoted) throw new Error('Unclosed CSV field')
  if (field || row.length) { row.push(field); rows.push([...row]) }
  return rows
}

/** Project source context into the small public-copy contract; never export the JD/contact record. */
export function prepareOpeningInputs(rows: unknown, preview = false) {
  if (!Array.isArray(rows)) throw new Error('Expected an array of opening rows')
  const input = rows.map((row: any) => {
    const item = Array.isArray(row)
      ? { recordId: String(row[0] || ''), company: String(row[1] || ''), status: String(row[17] || 'Draft'), lines: Array.from({ length: 4 }, (_, index) => String(row[index + 13] || '')), greetingName: row[3], role: row[5], jobDescriptionUrl: row[6], jobDescriptionExcerpt: row[7], priority1: row[8], evidence1: row[9], priority2: row[10], evidence2: row[11], whyCompany: row[12], contribution: row[22] }
      : { ...row, recordId: row.recordId || row.pageId, status: row.status || 'Draft', lines: row.lineTemplates ?? row.lines ?? ['', '', '', ''] }
    let lines: string[]
    try {
      const templates = openingTemplateRows(item.lines, item.company)
      if (item.status === 'Ready' && templates.some(line => /\{\{\s*contribution\s*\}\}/.test(line)) && !String(item.evidence1 || '').trim() && !String(item.evidence2 || '').trim()) throw new Error('A contribution needs truthful personal evidence in Evidence 1 or Evidence 2')
      lines = resolveOpeningTemplates(templates, item)
    }
    catch (error) { if (item.status === 'Ready') throw error; lines = ['', '', '', ''] }
    if (item.status === 'Ready') {
      const present = (value: unknown) => Boolean(String(value || '').trim())
      if ((present(item.priority1) || present(item.priority2)) && (!/^https?:\/\//i.test(String(item.jobDescriptionUrl || '').trim()) || !present(item.jobDescriptionExcerpt))) {
        throw new Error('A claimed JD priority needs the real job-description URL and supporting excerpt')
      }
      if (present(item.priority1) && !present(item.evidence1) || present(item.priority2) && !present(item.evidence2)) throw new Error('A selected priority needs truthful personal evidence')
    }
    return { recordId: item.recordId, company: item.company, status: item.status, lines }
  })
    .filter(row => row.company)
  const validated = validateOpenings(input)
  if (!preview) return validated
  return validated.map(row => row.status === 'Draft' && validOpeningLines(row.lines) ? { ...row, status: 'Ready' as const } : row)
}

async function main() {
  const args = process.argv.slice(2)
  const flag = (name: string) => args[args.indexOf(name) + 1]
  if (!args.includes('--input') || !flag('--input') || !args.includes('--output') || !flag('--output')) {
    throw new Error('Use --input <Personalized Openings CSV or JSON> --output <JSON>. Optional --preview displays prepared Draft copy locally; it does not publish.')
  }
  const path = flag('--input'), output = flag('--output')
  const text = await readFile(path, 'utf8')
  const rows = path.toLowerCase().endsWith('.csv') ? csvRows(text.replace(/^\uFEFF/, '')).slice(1) : JSON.parse(text)
  const result = prepareOpeningInputs(rows, args.includes('--preview'))
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 })
  const visible = result.filter(row => row.status === 'Ready')
  console.log(`Prepared ${result.length} opening records; ${visible.length} displayable ${args.includes('--preview') ? 'local previews' : 'Ready records'}. No network request was made.`)
  for (const row of visible) console.log(`${row.company}: ${personalizedOpeningPath(row.recordId)}`)
}

if (process.argv[1]?.endsWith('/prepare-openings.ts')) void main().catch(error => { console.error(error.message); process.exitCode = 1 })
