export type RestoredNode = string | {
  tag: string
  attributes: Record<string, string | boolean>
  children: RestoredNode[]
}

const entities: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' }
const tableFormattingParents = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup'])
function decodeText(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, name: string) => {
    if (name.startsWith('#')) return String.fromCodePoint(Number.parseInt(name.slice(name[1].toLowerCase() === 'x' ? 2 : 1), name[1].toLowerCase() === 'x' ? 16 : 10))
    return entities[name.toLowerCase()] ?? entity
  })
}

/** Parse only output already validated by restoredArticleHtml. This retains the
 * manuscript's enclosing sections while allowing a known figure to use React. */
export function restoredNodeTree(adaptedHtml: string): RestoredNode[] {
  const root = { tag: '', attributes: {}, children: [] as RestoredNode[] }
  const stack = [root]
  for (const token of adaptedHtml.match(/<[^>]+>|[^<]+/g) || []) {
    if (!token.startsWith('<')) {
      const parent = stack.at(-1)!
      const text = decodeText(token)
      // Indentation between table elements cannot become React text children.
      // Whitespace inside cells and ordinary prose remains part of the manuscript.
      if (!tableFormattingParents.has(parent.tag) || !/^[\t\n\f\r ]*$/.test(text)) parent.children.push(text)
      continue
    }
    const closing = token.match(/^<\/([a-z0-9]+)>$/i)
    if (closing) {
      if (stack.length === 1 || stack.at(-1)!.tag !== closing[1]) throw new Error('Unbalanced restored manuscript element')
      stack.pop()
      continue
    }
    const tag = token.match(/^<([a-z0-9]+)/i)?.[1]
    if (!tag) throw new Error('Unexpected restored manuscript token')
    const attributes: Record<string, string | boolean> = {}
    for (const [, name, value] of token.matchAll(/([\w:-]+)="([^"]*)"/g)) attributes[name] = decodeText(value)
    if (/\sdownload(?:\s|>)/.test(token)) attributes.download = true
    const node = { tag, attributes, children: [] as RestoredNode[] }
    stack.at(-1)!.children.push(node)
    if (tag !== 'img') stack.push(node)
  }
  if (stack.length !== 1) throw new Error('Unclosed restored manuscript element')
  return root.children
}

export function restoredDescendant(node: RestoredNode, tag: string): Exclude<RestoredNode, string> | undefined {
  if (typeof node === 'string') return undefined
  if (node.tag === tag) return node
  for (const child of node.children) {
    const found = restoredDescendant(child, tag)
    if (found) return found
  }
}
