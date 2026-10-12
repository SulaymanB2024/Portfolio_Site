export interface OpeningTemplateFields {
  company?: string; greetingName?: string; role?: string; priority1?: string; priority2?: string
  evidence1?: string; evidence2?: string; whyCompany?: string
}

/** Editorially written row templates; input substitution makes no new personal claims. */
export function resolveOpeningTemplates(lines: unknown, fields: OpeningTemplateFields): string[] {
  if (!Array.isArray(lines) || lines.length !== 4 || !lines.every(line => typeof line === 'string')) throw new Error('Enter four opening rows')
  const clean = (value?: string) => String(value || '').trim().replace(/\s+/g, ' ')
  const name = clean(fields.greetingName)
  const values: Record<string, string> = {
    greeting: name ? `${name} — ` : '', company: clean(fields.company), role: clean(fields.role),
    priority_1: clean(fields.priority1), priority_2: clean(fields.priority2),
    evidence_1: clean(fields.evidence1), evidence_2: clean(fields.evidence2), why_company: clean(fields.whyCompany),
  }
  return lines.map(line => {
    const resolved = line.replace(/\{\{\s*([a-z_0-9]+)\s*\}\}/g, (_: string, key: string) => {
      if (!Object.hasOwn(values, key)) throw new Error(`Unknown opening field: ${key}`)
      if (key !== 'greeting' && !values[key]) throw new Error(`Missing opening field: ${key}`)
      return values[key]
    }).trim().replace(/\s+/g, ' ')
    if (/\{\{|\}\}/.test(resolved)) throw new Error('Unresolved opening field')
    return resolved
  })
}
