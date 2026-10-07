import AnimatedArtwork from './AnimatedArtwork'
import { useArtworkMotion } from './ArtworkMotion'
import { getArticleGenerativeArtwork } from './generative/manifest'
import { displayDate, displayReadTime, displayWritingTopic, type ArticleSummary } from './types'
import { LinkArrow } from '../DestinationLink'
import './story-links.css'

export function StoryLink({ article, href = `#/writing/${article.slug}`, description = article.subtitle, position }: {
  article: ArticleSummary; href?: string; description?: string; position?: string
}) {
  const artwork = getArticleGenerativeArtwork(article.path)
  const { paused } = useArtworkMotion()
  return <a className="story-link" href={href}>
    <div className="story-link-art" data-treatment={artwork.treatment}><AnimatedArtwork artwork={artwork} size={240} paused={paused} embedded decorative /></div>
    <div className="story-link-copy"><p className="eyebrow">{displayWritingTopic(article.category)}</p><h2>{article.displayTitle || article.title}</h2><p className="story-link-deck">{description}</p><div className="story-link-meta mono">{position && <span>{position}</span>}<time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time><span className="writing-story-readtime">{displayReadTime(article.readTime)}</span></div></div>
    <LinkArrow className="story-link-arrow" />
  </a>
}
