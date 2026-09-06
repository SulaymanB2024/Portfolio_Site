import type { ArticleNavItem, ArticleReaderConfig } from '../components/ArticleLayout';
import { getArticleGenerativeArtwork } from '../art/generative/manifest';
import { getArticlePath } from '../content/articleRegistry';
import { isInvestmentMemo, type PublicArticle } from '../content/articleModels';
import { formatPublicationDate, normalizePublicationDate } from '../utils/publicationDate';
import { getArticleRelatedLinkLabel, getArticleSearchTarget } from '../seo/articleSearchTargets';

export function restoredArticleConfig(
  article: PublicArticle,
  className: string,
  navigation: ArticleNavItem[],
  evidence: string,
  metrics: Readonly<NonNullable<ArticleReaderConfig['metrics']>>,
): ArticleReaderConfig {
  const investment = isInvestmentMemo(article);
  const archive = investment ? '/markets' : '/research';
  const articlePath = getArticlePath(article);
  const related = getArticleSearchTarget(articlePath)?.relatedPaths ?? [];
  return {
    activePath: archive,
    mode: 'reference',
    className,
    archive: { href: archive, label: investment ? 'Markets archive' : 'Research archive' },
    hero: {
      eyebrow: article.category,
      title: article.title,
      deck: article.subtitle,
      generativeArtwork: getArticleGenerativeArtwork(getArticlePath(article)),
    },
    publication: {
      author: article.author,
      subject: article.category,
      published: { dateTime: normalizePublicationDate(article.date), value: formatPublicationDate(article.date) },
      readTime: article.readTime,
      evidence,
    },
    metrics: [...metrics],
    navigation: { items: navigation },
    boundary: {
      label: 'Scope and limits',
      content: investment ? article.recommendationBoundary : article.evidenceBoundary,
    },
    endnote: {
      label: 'Conclusion',
      title: article.conclusion.title,
      content: article.conclusion.content,
      note: evidence,
      links: [...related.map((href) => ({ href, label: getArticleRelatedLinkLabel(articlePath, href) })), { href: archive, label: 'More research' }],
    },
  };
}
