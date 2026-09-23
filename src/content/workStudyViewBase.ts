import { primaryNav, navLabel } from './siteNavigation';
import { WORK_STUDIES, WORK_STUDIES_UPDATED, workStudyPath, type WorkStudy } from './workStudies';

export const WORK_ARCHIVE = [
  { name: 'Atlas SEO Audit Console', label: 'Crawl infrastructure', href: '/atlas', description: 'A crawler and review console that keeps recommendations connected to URL-level observations.' },
  { name: 'Texas Toll-Road Ownership', label: 'Infrastructure research', href: '/markets/who-owns-texas-toll-roads', description: 'Who owns the road, controls the concession, collects the toll, and bears the risk?' },
  { name: 'ViralBench + Codex', label: 'Evaluation design', href: '/viralbench-codex-agent-harness', description: 'An engineering design for traces, replay, and controlled trials around a live marketing-agent benchmark.' },
  { name: 'Austin Crawlability Pilot', label: 'Technical SEO research', href: '/austin-technical-seo', description: 'A bounded public study with inspectable rows, collection limits, and a downloadable dataset.' },
  { name: 'Void Agency', label: 'Operating practice', href: 'https://www.void-agency.com/', description: 'The technical SEO and web-systems practice behind my client delivery work.' },
  { name: 'Technical Ledger', label: 'Technical publication', href: 'https://sulayman-bowles.tech/', description: 'Longer engineering notes, graphics experiments, and competition records.' },
];
export const WORK_INDEX_DESCRIPTION = 'Technical SEO portfolio, AI systems, graphics engineering, and investment research by Sulayman Bowles. Explore ten project case studies and six supporting works.';
export const WORK_INDEX_TITLE = 'Technical SEO Portfolio, Products & AI Systems | Sulayman Bowles';

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
const e = escapeHtml;
const paragraphs = (items: string[]) => items.map(p => `<p>${e(p)}</p>`).join('');
const absolute = (path: string) => path.startsWith('http') ? path : `https://sulayman-bowles.dev${path}`;
const workStudiesUpdatedLabel = new Date(`${WORK_STUDIES_UPDATED}T12:00:00Z`).toLocaleDateString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
});

function arrow() { return '<span aria-hidden="true" class="ws-arrow">↗</span>'; }
const sharedWorkNav = primaryNav.map((item) =>
  `<a href="${e(item.href)}" ${item.href === '/work' ? 'aria-current="page"' : ''}>${e(navLabel(item))}</a>`
).join('');
function header(detail = false) {
  return `<a class="ws-skip" href="#work-main">Skip to content</a>
  <header class="ws-header">
    <a class="ws-brand" href="/" aria-label="Sulayman Bowles — Home">
      <img src="/favicon.svg" width="36" height="36" alt="" aria-hidden="true" class="ws-brand-mark">
      <span class="ws-brand-copy"><strong>SULAYMAN BOWLES</strong><small>Technical SEO · AI Systems · Finance Research</small></span>
    </a>
    <nav aria-label="${detail ? 'Case study' : 'Work'} navigation">${sharedWorkNav}</nav>
  </header>`;
}
function footer() {
  return `<footer class="ws-footer">
    <a class="ws-footer-brand" href="/" aria-label="Sulayman Bowles — Home">
      <img src="/favicon.svg" width="32" height="32" alt="" aria-hidden="true">
      <span><strong>SULAYMAN BOWLES</strong><small>Technical SEO · AI Systems · Finance Research</small></span>
    </a>
    <nav aria-label="Footer navigation">${sharedWorkNav}</nav>
    <div class="ws-footer-meta">© 2026 SULAYMAN BOWLES<br>ALL RIGHTS RESERVED</div>
    <a class="ws-footer-top" href="#work-main">Back to top ↑</a>
  </footer>`;
}

const svg = (body: string, extra = '') => `<svg viewBox="0 0 600 390" aria-hidden="true" focusable="false" ${extra}>${body}</svg>`;
const line = (x1: number, y1: number, x2: number, y2: number) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;

/** The plate is authored explanatory art, never a product screenshot or an observed performance chart. */
function ditherField(step: number) {
  const bayer = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  let d = '';
  for (let y = 22, iy = 0; y < 365; y += step, iy++) {
    for (let x = 40, ix = 0; x < 560; x += step, ix++) {
      const dx = (x - 300) / 185, dy = (y - 215) / 161;
      const r = dx * dx + dy * dy;
      if (r > 1) continue;
      const light = Math.max(0, Math.min(1, .29 + .57 * Math.sqrt(1 - r) - .30 * dx - .22 * dy));
      if (light > (bayer[iy % 4][ix % 4] + .5) / 16) d += `M${x} ${y}h${step - 1}v${step - 1}h-${step - 1}z`;
    }
  }
  return `<path fill="currentColor" d="${d}"/>`;
}
function artwork(study: WorkStudy, compact: boolean) {
  switch (study.visual) {
    case 'dither': return svg(`<g opacity=".2" fill="none" stroke="currentColor"><circle cx="300" cy="205" r="176"/><path d="M30 205h540M300 15v360"/></g>${(compact ? [9] : [5, 9, 15]).map((step, i) => `<g data-grain-layer="${i}" ${i > 0 ? 'style="display:none"' : ''}>${ditherField(step)}</g>`).join('')}`);
    case 'discovery': return svg(`<g fill="none" stroke="currentColor"><path d="M64 326V66h472v260Z" opacity=".25"/><path d="M64 119h472M105 51v31M161 51v31M217 51v31M273 51v31M329 51v31M385 51v31M441 51v31M497 51v31" opacity=".4"/>${[0,1,2,3,4,5,6].map(i => line(98+i*66,141,98+i*66,300)).join('')}${[0,1,2].map(i => line(88,154+i*63,512,154+i*63)).join('')}<path class="ws-art-accent" d="M164 155h133v125h134" stroke-width="3"/><circle cx="164" cy="155" r="11" fill="currentColor"/><circle cx="297" cy="218" r="11" fill="currentColor"/><circle cx="431" cy="280" r="17" stroke-width="3"/></g>`);
    case 'payroll': return svg(`<g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="58" y="58" width="184" height="275" rx="3"/><path d="M80 99h140M80 137h85M80 164h140M80 191h109M80 264h140M80 291h96" opacity=".45"/><path d="M242 194h76M382 194h88M470 194v-68h74M470 194v68h74"/><circle class="ws-art-accent" cx="350" cy="194" r="33"/><path d="m335 194 10 10 19-23" class="ws-art-accent" stroke-width="3"/><rect x="492" y="103" width="70" height="46"/><rect x="492" y="239" width="70" height="46"/><path d="M84 224h24m10 0h24m10 0h24m10 0h24" stroke-width="6"/></g>`);
    case 'thesis': return svg(`<g fill="none" stroke="currentColor"><path d="M76 310 300 40l224 270ZM112 265h376M160 208h280M210 149h180"/><path d="M76 339h448M300 40v270" opacity=".35"/><circle cx="300" cy="208" r="52" class="ws-art-accent" stroke-width="2"/><circle cx="300" cy="208" r="8" fill="currentColor"/><path d="M248 208h104M300 156v104" class="ws-art-accent"/></g>`);
    case 'mandate': return svg(`<g fill="none" stroke="currentColor"><path d="M48 110h133v170H48ZM419 110h133v170H419Z"/><path d="M181 194h75M344 194h75" stroke-width="2"/><path d="M257 65h86v260h-86Z" stroke-dasharray="5 7" opacity=".5"/><circle cx="300" cy="194" r="32" class="ws-art-accent"/><path d="m288 193 8 8 16-19" class="ws-art-accent" stroke-width="3"/><path d="M76 146h77M76 171h53M76 219h77M76 244h60M447 146h77M447 171h53M447 219h77M447 244h60" opacity=".45"/></g>`);
    case 'solver': return svg(`<g fill="none" stroke="currentColor" opacity=".25">${[0,1,2,3,4,5].map(i=>line(110+i*76,58,110+i*76,338)).join('')}${[0,1,2,3,4].map(i=>line(110,58+i*70,490,58+i*70)).join('')}</g><g fill="none" stroke="currentColor" stroke-width="2"><path d="M110 58 262 128 186 268 338 338 490 268 414 128" class="ws-art-accent"/>${[[110,58],[262,128],[186,268],[338,338],[490,268],[414,128]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===5?12:6}" ${i===5?'':'fill="currentColor"'}/>`).join('')}</g>`);
    case 'ingestion': return svg(`<g fill="none" stroke="currentColor"><path d="M55 73h130v58H55ZM55 260h130v58H55ZM235 157h130v76H235ZM421 73h130v58H421ZM421 260h130v58H421Z"/><path d="M185 102h27v93h23M185 289h27v-94M365 195h28v-93h28"/><path d="M365 195h28v94h28" stroke-dasharray="5 5" opacity=".5"/><path d="m450 95 12 12 24-25" class="ws-art-accent" stroke-width="3"/><path d="M450 289h69" opacity=".55"/><path d="M79 95h77M79 111h54M79 282h77M79 298h54M260 183h80M260 202h54" opacity=".4"/></g>`);
    case 'operator': return svg(`<g fill="none" stroke="currentColor"><path d="M62 96h127v216H62ZM236 68h127v216H236ZM410 96h127v216H410Z"/><path d="M77 114h97v90H77ZM251 86h97v90H251ZM425 114h97v90H425Z" opacity=".4"/><circle cx="126" cy="159" r="28" class="ws-art-accent"/><path d="M271 151 296 109l32 42ZM440 182l33-47 33 47" class="ws-art-accent"/><path d="M78 230h95M78 249h64M78 279h82M252 203h95M252 222h64M252 252h82M426 230h95M426 249h64M426 279h82" opacity=".5"/><path d="M189 200h47M363 200h47" stroke-dasharray="4 5"/></g>`);
    case 'ticket': return svg(`<g fill="none" stroke="currentColor"><path d="M65 95h146v202H65ZM389 95h146v202H389Z"/><path d="M211 196h55M334 196h55" stroke-width="2"/><path d="M266 141h68v110h-68Z" stroke-dasharray="6 6" opacity=".55"/><circle cx="300" cy="196" r="25" class="ws-art-accent" stroke-width="2"/><path d="m289 196 8 8 16-18" class="ws-art-accent" stroke-width="3"/><path d="M87 124h102M87 151h68M87 233h102M87 260h79M411 124h102M411 151h68M411 233h102M411 260h79" opacity=".4"/><path d="M117 81v28M159 81v28M441 81v28M483 81v28"/></g>`);
  }
}
export function workStudyArt(study: WorkStudy, compact = false) {
  return `<div class="ws-art ws-art--${study.visual}">${artwork(study, compact)}<div class="ws-plate-corner" aria-hidden="true">${study.number} / ${e(study.discipline.split(' / ')[0])}</div></div>`;
}

function specificPanel(study: WorkStudy) {
  if (study.visual === 'solver') return `<div class="ws-result-specimen"><span class="ws-kicker">Recorded solver output</span><strong>33,609</strong><dl><div><dt>Schedule constant</dt><dd>K = 7</dd></div><div><dt>Path length</dt><dd>54 moves</dd></div><div><dt>Check</dt><dd>Separate verifier</dd></div></dl></div>`;
  if (study.visual === 'ingestion') return `<div class="ws-state-strip"><div><span class="ws-kicker">Observation</span><strong>Partial scan</strong></div><span class="ws-state-arrow" aria-hidden="true">→</span><div><span class="ws-kicker">Decision</span><strong>Do not infer closure</strong></div></div>`;
  if (study.visual === 'mandate') return `<div class="ws-boundary-strip"><div><span class="ws-kicker">Inside the brief</span><p>Workflow · Authority · Rights posture</p></div><div><span class="ws-kicker">Outside the intake</span><p>Raw records · Credentials · Private messages</p></div></div>`;
  if (study.visual === 'thesis') return `<div class="ws-thesis-strip"><span class="ws-kicker">Investment question</span><p>What is owned?<br>Who decides?<br>Who bears the risk?</p></div>`;
  if (study.visual === 'payroll') return `<div class="ws-state-strip"><div><span class="ws-kicker">Visibility</span><strong>Private compensation</strong></div><span class="ws-state-arrow" aria-hidden="true">≠</span><div><span class="ws-kicker">Authority</span><strong>Treasury approval</strong></div></div>`;
  if (study.visual === 'operator') return `<div class="ws-state-strip"><div><span class="ws-kicker">Artifact</span><strong>Prepared for review</strong></div><span class="ws-state-arrow" aria-hidden="true">≠</span><div><span class="ws-kicker">Action</span><strong>Published campaign</strong></div></div>`;
  if (study.visual === 'ticket') return `<div class="ws-state-strip"><div><span class="ws-kicker">Authority</span><strong>Matching gate cap</strong></div><span class="ws-state-arrow" aria-hidden="true">→</span><div><span class="ws-kicker">State</span><strong>Unused → used</strong></div></div>`;
  return '';
}

export function renderWorkStudy(study: WorkStudy) {
  const idx = WORK_STUDIES.findIndex(p => p.slug === study.slug);
  const next = WORK_STUDIES[(idx + 1) % WORK_STUDIES.length];
  return `<div class="work-studio ws-study ws-study--${study.visual}" data-work-study="${e(study.slug)}">${header(true)}
  <main class="seo-static-crawl-content"><div id="work-main" tabindex="-1"><div class="ws-frame">
  <nav class="ws-breadcrumb" aria-label="Breadcrumb"><a href="/work">Selected work</a><span aria-hidden="true">/</span><span aria-current="page">${e(study.name)}</span></nav>
  <section class="ws-study-hero" aria-labelledby="study-title"><div class="ws-study-title"><p class="ws-kicker">${e(study.discipline)} <span aria-hidden="true">/</span> ${study.number}</p><p class="ws-project-name">${e(study.name)}</p><h1 id="study-title"><span>${e(study.headline[0])}</span><em>${e(study.headline[1])}</em></h1><p class="ws-dek">${e(study.description)}</p><a class="ws-text-link" href="#the-work">Read the case study <span aria-hidden="true">↓</span></a></div><div class="ws-hero-plate">${workStudyArt(study)}<p class="ws-hero-caption">${study.visual === 'solver' ? 'Illustrative path motif, not the solved puzzle board.' : e(study.visualCaption)}</p></div></section>
  <dl class="ws-facts"><div><dt>My role</dt><dd>${e(study.role)}</dd></div><div><dt>Form</dt><dd>${e(study.medium)}</dd></div><div><dt>Period</dt><dd>${e(study.period)}</dd></div><div><dt>Status</dt><dd>${e(study.status)}</dd></div></dl>
  <div class="ws-reading-grid" id="the-work"><aside class="ws-reading-rail"><p class="ws-kicker">Inside the project</p><nav aria-label="Case study sections">${study.chapters.map((c,i)=>`<a href="#chapter-${i+1}"><span aria-hidden="true">0${i+1}</span>${e(c.title)}</a>`).join('')}<a href="#design-decisions"><span aria-hidden="true">04</span>Design decisions</a><a href="#result"><span aria-hidden="true">05</span>Result & sources</a></nav><p class="ws-rail-note">A case study by<br><a href="/about">Sulayman Bowles</a></p></aside>
  <article class="ws-narrative"><p class="ws-premise">${e(study.premise)}</p>
  ${study.chapters.map((chapter, i) => `<section class="ws-chapter" id="chapter-${i+1}" aria-labelledby="chapter-title-${i+1}"><p class="ws-kicker">0${i+1} / ${['The problem','The work','The judgment'][i]}</p><h2 id="chapter-title-${i+1}">${e(chapter.title)}</h2>${paragraphs(chapter.paragraphs)}</section>${i===0?`<figure class="ws-inspector" data-inspector="${study.visual}"><figcaption><span class="ws-kicker">Working principle</span><strong>${e(study.visualLabel)}</strong></figcaption>${specificPanel(study)}<div class="ws-inspector-controls" role="group" aria-label="Explore ${e(study.name)}">${study.observations.map((ob,j)=>`<button type="button" data-observation-button="${j}" aria-pressed="${j===0}" aria-controls="observation-${e(study.slug)}-${j}">${e(ob.label)}</button>`).join('')}</div><div class="ws-observations" aria-live="polite">${study.observations.map((ob,j)=>`<p id="observation-${e(study.slug)}-${j}" data-observation="${j}" ${j===0?'class="is-active"':''}><strong>${e(ob.label)}.</strong> ${e(ob.text)}</p>`).join('')}</div><p class="ws-figure-note">${e(study.visualCaption)}</p></figure>`:''}`).join('')}
  <section class="ws-chapter ws-decisions" id="design-decisions" aria-labelledby="decisions-title"><p class="ws-kicker">04 / Decisions</p><h2 id="decisions-title">What I chose.<br><em>And why.</em></h2><dl>${study.decisions.map((decision,i)=>`<div><dt><span aria-hidden="true">0${i+1}</span>${e(decision.choice)}</dt><dd>${e(decision.reason)}</dd></div>`).join('')}</dl></section>
  <section class="ws-chapter ws-outcome" id="result" aria-labelledby="result-title"><p class="ws-kicker">05 / Result</p><h2 id="result-title">What came out of it.</h2><p class="ws-outcome-lead">${e(study.result)}</p>${study.links.length?`<div class="ws-source-links">${study.links.map(link=>`<a href="${e(link.href)}" data-portfolio-cta="work_open_evidence"><span>${e(link.label)} ${arrow()}</span><small>${e(link.note)}</small></a>`).join('')}</div>`:''}<details class="ws-scope"><summary>Status & source notes</summary><p>${e(study.scope)}</p><p>Case study updated ${workStudiesUpdatedLabel}.</p></details></section>
  </article></div>
  <section class="ws-related" aria-labelledby="related-title"><div><p class="ws-kicker">Continue exploring</p><h2 id="related-title">Related work.</h2></div><div class="ws-related-links">${study.related.map(slug=>WORK_STUDIES.find(s=>s.slug===slug)).filter((s): s is WorkStudy=>Boolean(s)).map(s=>`<a href="${workStudyPath(s)}" data-portfolio-cta="work_open_project"><span class="ws-kicker">${e(s.discipline)}</span><strong>${e(s.name)} ${arrow()}</strong><p>${e(s.description)}</p></a>`).join('')}</div></section>
  <a class="ws-next" href="${workStudyPath(next)}" data-portfolio-cta="work_open_project"><span class="ws-kicker">Next case study / ${next.number}</span><strong>${e(next.name)}</strong>${arrow()}</a>
  </div></div></main>${footer()}</div>`;
}

export function renderWorkIndex() {
  return `<div class="work-studio ws-index">${header()}<main class="seo-static-crawl-content"><div id="work-main" tabindex="-1"><div class="ws-frame">
  <section class="ws-index-hero" aria-labelledby="work-title"><div><p class="ws-kicker">Selected work / ${WORK_STUDIES.length} case studies</p><h1 id="work-title">Ideas, built.<br><em>Decisions, explained.</em></h1></div><div class="ws-index-intro"><p>Products, graphics engineering, investment research, and the systems underneath.</p><p>Each project starts with a specific problem. These case studies explain what I built, the choices I made, and what the work became.</p><a class="ws-text-link" href="#case-studies">Explore the work <span aria-hidden="true">↓</span></a></div></section>
  <nav class="ws-project-index" aria-label="Jump to a project">${WORK_STUDIES.map(s=>`<a href="#${e(s.legacyId)}"><span>${s.number}</span>${e(s.name)}</a>`).join('')}</nav>
  <section id="case-studies" class="ws-project-grid" aria-label="Project case studies">${WORK_STUDIES.map(s=>`<article class="ws-project-card" id="${e(s.legacyId)}"><a class="ws-card-link" href="${workStudyPath(s)}" data-portfolio-cta="work_open_project"><div class="ws-card-art">${workStudyArt(s,true)}<span class="ws-open-study">Read case study ${arrow()}</span></div><div class="ws-card-copy"><p class="ws-kicker">${e(s.discipline)} <span>${s.number}</span></p><h2>${e(s.name)} ${arrow()}</h2><p>${e(s.description)}</p><div class="ws-card-meta"><span>${e(s.role)}</span><span>${e(s.status)}</span></div></div></a></article>`).join('')}</section>
  <section class="ws-archive" aria-labelledby="archive-title"><div><p class="ws-kicker">Six more public works</p><h2 id="archive-title">Also on<br><em>the desk.</em></h2><p>The existing products, research, and operating work that complete the portfolio.</p></div><div>${WORK_ARCHIVE.map(s=>`<article><a href="${e(s.href)}" data-portfolio-cta="work_open_project"><span class="ws-kicker">${e(s.label)}</span><h3>${e(s.name)} ${arrow()}</h3><p>${e(s.description)}</p></a></article>`).join('')}</div></section>
  <nav class="ws-supporting" aria-label="Methods and supporting files"><a href="/method">Technical SEO audit method ↗</a><a href="/atlas/sample-crawl">Atlas sample crawl ↗</a><a href="/research/appian-assumptions-table.csv">Appian assumptions table ↗</a></nav><section class="ws-contact"><p class="ws-kicker">A useful next conversation</p><h2>Start with<br><em>the problem.</em></h2><div><p>For product, systems, or research work, share the decision you are trying to make.</p><a class="ws-button" href="/contact" data-portfolio-cta="work_open_contact">Get in touch ${arrow()}</a><a class="ws-text-link" href="/resume">View résumé ${arrow()}</a></div></section>
  </div></div></main>${footer()}</div>`;
}

export function workStudyJsonLd(study: WorkStudy) {
  const url = absolute(workStudyPath(study));
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: `${study.name} | Sulayman Bowles`, description: study.description, dateModified: WORK_STUDIES_UPDATED, isPartOf: { '@id': 'https://sulayman-bowles.dev/#website' }, about: { '@id': `${url}#project` }, breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'CreativeWork', '@id': `${url}#project`, name: study.name, description: study.description, url, creator: { '@id': 'https://sulayman-bowles.dev/about#sulayman-bowles' }, creativeWorkStatus: study.status, dateModified: WORK_STUDIES_UPDATED },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sulayman-bowles.dev/' },
      { '@type': 'ListItem', position: 2, name: 'Selected work', item: absolute('/work') },
      { '@type': 'ListItem', position: 3, name: study.name, item: url }
    ] }
  ] };
}

export function workIndexJsonLd() {
  const items = [...WORK_STUDIES.map(s=>({name:s.name,href:workStudyPath(s)})),...WORK_ARCHIVE];
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': ['WebPage', 'CollectionPage'], isPartOf: { '@id': 'https://sulayman-bowles.dev/#website' }, keywords: 'technical SEO portfolio, AI systems portfolio, financial research', '@id': 'https://sulayman-bowles.dev/work#webpage', url: absolute('/work'), name: WORK_INDEX_TITLE, description: WORK_INDEX_DESCRIPTION, mainEntity: { '@id': 'https://sulayman-bowles.dev/work#projects' } },
    { '@type': 'ItemList', '@id': 'https://sulayman-bowles.dev/work#projects', numberOfItems: items.length, itemListElement: items.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,url:absolute(item.href)})) }
  ] };
}
