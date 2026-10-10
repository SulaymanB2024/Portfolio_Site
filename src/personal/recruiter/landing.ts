import catalog from '../editorial/data/catalog.json' with { type: 'json' }
import { resumeProfile } from '../profile-copy.ts'
import { contact } from '../content.ts'
import { publicPages } from '../public-pages.ts'
import type { OutreachCompanyContext } from '../outreach-context.ts'
import { escapeMetadata, searchMetadata, type SearchMetadata } from '../search-metadata.ts'
import { recruiterCompanyProfile, type RecruiterWorkKey } from './company-profiles.ts'

const work: Record<RecruiterWorkKey, { title: string; label: string; description: string; route: string }> = {
  internshipdeadlines: { title: 'InternshipDeadlines', label: 'Launched product / Search & data', description: 'I built a student product that connects internship search, employer research, and application planning. Its pipeline validates sources, classifies roles, and preserves provenance.', route: 'work/internshipdeadlines' },
  atlas: { title: 'Atlas', label: 'Local workflow shipped / Python & SQLite', description: 'A website audit console I built to connect captured pages, findings, and evidence. Each recommendation has a source you can inspect.', route: 'work/atlas' },
  sapien: { title: 'Sapien', label: 'Growth & research / Current role', description: 'I lead positioning and growth for a market research platform using simulated audiences: buyer use cases, research synthesis, content, and sales material.', route: 'work/sapien' },
  markets: { title: 'Investing & Markets', label: 'Independent research / Finance & energy', description: 'Research into the contracts, cash flows, and physical constraints behind infrastructure, energy, and digital assets.', route: 'work/investing-markets' },
  payrollpro: { title: 'PayrollPro', label: 'Hackathon prototype / Team of three', description: 'A payroll product prototype built in a three-person hackathon team. The case study follows the problem, product decisions, and working demonstration.', route: 'work/payrollpro' },
  solver: { title: 'A constraint solver', label: 'Correct solution / Jane Street puzzle', description: 'A Python constraint solver for Jane Street’s July 2026 knight puzzle. The write-up explains the search, constraints, and verified solution.', route: 'writing/jane-street-exact-search-solver-verification' },
  creative: { title: 'Creative research & experiments', label: 'CreativeTrace / Tools & visual studies', description: 'I study patterns in public posts and video, develop creative hypotheses, and build tools and experiments in light, texture, and motion.', route: 'work/miscellaneous' },
}

export function recruiterMetadata(company: OutreachCompanyContext, route = 'recruiter'): SearchMetadata {
  if (route !== 'recruiter') return { ...searchMetadata(route), robots: 'noindex, follow' }
  const profile = recruiterCompanyProfile(company.slug, company.name)
  return { ...searchMetadata(''), route, title: `For ${company.name} — Sulayman Bowles`, description: profile.introduction, robots: 'noindex, follow', schema: null }
}

/** One escaped renderer for the initial document and the mounted landing page. */
export function renderRecruiterLanding(company: OutreachCompanyContext, links: 'hash' | 'document' = 'hash') {
  const profile = recruiterCompanyProfile(company.slug, company.name)
  const e = escapeMetadata
  const href = (route: string) => links === 'hash' ? `#/${route}` : publicPages.find(page => page.route === route)?.path || `/${route}`
  const arrow = '<span aria-hidden="true">↗</span>'
  const email = `mailto:${contact.email}?subject=${encodeURIComponent(`${company.name} — Let's talk`)}`
  const selectedWork = profile.work.map((key, index) => {
    const project = work[key]
    return `<article class="recruiter-work-entry"><span class="recruiter-index">0${index + 1}</span><div><p class="recruiter-label">${e(project.label)}</p><h3><a href="${e(href(project.route))}">${e(project.title)} ${arrow}</a></h3><p>${e(project.description)}</p></div></article>`
  }).join('')
  const experience = profile.experience.map(organization => {
    const job = resumeProfile.experience.find(job => job.organization === organization)
    if (!job) throw new Error(`Missing public experience: ${organization}`)
    return `<article class="recruiter-experience-entry"><div><h3>${e(job.organization)}</h3><p class="recruiter-label">${e(job.title)}</p><p class="recruiter-dates">${e(job.dates)}</p></div><p>${e(job.publicSummary)}</p></article>`
  }).join('')
  const reading = profile.reading.map(slug => {
    const article = catalog.find(article => article.slug === slug)
    if (!article) throw new Error(`Missing public reading: ${slug}`)
    return `<article class="recruiter-reading-entry"><p class="recruiter-label">${e(article.category)}</p><h3><a href="${e(href(`writing/${slug}`))}">${e(article.displayTitle || article.title)} ${arrow}</a></h3><p>${e(article.seoDescription || article.subtitle || '')}</p></article>`
  }).join('')
  return `<div class="recruiter-landing" data-recruiter-company="${e(company.slug)}">
    <section class="recruiter-hero" aria-labelledby="recruiter-title">
      <div class="recruiter-hero-copy"><p class="recruiter-company-line">For the team at <strong>${e(company.name)}</strong></p>
        <h1 id="recruiter-title">${e(profile.headline[0])}<br><em>${e(profile.headline[1])}</em></h1>
        <p class="recruiter-introduction">${e(profile.introduction)}</p>
        <div class="recruiter-actions"><a class="recruiter-action" href="${e(href('resume'))}">View my résumé ${arrow}</a><a class="recruiter-action recruiter-action-secondary" href="${e(email)}">Let’s talk ${arrow}</a></div>
      </div>
      <aside class="recruiter-portrait"><figure><img src="/art/helmet.webp" width="600" height="600" alt="A dithered study of a historical jousting helmet"><figcaption>Building carefully. Thinking independently.</figcaption></figure><div class="recruiter-signature"><span>Sulayman Bowles</span><span>Product, AI & finance<br>Austin, Texas · UT Austin</span></div></aside>
    </section>
    <section class="recruiter-section recruiter-contribution" aria-labelledby="recruiter-contribution-title"><div class="recruiter-section-heading"><p class="recruiter-label">01 / Where I could contribute</p><h2 id="recruiter-contribution-title">${e(profile.focus)}</h2><p>Experience I’d bring to ${e(company.name)}.</p></div><div class="recruiter-priorities">${profile.priorities.map(item => `<article><h3>${e(item.title)}</h3><p>${e(item.body)}</p></article>`).join('')}</div></section>
    <section class="recruiter-section recruiter-work" aria-labelledby="recruiter-work-title"><div class="recruiter-section-heading"><p class="recruiter-label">02 / Selected work</p><h2 id="recruiter-work-title">A closer look<br>at the work.</h2><p>Three projects selected for ${e(company.name)}.</p><a class="recruiter-text-link" href="${e(href('work'))}">Explore all work ${arrow}</a></div><div>${selectedWork}</div></section>
    <section class="recruiter-section recruiter-experience" aria-labelledby="recruiter-experience-title"><div class="recruiter-section-heading"><p class="recruiter-label">03 / Experience</p><h2 id="recruiter-experience-title">Research into<br>real products.</h2><p>Building, testing, and communicating ideas in practice.</p><a class="recruiter-text-link" href="${e(href('resume'))}">Full experience & education ${arrow}</a></div><div>${experience}</div></section>
    <section class="recruiter-section recruiter-reading" aria-labelledby="recruiter-reading-title"><div class="recruiter-section-heading"><p class="recruiter-label">04 / A window into my thinking</p><h2 id="recruiter-reading-title">Writing for<br>the conversation.</h2><p>Two pieces I’d bring to a conversation with ${e(company.name)}.</p></div><div>${reading}</div></section>
    <section class="recruiter-closing"><p class="recruiter-label">For ${e(company.name)}</p><h2>Let’s find a question<br>worth working on.</h2><p>I’d welcome a conversation about where this work could be useful to your team.</p><a class="recruiter-action" href="${e(email)}">${e(contact.email)} ${arrow}</a><a class="recruiter-text-link" href="/">Explore my full portfolio ${arrow}</a></section>
  </div>`
}

export function renderRecruiterDocument(company: OutreachCompanyContext) {
  const e = escapeMetadata
  return `<div class="static-site recruiter-static"><header><a href="/${e(company.slug)}">Sulayman Bowles</a><nav aria-label="Main navigation"><a href="/about">About</a><a href="/writing">Writing</a><a href="/work">Work</a><a href="/resume">Résumé</a><a href="/contact">Contact</a></nav></header><main id="main-content">${renderRecruiterLanding(company, 'document')}</main><footer><span>Sulayman Bowles</span><a href="${e(contact.linkedin)}">LinkedIn ↗</a><a href="https://sketchfab.com/3d-models/jousting-helmet-a4eea31d9d9441af9434a7da5ae46b54">Jousting Helmet · The Royal Armoury · CC BY 4.0</a></footer></div>`
}
