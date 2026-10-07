import { topicLabel } from './topic-label'
import AnimatedArtwork from './AnimatedArtwork'
import { useArtworkMotion } from './ArtworkMotion'
import { getArticleGenerativeArtwork } from './generative/manifest'
import { displayDate, type ArticleSummary } from './types'
import { LinkArrow } from '../DestinationLink'
import './story-links.css'

export function StoryLink({ article }: { article: ArticleSummary }) {
  const artwork = getArticleGenerativeArtwork(article.path)
  const { paused } = useArtworkMotion()
  return <a className="story-link" href={`#/writing/${article.slug}`}>
    <div className="story-link-art" data-treatment={artwork.treatment}><AnimatedArtwork artwork={artwork} size={240} paused={paused} embedded decorative /></div>
    <div className="story-link-copy"><p className="eyebrow">{topicLabel(article.category)}</p><h2>{article.displayTitle || article.title}</h2><p className="story-link-deck">{article.subtitle}</p><div className="story-link-meta mono"><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time></div></div>
    <LinkArrow className="story-link-arrow" />
  </a>
}
