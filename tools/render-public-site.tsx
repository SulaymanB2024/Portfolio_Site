import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import catalog from '../src/personal/editorial/data/catalog.json'
import { markdownToReact, inlineText } from '../src/personal/editorial/Markdown'
import { siteOrigin, publicPages } from '../src/personal/public-pages'
import { siteCopy } from '../src/personal/site-copy'
import { projects, contact } from '../src/personal/content'
import { caseStudies } from '../src/personal/projects/case-studies'
import { resumeProfile, resumeReview } from '../src/personal/profile-copy'
import { personalObjects } from '../src/personal/about/about-content'

const dist = join(process.cwd(), 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
const paragraphs = (values: string[] = []) => values.map((value, i) => <p key={i}>{inlineText(value)}</p>)
const links = (pages: typeof publicPages) => <ul>{pages.map(page => <li key={page.path}><a href={page.path}>{page.title.replace(' — Sulayman Bowles', '')}</a><p>{page.description}</p></li>)}</ul>
const articleData = new Map(await Promise.all(catalog.map(async summary => [summary.slug, JSON.parse(await readFile(join(process.cwd(), 'src/personal/editorial/data/articles', `${summary.slug}.json`), 'utf8'))] as const)))

function Table({ table }: { table: any }) {
  return <div style={{ overflowX: 'auto' }}><table><caption>{table.title || table.caption}</caption><thead><tr>{(table.headers || table.columns || []).map((header: any, i: number) => <th key={i}>{typeof header === 'string' ? header : header.label}</th>)}</tr></thead><tbody>{(table.rows || []).map((row: string[], i: number) => <tr key={i}>{row.map((cell, j) => <td key={j}>{inlineText(String(cell))}</td>)}</tr>)}</tbody></table></div>
}

function Article({ article }: { article: any }) {
  const markdown = article.markdown?.replace(/^# .+\n+/, '')
  return <>
    {article.slug === 'viralbench-codex-agent-harness' && <p>This is a published engineering design for a proposed improvement harness. It does not establish a deployed improvement service.</p>}
    {markdown ? markdownToReact(markdown) : <>{paragraphs(article.content)}{article.evidenceBoundary && <p>{inlineText(article.evidenceBoundary)}</p>}{[...(article.sections || []), ...(article.markdownSections || [])].map((section: any) => <section key={section.id} id={section.id}><h2>{section.title}</h2>{section.markdown && markdownToReact(section.markdown)}{paragraphs(section.paragraphs)}{section.bullets && <ul>{section.bullets.map((b: string, i: number) => <li key={i}>{inlineText(b)}</li>)}</ul>}{section.table && <Table table={section.table} />}</section>)}</>}
    {article.cases && <section id="case-inventory"><h2>Case inventory</h2>{article.cases.map((item: any) => <details key={item.name}><summary>{item.name} — {item.grade}</summary><dl>{Object.entries(item).filter(([k]) => !['name', 'href'].includes(k)).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl><a href={item.href}>Source</a></details>)}</section>}
    {article.sources?.length > 0 && <section id="sources"><h2>Sources</h2><ol>{article.sources.map((source: any, i: number) => <li key={i} id={`source-${source.id?.toLowerCase() || i + 1}`}>{(source.href ? [source.href] : source.hrefs || []).map((href: string, j: number) => <a key={j} href={href}>{j ? 'Additional source' : source.label}</a>)}{source.note && <p>{source.note}</p>}{source.limitation && <p>{source.limitation}</p>}</li>)}</ol></section>}
    {article.faqs && <section><h2>Questions</h2>{article.faqs.map((faq: any) => <details key={faq.question}><summary>{faq.question}</summary>{markdownToReact(faq.answer)}</details>)}</section>}
    {[...(article.researchAssets || []), ...(article.supportingAssets || [])].length > 0 && <section><h2>Supporting material</h2><ul>{[...(article.researchAssets || []), ...(article.supportingAssets || [])].map((asset: any, i: number) => <li key={i}><a href={asset.href}>{asset.label}</a></li>)}</ul></section>}
  </>
}

function Body({ route }: { route: string }) {
  const article = articleData.get(route.slice('writing/'.length))
  if (route.startsWith('writing/') && article) return <Article article={article} />
  if (route === 'writing') return links(publicPages.filter(page => page.route.startsWith('writing/')))
  if (route === 'work') return links(publicPages.filter(page => page.route.startsWith('work/')))
  const project = projects.find(project => route === `work/${project.slug}`)
  if (project) return <><p>{project.overview}</p>{project.areas.map(area => <section key={area.title}><h2>{area.title}</h2><p>{area.description}</p></section>)}{project.link && <a href={project.link.href}>{project.link.label}</a>}</>
  const study = caseStudies.find(study => route === `work/${study.slug}`)
  if (study) return <><p>{study.summary}</p><p>{study.role} · {study.period} · {study.status}</p><p>{study.caption}</p><a href={study.source.startsWith('#/writing/') ? publicPages.find(page => page.route === study.source.slice(2))!.path : study.source}>Source material</a></>
  if (route === 'about') return <><p>{resumeProfile.currentSummary}</p>{personalObjects.map(object => <section key={object.id}><h2>{object.title}</h2><p>{object.sentence}</p><p>{object.detail}</p></section>)}</>
  if (route === 'resume') return <><p>{resumeReview.introduction}</p><h2>Education</h2><p>{resumeProfile.education.institution} · {resumeProfile.education.degrees.map(degree => `${degree.degree}, ${degree.field}`).join('; ')} · {resumeProfile.education.expectedGraduation}</p><h2>Experience</h2>{resumeProfile.experience.map((job: any) => <section key={job.organization}><h3>{job.organization}</h3><p>{job.title} · {job.dates}</p><p>{job.publicSummary}</p><ul>{job.bullets.map((bullet: string, i: number) => <li key={i}>{bullet}</li>)}</ul></section>)}<h2>Awards and leadership</h2>{resumeProfile.awardsAndLeadership.map((award: any) => <section key={award.organization}><h3>{award.organization}</h3><p>{award.title} · {award.dates}</p><p>{award.detail}</p></section>)}<p>{resumeReview.pdfNote}</p><a href="/Sulayman_Bowles_Resume.pdf">{resumeReview.pdfLabel}</a></>
  if (route === 'contact') return <><p>{siteCopy.contact.description}</p><a href={`mailto:${contact.email}`}>{contact.email}</a><p><a href={contact.linkedin}>LinkedIn</a></p></>
  if (route === '404') return <p>This address does not exist. <a href="/">Return home</a>.</p>
  return <><p>{siteCopy.home.description}</p><h2>Selected work</h2>{links(publicPages.filter(page => page.route.startsWith('work/')))}<h2>Selected writing</h2>{links(publicPages.filter(page => page.route.startsWith('writing/')))}<p><a href="/resume">Experience and education</a> · <a href="/about">About Sulayman</a> · <a href="/contact">Contact</a></p></>
}

const fallbackStyle = `<style>.static-site{max-width:76rem;margin:0 auto;padding:2rem 5vw;font:1.05rem/1.65 Georgia,serif}.static-site header{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;border-bottom:1px solid #b7b1a4;padding-bottom:1rem}.static-site nav{display:flex;flex-wrap:wrap;gap:1rem}.static-site main{max-width:52rem;margin:3rem auto}.static-site h1{font-size:clamp(2.5rem,7vw,5rem);line-height:1.08}.static-site h2{margin-top:2rem}.static-site a{color:inherit}.static-site table{border-collapse:collapse}.static-site td,.static-site th{padding:.5rem;border:1px solid #b7b1a4}.static-site img{max-width:100%;height:auto}.static-site pre{overflow:auto}.static-site li{margin:.6rem 0}.static-site footer{border-top:1px solid #b7b1a4;padding-top:1rem}</style>`

for (const page of [...publicPages, { route: '404', path: '/404', title: 'Page not found — Sulayman Bowles', description: 'This address does not exist.' }]) {
  const article = articleData.get(page.route.slice('writing/'.length))
  const jsonld = article ? { '@context': 'https://schema.org', '@type': 'Article', headline: article.displayTitle || article.title, description: page.description, mainEntityOfPage: `${siteOrigin}${page.path}`, datePublished: article.date.replaceAll('.', '-'), dateModified: (article.dateModified || article.date).replaceAll('.', '-'), author: { '@type': 'Person', name: 'Sulayman Bowles', url: siteOrigin }, ...(article.image ? { image: `${siteOrigin}${article.image}` } : {}) } : { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: `${siteOrigin}${page.path}`, about: { '@type': 'Person', name: 'Sulayman Bowles', url: siteOrigin, sameAs: [contact.linkedin, 'https://github.com/SulaymanB2024'] } }
  const body = renderToStaticMarkup(<div className="static-site"><header><a href="/">Sulayman Bowles</a><nav aria-label="Main navigation">{publicPages.filter(p => !p.route.includes('/') && p.route).map(p => <a key={p.path} href={p.path}>{p.title.replace(' — Sulayman Bowles', '')}</a>)}</nav></header><main><h1>{page.route === '' ? siteCopy.home.title : page.title.replace(' — Sulayman Bowles', '')}</h1><p>{page.description}</p><Body route={page.route} /></main><footer><a href={`mailto:${contact.email}`}>{contact.email}</a> · <a href="/sitemap">All pages</a></footer></div>)
  const metadata = `<link rel="canonical" href="${siteOrigin}${page.path}" /><meta name="robots" content="${page.route === '404' ? 'noindex, follow' : 'index, follow'}" /><meta property="og:url" content="${siteOrigin}${page.path}" /><meta name="twitter:card" content="summary_large_image" /><meta property="og:image" content="${siteOrigin}${article?.image || '/og-default.png'}" /><script id="page-schema" data-route="${page.route}" type="application/ld+json">${JSON.stringify(jsonld).replaceAll('<', '\\u003c')}</script>`
  let html = template.replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`).replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*("\s*\/?>)/g, `$1${escape(page.description)}$2`).replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${escape(page.title)}$2`).replace(/(<meta property="og:type" content=")[^"]*("\s*\/?>)/, `$1${article ? 'article' : 'website'}$2`).replace('</head>', `${metadata}${fallbackStyle}</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const destination = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html')
  await mkdir(join(destination, '..'), { recursive: true }); await writeFile(destination, html)
  // Vercel clean URLs and its filesystem phase also resolve the .html form.
  // Retain the directory form for ordinary static hosts.
  if (page.path !== '/') await writeFile(join(dist, `${page.path.slice(1)}.html`), html)
}
await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPages.map(page => `<url><loc>${siteOrigin}${page.path}</loc></url>`).join('')}</urlset>\n`)
await writeFile(join(dist, 'sitemap.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>All pages — Sulayman Bowles</title><link rel="canonical" href="${siteOrigin}/sitemap">${fallbackStyle}</head><body>${renderToStaticMarkup(<main className="static-site"><h1>All pages</h1>{links(publicPages)}</main>)}</body></html>`)
console.log(`Generated ${publicPages.length} indexable pages, a 404, and discovery files.`)
