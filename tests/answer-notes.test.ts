import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import data from '../src/personal/editorial/data/answer-notes.json' with { type: 'json' }
import { answerNotes, questionAnchor, readerModifiedDate } from '../src/personal/editorial/answer-notes.ts'
import { readingTopics, topicQuestions } from '../src/personal/editorial/topics.ts'

const source = (slug: string) => JSON.parse(readFileSync(`src/personal/editorial/data/articles/${slug}.json`, 'utf8'))
const ids = (article: any) => new Set([
  ...(article.sections || []).map((section: any) => section.id),
  ...(article.markdownSections || []).map((section: any) => section.id),
  ...(article.outline || []).map((section: any) => section.id),
  ...(article.faqs || []).map((faq: any) => questionAnchor(faq.question)),
  ...(answerNotes(article.slug)?.questions || []).map(question => question.id),
])

test('every answer is attributable to an existing essay, working analysis target, and retained evidence', () => {
  for (const slug of Object.keys(data.articles)) {
    assert(catalog.some(article => article.slug === slug), `Unknown essay: ${slug}`)
    const article = source(slug), notes = answerNotes(slug)!
    assert(notes.boundary.trim(), `Missing scope: ${slug}`)
    const questionIds = notes.questions.map(question => question.id)
    assert.equal(new Set(questionIds).size, questionIds.length, `Answer ID collision: ${slug}`)
    for (const question of notes.questions) {
      assert(/^answer-[a-z0-9-]+$/.test(question.id))
      assert(question.question.endsWith('?') && question.answer.trim())
      assert(ids(article).has(question.section), `Missing analysis: ${slug}#${question.section}`)
      assert(question.sources.length > 0, `Unattributed answer: ${slug}#${question.id}`)
      for (const evidence of question.sources) {
        assert(evidence.label.trim())
        const url = new URL(evidence.href, 'https://sulayman-bowles.dev')
        assert(['https:'].includes(url.protocol))
        if (url.origin === 'https://sulayman-bowles.dev') assert(existsSync(`public${url.pathname}`), `Missing evidence file: ${url.pathname}`)
      }
      const related = source(question.related.slug)
      assert.notEqual(related.slug, slug)
      assert(ids(related).has(question.related.section), `Missing connected passage: ${related.slug}#${question.related.section}`)
    }
  }
})

test('a dated reader addition changes only the edited edition, while future revisions and unknown slugs remain intact', () => {
  assert.equal(readerModifiedDate('robots-txt-courtesy-not-access-control', '2026.10.05'), '2026-10-06')
  assert.equal(readerModifiedDate('robots-txt-courtesy-not-access-control', '2027.01.01'), '2027-01-01')
  assert.equal(readerModifiedDate('the-first-ai-managers', '2026.10.05'), '2026-10-05')
  assert.equal(readerModifiedDate('unpublished'), undefined)
  for (const summary of catalog) assert.equal(source(summary.slug).date, summary.date, 'Reader additions cannot rewrite manuscript publication dates')
})

test('existing question permalinks are wording-based and unique within each essay', () => {
  assert.equal(questionAnchor('Who owns SH 130?'), 'question-who-owns-sh-130')
  assert.equal(questionAnchor('What’s a résumé?'), 'question-what-s-a-resume')
  for (const summary of catalog) {
    const questions = (source(summary.slug).faqs || []).map((faq: any) => questionAnchor(faq.question))
    assert.equal(new Set(questions).size, questions.length, `Question ID collision: ${summary.slug}`)
  }
})

test('each topic question leads into its own collection at an existing passage', () => {
  for (const topic of readingTopics) {
    assert(topic.seoTitle && topic.seoTitle !== topic.title)
    for (const question of topicQuestions(topic)) assert(ids(source(question.slug)).has(question.section), `Broken topic target: ${question.slug}#${question.section}`)
  }
})
