import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { markdownToReact } from '../../../src/personal/editorial/Markdown'

const lane = dirname(fileURLToPath(import.meta.url))
const notebookPath = resolve(lane, process.argv[2] || 'model.ipynb')
const outputPath = resolve(lane, process.argv[3] || 'notebook-preview.html')
const notebook = JSON.parse(await readFile(notebookPath, 'utf8'))
const prose = (text: string | string[]) => Array.isArray(text) ? text.join('') : text
const localLinks: { token: string; label: string; href: string }[] = []
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
const renderMarkdown = (text: string) => markdownToReact(text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
  if (/^(https?:|\/|#)/.test(href)) return match
  const file = resolve(dirname(notebookPath), href)
  if (!file.startsWith(`${lane}/`)) return match
  const token = `NotebookLocalResource${localLinks.length}`
  localLinks.push({ token, label, href })
  return token
}))
const body = renderToStaticMarkup(<main>{notebook.cells.map((cell: any, index: number) => <section key={index}>
  {cell.cell_type === 'markdown' ? index === 0 && prose(cell.source).startsWith('# ')
    ? <><h1>{prose(cell.source).split('\n')[0].slice(2)}</h1>{renderMarkdown(prose(cell.source).split('\n').slice(1).join('\n'))}</>
    : renderMarkdown(prose(cell.source)) : <details><summary>Calculation code</summary><pre><code>{prose(cell.source)}</code></pre></details>}
  {cell.outputs?.map((output: any, i: number) => output.data?.['image/png']
    ? <div className="notebook-figure-viewport" key={i} role="region" aria-label="Executed model figure" tabIndex={0}><img src={`data:image/png;base64,${prose(output.data['image/png'])}`} alt="Executed underwriting or operating-model figure" /></div>
    : output.data?.['text/markdown'] ? <div key={i}>{renderMarkdown(prose(output.data['text/markdown']))}</div>
    : output.text ? <pre key={i}>{prose(output.text)}</pre> : null)}
</section>)}</main>)
const linkedBody = localLinks.reduce((html, link) => html.replaceAll(link.token, `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`), body)
const css = `body{background:#f5f2ea;color:#24221e;font:18px/1.65 Georgia,serif;max-width:1100px;margin:auto;padding:30px 5vw}h1{font-size:42px;line-height:1.2}h2{margin-top:48px}h3{margin-top:28px}pre{font:13px/1.6 monospace;white-space:pre-wrap;overflow-wrap:anywhere}.notebook-figure-viewport{overflow-x:auto}img{display:block;width:100%;min-width:760px;height:auto;mix-blend-mode:multiply}a{color:inherit}section{padding:10px 0}table{width:100%;border-collapse:collapse;font:14px/1.6 Arial,sans-serif}th,td{padding:12px;text-align:left;border-bottom:1px solid #d9d4c9}details{font:14px/1.7 monospace;margin:20px 0}@media(max-width:700px){h1{font-size:32px}.article-table-wrap{overflow-x:auto}}`
await writeFile(outputPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Executed model companion</title><style>${css}</style></head><body>${linkedBody}</body></html>`)
console.log('Rendered saved notebook for visual inspection')
