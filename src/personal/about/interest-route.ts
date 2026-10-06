import type { InterestId } from './about-content'

const interests: readonly InterestId[] = ['bass', 'score', 'knight']

export function interestFromHash(hash: string): InterestId | null {
  if (hash.split('?')[0] !== '#/about') return null
  const value = new URLSearchParams(hash.split('?')[1] ?? '').get('interest')
  return interests.find(id => id === value) ?? null
}

export function interestHref(id: InterestId) { return `#/about?interest=${id}` }
