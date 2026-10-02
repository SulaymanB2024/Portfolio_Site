import catalog from './editorial/data/catalog.json'
import AnimatedArtwork from './editorial/AnimatedArtwork'
import { ArtworkMotionControl, useArtworkMotion } from './editorial/ArtworkMotion'
import { getArticleGenerativeArtwork } from './editorial/generative/manifest'
import { displayDate, type ArticleSummary } from './editorial/types'
import { homeWritingDecks, siteCopy, withWritingCopy } from './site-copy'
import './home-writing.css'

const articles = (catalog as ArticleSummary[]).map(withWritingCopy)
const featured = ['who-owns-texas-toll-roads', 'atlas-building-an-evidence-console', 'the-first-ai-managers']
  .map(slug => articles.find(article => article.slug === slug))
  .filter((article): article is ArticleSummary => Boolean(article))

function JournalEssay({ article, lead = false }: { article: ArticleSummary; lead?: boolean }) {
  const { paused } = useArtworkMotion()
  const artwork = getArticleGenerativeArtwork(article.path)
  return <a className={`journal-essay ${lead ? 'journal-lead' : 'journal-companion'}`} href={`#/writing/${article.slug}`}>
    <div className="journal-essay-copy">
      <p className="journal-category mono">{article.category}</p>
      <h3>{article.displayTitle || article.title}</h3>
      <p className="journal-deck">{homeWritingDecks[article.slug] ?? article.subtitle}</p>
      <div className="journal-meta mono"><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time><span>{article.readTime}</span></div>
    </div>
    <div className="journal-art"><AnimatedArtwork artwork={artwork} size={lead ? 300 : 180} paused={paused} embedded decorative /></div>
    <span className="journal-read mono">{siteCopy.writing.read}<span aria-hidden="true">↗</span></span>
  </a>
}

export function HomeWriting() {
  const [lead, ...companions] = featured
  return <section className="home-writing home-journal" aria-labelledby="home-writing-title">
    <div className="journal-heading"><div><span className="journal-kicker mono">{siteCopy.writing.homeKicker}</span><h2 id="home-writing-title">Writing<span className="period">.</span></h2></div><ArtworkMotionControl /></div>
    <div className="journal-layout">
      {lead && <JournalEssay article={lead} lead />}
      <div className="journal-companions">{companions.map(article => <JournalEssay key={article.slug} article={article} />)}</div>
    </div>
    <a className="journal-all mono" href="#/writing">{siteCopy.writing.all}<span aria-hidden="true">→</span></a>
  </section>
}

export default HomeWriting
