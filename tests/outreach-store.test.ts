import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { emptyRegistry, outreachRegistryKey } from '../lib/outreach/registry.ts'
import { managementRegistryStore } from '../lib/outreach/store.ts'
import { createSyncHandler, outreachSpreadsheetId } from '../lib/outreach/sync.ts'

const marker = 'private-upstream-credential-marker'
const env = { OUTREACH_CONFIG_ID: 'ecfg_test', OUTREACH_TEAM_ID: 'team_test', OUTREACH_VERCEL_TOKEN: `\r\n ${marker}\r\n` }
const secret = 'test-only-signing-secret-'.repeat(3)

function signedRequest() {
  const body = JSON.stringify({ spreadsheetId: outreachSpreadsheetId, sheet: 'Portfolio Links', companies: [{ recordId: randomUUID(), company: 'New Company' }] })
  const timestamp = String(Date.now())
  return new Request('https://example.test/api/outreach-sync', { method: 'POST', body, headers: {
    'x-outreach-timestamp': timestamp, 'x-outreach-signature': createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex'),
  } })
}

test('copied writer-token whitespace is removed before constructing request headers', async () => {
  let calls = 0
  const fetcher: typeof fetch = async (_url, init) => {
    assert.equal(new Headers(init?.headers).get('Authorization'), `Bearer ${marker}`)
    calls++
    return Response.json([{ key: outreachRegistryKey, value: emptyRegistry() }])
  }
  const store = managementRegistryStore(env, fetcher)
  await store.read()
  await store.write(emptyRegistry())
  assert.equal(calls, 2)
  assert.throws(() => managementRegistryStore({ ...env, OUTREACH_VERCEL_TOKEN: ' \r\n ' }), /Missing registry writer configuration/)
})

test('registry failures report the failing operation and HTTP status without exposing credentials or upstream errors', async t => {
  for (const scenario of [
    { operation: 'read', response: () => new Response(marker, { status: 401 }), expected: 'Registry read failed (HTTP 401)' },
    { operation: 'write', response: () => new Response(marker, { status: 403 }), expected: 'Registry write failed (HTTP 403)' },
    { operation: 'read', response: () => { throw new Error(marker) }, expected: 'Registry read request failed' },
    { operation: 'read', response: () => Response.json({ private: marker }), expected: 'Registry read returned an invalid response' },
  ]) await t.test(scenario.expected, async () => {
    let writes = 0
    const fetcher: typeof fetch = async (_url, init) => {
      const operation = init?.method === 'PATCH' ? 'write' : 'read'
      if (operation === 'write') writes++
      return operation === scenario.operation ? scenario.response() : Response.json([{ key: outreachRegistryKey, value: emptyRegistry() }])
    }
    const warnings: unknown[][] = []
    const originalWarn = console.warn
    console.warn = (...args: unknown[]) => { warnings.push(args) }
    try {
      const response = await createSyncHandler(managementRegistryStore(env, fetcher), new Set(), secret)(signedRequest())
      assert.equal(response.status, 503)
      const body = await response.text()
      assert(body.includes(scenario.expected))
      assert(!body.includes(marker))
      assert(!JSON.stringify(warnings).includes(marker))
      assert.equal(writes, scenario.operation === 'write' ? 1 : 0)
    } finally { console.warn = originalWarn }
  })
})
