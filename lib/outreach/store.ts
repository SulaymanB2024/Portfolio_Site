import { get } from '@vercel/global-config'
import { outreachRegistryKey, parseRegistry, type OutreachRegistry } from './registry.ts'

export async function readLiveRegistry() { return parseRegistry(await get(outreachRegistryKey)) }

/** Management reads are authoritative for writes; replicated SDK reads serve visits. */
export function managementRegistryStore(env: NodeJS.ProcessEnv, fetcher = fetch) {
  const id = env.OUTREACH_CONFIG_ID || ''
  const team = env.OUTREACH_TEAM_ID || ''
  const token = env.OUTREACH_VERCEL_TOKEN || ''
  if (!/^gc_|^ecfg_/.test(id) || !team.startsWith('team_') || !token) throw new Error('Missing registry writer configuration')
  const url = `https://api.vercel.com/v1/global-config/${encodeURIComponent(id)}/items?teamId=${encodeURIComponent(team)}`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  return {
    async read() {
      const response = await fetcher(url, { headers, signal: AbortSignal.timeout(10_000), cache: 'no-store' })
      if (!response.ok) throw new Error('Registry read failed')
      const data = await response.json()
      const items = Array.isArray(data) ? data : data.items
      if (!Array.isArray(items)) throw new Error('Invalid registry response')
      return parseRegistry(items.find((item: { key: string }) => item.key === outreachRegistryKey)?.value)
    },
    async write(registry: OutreachRegistry) {
      const response = await fetcher(url, {
        method: 'PATCH', headers, signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({ items: [{ operation: 'upsert', key: outreachRegistryKey, value: registry }] }),
      })
      if (!response.ok) throw new Error('Registry write failed')
    },
  }
}
