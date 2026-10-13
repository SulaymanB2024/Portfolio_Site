import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash, createHmac, randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { outreachSpreadsheetId, validSyncSignature } from '../lib/outreach/sync.ts'
import { defaultOpeningTemplates, resolveOpeningTemplates } from '../tools/outreach/opening-templates.ts'

const source = readFileSync(new URL('../tools/outreach/Code.gs', import.meta.url), 'utf8')
const secret = 'test-only-personalized-script-secret-'.repeat(2)
const companyHeaders = ['Company', 'Slug', 'Live URL', 'Sync status', 'Last synced', 'Record ID']
const legacyHeaders = ['Page ID', 'Company', 'Relationship ID', 'Greeting name', 'App Key', 'Role / team', 'Job description URL', 'Job description excerpt', 'Priority 1', 'Evidence 1', 'Priority 2', 'Evidence 2', 'Why company', 'Opening line 1', 'Opening line 2', 'Opening line 3', 'Opening line 4', 'Copy status', 'Personalized URL', 'Sync status', 'Last synced', 'Local preview URL']
const headers = [...legacyHeaders, 'Contribution']
const lines = ['I built Atlas around', 'checkable evidence.', 'I like Google linking answers', 'back to sources.']
const row = (company = 'Google', status = 'Ready', copy = lines) => {
  const cells: any[] = Array(23).fill('')
  cells[1] = company; cells.splice(13, 4, ...copy); cells[17] = status
  return cells
}
const contributionRow = (status = 'Ready', copy = ['', '', '', '']) => {
  const cells = row('Google', status, copy)
  cells[3] = 'Taylor'; cells[9] = 'I built Atlas to trace evidence.'; cells[12] = 'I like Google’s grounded answers.'; cells[22] = 'source-linked research'
  return cells
}

function automation(input: any[][], companyNames: string[] = [], withSheet = true, signingKey = secret, openingHeaders = headers) {
  const rows = [openingHeaders.slice(), ...input.map(value => value.slice())]
  const companyRows = [companyHeaders.slice(), ...companyNames.map(name => [name, '', '', '', '', ''])]
  const properties = new Map<string, string>([['OUTREACH_SYNC_SECRET', signingKey]])
  const state = {
    posts: [] as any[], checks: [] as any[], sleeps: [] as number[], releases: 0,
    published: {} as Record<string, { company: string; slug: string; lines: string[]; enabled: boolean }>,
    companies: {} as Record<string, string>, failSync: false, failWriteback: false, locked: false,
    serveMode: 'valid', propagationOnSleep: false, badReceipt: false,
    duringFetch: undefined as undefined | (() => void), duringCheck: undefined as undefined | (() => void),
    duringIdWrite: undefined as undefined | (() => void), duringWriteback: undefined as undefined | (() => void),
    duringSourceRead: undefined as undefined | (() => void),
    triggers: [] as string[], notes: {} as Record<number, string>, validations: {} as Record<number, any>, widths: {} as Record<number, number>,
    headerPresentation: [] as { column: number; width: number; property: string; value: unknown }[],
    frozen: 0, created: 0,
  }
  const response = (code: number, body: string) => ({ getResponseCode: () => code, getContentText: () => body })
  const range = (cells: any[][], startRow: number, column: number, count = 1, width = 1): any => ({
    getValues() {
      if (cells === rows && startRow > 1 && column === 1 && count === 1 && width === 23) { const callback = state.duringSourceRead; state.duringSourceRead = undefined; callback?.() }
      return Array.from({ length: count }, (_, i) => Array.from({ length: width }, (_, j) => cells[startRow - 1 + i]?.[column - 1 + j] ?? ''))
    },
    setValues(values: any[][]) {
      if (cells === rows && column === 19) {
        if (state.failWriteback) { state.failWriteback = false; throw new Error('Interrupted opening writeback') }
        const callback = state.duringWriteback; state.duringWriteback = undefined; callback?.()
      }
      values.forEach((value, i) => {
        cells[startRow - 1 + i] ??= Array(cells === rows ? 23 : 6).fill('')
        value.forEach((cell, j) => { cells[startRow - 1 + i][column - 1 + j] = cell })
      })
      return this
    },
    setValue(value: any) {
      if (cells === rows && column === 1) { const callback = state.duringIdWrite; state.duringIdWrite = undefined; callback?.() }
      cells[startRow - 1] ??= Array(cells === rows ? 23 : 6).fill('')
      cells[startRow - 1][column - 1] = value
      return this
    },
    setFontWeight(value: string) { if (cells === rows && startRow === 1) state.headerPresentation.push({ column, width, property: 'fontWeight', value }); return this },
    setBackground(value: string) { if (cells === rows && startRow === 1) state.headerPresentation.push({ column, width, property: 'background', value }); return this },
    setNumberFormat() { return this },
    setWrap(value: boolean) { if (cells === rows && startRow === 1) state.headerPresentation.push({ column, width, property: 'wrap', value }); return this },
    setNote(note: string) { if (cells === rows) state.notes[column] = note; return this },
    setDataValidation(rule: any) { if (cells === rows) state.validations[column] = rule; return this },
  })
  const sheet = (cells: any[][], name: string) => ({
    getName: () => name, getLastRow: () => cells.length, getMaxRows: () => 1000,
    getRange: (startRow: number | string, column?: number, count?: number, width?: number) => typeof startRow === 'string' ? range(cells, 1, 1) : range(cells, startRow, column!, count, width),
    setFrozenRows(value: number) { if (cells === rows) state.frozen = value },
    setColumnWidth(column: number, value: number) { if (cells === rows) state.widths[column] = value }, hideColumns() {},
  })
  let openingsSheet: any = withSheet ? sheet(rows, 'Personalized Openings') : undefined
  const legacySheet = sheet(companyRows, 'Portfolio Links')
  const workbook = {
    getId: () => outreachSpreadsheetId,
    getSheetByName: (name: string) => name === 'Personalized Openings' ? openingsSheet : name === 'Portfolio Links' ? legacySheet : undefined,
    insertSheet(name: string) { assert.equal(name, 'Personalized Openings'); state.created++; rows.length = 0; rows.push(Array(23).fill('')); return openingsSheet = sheet(rows, name) },
  }
  const builder = () => {
    const rule: any = {}
    const api: any = {
      requireValueInList(values: string[], visible: boolean) { rule.values = values; rule.visible = visible; return api },
      requireFormulaSatisfied(value: string) { rule.formula = value; return api },
      setAllowInvalid(value: boolean) { rule.allowInvalid = value; return api },
      setHelpText(value: string) { rule.help = value; return api }, build: () => rule,
    }
    return api
  }
  const context: any = vm.createContext({
    SpreadsheetApp: { getActiveSpreadsheet: () => workbook, flush() {}, newDataValidation: builder },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => properties.get(key), setProperty: (key: string, value: string) => properties.set(key, value), deleteProperty: (key: string) => properties.delete(key) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => !state.locked, releaseLock: () => { state.releases++ } }) },
    Utilities: {
      getUuid: randomUUID, DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'UTF-8' },
      computeDigest: (_: string, value: string) => [...createHash('sha256').update(value).digest()],
      base64Encode: (value: number[]) => Buffer.from(value).toString('base64'),
      computeHmacSha256Signature: (value: string, key: string, charset: string) => {
        assert.equal(charset, 'UTF-8')
        return [...createHmac('sha256', Buffer.from(key, 'utf8')).update(value, 'utf8').digest()].map(byte => byte > 127 ? byte - 256 : byte)
      },
      sleep: (delay: number) => { state.sleeps.push(delay); if (state.propagationOnSleep) state.serveMode = 'valid' },
    },
    UrlFetchApp: {
      fetch(url: string, options: any) {
        assert.equal(url, 'https://sulayman-bowles.dev/api/outreach-sync')
        assert.equal(options.contentType, 'application/json; charset=utf-8')
        assert(validSyncSignature(options.payload, options.headers['X-Outreach-Timestamp'], options.headers['X-Outreach-Signature'], signingKey))
        const input = JSON.parse(options.payload)
        assert.equal(input.spreadsheetId, outreachSpreadsheetId)
        state.posts.push(input)
        const callback = state.duringFetch; state.duringFetch = undefined; callback?.()
        if (state.failSync) return response(503, JSON.stringify({ error: 'Temporary registry failure' }))
        if (input.sheet === 'Portfolio Links') {
          const links = input.companies.map((entry: any) => {
            const slug = entry.company === 'Microsoft' ? 'microsoft' : 'google'
            state.companies[entry.recordId] = slug
            return { ...entry, slug, url: `https://sulayman-bowles.dev/${slug}` }
          })
          return response(200, JSON.stringify({ revision: 1, changed: true, links }))
        }
        assert.equal(input.sheet, 'Personalized Openings')
        const links = input.openings.map((entry: any) => {
          assert.deepEqual(Object.keys(entry).sort(), ['company', 'lines', 'recordId', 'status'])
          const prior = state.published[entry.recordId]
          if (prior && prior.company !== entry.company) throw new Error('Server rejects changed company binding')
          if (entry.status === 'Ready') state.published[entry.recordId] = { company: entry.company, slug: entry.company === 'Microsoft' ? 'microsoft' : 'google', lines: entry.lines, enabled: true }
          else if (entry.status === 'Paused' && prior) prior.enabled = false
          const published = state.published[entry.recordId]
          return { recordId: entry.recordId, company: entry.company, status: entry.status, ...(published ? { slug: published.slug, url: `https://sulayman-bowles.dev/for/${entry.recordId}` } : {}) }
        })
        if (state.badReceipt && links.length) links[0].url = 'https://unexpected.example/for/' + links[0].recordId
        return response(200, JSON.stringify({ revision: 1, changed: true, links }))
      },
      fetchAll(requests: any[]) {
        const callback = state.duringCheck; state.duringCheck = undefined; callback?.()
        state.checks.push(...requests)
        return requests.map(request => {
          assert.equal(request.method, 'get'); assert.equal(request.followRedirects, false)
          const id = request.url.split('/').at(-1)
          const opening = state.published[id]
          if (!opening) return response(200, `<meta name="outreach-company" content="${id}"><link rel="canonical" href="https://sulayman-bowles.dev/">`)
          const copy = { id: state.serveMode === 'wrong-id' ? randomUUID() : id, lines: state.serveMode === 'stale-copy' ? lines : opening.lines }
          const script = JSON.stringify(copy).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
          return response(!opening.enabled ? 404 : state.serveMode === 'redirect' ? 302 : 200, `<meta name="outreach-company" content="${state.serveMode === 'wrong-company' ? 'stripe' : opening.slug}"><meta name="outreach-opening-id" content="${copy.id}"><script type="application/json" id="outreach-opening-copy">${script}</script>`)
        })
      },
    },
    ScriptApp: {
      getProjectTriggers: () => state.triggers.map(name => ({ getHandlerFunction: () => name })),
      newTrigger(name: string) { const trigger: any = { forSpreadsheet: () => trigger, onEdit: () => trigger, timeBased: () => trigger, everyMinutes: (value: number) => { assert.equal(value, 5); return trigger }, create: () => state.triggers.push(name) }; return trigger },
    },
  })
  vm.runInContext(source, context)
  return { rows, companyRows, state, properties, run: () => context.outreachReconcile(), runOpenings: () => context.outreachReconcileOpenings_(), setup: () => context.installPersonalizedOpeningsSheet(), install: () => context.installOutreachAutomation(),
    resolve: (cells: any[]) => [...context.outreachResolveOpeningLines_(cells)],
    edit: (name: string, column: number, width = 1) => context.outreachSheetEdited({ range: { getSheet: () => ({ getName: () => name }), getColumn: () => column, getLastColumn: () => column + width - 1, getLastRow: () => 2 } }) }
}

test('Unicode opening text and signing keys use the same UTF-8 bytes as the server', () => {
  const copy = ['Zoë — I build tools with', 'Python and SQL.', 'I like answers tied to', 'checkable sources.']
  const app = automation([row('Google', 'Ready', copy)], [], true, 'tést-only-UTF8-signing-key-'.repeat(3))
  app.run()
  assert.deepEqual(app.state.posts[0].openings[0].lines, copy)
  assert.equal(app.rows[1][19], 'Live')
  assert.deepEqual(app.state.published[app.rows[1][0]].lines, copy)
})

test('personalized batches reuse HMAC and send only resolved public fields; same-company pairings keep distinct IDs', () => {
  const first = row(); first[2] = 'rel-private'; first[3] = 'Taylor'; first[4] = 'app-private'; first[5] = 'Data internship'
  const app = automation([first, row('Google', 'Ready', ['I worked on pricing at an', 'AI image startup.', 'I like Google grounding answers', 'in source material.'])])
  app.state.duringFetch = () => { const moved = app.rows.splice(1, 1)[0]; app.rows.push(moved) }
  app.run()
  assert.notEqual(app.rows[1][0], app.rows[2][0])
  for (const cells of app.rows.slice(1)) { assert.equal(cells[18], `https://sulayman-bowles.dev/for/${cells[0]}`); assert.equal(cells[19], 'Live') }
  assert.equal(app.state.checks.length, 2)
  assert(!JSON.stringify(app.state.posts).includes('rel-private'))
  assert(!JSON.stringify(app.state.posts).includes('app-private'))
  app.run(); assert.equal(app.state.posts.length, 1)
})

test('reviewed templates use row inputs and a missing name has a clean fallback; changed used fields reverify the same URL', () => {
  const cells = row('Google', 'Ready', ['{{greeting}}I built Atlas around', 'checkable evidence.', 'I like {{company}} linking answers', 'back to sources.'])
  cells[3] = 'Taylor'
  const app = automation([cells]); app.run()
  assert.equal(app.state.posts[0].openings[0].lines[0], 'Taylor — I built Atlas around')
  const id = app.rows[1][0]; const url = app.rows[1][18]
  app.rows[1][3] = ''; app.run()
  assert.equal(app.state.posts[1].openings[0].lines[0], 'I built Atlas around')
  assert.equal(app.rows[1][0], id); assert.equal(app.rows[1][18], url)
  assert.equal(app.state.checks.length, 2)
})

test('blank new openings seed greeting/contribution defaults, and W edits update the same verified public URL', () => {
  const cells = contributionRow(); cells[21] = 'http://127.0.0.1:4193/local-review'
  const app = automation([cells]); app.run()
  assert.deepEqual(app.rows[1].slice(13, 17), [...defaultOpeningTemplates])
  assert.deepEqual(app.state.posts[0].openings[0].lines, ['Hi Taylor — I could bring', 'source-linked research to Google.', cells[9], cells[12]])
  const id = app.rows[1][0]; const url = app.rows[1][18]
  app.rows[1][22] = 'careful market research'; app.edit('Personalized Openings', 23)
  assert.equal(app.state.posts[1].openings[0].lines[1], 'careful market research to Google.')
  assert.equal(app.rows[1][0], id); assert.equal(app.rows[1][18], url); assert.equal(app.rows[1][19], 'Live')
  app.rows[1][3] = ''; app.edit('Personalized Openings', 4)
  assert.equal(app.state.posts[2].openings[0].lines[0], 'Hi Google team — I could bring')
  app.rows[1][22] = 'checkable research'; app.edit('Personalized Openings', 22, 2)
  assert.equal(app.state.posts[3].openings[0].lines[1], 'checkable research to Google.')
  app.rows[1][21] = 'A different local preview'; app.edit('Personalized Openings', 22)
  assert.equal(app.state.posts.length, 4)
  app.rows[1][18] = ''; app.edit('Personalized Openings', 19)
  assert.equal(app.rows[1][18], url); assert.equal(app.state.posts.length, 5)
  assert.equal(app.rows[1][21], 'A different local preview')
  assert.deepEqual(app.state.triggers, [])
})

test('contribution claims need personal evidence and complete Ready copy; incomplete Drafts remain unpublished', () => {
  const cells = contributionRow('Ready', ['{{salutation}} — I could bring', '{{contribution}} to {{company}}.', 'I value checkable work.', '{{why_company}}'])
  cells[9] = ''
  const app = automation([cells]); assert.throws(app.run, /truthful personal evidence/); assert.equal(app.state.posts.length, 0)
  app.rows[1][11] = 'My returns research traced freight costs.'; app.run(); assert.equal(app.rows[1][19], 'Live')
  app.rows[1][22] = ''; assert.throws(app.run, /contribution.*nonempty source field/)
  app.rows[1][17] = 'Draft'; app.run()
  assert.match(app.rows[1][19], /^Draft — previous published copy retained/)
  const incomplete = automation([contributionRow('Draft')]); incomplete.rows[1][22] = ''; incomplete.rows[1][9] = ''
  incomplete.run(); assert.deepEqual(incomplete.rows[1].slice(13, 17), [...defaultOpeningTemplates]); assert.equal(incomplete.rows[1][18], '')
  assert.match(incomplete.rows[1][19], /^Draft — unpublished/)
})

test('default seeding preserves literal and partial blocks, and detects a concurrent source edit before writing', () => {
  const literal = contributionRow('Ready', lines)
  const partial = contributionRow('Draft', ['Keep this authored row.', '', '', ''])
  const app = automation([literal, partial]); app.run()
  assert.deepEqual(app.rows[1].slice(13, 17), lines)
  assert.deepEqual(app.rows[2].slice(13, 17), ['Keep this authored row.', '', '', ''])
  const moved = automation([contributionRow('Draft'), row()])
  moved.state.duringSourceRead = () => { moved.rows[1][13] = 'An authored edit made during setup.'; moved.rows[1][22] = 'careful market research' }
  assert.throws(moved.run, /Rows changed during template setup/)
  assert.equal(moved.state.posts.length, 0); assert.deepEqual(moved.rows[1].slice(13, 17), ['An authored edit made during setup.', '', '', ''])
  moved.run(); assert.deepEqual(moved.rows[1].slice(13, 17), ['An authored edit made during setup.', '', '', ''])
})

test('Apps Script and local greeting/contribution templates normalize fields identically', () => {
  const cells = contributionRow('Draft', [' {{ salutation }} — I could bring ', ' {{ contribution }} to {{ company }}. ', '{{ evidence_1 }}', '{{ why_company }}'])
  cells[3] = ' Zoë  '; cells[22] = 'source-linked\n research'; cells[9] = 'I built Atlas\n to trace evidence.'
  assert.deepEqual(automation([]).resolve(cells), resolveOpeningTemplates(cells.slice(13, 17), { company: cells[1], greetingName: cells[3], contribution: cells[22], evidence1: cells[9], whyCompany: cells[12] }))
})

test('role, sourced priorities, both evidence fields and the company reason resolve from their exact columns', () => {
  const cells = row('Google', 'Ready', ['{{greeting}}{{role}} draws me to {{company}}.', 'I bring {{evidence_1}}.', '{{priority_1}} and {{priority_2}} fit my work.', 'I like {{why_company}}; {{evidence_2}}.'])
  cells[3] = 'Taylor'; cells[5] = 'Data research'; cells[6] = 'https://careers.example.com/sourced-test-role'; cells[7] = 'This test JD lists Python and SQL.'
  cells[8] = 'Python'; cells[9] = 'data pipelines'; cells[10] = 'SQL'; cells[11] = 'auditable research'; cells[12] = 'grounded answers'
  const app = automation([cells]); app.run()
  assert.deepEqual(app.state.posts[0].openings[0].lines, ['Taylor — Data research draws me to Google.', 'I bring data pipelines.', 'Python and SQL fit my work.', 'I like grounded answers; auditable research.'])
  const url = app.rows[1][18]; app.rows[1][5] = 'Product research'; app.run()
  assert.equal(app.rows[1][18], url); assert.equal(app.state.checks.length, 2)
  assert.equal(app.state.posts[1].openings[0].lines[0], 'Taylor — Product research draws me to Google.')
})

test('Apps Script and local preparation normalize whitespace and token spacing identically', () => {
  const templates = ['  {{ greeting }} I bring {{ evidence_1 }}. ', '{{ role }} at {{company }} interests me.', '{{priority_1}} and {{priority_2}}.', 'I like {{ why_company }}; {{evidence_2}}.']
  const cells = row(' Google  ', 'Draft', templates)
  cells[3] = '  Taylor  '; cells[5] = ' Product\n research '; cells[8] = ' market\n analysis '; cells[9] = ' data\n pipelines '
  cells[10] = ' client   work '; cells[11] = ' auditable\n research '; cells[12] = ' grounded   answers '
  const expected = resolveOpeningTemplates(templates, { company: cells[1], greetingName: cells[3], role: cells[5], priority1: cells[8], evidence1: cells[9], priority2: cells[10], evidence2: cells[11], whyCompany: cells[12] })
  assert.deepEqual(automation([]).resolve(cells), expected)
})

test('incomplete Draft templates stay unpublished without blocking other Ready rows, and later drafts retain the old published copy', () => {
  const app = automation([row('Google', 'Draft', ['{{role}}', '{{unknown}}', '', '']), row()])
  app.run(); assert.equal(app.rows[1][18], ''); assert.match(app.rows[1][19], /^Draft — unpublished/)
  assert.deepEqual(app.state.posts[0].openings[0].lines, ['', '', '', ''])
  const id = app.rows[2][0]; const old = app.state.published[id].lines.slice()
  app.rows[2][17] = 'Draft'; app.rows[2][13] = 'Unpublished revised first row.'; app.run()
  assert.deepEqual(app.state.published[id].lines, old)
  assert.equal(app.rows[2][18], `https://sulayman-bowles.dev/for/${id}`)
  assert.match(app.rows[2][19], /^Draft — previous published copy retained/)
})

test('Paused disables an existing page; resuming Ready requires a fresh public-copy GET', () => {
  const app = automation([row()]); app.run(); const id = app.rows[1][0]
  app.rows[1][17] = 'Paused'; app.run()
  assert.equal(app.state.published[id].enabled, false); assert.equal(app.rows[1][19], 'Paused')
  assert.equal(app.rows[1][18], `https://sulayman-bowles.dev/for/${id}`)
  app.rows[1][17] = 'Draft'; app.run()
  assert.equal(app.state.published[id].enabled, false); assert.equal(app.rows[1][19], 'Draft — previous version paused')
  const checks = app.state.checks.length
  app.rows[1][17] = 'Ready'; app.state.serveMode = 'wrong-id'; app.run()
  assert.equal(app.state.checks.length, checks + 3); assert.match(app.rows[1][19], /^Pending verification/)
  app.state.serveMode = 'valid'; app.run(); assert.equal(app.rows[1][19], 'Live')
})

test('wrong company, wrong ID, redirects and stale exact copy cannot produce a Live receipt', () => {
  for (const mode of ['wrong-company', 'wrong-id', 'redirect', 'stale-copy']) {
    const app = automation([row('Google', 'Ready', ['I studied software pricing.', 'Usage matters.', 'I like Google linking answers', 'back to sources.'])])
    app.state.serveMode = mode; app.run()
    assert.equal(app.rows[1][18], ''); assert.match(app.rows[1][19], /^Pending verification/)
    assert.equal(app.properties.has('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT'), false)
  }
})

test('changed copy at a stable URL is not Live until its exact four rows propagate', () => {
  const app = automation([row()]); app.run(); const url = app.rows[1][18]
  app.rows[1][13] = 'I researched software pricing.'; app.state.serveMode = 'stale-copy'; app.run()
  assert.equal(app.rows[1][18], url); assert.match(app.rows[1][19], /^Pending verification/)
  app.state.propagationOnSleep = true; app.run()
  assert.equal(app.rows[1][19], 'Live'); assert.equal(app.rows[1][18], url)
  assert.deepEqual(app.state.sleeps.slice(-1), [3000])
})

test('a failed sync or interrupted output write retains stable identity and recovers the same URL', () => {
  const app = automation([row()]); app.state.failSync = true
  assert.throws(app.run, /Temporary registry failure/); const id = app.rows[1][0]
  assert.match(id, /^[a-f0-9-]{36}$/); assert.equal(app.rows[1][18], '')
  app.state.failSync = false; app.state.failWriteback = true
  assert.throws(app.run, /Interrupted opening writeback/)
  assert.equal(app.rows[1][0], id); app.run()
  assert.equal(app.rows[1][18], `https://sulayman-bowles.dev/for/${id}`); assert.equal(app.rows[1][19], 'Live')
})

test('a sort during ID assignment cannot rebind an established pairing to another company', () => {
  const app = automation([row()]); app.run(); const id = app.rows[1][0]
  app.rows.push(row('Microsoft')); const calls = app.state.posts.length
  app.state.duringIdWrite = () => { const first = app.rows.splice(1, 1)[0]; app.rows.push(first) }
  assert.throws(app.run, /Rows moved during ID assignment/)
  assert.equal(app.state.posts.length, calls); assert.equal(app.state.published[id].company, 'Google')
  app.run(); assert.equal(app.rows[1][1], 'Microsoft'); assert.equal(app.rows[2][1], 'Google')
  assert.equal(app.rows[1][19], 'Live'); assert.equal(app.rows[2][19], 'Live')
})

test('a copy edit during verification receives no stale writeback; a write-time sort is detected and repaired next pass', () => {
  const app = automation([row(), row('Microsoft')])
  app.state.duringCheck = () => { app.rows[1][13] = 'An independently edited first row.' }
  app.run(); assert.equal(app.rows[1][19], ''); assert.equal(app.properties.has('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT'), false)
  app.run(); assert.equal(app.rows[1][19], 'Live')
  app.properties.delete('OUTREACH_OPENINGS_LAST_VERIFIED_OUTPUT')
  app.rows[1][18] = ''; app.rows[1][19] = ''
  app.state.duringWriteback = () => { const moved = app.rows.splice(1, 1)[0]; app.rows.push(moved) }
  app.run(); assert.equal(app.properties.has('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT'), false)
  app.run()
  for (const cells of app.rows.slice(1)) assert.equal(cells[18], `https://sulayman-bowles.dev/for/${cells[0]}`)
})

test('UUID assignment includes W in its source guard and never writes an ID for a stale contribution snapshot', () => {
  const app = automation([contributionRow('Ready', [...defaultOpeningTemplates]), row()])
  app.state.duringSourceRead = () => { app.rows[1][22] = 'careful market research' }
  assert.throws(app.run, /Rows changed during ID assignment/)
  assert.equal(app.rows[1][0], ''); assert.equal(app.state.posts.length, 0)
  app.run(); assert.equal(app.rows[1][19], 'Live')
  assert.equal(app.state.posts[0].openings[0].lines[1], 'careful market research to Google.')
})

test('concurrent W edits and same-company reorders cannot receive stale verification or output receipts', () => {
  const first = contributionRow('Ready', [...defaultOpeningTemplates])
  const second = contributionRow('Ready', [...defaultOpeningTemplates]); second[22] = 'careful market research'
  const app = automation([first, second])
  app.state.duringCheck = () => { app.rows[1][22] = 'checkable research'; const moved = app.rows.splice(1, 1)[0]; app.rows.push(moved) }
  app.run()
  assert.equal(app.rows[1][19], 'Live'); assert.equal(app.rows[2][19], '')
  assert.equal(app.properties.has('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT'), false)
  app.run()
  for (const cells of app.rows.slice(1)) { assert.equal(cells[19], 'Live'); assert.equal(cells[18], `https://sulayman-bowles.dev/for/${cells[0]}`); assert.equal(app.state.published[cells[0]].lines[1], `${cells[22]} to Google.`) }
  // Even an unused contribution field is part of the editorial snapshot.
  const unused = automation([row()])
  unused.state.duringFetch = () => { unused.rows[1][22] = 'A concurrent source edit' }
  unused.run(); assert.equal(unused.rows[1][19], ''); assert.equal(unused.properties.has('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT'), false)
  unused.run(); assert.equal(unused.rows[1][19], 'Live')
})

test('Ready validation enforces public copy limits, resolved tokens and sourced priorities before any POST', () => {
  const invalid = ['', 'x'.repeat(113), 'http://example.com', 'person@example.com', 'Line\u0000break', '{{unknown}}', '{{role}}', Array(45).fill('word').join(' ')]
  for (const value of invalid) {
    const app = automation([row('Google', 'Ready', [value, ...lines.slice(1)])])
    assert.throws(app.run); assert.equal(app.state.posts.length, 0)
  }
  const cells = row(); cells[8] = 'Python'; cells[9] = 'Atlas data pipeline'
  const app = automation([cells]); assert.throws(app.run, /real job-description URL/)
  app.rows[1][6] = 'https://careers.example.com/real-source'; app.rows[1][7] = 'The sourced role lists Python.'; app.rows[1][9] = ''
  assert.throws(app.run, /truthful personal evidence/); assert.equal(app.state.posts.length, 0)
  app.rows[1][9] = 'Atlas data pipeline'; app.run(); assert.equal(app.rows[1][19], 'Live')
})

test('escaped copy is parsed as JSON, while a mismatched server receipt never redirects verification off the canonical host', () => {
  const app = automation([row('Google', 'Ready', ['I compared costs & returns.', 'Evidence matters.', 'I like Google linking answers', 'back to sources.'])])
  app.run(); assert.equal(app.rows[1][19], 'Live')
  app.rows[1][13] = 'I compared pricing & returns.'; app.state.badReceipt = true
  const checks = app.state.checks.length
  assert.throws(app.run, /mismatched opening identity/); assert.equal(app.state.checks.length, checks)
})

test('sheet-only setup is idempotent and preserves authored rows, while bad headers stop without replacement', () => {
  const app = automation([row('Google', 'Draft')]); const initial = app.rows[1].slice()
  app.setup(); app.setup(); assert.deepEqual(app.rows[1], initial)
  assert.equal(app.state.posts.length, 0); assert.equal(app.state.triggers.length, 0); assert.equal(app.state.created, 0)
  assert.equal(app.state.frozen, 1); assert.equal(Object.keys(app.state.notes).length, 23)
  assert.deepEqual([...app.state.validations[18].values], ['Draft', 'Ready', 'Paused'])
  assert.equal(app.state.validations[10].formula, '=OR(I2="",LEN(TRIM(J2))>0)')
  app.rows[0][0] = 'Unexpected existing header'
  assert.throws(app.setup, /no existing cells were overwritten/); assert.equal(app.rows[0][0], 'Unexpected existing header')
  const empty = automation([], [], false); empty.setup(); empty.setup(); assert.equal(empty.state.created, 1)
  assert.deepEqual([...empty.rows[0]], headers)
})

test('legacy A–V headers upgrade only W while preserving all existing source and output cells', () => {
  const cells = row('Google', 'Draft').slice(0, 22)
  cells[0] = randomUUID(); cells[18] = 'Previously generated URL'; cells[19] = 'Previous receipt'; cells[20] = 'Previous timestamp'; cells[21] = 'Local preview'
  const app = automation([cells], [], true, secret, legacyHeaders)
  const before = app.rows[1].slice(); app.setup(); app.setup()
  assert.deepEqual(app.rows[1], before); assert.deepEqual([...app.rows[0]], headers)
  assert.equal(app.state.posts.length, 0); assert.deepEqual(app.state.triggers, [])
  const legacy = automation([row().slice(0, 22)], [], true, secret, legacyHeaders)
  legacy.run(); assert.deepEqual([...legacy.rows[0]], headers); assert.deepEqual(legacy.state.posts[0].openings[0].lines, lines); assert.equal(legacy.rows[1][19], 'Live')
  assert.deepEqual(legacy.state.headerPresentation, [
    { column: 23, width: 1, property: 'fontWeight', value: 'bold' },
    { column: 23, width: 1, property: 'background', value: '#e8edf2' },
    { column: 23, width: 1, property: 'wrap', value: true },
  ])
  assert.deepEqual(legacy.state.widths, { 23: 380 }); assert.deepEqual(Object.keys(legacy.state.notes), ['23'])
  assert.match(legacy.state.notes[23], /\{\{contribution\}\}/); assert.match(legacy.state.notes[23], /truthful Evidence 1 or Evidence 2/)
  assert.deepEqual(legacy.state.validations, {}); assert.equal(legacy.state.frozen, 0)
  legacy.run(); assert.equal(legacy.state.headerPresentation.length, 3); assert.deepEqual(legacy.state.triggers, [])
  const explicit = automation([contributionRow('Draft')]); const explicitBefore = explicit.rows[1].slice()
  explicit.setup(); assert.deepEqual(explicit.rows[1], explicitBefore)
  const occupied = automation([row('Google', 'Draft')], [], true, secret, [...legacyHeaders, 'Unrelated existing field'])
  const occupiedBefore = JSON.stringify(occupied.rows)
  assert.throws(occupied.setup, /no existing cells were overwritten/); assert.throws(occupied.runOpenings, /headers do not match/)
  assert.equal(JSON.stringify(occupied.rows), occupiedBefore); assert.equal(occupied.state.posts.length, 0)
  const mismatched = automation([row()], [], true, secret, ['Wrong A', ...legacyHeaders.slice(1)])
  assert.throws(mismatched.setup, /headers do not match/); assert.equal(mismatched.rows[0][0], 'Wrong A'); assert.equal(mismatched.rows[0][22], undefined)
})

test('existing company A–F behavior and trigger ownership stay intact; template-field edits reconcile while local preview edits do not', () => {
  const app = automation([row('Google', 'Draft')], ['Microsoft'])
  app.install(); app.install()
  assert.deepEqual(app.state.triggers, ['outreachSheetEdited', 'outreachReconcile'])
  assert.equal(app.companyRows[1][2], 'https://sulayman-bowles.dev/microsoft'); assert.equal(app.companyRows[1][3], 'Live')
  assert.equal(app.state.posts.filter(value => value.sheet === 'Portfolio Links').length, 1)
  const calls = app.state.posts.length
  app.rows[1][13] = 'An authored draft.'; app.edit('Personalized Openings', 14)
  assert.equal(app.state.posts.length, calls + 1)
  app.rows[1][13] = 'Another draft.'; app.edit('Personalized Openings', 22)
  assert.equal(app.state.posts.length, calls + 1)
  app.state.locked = true; app.run(); assert.equal(app.state.posts.length, calls + 1)
})
