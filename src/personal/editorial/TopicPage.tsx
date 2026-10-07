import { useEffect, type MouseEvent } from 'react'
import { findReadingTopic, readingTopics, topicReadings, topicQuestions } from './topics'
import { readingPathHref, sectionHref } from './library'
import { displayDate, displayReadTime } from './types'
import './reading-guides.css'

export function ReadingPaths({ interactive = false }: { interactive?: boolean }) {
  return <nav className="reading-paths" aria-label="Reading paths">
    {readingTopics.map(topic => <a key={topic.slug} href={`${interactive ? '#' : ''}/topics/${topic.slug}`}>
      <span className="eyebrow">{topic.readings.length} essays</span>
      <h2>{topic.title}</h2><p>{topic.description}</p><span className="reading-path-action">Explore the reading path <span aria-hidden="true">↗</span></span>
    </a>)}
  </nav>
}

export function TopicBody({ slug, interactive = false }: { slug: string; interactive?: boolean }) {
  const topic = findReadingTopic(slug)
  if (!topic) return null
  function rememberReading(event: MouseEvent<HTMLAnchorElement>, selected: string) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    history.replaceState(history.state, '', `${location.pathname}${location.search}${readingPathHref(slug, selected)}`)
  }
  return <>
    <div className="topic-introduction">{topic.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    <nav className="topic-questions" aria-labelledby="topic-questions-title"><h2 id="topic-questions-title">Start with a question</h2><ul>{topicQuestions(topic).map(({ question, section, article }) => <li key={question}><a href={interactive ? sectionHref(`#/writing/${article.slug}?from=${encodeURIComponent(readingPathHref(slug, article.slug))}`, section) : `${article.path}#${encodeURIComponent(section)}`} onClick={interactive ? event => rememberReading(event, article.slug) : undefined}>{question}</a></li>)}</ul></nav>
    <p className="reading-duration">Question paths added <time dateTime={topic.questionsUpdated}>{displayDate(topic.questionsUpdated)}</time>.</p>
    <ol className="topic-readings">{topicReadings(topic).map(({ article, reason }, index) => <li key={article.slug}>
      <span className="reading-step" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><h2><a data-slug={article.slug} href={interactive ? `#/writing/${article.slug}?from=${encodeURIComponent(readingPathHref(slug, article.slug))}` : article.path} onClick={interactive ? event => rememberReading(event, article.slug) : undefined}>{article.displayTitle || article.title}</a></h2><p>{reason}</p><span className="reading-duration">{displayReadTime(article.readTime)}</span></div>
    </li>)}</ol>
    <p className="topic-return"><a href={interactive ? '#/writing' : '/writing'}>Browse all writing <span aria-hidden="true">↗</span></a></p>
  </>
}

export default function TopicPage({ slug }: { slug: string }) {
  const topic = findReadingTopic(slug)
  useEffect(() => {
    const selected = new URLSearchParams(location.hash.split('?')[1] || '').get('at')
    if (!topic?.readings.some(reading => reading.slug === selected)) return
    const frame = requestAnimationFrame(() => {
      const link = [...document.querySelectorAll<HTMLAnchorElement>('.topic-readings h2 a')].find(item => item.dataset.slug === selected)
      link?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [topic])
  if (!topic) return <section className="topic-page"><h1>Reading path not found</h1><a href="#/writing">Browse writing</a></section>
  return <section className="topic-page">
    <header><a className="eyebrow" href="#/writing">Writing / Reading paths</a><h1>{topic.title}</h1><p className="topic-deck">{topic.description}</p></header>
    <TopicBody slug={slug} interactive />
  </section>
}
