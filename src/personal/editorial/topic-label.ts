const labels: Record<string, string> = {
  All: 'All topics',
  'INFRASTRUCTURE INVESTING': 'Infrastructure',
  'PRODUCT & SYSTEMS': 'Product & systems',
  'AI SYSTEMS': 'AI systems',
  'ViralBench / Codex / agent evaluation': 'Agent evaluation',
}

/** Display labels are independent of the stable category keys in bookmarks. */
export function topicLabel(category: string) {
  if (labels[category]) return labels[category]
  if (category !== category.toUpperCase()) return category
  return category.toLowerCase()
    .replace(/\b(ai|seo|html|dom|api|csv|gpu|us)\b/g, token => token.toUpperCase())
    .replace(/^[a-z]/, letter => letter.toUpperCase())
}
