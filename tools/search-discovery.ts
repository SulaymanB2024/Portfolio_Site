import { publicPages, siteOrigin } from '../src/personal/public-pages.ts'
import { identity } from '../src/personal/identity.ts'
import { resumeProfile, resumeReview } from '../src/personal/profile-copy.ts'
import { sourceDate, personId } from '../src/personal/search-metadata.ts'
import { readingTopics, topicReadings } from '../src/personal/editorial/topics.ts'
import type { WritingArticle } from '../src/personal/editorial/types.ts'
import { answerNotes, answerNotesUpdated, readerModifiedDate } from '../src/personal/editorial/answer-notes.ts'

const machinePaths = {
  profile: '/machine/profile.json',
  references: '/machine/references.json',
  fullText: '/llms-full.txt',
}

// Select reviewed public fields explicitly: resumeProfile also inherits an
// older source artifact whose certifications and project paths are historical.
export function machineProfile(evidenceNotes: string) {
  return {
    schemaVersion: 1,
    id: personId,
    name: identity.name,
    givenName: identity.givenName,
    familyName: identity.familyName,
    url: `${siteOrigin}/about`,
    summary: identity.summary,
    reviewedAsOf: resumeReview.asOf,
    education: {
      institution: resumeProfile.education.institution,
      degrees: resumeProfile.education.degrees.map(({ degree, field }) => ({ degree, field })),
      expectedGraduation: resumeProfile.education.expectedGraduation,
      source: `${siteOrigin}/resume`,
    },
    experience: resumeProfile.experience.filter(role => role.visibility === 'public').map(role => ({
      organization: role.organization, title: role.title, dates: role.dates,
      summary: role.publicSummary, contributions: role.bullets,
      source: `${siteOrigin}/resume`,
    })),
    awardsAndLeadership: resumeProfile.awardsAndLeadership.map(award => ({
      organization: award.organization, title: award.title, dates: award.dates,
      detail: award.detail, source: `${siteOrigin}/resume`,
    })),
    profiles: identity.profiles.map(({ label, href }) => ({ label, url: href })),
    sources: ['/about', '/resume', '/work'].map(path => `${siteOrigin}${path}`),
    historicalSources: [{
      url: `${siteOrigin}/Sulayman_Bowles_Resume.pdf`,
      note: resumeReview.pdfNote,
    }],
    evidenceBoundaries: evidenceNotes.trim(),
  }
}

export function machineReferences(articles: WritingArticle[], evidenceNotes: string) {
  return {
    schemaVersion: 1,
    site: `${siteOrigin}/`,
    author: { id: personId, name: identity.name, profile: `${siteOrigin}${machinePaths.profile}` },
    profileReviewedAsOf: resumeReview.asOf,
    // No build timestamp: dates describe source content, not deployment churn.
    pages: publicPages.map(page => ({
      url: `${siteOrigin}${page.path}`, title: page.title, description: page.description,
      kind: page.route.startsWith('writing/') ? 'article' : page.route.startsWith('topics/') ? 'reading-path' : page.route.startsWith('work/') ? 'work' : 'profile-or-navigation',
    })),
    articles: articles.map(article => ({
      url: `${siteOrigin}${article.path}`, title: article.displayTitle || article.title,
      description: article.subtitle, author: personId, category: article.category,
      datePublished: sourceDate(article.date), dateModified: readerModifiedDate(article.slug, article.dateModified),
      manuscriptDateModified: sourceDate(article.dateModified),
      evidenceBoundary: article.pageContent?.boundary?.text || article.evidenceBoundary,
      // Reader additions are visible on the page, with their own dated scope;
      // they do not revise the manuscript's research cutoff or source ledger.
      ...(answerNotes(article.slug) ? { readerNotes: {
        dateAdded: answerNotesUpdated,
        evidenceBoundary: answerNotes(article.slug)!.boundary,
        questions: answerNotes(article.slug)!.questions.map(note => ({
          url: `${siteOrigin}${article.path}#${note.id}`, question: note.question,
          sources: note.sources.map(source => ({ label: source.label, url: new URL(source.href, siteOrigin).href })),
        })),
      } } : {}),
      sources: (article.sources || []).map(source => ({
        label: source.label, publisher: source.publisher, date: source.date,
        lastVerified: source.lastVerified, note: source.note, limitation: source.limitation,
        urls: [...new Set([
          ...(source.href ? [source.href] : []), ...(source.hrefs || []),
          ...[...(source.markdown || '').matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]),
        ])].map(href => new URL(href, siteOrigin).href),
        ...(source.markdown ? { citation: source.markdown } : {}),
      })),
    })),
    readingPaths: readingTopics.map(topic => ({
      url: `${siteOrigin}/topics/${topic.slug}`, title: topic.title, description: topic.description,
      readings: topicReadings(topic).map(({ article, reason }) => ({ url: `${siteOrigin}${article.path}`, reason })),
    })),
    resources: Object.fromEntries(Object.entries(machinePaths).map(([key, path]) => [key, `${siteOrigin}${path}`])),
    evidenceBoundaries: evidenceNotes.trim(),
  }
}

const decodeEntities = (text: string) => text.replace(/&(amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (_, entity: string) => {
  if (entity.startsWith('#x')) return String.fromCodePoint(parseInt(entity.slice(2), 16))
  if (entity.startsWith('#')) return String.fromCodePoint(Number(entity.slice(1)))
  return ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' } as Record<string, string>)[entity.toLowerCase()]
})

// Project the very same rendered main document into text; never maintain a
// second, richer biography or article exclusively for bots.
export function documentText(markup: string, canonical: string) {
  return decodeEntities(markup
    .replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([^]*?)<\/a>/gi, (_, href: string, label: string) => `${label} (${new URL(decodeEntities(href), canonical).href})`)
    .replace(/<img\b[^>]*alt="([^"]*)"[^>]*>/gi, '\n$1\n')
    .replace(/<br\b[^>]*>|<\/?(?:h[1-6]|p|div|section|article|nav|header|footer|ul|ol|li|tr|pre|blockquote|figure|figcaption|dl|dt|dd|details|summary|text|tspan)\b[^>]*>/gi, '\n\n')
    .replace(/<\/(?:td|th)>/gi, ' | ')
    .replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n').trim()
}

export function fullDiscoveryText(profile: ReturnType<typeof machineProfile>, documents: { url: string; text: string }[]) {
  return `# ${profile.name}\n\nOfficial site: ${siteOrigin}/\nPerson identifier: ${profile.id}\nProfile reviewed as of: ${profile.reviewedAsOf}\n\nThis is an alternate text representation of the existing public documents. Source-page URLs and dates retain their original scope; a deployment does not establish new review dates.\n\n## Profile\n\n${profile.summary}\n\n## Evidence boundaries\n\n${profile.evidenceBoundaries}\n\n${documents.map(document => `---\n\nCanonical source: ${document.url}\n\n${document.text}`).join('\n\n')}\n`
}

// Optional retrieval convenience, generated from the same records as the site.
// Indexability is established by HTML, canonicals, robots, and the XML sitemap.
export function discoveryText(profile: string, profileAsOf: string, evidenceNotes: string) {
  const list = (pages: typeof publicPages) => pages.map(page =>
    `- [${page.route ? page.title.replace(' — Sulayman Bowles', '') : 'Home'}](${siteOrigin}${page.path}): ${page.description}`,
  ).join('\n')
  return `# Sulayman Bowles

> Official personal site: software, AI, product, growth, and finance.

Official site: ${siteOrigin}/
Person identifier: ${personId}
Profile source snapshot: ${profileAsOf}

## Profile

${profile}

## Primary pages

${list(publicPages.filter(page => !page.route.includes('/')))}

## Work

${list(publicPages.filter(page => page.route.startsWith('work/')))}

## Writing

${list(publicPages.filter(page => page.route.startsWith('writing/')))}

## Reading paths

${list(publicPages.filter(page => page.route.startsWith('topics/')))}

## Supporting references

- [Reviewed public profile (JSON)](${siteOrigin}${machinePaths.profile})
- [Canonical pages and cited sources (JSON)](${siteOrigin}${machinePaths.references})
- [Existing public documents in full text](${siteOrigin}${machinePaths.fullText})
- [Historical July 2026 résumé PDF](${siteOrigin}/Sulayman_Bowles_Resume.pdf): the web résumé reflects the September 2026 source snapshot.
- [Professional profile](https://www.linkedin.com/in/sulayman-bowles/)
- [Code](https://github.com/SulaymanB2024)

## Evidence boundaries

${evidenceNotes.trim()}
`
}
