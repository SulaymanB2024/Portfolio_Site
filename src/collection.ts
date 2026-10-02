import inventory from './collection.json'

export interface Model {
  slug: string
  name: string
  viewerUrl?: string
  creator: { displayName: string; profileUrl?: string }
  license: { label: string; url?: string; slug: string }
  attribution?: string
  origin?: string
  profiles: Record<string, { bytes: number; url: string }>
}
export const models: Model[] = inventory.models
