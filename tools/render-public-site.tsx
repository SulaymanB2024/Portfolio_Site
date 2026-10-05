import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import catalog from '../src/personal/editorial/data/catalog.json'
import { inlineText } from '../src/personal/editorial/Markdown'
import { siteOrigin, publicPages } from '../src/personal/public-pages'
import { siteCopy } from '../src/personal/site-copy'
import { projects, contact } from '../src/personal/content'
import { caseStudies } from '../src/personal/projects/case-studies'
import { resumeProfile, resumeReview } from '../src/personal/profile-copy'
import { personalObjects } from '../src/personal/about/about-content'
import { workNarratives } from '../src/personal/projects/work-narratives'
import { caseNarratives } from '../src/personal/projects/case-narratives'
import { WorkMaterials, WorkSources } from '../src/personal/projects/WorkMaterials'
import type { WorkDocument } from '../src/personal/projects/work-document'
import { searchMetadata, withSearchHead } from '../src/personal/search-metadata'
import { PublicArticle } from './public-article'
import { withDocumentLinks } from './public-document-links'
import { discoveryText } from './search-discovery'
import { PersonalProfile } from '../src/personal/PersonalProfile'
import { writingFeed } from './search-feed'

const dist = join(process.cwd(), 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const paragraphs = (values: string[] = []) => values.map((value, i) => <p key={i}>{inlineText(value)}</p>)
const links = (pages: typeof publicPages) => <ul>{pages.map(page => <li key={page.path}><a href={page.path}>{page.title.replace(' — Sulayman Bowles', '')}</a><p>{page.description}</p></li>)}</ul>
const articleData = new Map(await Promise.all(catalog.map(async summary => [summary.slug, JSON.parse(await readFile(join(process.cwd(), 'src/personal/editorial/data/articles', `${summary.slug}.json`), 'utf8'))] as const)))

function ProjectDocument({ document, slug, caseStudy = false }: { document: WorkDocument; slug: string; caseStudy?: boolean }) {
  const sectionId = (id: string) => caseStudy ? id : `${slug}-${id}`
  return <>
    <p>{document.deck}</p><p>{document.summary}</p>
    <nav aria-label="In this project">{document.chapters.map(chapter => <a key={chapter.id} href={`#${sectionId(chapter.id)}`}>{chapter.label}</a>)}</nav>
    {document.chapters.map(chapter => <section id={sectionId(chapter.id)} key={chapter.id}>
      <h2>{chapter.title}</h2>{paragraphs(chapter.body)}<WorkMaterials chapter={chapter} />
    </section>)}
    <WorkSources links={document.links} />
  </>
}

function Body({ route }: { route: string }) {
  const article = articleData.get(route.slice('writing/'.length))
  if (route.startsWith('writing/') && article) return <PublicArticle article={article} />
  if (route === 'writing') return links(publicPages.filter(page => page.route.startsWith('writing/')))
  if (route === 'work') return links(publicPages.filter(page => page.route.startsWith('work/')))
  const project = projects.find(project => route === `work/${project.slug}`)
  const narrative = project && workNarratives[project.slug]
  if (project && narrative) return <ProjectDocument document={narrative} slug={project.slug} />
  if (project) return <><p>{project.overview}</p>{project.areas.map(area => <section key={area.title}><h2>{area.title}</h2><p>{area.description}</p></section>)}{project.link && <a href={project.link.href}>{project.link.label}</a>}</>
  const study = caseStudies.find(study => route === `work/${study.slug}`)
  if (study) return <ProjectDocument document={caseNarratives[study.slug]} slug={study.slug} caseStudy />
  if (route === 'about') return <>{personalObjects.map(object => <section key={object.id}><h2>{object.label}</h2></section>)}</>
  if (route === 'resume') return <><p>{resumeReview.introduction}</p><h2>Education</h2><p>{resumeProfile.education.institution} · {resumeProfile.education.degrees.map(degree => `${degree.degree}, ${degree.field}`).join('; ')} · {resumeProfile.education.expectedGraduation}</p><h2>Experience</h2>{resumeProfile.experience.map((job: any) => <section key={job.organization}><h3>{job.organization}</h3><p>{job.title} · {job.dates}</p><p>{job.publicSummary}</p><ul>{job.bullets.map((bullet: string, i: number) => <li key={i}>{bullet}</li>)}</ul></section>)}<h2>Awards and leadership</h2>{resumeProfile.awardsAndLeadership.map((award: any) => <section key={award.organization}><h3>{award.organization}</h3><p>{award.title} · {award.dates}</p><p>{award.detail}</p></section>)}<p>{resumeReview.pdfNote}</p><a href="/Sulayman_Bowles_Resume.pdf">{resumeReview.pdfLabel}</a></>
  if (route === 'contact') return <><p>{siteCopy.contact.description}</p><a href={`mailto:${contact.email}`}>{contact.email}</a><p><a href={contact.linkedin}>LinkedIn</a></p></>
  if (route === '404') return <p>This address does not exist. <a href="/">Return home</a>.</p>
  return <><p>{siteCopy.home.description}</p><PersonalProfile compact /><h2>Selected work</h2>{links(publicPages.filter(page => page.route.startsWith('work/')))}<h2>Selected writing</h2>{links(publicPages.filter(page => page.route.startsWith('writing/')))}<p><a href="/resume">Experience and education</a> · <a href="/about">About Sulayman</a> · <a href="/contact">Contact</a></p></>
}

const fallbackStyle = `<style>.static-site{max-width:76rem;margin:0 auto;padding:2rem 5vw;font:1.05rem/1.65 Georgia,serif;overflow-wrap:anywhere}.static-site header{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;border-bottom:1px solid #b7b1a4;padding-bottom:1rem}.static-site nav{display:flex;flex-wrap:wrap;gap:1rem}.static-site main{max-width:52rem;margin:3rem auto}.static-site h1{font-size:clamp(2.5rem,7vw,5rem);line-height:1.08}.static-site h2{margin-top:2rem}.static-site a{color:inherit}.static-site table{border-collapse:collapse}.static-site td,.static-site th{padding:.5rem;border:1px solid #b7b1a4}.static-site img{max-width:100%;height:auto}.static-site pre{overflow:auto}.static-site li{margin:.6rem 0}.static-site footer{border-top:1px solid #b7b1a4;padding-top:1rem}</style>`

for (const page of [...publicPages, { route: '404', path: '/404', title: 'Page not found — Sulayman Bowles', description: 'This address does not exist.' }]) {
  const body = withDocumentLinks(renderToStaticMarkup(<div className="static-site"><header><a href="/">Sulayman Bowles</a><nav aria-label="Main navigation">{publicPages.filter(p => !p.route.includes('/') && p.route).map(p => <a key={p.path} href={p.path}>{p.title.replace(' — Sulayman Bowles', '')}</a>)}</nav></header><main><h1>{page.route === '' ? siteCopy.home.title : page.title.replace(' — Sulayman Bowles', '')}</h1><p>{page.description}</p><Body route={page.route} /></main><footer><a href={`mailto:${contact.email}`}>{contact.email}</a> · <a href="/sitemap">All pages</a></footer></div>))
  const html = withSearchHead(template, searchMetadata(page.route))
    .replace('</head>', () => `${fallbackStyle}</head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
  const destination = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html')
  await mkdir(join(destination, '..'), { recursive: true }); await writeFile(destination, html)
  // Vercel clean URLs and its filesystem phase also resolve the .html form.
  // Retain the directory form for ordinary static hosts.
  if (page.path !== '/') await writeFile(join(dist, `${page.path.slice(1)}.html`), html)
}
await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPages.map(page => `<url><loc>${siteOrigin}${page.path}</loc></url>`).join('')}</urlset>\n`)
const sitemapHead = { ...searchMetadata('404'), route: 'sitemap', title: 'All pages — Sulayman Bowles', description: 'Work, writing, biography, résumé, and contact pages by Sulayman Bowles.', canonical: `${siteOrigin}/sitemap` }
await writeFile(join(dist, 'sitemap.html'), withSearchHead(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${fallbackStyle}</head><body>${renderToStaticMarkup(<main className="static-site"><h1>All pages</h1>{links(publicPages)}</main>)}</body></html>`, sitemapHead))
const discoverySource = await readFile(join(process.cwd(), 'public/llms.txt'), 'utf8')
const evidenceNotes = discoverySource.split('## Evidence boundaries\n')[1]
if (!evidenceNotes?.trim()) throw new Error('Missing discovery evidence boundaries')
const roleNotes = discoverySource.match(/\n\n(Sapien work covers[^]*?)\n\n##/)?.[1]
await writeFile(join(dist, 'llms.txt'), discoveryText(resumeProfile.currentSummary, resumeReview.asOf, [roleNotes, evidenceNotes].filter(Boolean).join('\n\n')))
await writeFile(join(dist, 'feed.xml'), writingFeed(catalog))
console.log(`Generated ${publicPages.length} indexable pages, a 404, and discovery files.`)
