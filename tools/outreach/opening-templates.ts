export interface OpeningTemplateFields {
  company?: string; greetingName?: string; role?: string; priority1?: string; priority2?: string
  evidence1?: string; evidence2?: string; whyCompany?: string; contribution?: string
}

export const defaultOpeningTemplates = ['{{salutation}} — I could bring', '{{contribution}} to {{company}}.', '{{evidence_1}}', '{{why_company}}'] as const

/** Only a wholly empty block gets defaults; an authored or partial block is never replaced. */
export function openingTemplateRows(lines: unknown, company?: string): string[] {
  if (!Array.isArray(lines) || lines.length !== 4 || !lines.every(line => typeof line === 'string')) throw new Error('Enter four opening rows')
  return String(company || '').trim() && lines.every(line => !line.trim()) ? [...defaultOpeningTemplates] : [...lines]
}

/** Editorially written row templates; input substitution makes no new personal claims. */
export function resolveOpeningTemplates(lines: unknown, fields: OpeningTemplateFields): string[] {
  const templates = openingTemplateRows(lines, fields.company)
  const clean = (value?: string) => String(value || '').trim().replace(/\s+/g, ' ')
  const name = clean(fields.greetingName)
  const values: Record<string, string> = {
    greeting: name ? `${name} — ` : '', salutation: name ? `Hi ${name}` : clean(fields.company) ? `Hi ${clean(fields.company)} team` : '', company: clean(fields.company), role: clean(fields.role),
    priority_1: clean(fields.priority1), priority_2: clean(fields.priority2),
    evidence_1: clean(fields.evidence1), evidence_2: clean(fields.evidence2), why_company: clean(fields.whyCompany), contribution: clean(fields.contribution),
  }
  return templates.map(line => {
    const resolved = line.replace(/\{\{\s*([a-z_0-9]+)\s*\}\}/g, (_: string, key: string) => {
      if (!Object.hasOwn(values, key)) throw new Error(`Unknown opening field: ${key}`)
      if (key !== 'greeting' && !values[key]) throw new Error(`Missing opening field: ${key}`)
      return values[key]
    }).trim().replace(/\s+/g, ' ')
    if (/\{\{|\}\}/.test(resolved)) throw new Error('Unresolved opening field')
    return resolved
  })
}
