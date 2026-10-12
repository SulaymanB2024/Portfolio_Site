import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { csvRows, prepareOpeningInputs } from '../tools/outreach/prepare-openings.ts'
import { resolveOpeningTemplates } from '../tools/outreach/opening-templates.ts'

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
