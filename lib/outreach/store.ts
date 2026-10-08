import { get } from '@vercel/global-config'
import { outreachRegistryKey, parseRegistry, type OutreachRegistry } from './registry.ts'

export async function readLiveRegistry() { return parseRegistry(await get(outreachRegistryKey)) }

/** Only these controlled fields may cross the upstream credential boundary. */
export class RegistryRequestError extends Error {
  constructor(operation: 'read' | 'write', reason: 'request' | 'http' | 'invalid-response', status?: number) {
    super(`Registry ${operation} ${reason === 'http' ? `failed (HTTP ${status})` : reason === 'request' ? 'request failed' : 'returned an invalid response'}`)
  }
}

/** Management reads are authoritative for writes; replicated SDK reads serve visits. */
export function managementRegistryStore(env: NodeJS.ProcessEnv, fetcher = fetch) {
  const id = env.OUTREACH_CONFIG_ID || ''
  const team = env.OUTREACH_TEAM_ID || ''
  const token = (env.OUTREACH_VERCEL_TOKEN || '').trim()
  if (!/^gc_|^ecfg_/.test(id) || !team.startsWith('team_') || !token) throw new Error('Missing registry writer configuration')
  const url = `https://api.vercel.com/v1/global-config/${encodeURIComponent(id)}/items?teamId=${encodeURIComponent(team)}`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  async function request(operation: 'read' | 'write', init: RequestInit) {
    let response
    try { response = await fetcher(url, { ...init, headers, signal: AbortSignal.timeout(10_000) }) }
    catch { throw new RegistryRequestError(operation, 'request') }
    if (!response.ok) throw new RegistryRequestError(operation, 'http', response.status)
    return response
  }
  return {
    async read() {
      const response = await request('read', { cache: 'no-store' })
      try {
        const data = await response.json()
        const items = Array.isArray(data) ? data : data.items
        if (!Array.isArray(items)) throw new Error('Invalid registry response')
        return parseRegistry(items.find((item: { key: string }) => item.key === outreachRegistryKey)?.value)
      } catch { throw new RegistryRequestError('read', 'invalid-response') }
    },
    async write(registry: OutreachRegistry) {
      await request('write', {
        method: 'PATCH',
        body: JSON.stringify({ items: [{ operation: 'upsert', key: outreachRegistryKey, value: registry }] }),
      })
    },
  }
}
