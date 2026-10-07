import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { restoredArticleHtml } from '../src/personal/editorial/restored-html.ts'
import { restoredNodeTree, restoredDescendant, type RestoredNode } from '../src/personal/editorial/restored-node-tree.ts'

const flatten = (nodes: RestoredNode[]): Exclude<RestoredNode, string>[] => nodes.flatMap(node => typeof node === 'string' ? [] : [node, ...flatten(node.children)])
const text = (nodes: RestoredNode[]): string => nodes.map(node => typeof node === 'string' ? node : text(node.children)).join('')

test('native figure adaptation retains the complete toll-road manuscript hierarchy and evidence targets', () => {
  const article = JSON.parse(readFileSync(new URL('../src/personal/editorial/data/articles/why-texas-toll-roads-stay-tolled.json', import.meta.url), 'utf8'))
  const catalog = JSON.parse(readFileSync(new URL('../src/personal/editorial/data/catalog.json', import.meta.url), 'utf8'))
  const adapted = restoredArticleHtml(article.htmlBody, catalog, '/portfolio/')
  const nodes = restoredNodeTree(adapted)
  const elements = flatten(nodes)
  for (const tag of ['section', 'p', 'table', 'tr', 'td', 'th', 'figure', 'figcaption', 'a', 'img']) {
    assert.equal(elements.filter(node => node.tag === tag).length, [...adapted.matchAll(new RegExp(`<${tag}(?:\\s|>)`, 'g'))].length, tag)
  }
  for (const [, id] of adapted.matchAll(/ id="([^"]+)"/g)) assert(elements.some(node => node.attributes.id === id), id)
  for (const tableElement of elements.filter(node => ['table', 'thead', 'tbody', 'tfoot', 'tr'].includes(node.tag))) {
    assert(!tableElement.children.some(child => typeof child === 'string' && /^[\t\n\f\r ]*$/.test(child)), `No formatting text in ${tableElement.tag}`)
  }
  assert.equal(elements.filter(node => node.tag === 'figure' && restoredDescendant(node, 'img')).length, 3)
  for (const figure of elements.filter(node => node.tag === 'figure' && restoredDescendant(node, 'img'))) {
    assert.equal(restoredDescendant(figure, 'img')?.attributes.src.toString().startsWith('/portfolio/images/research/'), true)
    assert(restoredDescendant(figure, 'figcaption'), 'Caption remains inside its figure')
  }
  for (const amount of ['$1,731,730,721', '$30.17', '$19.29', '$47.49', '$3.05', '$15.03', '$4.82', '$44.59', '$35.56']) assert(text(nodes).includes(amount), amount)
})

test('the adapted tree decodes literal prose and attributes without treating escaped text as markup', () => {
  const nodes = restoredNodeTree(restoredArticleHtml('<section id="one"><p>A &amp; B&#x27;s &lt;test&gt; &#8212; &#160;</p><a href="/example?a=1&amp;b=2">Link</a><img src="/image.svg" alt="A &amp; B" /></section>', []))
  assert.equal(text(nodes), "A & B's <test> — \u00a0Link")
  assert.equal(restoredDescendant(nodes[0], 'a')?.attributes.href, 'https://sulayman-bowles.dev/example?a=1&b=2')
  assert.equal(restoredDescendant(nodes[0], 'img')?.attributes.alt, 'A & B')
})

test('void images do not swallow later source links and download attributes survive', () => {
  const nodes = restoredNodeTree(restoredArticleHtml('<div><img src="/image.svg" alt="Test" /><p>Caption</p><a href="/data.csv" download>Data</a></div>', []))
  const div = nodes[0]
  assert.equal(typeof div !== 'string' && div.children.length, 3)
  assert.equal(restoredDescendant(div, 'a')?.attributes.download, true)
})

test('table indentation is omitted while cell spacing and nearby prose remain intact', () => {
  const nodes = restoredNodeTree('<div><p>Before <a href="#source">source</a> after.</p><table>\n <thead>\n <tr>\n <th> Label </th>\n </tr>\n </thead>\n <tbody>\n <tr>\n <td>A <strong> &amp; </strong> B</td>\n </tr>\n </tbody>\n</table><p>After.</p></div>')
  assert.equal(text(nodes), 'Before source after. Label A  &  BAfter.')
  for (const element of flatten(nodes).filter(node => ['table', 'thead', 'tbody', 'tr'].includes(node.tag))) {
    assert(element.children.every(child => typeof child !== 'string'), element.tag)
  }
})

test('unbalanced adapted markup fails visibly instead of silently relocating the manuscript', () => {
  for (const html of ['<section><p>Text</section>', '<section>Text', '</section>']) assert.throws(() => restoredNodeTree(html))
})
