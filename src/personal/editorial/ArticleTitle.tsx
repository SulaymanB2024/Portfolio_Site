import { Fragment } from 'react'
import { articlePresentation } from './article-presentation'
import type { ArticleSummary } from './types'

export default function ArticleTitle({ article }: { article: ArticleSummary }) {
  const lines = articlePresentation(article).lines
  return lines ? lines.map((line, index) => <Fragment key={line}>{index > 0 && ' '}<span className="article-title-line">{line}</span></Fragment>) : article.displayTitle || article.title
}
