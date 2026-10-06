import catalog from './editorial/data/catalog.json'
import AnimatedArtwork from './editorial/AnimatedArtwork'
import { useArtworkMotion } from './editorial/ArtworkMotion'
import { getArticleGenerativeArtwork } from './editorial/generative/manifest'
import { displayDate, type ArticleSummary } from './editorial/types'
import { homeWritingDecks, siteCopy, withWritingCopy } from './site-copy'
import { DestinationCue, DestinationLink } from './DestinationLink'
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
      <h3>{article.displayTitle || article.title}</h3>
      <p className="journal-deck">{homeWritingDecks[article.slug] ?? article.subtitle}</p>
      <div className="journal-meta mono"><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time></div>
    </div>
    <div className="journal-art"><AnimatedArtwork artwork={artwork} size={lead ? 400 : 240} paused={paused} embedded decorative /></div>
    <DestinationCue className="journal-read mono">{siteCopy.writing.read}</DestinationCue>
  </a>
}

export function HomeWriting() {
  const [lead, ...companions] = featured
  return <section className="home-writing home-journal" aria-labelledby="home-writing-title">
    <div className="journal-heading"><h2 id="home-writing-title">Writing<span className="period">.</span></h2></div>
    <div className="journal-layout">
      {lead && <JournalEssay article={lead} lead />}
      <div className="journal-companions">{companions.map(article => <JournalEssay key={article.slug} article={article} />)}</div>
    </div>
    <DestinationLink className="journal-all mono" href="#/writing">{siteCopy.writing.all}</DestinationLink>
  </section>
}

export default HomeWriting
