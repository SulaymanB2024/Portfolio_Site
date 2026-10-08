import { createSyncHandler } from '../lib/outreach/sync.ts'
import { managementRegistryStore } from '../lib/outreach/store.ts'
import { reservedOutreachSlugs } from '../lib/outreach/reserved.ts'

export default {
  async fetch(request: Request) {
    try { return await createSyncHandler(managementRegistryStore(process.env), reservedOutreachSlugs(), process.env.OUTREACH_SYNC_SECRET || '')(request) }
    catch { return Response.json({ error: 'Sync is not configured' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }) }
  },
}
