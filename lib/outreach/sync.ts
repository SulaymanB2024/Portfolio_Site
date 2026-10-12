import { createHmac, timingSafeEqual } from 'node:crypto'
import { parseRegistry, reconcileCompanies, validateCompanies, type OutreachRegistry } from './registry.ts'
import { RegistryRequestError } from './store.ts'
import { reconcileOpenings, validateOpenings } from './openings.ts'

export const outreachSpreadsheetId = '1WDUFFDYgXqCXGwglBDpr2qB6pUtVpcJw04lMMQohuFA'
export interface RegistryStore {
  read(): Promise<OutreachRegistry>
  write(registry: OutreachRegistry): Promise<void>
}

export function validSyncSignature(body: string, timestamp: string, signature: string, secret: string, now = Date.now()) {
  if (!/^\d{13}$/.test(timestamp) || Math.abs(now - Number(timestamp)) > 5 * 60_000 || !/^[a-f0-9]{64}$/.test(signature) || secret.length < 32) return false
  const expected = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest()
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'))
}

export function createSyncHandler(store: RegistryStore, reserved: Set<string>, secret: string) {
  return async (request: Request): Promise<Response> => {
    const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
    if (request.method !== 'POST') return json({ error: 'Use POST' }, 405)
    if (secret.length < 32) return json({ error: 'Sync is not configured' }, 503)
    const body = await request.text()
    if (Buffer.byteLength(body) > 500_000) return json({ error: 'Company batch is too large' }, 413)
    if (!validSyncSignature(body, request.headers.get('x-outreach-timestamp') || '', request.headers.get('x-outreach-signature') || '', secret)) return json({ error: 'Unauthorized' }, 401)
    let source: 'Portfolio Links' | 'Personalized Openings'
    let rows: ReturnType<typeof validateCompanies> | ReturnType<typeof validateOpenings>
    try {
      const input = JSON.parse(body)
      if (input.spreadsheetId !== outreachSpreadsheetId || !['Portfolio Links', 'Personalized Openings'].includes(input.sheet)) throw new Error('Unexpected publication source')
      source = input.sheet
      rows = source === 'Portfolio Links' ? validateCompanies(input.companies) : validateOpenings(input.openings)
    } catch (error) { return json({ error: error instanceof Error ? error.message : 'Invalid company rows' }, 400) }
    try {
      const previous = parseRegistry(await store.read())
      const result = source === 'Portfolio Links'
        ? reconcileCompanies(previous, rows as ReturnType<typeof validateCompanies>, reserved)
        : reconcileOpenings(previous, rows as ReturnType<typeof validateOpenings>, reserved)
      if (result.changed) await store.write(result.registry)
      return json({ revision: result.registry.revision, changed: result.changed, links: result.links })
    } catch (error) {
      // No payloads, upstream response bodies, tokens or company contacts in logs.
      const failure = error instanceof RegistryRequestError ? error.message : 'Registry update failed'
      console.warn('[outreach] registry synchronization failed', failure)
      return json({ error: `${failure}. Check the Vercel writer token, team scope and Global Config limits. Published links are retained; scheduled sync will retry.` }, 503)
    }
  }
}
