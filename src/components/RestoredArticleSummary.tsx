import { getArticleSearchTarget } from '../seo/articleSearchTargets';

export function RestoredArticleSummary({ path }: { path: string }) {
  const target = getArticleSearchTarget(path);
  if (!target) return null;
  return (
    <section className="toll-article-section" aria-label="Short answer">
      <h2>Short answer</h2>
      <p>{target.directAnswer}</p>
      <p>{target.originalArtifact}</p>
    </section>
  );
}
