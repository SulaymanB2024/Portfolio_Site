import { createElement, useMemo, type ReactNode } from 'react'
import catalog from './data/catalog.json'
import { restoredArticleHtml } from './restored-html'
import { restoredNodeTree, restoredDescendant, type RestoredNode } from './restored-node-tree'
import ResearchFigure from './ResearchFigure'
import { hasTexasTollFigure } from './TexasTollFigures'
import type { ArticleSummary } from './types'

export default function RestoredArticleBody({ html, baseUrl = '/' }: { html: string; baseUrl?: string }) {
  const adapted = useMemo(() => restoredArticleHtml(html, catalog as ArticleSummary[], baseUrl), [html, baseUrl])
  const nativeFigures = /texas-toll-roads-stay-tolled-(five-questions|100|hctra-cash)\.svg/.test(adapted)
  const nodes = useMemo(() => nativeFigures ? restoredNodeTree(adapted) : null, [adapted, nativeFigures])
  function renderNode(node: RestoredNode, key: string): ReactNode {
    if (typeof node === 'string') return node
    if (node.tag === 'figure') {
      const image = restoredDescendant(node, 'img')
      const source = image?.attributes.src
      if (image && typeof source === 'string' && hasTexasTollFigure(source)) {
        const caption = restoredDescendant(node, 'figcaption')
        // ResearchFigure resolves the base path itself; retain the source caption.
        const src = '/images/research/' + source.split('/').at(-1)
        return <ResearchFigure key={key} id={typeof node.attributes.id === 'string' ? node.attributes.id : undefined} figure={{ src, alt: String(image.attributes.alt || ''), caption: '', width: Number(image.attributes.width) || 1600, height: Number(image.attributes.height) || 900 }} caption={caption?.children.map((child, index) => renderNode(child, `${key}-caption-${index}`))} />
      }
    }
    const attributes = Object.fromEntries(Object.entries(node.attributes).map(([name, value]) => [name === 'class' ? 'className' : name === 'tabindex' ? 'tabIndex' : name, value]))
    return createElement(node.tag, { ...attributes, key }, ...node.children.map((child, index) => renderNode(child, `${key}-${index}`)))
  }
  return nodes ? <div className="reader-restored-html">{nodes.map((node, index) => renderNode(node, `restored-${index}`))}</div> : <div className="reader-restored-html" dangerouslySetInnerHTML={{ __html: adapted }} />
}
