import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash, createHmac, randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { emptyRegistry, reconcileCompanies, validateCompanies } from '../lib/outreach/registry.ts'
import { reservedOutreachSlugs } from '../lib/outreach/reserved.ts'
import { outreachSpreadsheetId, validSyncSignature } from '../lib/outreach/sync.ts'

const headers = ['Company', 'Slug', 'Live URL', 'Sync status', 'Last synced', 'Record ID']
const source = readFileSync(new URL('../tools/outreach/Code.gs', import.meta.url), 'utf8')
const secret = 'test-only-script-secret-'.repeat(3)

function automation(names: string[]) {
  const rows: any[][] = [headers.slice(), ...names.map(name => [name, '', '', 'Pending setup', '', ''])]
  const properties = new Map<string, string>([['OUTREACH_SYNC_SECRET', secret]])
  const state = { registry: emptyRegistry(), calls: 0, writes: 0, checks: 0, releases: 0,
    failSync: false, failWriteback: false, verificationReady: true, locked: false, propagationOnSleep: false, sleeps: [] as number[],
    duringFetch: undefined as undefined | (() => void), duringIdWrite: undefined as undefined | (() => void), duringWriteback: undefined as undefined | (() => void), triggers: [] as string[] }
  const response = (status: number, text: string) => ({ getResponseCode: () => status, getContentText: () => text })
  const range = (startRow: number, startColumn: number, rowCount = 1, columnCount = 1): any => ({
    getValues: () => rows.slice(startRow - 1, startRow - 1 + rowCount).map(row => row.slice(startColumn - 1, startColumn - 1 + columnCount)),
    setValues(values: any[][]) {
      if (startColumn === 2 && state.failWriteback) { state.failWriteback = false; throw new Error('Sheet write interrupted') }
      if (startColumn === 2) { const move = state.duringWriteback; state.duringWriteback = undefined; move?.() }
      values.forEach((value, i) => value.forEach((cell, j) => { rows[startRow - 1 + i][startColumn - 1 + j] = cell }))
      return this
    },
    setValue(value: any) { if (startColumn === 6) { const move = state.duringIdWrite; state.duringIdWrite = undefined; move?.() } rows[startRow - 1][startColumn - 1] = value; return this },
    setFontWeight() { return this }, setBackground() { return this }, setNumberFormat() { return this }, setNote() { return this },
  })
  const sheet = { getLastRow: () => rows.length,
    getRange: (row: number | string, column?: number, rowCount?: number, columnCount?: number) => typeof row === 'string' ? range(1, 1) : range(row, column!, rowCount, columnCount),
    setFrozenRows() {}, setColumnWidth() {}, hideColumns() {}, getName: () => 'Portfolio Links' }
  const workbook = { getId: () => outreachSpreadsheetId, getSheetByName: (name: string) => name === 'Portfolio Links' ? sheet : undefined }
  const context: any = vm.createContext({
    SpreadsheetApp: { getActiveSpreadsheet: () => workbook, flush() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => properties.get(key), setProperty: (key: string, value: string) => properties.set(key, value), deleteProperty: (key: string) => properties.delete(key) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => !state.locked, releaseLock: () => { state.releases++ } }) },
    Utilities: { getUuid: randomUUID, sleep: (delay: number) => { state.sleeps.push(delay); if (state.propagationOnSleep) state.verificationReady = true }, DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (_: string, value: string) => [...createHash('sha256').update(value).digest()],
      base64Encode: (value: number[]) => Buffer.from(value).toString('base64'),
      computeHmacSha256Signature: (value: string, key: string) => [...createHmac('sha256', key).update(value).digest()].map(byte => byte > 127 ? byte - 256 : byte) },
    UrlFetchApp: {
      fetch(url: string, options: any) {
        assert.equal(url, 'https://sulayman-bowles.dev/api/outreach-sync')
        assert(validSyncSignature(options.payload, options.headers['X-Outreach-Timestamp'], options.headers['X-Outreach-Signature'], secret))
        state.calls++
        state.duringFetch?.(); state.duringFetch = undefined
        if (state.failSync) return response(503, JSON.stringify({ error: 'Registry unavailable; scheduled retry' }))
        const input = JSON.parse(options.payload)
        assert.equal(input.spreadsheetId, outreachSpreadsheetId)
        assert.equal(input.sheet, 'Portfolio Links')
        const result = reconcileCompanies(state.registry, validateCompanies(input.companies), reservedOutreachSlugs())
        if (result.changed) { state.registry = result.registry; state.writes++ }
        return response(200, JSON.stringify(result))
      },
      fetchAll(requests: any[]) {
        state.checks += requests.length
        return requests.map(request => {
          assert.equal(request.followRedirects, false)
          const slug = request.url.split('/').at(-1)
          return response(state.verificationReady ? 200 : 503, `<head><link rel="canonical" href="https://sulayman-bowles.dev/"><meta name="outreach-company" content="${slug}"></head>`)
        })
      },
    },
    ScriptApp: { getProjectTriggers: () => state.triggers.map(name => ({ getHandlerFunction: () => name })),
      newTrigger(name: string) {
        const trigger = { forSpreadsheet: () => trigger, onEdit: () => trigger, timeBased: () => trigger,
          everyMinutes: (minutes: number) => { assert.equal(minutes, 5); return trigger }, create: () => state.triggers.push(name) }
        return trigger
      } },
  })
  vm.runInContext(source, context)
  return { rows, state, properties, run: () => context.outreachReconcile(), install: () => context.installOutreachAutomation() }
}

test('Apps Script signs a deduplicated batch, writes by stable ID after row movement and skips unchanged input', () => {
  const app = automation(['Google', 'Base Power Company', ' Google '])
  app.state.duringFetch = () => { const first = app.rows.splice(1, 1)[0]; app.rows.push(first) }
  app.run()
  for (const row of app.rows.slice(1)) {
    assert.equal(row[3], 'Live')
    assert.equal(row[2], `https://sulayman-bowles.dev/${row[0].trim() === 'Google' ? 'google' : 'base-power'}`)
    assert.match(row[5], /^[0-9a-f-]{36}$/)
  }
  assert.equal(app.state.checks, 2)
  app.run()
  assert.equal(app.state.calls, 1)
  assert.equal(app.state.writes, 1)
  // This models the API/programmatic edit path: no onEdit handler is invoked.
  app.rows.push(['Boston Consulting Group', '', '', '', '', ''])
  app.run()
  assert.equal(app.rows.at(-1)![2], 'https://sulayman-bowles.dev/bcg')
  assert.equal(app.state.writes, 2)
})

test('failed registry imports preserve previously published URLs and stable IDs for the next reconciliation', () => {
  const app = automation(['Google']); app.run()
  app.rows.push(['Figma', '', '', '', '', '']); app.state.failSync = true
  assert.throws(app.run, /Registry unavailable/)
  const figmaId = app.rows[2][5]
  assert.equal(app.rows[1][2], 'https://sulayman-bowles.dev/google')
  assert.equal(app.rows[2][2], '')
  assert.match(app.rows[2][3], /^Sync error/)
  app.state.failSync = false; app.run()
  assert.equal(app.rows[2][5], figmaId)
  assert.equal(app.rows[2][2], 'https://sulayman-bowles.dev/figma')
  assert.equal(app.state.releases, 3)
})

test('a sort during new ID assignment never republishes a known company under another company’s URL', () => {
  const app = automation(['Google']); app.run()
  const googleId = app.rows[1][5]
  app.rows.push(['Stripe', '', '', '', '', ''])
  app.state.duringIdWrite = () => { const google = app.rows.splice(1, 1)[0]; app.rows.push(google) }
  assert.throws(app.run, /Rows moved during ID assignment/)
  assert.equal(app.state.calls, 1)
  assert.equal(app.state.registry.records[googleId], 'google')
  app.run()
  assert.equal(app.rows[1][2], 'https://sulayman-bowles.dev/stripe')
  assert.equal(app.rows[2][2], 'https://sulayman-bowles.dev/google')
})

test('registry success followed by interrupted Sheet writeback recovers the same URL without a second config write', () => {
  const app = automation(['Roblox']); app.state.failWriteback = true
  assert.throws(app.run, /Sheet write interrupted/)
  const id = app.rows[1][5]
  assert.equal(app.rows[1][2], '')
  assert.equal(app.state.registry.records[id], 'roblox')
  app.run()
  assert.equal(app.rows[1][2], 'https://sulayman-bowles.dev/roblox')
  assert.equal(app.rows[1][5], id)
  assert.equal(app.state.writes, 1)
})

test('writeback-time sorting and edited output cells are repaired instead of cached as complete', () => {
  const app = automation(['Google', 'Stripe']); app.run()
  app.properties.delete('OUTREACH_LAST_VERIFIED_OUTPUT')
  app.state.duringWriteback = () => { const google = app.rows.splice(1, 1)[0]; app.rows.push(google) }
  app.run()
  assert.equal(app.properties.has('OUTREACH_LAST_VERIFIED_INPUT'), false)
  app.run()
  assert.equal(app.rows[1][2], 'https://sulayman-bowles.dev/stripe')
  assert.equal(app.rows[2][2], 'https://sulayman-bowles.dev/google')
  assert.equal(app.state.writes, 1)
  app.rows[1][2] = 'https://sulayman-bowles.dev/incorrect'
  app.run()
  assert.equal(app.rows[1][2], 'https://sulayman-bowles.dev/stripe')
})

test('URLs are withheld until verified; temporary verification failures retain previously published links', () => {
  const app = automation(['Google']); app.run()
  app.rows[1][3] = 'Sync error — previous interrupted run'
  app.rows.push(['Stripe', '', '', '', '', '']); app.state.verificationReady = false
  app.run()
  assert.equal(app.rows[1][2], 'https://sulayman-bowles.dev/google')
  assert.equal(app.rows[2][2], '')
  assert.match(app.rows[2][3], /^Pending verification/)
  app.state.verificationReady = true; app.run()
  assert.equal(app.rows[2][2], 'https://sulayman-bowles.dev/stripe')
  assert.equal(app.rows[1][3], 'Live')
  assert.equal(app.state.writes, 2)
})

test('new URLs get a bounded propagation retry before waiting for another scheduled reconciliation', () => {
  const app = automation(['Figma']); app.state.verificationReady = false; app.state.propagationOnSleep = true
  app.run()
  assert.equal(app.rows[1][2], 'https://sulayman-bowles.dev/figma')
  assert.deepEqual(app.state.sleeps, [3000])
  assert.equal(app.state.writes, 1)
})

test('automation installation is idempotent, uses five-minute reconciliation and skips a concurrent run', () => {
  const app = automation(['Google']); app.install(); app.install()
  assert.deepEqual(app.state.triggers, ['outreachSheetEdited', 'outreachReconcile'])
  app.state.locked = true; app.run()
  assert.equal(app.state.calls, 1)
  const manifest = JSON.parse(readFileSync(new URL('../tools/outreach/appsscript.json', import.meta.url), 'utf8'))
  assert.deepEqual(manifest.oauthScopes, ['https://www.googleapis.com/auth/spreadsheets.currentonly', 'https://www.googleapis.com/auth/script.scriptapp', 'https://www.googleapis.com/auth/script.external_request'])
})
