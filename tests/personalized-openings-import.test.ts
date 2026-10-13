import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { csvRows, prepareOpeningInputs } from '../tools/outreach/prepare-openings.ts'
import { defaultOpeningTemplates, resolveOpeningTemplates } from '../tools/outreach/opening-templates.ts'

test('quoted CSV preserves a multiline JD and exact copy while only approved public fields export', () => {
  const id = randomUUID()
  const row = [id, 'Coinbase', 'private-relationship-id', 'Rebhi', 'private-app-key', 'Sales Intern', 'https://example.test/jd', 'A multiline\nJD with "quotes", commas.', 'Research', 'Existing public crypto research', '', '', 'Institutional clients', '{{greeting}}I’ve researched', 'institutional crypto.', '{{company}} interests me for', 'its client work.', 'Draft', '', '', '', '']
  const csv = ['Page ID,Company,...', row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')].join('\r\n')
  const parsed = csvRows(csv)
  assert.equal(parsed[1][7], row[7])
  const publicRows = prepareOpeningInputs(parsed.slice(1))
  assert.deepEqual(publicRows[0].lines, ['Rebhi — I’ve researched', 'institutional crypto.', 'Coinbase interests me for', 'its client work.'])
  assert.equal(publicRows[0].status, 'Draft')
  assert(!JSON.stringify(publicRows).includes('private-'))
  assert(!JSON.stringify(publicRows).includes('example.test'))
  assert.equal(prepareOpeningInputs(parsed.slice(1), true)[0].status, 'Ready')
})

test('name and keyword substitutions follow spreadsheet edits and missing greeting stays natural', () => {
  const template = ['{{greeting}}I’ve used', '{{priority_1}}.', 'I’m interested in {{company}}’s', '{{role}}.']
  assert.deepEqual(resolveOpeningTemplates(template, { greetingName: 'Alex', company: 'Google', priority1: 'Python and SQL', role: 'data role' }), ['Alex — I’ve used', 'Python and SQL.', 'I’m interested in Google’s', 'data role.'])
  assert.deepEqual(resolveOpeningTemplates(template, { company: 'Google', priority1: 'financial models', role: 'finance role' }), ['I’ve used', 'financial models.', 'I’m interested in Google’s', 'finance role.'])
  assert.throws(() => resolveOpeningTemplates(template, { company: 'Google' }), /Missing opening field/)
  assert.throws(() => resolveOpeningTemplates(['{{private_notes}}', 'one', 'two', 'three'], {}), /Unknown opening field/)
})

test('unfinished drafts remain unpublished without blocking complete rows; Ready cannot contain unresolved fields', () => {
  const row = { recordId: randomUUID(), company: 'Google', status: 'Draft', lines: ['{{greeting}}I bring', '{{priority_1}}.', 'A third row', 'A fourth row'] }
  const prepared = prepareOpeningInputs([row], true)
  assert.equal(prepared[0].status, 'Draft')
  assert.equal(prepared[0].lines, undefined)
  assert.throws(() => prepareOpeningInputs([{ ...row, status: 'Ready' }]), /Missing opening field/)
  assert.throws(() => prepareOpeningInputs({ rows: [row] }), /Expected an array/)
  assert.throws(() => csvRows('"unclosed'), /Unclosed CSV field/)
})

test('Ready exports require sourced priorities and matching evidence; role-only copy needs no invented JD', () => {
  const row = { recordId: randomUUID(), company: 'Google', status: 'Ready', lines: ['I build', 'research tools.', 'I like Google’s', 'grounded answers.'], priority1: 'Research', evidence1: 'Atlas evidence console' }
  assert.throws(() => prepareOpeningInputs([row]), /job-description URL/)
  const sourced = { ...row, jobDescriptionUrl: 'https://example.test/sourced-role', jobDescriptionExcerpt: 'The role includes research.' }
  assert.throws(() => prepareOpeningInputs([{ ...sourced, evidence1: '' }]), /personal evidence/)
  assert.equal(prepareOpeningInputs([sourced])[0].status, 'Ready')
  const cells = [row.recordId, row.company, '', '', '', 'Research role', sourced.jobDescriptionUrl, sourced.jobDescriptionExcerpt, row.priority1, row.evidence1, '', '', '', ...row.lines, row.status, '', '', '', '']
  assert.deepEqual(prepareOpeningInputs([cells]), prepareOpeningInputs([sourced]))
  assert.equal(prepareOpeningInputs([{ ...row, priority1: '', evidence1: '' }])[0].status, 'Ready')
})

test('salutation and contribution greet a known recipient or company team without changing legacy greetings', () => {
  const templates = ['{{salutation}} — I could bring', '{{contribution}} to {{company}}.', '{{evidence_1}}', '{{why_company}}']
  const fields = { company: 'Google', greetingName: '  Taylor  ', contribution: 'research with checkable evidence', evidence1: 'I built Atlas to trace sources.', whyCompany: 'I like Google’s source-linked answers.' }
  assert.deepEqual(resolveOpeningTemplates(templates, fields), ['Hi Taylor — I could bring', 'research with checkable evidence to Google.', 'I built Atlas to trace sources.', 'I like Google’s source-linked answers.'])
  assert.equal(resolveOpeningTemplates(templates, { ...fields, greetingName: '' })[0], 'Hi Google team — I could bring')
  assert.equal(resolveOpeningTemplates(['{{greeting}}I build tools.', 'Second.', 'Third.', 'Fourth.'], fields)[0], 'Taylor — I build tools.')
  assert.equal(resolveOpeningTemplates(['{{greeting}}I build tools.', 'Second.', 'Third.', 'Fourth.'], { ...fields, greetingName: '' })[0], 'I build tools.')
})

test('JSON and W-column inputs project only resolved public copy and require evidence for contribution claims', () => {
  const item = { recordId: randomUUID(), company: 'Google', status: 'Ready', lineTemplates: [...defaultOpeningTemplates], greetingName: 'Taylor', contribution: 'source-linked research', evidence1: 'I built Atlas to trace evidence.', whyCompany: 'I like Google’s grounded answers.' }
  const cells = Array(23).fill('')
  cells[0] = item.recordId; cells[1] = item.company; cells[3] = item.greetingName; cells[9] = item.evidence1; cells[12] = item.whyCompany
  cells.splice(13, 4, ...item.lineTemplates); cells[17] = item.status; cells[22] = item.contribution
  assert.deepEqual(prepareOpeningInputs([cells]), prepareOpeningInputs([item]))
  assert.deepEqual(Object.keys(prepareOpeningInputs([item])[0]).sort(), ['company', 'lines', 'recordId', 'status'])
  assert.throws(() => prepareOpeningInputs([{ ...item, evidence1: '' }]), /truthful personal evidence/)
  const secondEvidence = { ...item, evidence1: '', evidence2: 'My returns research traced freight costs.', lineTemplates: ['{{salutation}} — I could bring', '{{contribution}} to {{company}}.', '{{evidence_2}}', '{{why_company}}'] }
  assert.equal(prepareOpeningInputs([secondEvidence])[0].status, 'Ready')
  assert.throws(() => prepareOpeningInputs([{ ...item, contribution: '' }]), /Missing opening field: contribution/)
  const updated = prepareOpeningInputs([{ ...item, contribution: 'careful market research' }])[0]
  assert.equal(updated.recordId, item.recordId)
  assert.equal(updated.lines?.[1], 'careful market research to Google.')
})

test('empty new template blocks get mechanical defaults while literal and partial blocks are retained', () => {
  const item = { recordId: randomUUID(), company: 'Google', status: 'Ready', lines: ['', ' ', '', ''], contribution: 'source-linked research', evidence1: 'I built Atlas to trace evidence.', whyCompany: 'I like Google’s grounded answers.' }
  const original = structuredClone(item)
  assert.deepEqual(prepareOpeningInputs([item])[0].lines, ['Hi Google team — I could bring', 'source-linked research to Google.', item.evidence1, item.whyCompany])
  assert.deepEqual(item, original)
  const literals = ['An authored first row.', 'A second row.', 'A third row.', 'A fourth row.']
  assert.deepEqual(prepareOpeningInputs([{ ...item, lines: literals, contribution: '', evidence1: '' }])[0].lines, literals)
  const partial = { ...item, lines: ['Keep this authored row.', '', '', ''], status: 'Draft' }
  assert.equal(prepareOpeningInputs([partial])[0].lines, undefined)
  assert.throws(() => prepareOpeningInputs([{ ...partial, status: 'Ready' }]), /four concise text rows/)
  assert.equal(prepareOpeningInputs([{ ...item, status: 'Draft', contribution: '', evidence1: '' }])[0].status, 'Draft')
  const oldCells = Array(22).fill('')
  oldCells[0] = item.recordId; oldCells[1] = item.company; oldCells.splice(13, 4, ...literals); oldCells[17] = 'Ready'
  assert.deepEqual(prepareOpeningInputs([oldCells])[0].lines, literals)
})
