import { ArtPoster } from '../src/personal/editorial/ArtPoster'
import { getArticleGenerativeArtwork } from '../src/personal/editorial/generative/manifest'
import { displayDate, type ArticleSummary } from '../src/personal/editorial/types'
import { withWritingCopy } from '../src/personal/site-copy'

export function PublicWritingStories({ articles, eagerFirst = false }: { articles: readonly ArticleSummary[]; eagerFirst?: boolean }) {
  return <div className="public-writing-gallery">{articles.map(withWritingCopy).map((article, index) => {
    const artwork = getArticleGenerativeArtwork(article.path)
    return <a className="public-writing-story" data-slug={article.slug} href={article.path} key={article.slug}>
      <div><h2>{article.displayTitle || article.title}</h2><p>{article.subtitle}</p><time dateTime={article.date.replaceAll('.', '-')}>{displayDate(article.date)}</time></div>
      <div className="public-writing-art"><ArtPoster artwork={artwork} eager={eagerFirst && index === 0} decorative baseURL="/" /></div>
    </a>
  })}</div>
}
