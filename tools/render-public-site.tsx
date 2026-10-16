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
import { ProjectAccount, ProjectSources } from '../src/personal/projects/ProjectAccount'
import { ProjectEndNavigation } from '../src/personal/projects/ProjectEndNavigation'
import type { WorkDocument } from '../src/personal/projects/work-document'
import { searchMetadata, withSearchHead } from '../src/personal/search-metadata'
import { PublicArticle } from './public-article'
import { PublicWritingStories } from './public-writing'
import ArtworkInkDefinitions from '../src/personal/editorial/ArtworkInk'
import { withDocumentLinks } from './public-document-links'
import { discoveryText, machineProfile, machineReferences, documentText, fullDiscoveryText } from './search-discovery'
import { PersonalProfile } from '../src/personal/PersonalProfile'
import { writingFeed } from './search-feed'
import { searchSitemap } from './search-sitemap'
import { featuredWorkSlugs } from '../src/personal/projects/work-curation'
import { writingSelection } from '../src/personal/editorial/writing-selection'
import { ReadingPaths, TopicBody } from '../src/personal/editorial/TopicPage'
import projectDetailStyle from '../src/personal/projects/project-detail.css?raw'
import researchDiagramStyle from '../src/personal/editorial/research-diagrams.css?raw'
import researchComparisonStyle from '../src/personal/editorial/research-comparison.css?raw'
import researchProcessStyle from '../src/personal/editorial/research-process.css?raw'
import readingGuideStyle from '../src/personal/editorial/reading-guides.css?raw'
import publicCoverStyle from '../src/personal/editorial/public-covers.css?raw'

const dist = join(process.cwd(), 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const paragraphs = (values: string[] = []) => values.map((value, i) => <p key={i}>{inlineText(value)}</p>)
const links = (pages: typeof publicPages) => <ul>{pages.map(page => <li key={page.path}><a href={page.path}>{page.title.replace(' — Sulayman Bowles', '')}</a><p>{page.description}</p></li>)}</ul>
const articleData = new Map(await Promise.all(catalog.map(async summary => [summary.slug, JSON.parse(await readFile(join(process.cwd(), 'src/personal/editorial/data/articles', `${summary.slug}.json`), 'utf8'))] as const)))
const machineDocuments: { url: string; text: string }[] = []

function ProjectDocument({ document, slug, caseStudy = false }: { document: WorkDocument; slug: string; caseStudy?: boolean }) {
  const sectionId = (id: string) => caseStudy ? id : `${slug}-${id}`
  return <div className="project-detail project-readable">
    <p>{document.summary}</p>
    <nav aria-label="In this project">{document.chapters.map(chapter => <a key={chapter.id} href={`#${sectionId(chapter.id)}`}>{chapter.label}</a>)}</nav>
    <ProjectAccount document={document} sectionId={sectionId} />
    <ProjectSources links={document.links} />
    <ProjectEndNavigation slug={slug} />
  </div>
}

function Body({ route }: { route: string }) {
  const article = articleData.get(route.slice('writing/'.length))
  if (route.startsWith('topics/')) return <TopicBody slug={route.slice('topics/'.length)} />
  if (route.startsWith('writing/') && article) return <PublicArticle article={article} />
  if (route === 'writing') {
    const selection = writingSelection(catalog)
    return <><p>{siteCopy.writing.introduction}</p><h2>Featured</h2><PublicWritingStories articles={selection.selected} eagerFirst /><h2>Reading paths</h2><ReadingPaths /><h2>Further reading</h2><PublicWritingStories articles={selection.more} /><h2>Notes</h2><PublicWritingStories articles={selection.notes} /></>
  }
  if (route === 'work') {
    const workPages = publicPages.filter(page => page.route.startsWith('work/'))
    return <><p>{siteCopy.work.introduction}</p><h2>Featured projects</h2>{links(featuredWorkSlugs.map(slug => workPages.find(page => page.route === `work/${slug}`)!))}</>
  }
  const project = projects.find(project => route === `work/${project.slug}`)
  const narrative = project && workNarratives[project.slug]
  if (project && narrative) return <ProjectDocument document={narrative} slug={project.slug} />
  if (project) return <><p>{project.overview}</p>{project.areas.map(area => <section key={area.title}><h2>{area.title}</h2><p>{area.description}</p></section>)}{project.link && <a href={project.link.href}>{project.link.label}</a>}</>
  const study = caseStudies.find(study => route === `work/${study.slug}`)
  if (study) return <ProjectDocument document={caseNarratives[study.slug]} slug={study.slug} caseStudy />
  if (route === 'about') return <><PersonalProfile />{personalObjects.map(object => <section key={object.id}><h2>{object.label}</h2></section>)}</>
  if (route === 'resume') return <>
    <p>{resumeReview.introduction}</p>
    <h2>Education</h2><p>{resumeProfile.education.institution} · {resumeProfile.education.degrees.map(degree => degree.degree + ', ' + degree.field).join('; ')} · Expected {resumeProfile.education.expectedGraduation}</p>
    <h2>Experience</h2>{resumeProfile.experience.map(job => <section key={job.organization}><h3>{job.organization}</h3><p>{job.title} · {job.dates}</p><p>{job.publicSummary}</p><ul>{job.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ul></section>)}
    <h2>Awards and leadership</h2>{resumeProfile.awardsAndLeadership.map(award => <section key={award.organization}><h3>{award.organization}</h3><p>{award.title} · {award.dates}</p><p>{award.detail}</p></section>)}
    <h2>Skills &amp; tools</h2><dl>{resumeProfile.skillGroups.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.items.join(', ')}</dd></div>)}</dl>
    <h2>Certifications</h2><ul>{resumeProfile.certifications.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>Languages</h2><ul>{resumeProfile.languages.map(item => <li key={item}>{item}</li>)}</ul>
    <p>{resumeReview.pdfNote}</p><a href={'/' + resumeReview.pdfFile}>{resumeReview.pdfLabel}</a>
  </>
  if (route === 'contact') return <><p>{siteCopy.contact.description}</p><a href={`mailto:${contact.email}`}>{contact.email}</a><p><a href={contact.linkedin}>LinkedIn</a></p></>
  if (route === '404') return <p>This address does not exist. <a href="/">Return home</a>.</p>
  return <><p>{siteCopy.home.description}</p><PersonalProfile compact /><h2>Selected work</h2>{links(featuredWorkSlugs.map(slug => publicPages.find(page => page.route === `work/${slug}`)!))}<h2>Selected writing</h2>{links(publicPages.filter(page => page.route.startsWith('writing/')))}<p>{siteCopy.home.contact}</p><p><a href="/resume">Résumé</a> · <a href="/about">About Sulayman</a> · <a href="/contact">Contact</a></p></>
}

const fallbackStyle = `<style>.static-site{max-width:76rem;margin:0 auto;padding:2rem 5vw;font:1.05rem/1.65 Georgia,serif;overflow-wrap:anywhere}.static-site header{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;border-bottom:1px solid #b7b1a4;padding-bottom:1rem}.static-site nav{display:flex;flex-wrap:wrap;gap:1rem}.static-site main{max-width:52rem;margin:3rem auto}.static-site h1{font-size:clamp(2.5rem,7vw,5rem);line-height:1.08}.static-site h2{margin-top:2rem}.static-site a{color:inherit}.static-site table{border-collapse:collapse}.static-site td,.static-site th{padding:.5rem;border:1px solid #b7b1a4}.static-site img{max-width:100%;height:auto}.static-site pre{overflow:auto}.static-site li{margin:.6rem 0}.static-site footer{border-top:1px solid #b7b1a4;padding-top:1rem}</style>`
const readingFallbackStyle = `<style>.static-site{--ink:#24221e;--muted:#68665e;--line:#b7b1a4;--editorial-sans:Arial,sans-serif;--editorial-mono:monospace}${readingGuideStyle}${publicCoverStyle}.static-site .reading-paths,.static-site .reader-guide-paths{display:grid}</style>`
const projectFallbackStyle = `<style>${projectDetailStyle}.static-site{--paper:#f5f2ea;--type-display:Arial,sans-serif;--type-interface:Arial,sans-serif;--type-reading:Georgia,serif}.static-site .project-account-section h2{font:600 2rem/1.18 Arial,sans-serif;letter-spacing:-.03em;margin:0 0 23px}.static-site .project-source-list li{margin:0}.static-site .work-table-wrap{overflow:auto}.static-site .work-table :is(th,td){border:0;border-bottom:1px solid var(--line);text-align:left}.static-site .work-table{border-collapse:collapse}.static-site .work-table caption{text-align:left}</style>`

// Keep the two responsive rulers mutually exclusive before the reader mounts,
// and when JavaScript is unavailable. Scope these rules to the static document.
const studyFallbackStyle = `<style>
.static-site{--ink:#24221e;--muted:#68665e;--paper:#f5f2ea;--line:#b7b1a4;--editorial-sans:Arial,sans-serif;--editorial-mono:monospace}
.static-site .article-study{margin:2rem 0}.static-site .article-study figcaption{margin-top:1rem;font:.85rem/1.6 Arial,sans-serif}.static-site .reader-code figcaption{font:.85rem/1.6 Arial,sans-serif}
.static-site .study-search{display:grid;grid-template-columns:1fr 1fr;gap:2rem}.static-site .study-search-label{display:block;border-bottom:1px solid currentColor;padding-bottom:.5rem;font:.8rem/1.5 Arial,sans-serif}
.static-site .study-search ol{display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:0;list-style:none}.static-site .study-search strong{display:block;font:1.25rem/1.3 Georgia,serif;margin:.5rem 0}.static-site .study-search small,.static-site .study-index{display:block;font:.75rem/1.6 Arial,sans-serif}
.static-site .study-schedule-wide svg,.static-site .study-schedule-narrow svg{font:13px monospace}.static-site .study-rule{stroke:currentColor;fill:none;stroke-width:1}.static-site .study-schedule-finish>path:first-child{fill:none;stroke:currentColor}
.static-site .study-schedule-period text,.static-site .study-axis-label,.static-site .study-schedule-finish text{font:12px Arial,sans-serif}.static-site .study-schedule-narrow{display:none}
.static-site .article-study .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media(max-width:760px){.static-site .study-search{grid-template-columns:1fr;gap:1rem}.static-site .study-schedule-wide{display:none}.static-site .study-schedule-narrow{display:grid;gap:6px}.static-site .study-schedule-narrow svg{font-size:15px}.static-site .study-schedule-narrow :is(.study-schedule-period text,.study-axis-label,.study-schedule-finish text){font-size:14px}}
${researchDiagramStyle}
${researchProcessStyle}
${researchComparisonStyle.replaceAll('.article-page .reader-prose', '.static-site').replaceAll('.article-page', '.static-site')}
.static-site .research-diagram .research-diagram-boundary{margin-top:22px}
.static-site .reader-equation{padding:1rem 0;border-block:1px solid var(--line)}
.static-site .reader-workflow ol{padding-left:1.5rem;list-style:decimal-leading-zero}
.static-site .reader-lineage ul{list-style:none;border-left:1px solid var(--line);padding-left:1.25rem}
</style>`

for (const page of [...publicPages, { route: '404', path: '/404', title: 'Page not found — Sulayman Bowles', description: 'This address does not exist.' }]) {
  const rendered = renderToStaticMarkup(<div className="static-site">{(page.route === 'writing' || page.route.startsWith('writing/')) && <ArtworkInkDefinitions />}<header><a href="/">Sulayman Bowles</a><nav aria-label="Main navigation">{publicPages.filter(p => !p.route.includes('/') && p.route).map(p => <a key={p.path} href={p.path}>{p.title.replace(' — Sulayman Bowles', '')}</a>)}</nav></header><main><h1>{page.route === '' ? siteCopy.home.title : page.title.replace(' — Sulayman Bowles', '')}</h1>{page.route !== '' && !page.route.startsWith('work/') && <p>{page.description}</p>}<Body route={page.route} /></main><footer><a href={`mailto:${contact.email}`}>{contact.email}</a> · <a href="/sitemap">All pages</a></footer></div>)
  // React emits image resource hints before the rendered root. Keep the first
  // readable element in #root and place those hints in the document head.
  const imageHints = rendered.match(/^(?:<link rel="preload" as="image"[^>]*\/>)+/)?.[0] || ''
  const body = withDocumentLinks(rendered.slice(imageHints.length))
  if (page.route !== '404') machineDocuments.push({
    url: `${siteOrigin}${page.path}`,
    text: documentText(body.match(/<main>([^]*?)<\/main>/)![1], `${siteOrigin}${page.path}`),
  })
  const html = withSearchHead(template, searchMetadata(page.route))
    .replace('</head>', () => `${imageHints}${fallbackStyle}${readingFallbackStyle}${page.route.startsWith('writing/') ? studyFallbackStyle : ''}${page.route.startsWith('work/') ? projectFallbackStyle : ''}</head>`)
    .replace('<div id="root"></div>', () => `<div id="root"><!--public-page:start-->${body}<!--public-page:end--></div>`)
  const destination = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html')
  await mkdir(join(destination, '..'), { recursive: true }); await writeFile(destination, html)
  // Vercel clean URLs and its filesystem phase also resolve the .html form.
  // Retain the directory form for ordinary static hosts.
  if (page.path !== '/') await writeFile(join(dist, `${page.path.slice(1)}.html`), html)
}
await writeFile(join(dist, 'sitemap.xml'), searchSitemap())
const sitemapHead = { ...searchMetadata('404'), route: 'sitemap', title: 'All pages — Sulayman Bowles', description: 'Work, writing, biography, résumé, and contact pages by Sulayman Bowles.', canonical: `${siteOrigin}/sitemap` }
await writeFile(join(dist, 'sitemap.html'), withSearchHead(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${fallbackStyle}</head><body>${renderToStaticMarkup(<main className="static-site"><h1>All pages</h1>{links(publicPages)}</main>)}</body></html>`, sitemapHead))
const discoverySource = await readFile(join(process.cwd(), 'public/llms.txt'), 'utf8')
const evidenceNotes = discoverySource.split('## Evidence boundaries\n')[1]
if (!evidenceNotes?.trim()) throw new Error('Missing discovery evidence boundaries')
const roleNotes = discoverySource.match(/\n\n(Sapien work covers[^]*?)\n\n##/)?.[1]
const machineEvidence = [roleNotes, evidenceNotes].filter(Boolean).join('\n\n')
const profile = machineProfile(machineEvidence)
await mkdir(join(dist, 'machine'), { recursive: true })
await writeFile(join(dist, 'machine/profile.json'), `${JSON.stringify(profile, null, 2)}\n`)
await writeFile(join(dist, 'machine/references.json'), `${JSON.stringify(machineReferences([...articleData.values()], machineEvidence), null, 2)}\n`)
await writeFile(join(dist, 'llms-full.txt'), fullDiscoveryText(profile, machineDocuments))
await writeFile(join(dist, 'llms.txt'), discoveryText(resumeProfile.currentSummary, resumeReview.asOf, machineEvidence))
await writeFile(join(dist, 'feed.xml'), writingFeed(catalog))
console.log(`Generated ${publicPages.length} indexable pages, a 404, and discovery files.`)
