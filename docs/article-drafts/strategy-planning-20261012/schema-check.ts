import source from '../../../src/personal/editorial/data/articles/choosing-a-growth-channel-under-a-capacity-limit.json'
import toastSource from '../../../src/personal/editorial/data/articles/toast-gross-profit-engine.json'
import harveySource from '../../../src/personal/editorial/data/articles/harvey-who-keeps-the-value-of-legal-ai.json'
import vantaSource from '../../../src/personal/editorial/data/articles/vanta-after-the-audit.json'
import type { ArticleSection, WritingArticle } from '../../../src/personal/editorial/types'

// JSON imports widen string values; narrow the validated presentation enum.
type ImportedArticle = Omit<WritingArticle, 'openingPresentation' | 'markdownSections'> & {
  openingPresentation: string
  markdownSections: (Omit<ArticleSection, 'blocks'> & { blocks: { kind: string; markdown?: string; tableId?: string }[] })[]
}
function normalize(raw: ImportedArticle): WritingArticle {
  return { ...raw, openingPresentation: 'integrated', markdownSections: raw.markdownSections.map(section => ({
    ...section, blocks: section.blocks.map(block => {
      if (block.kind === 'markdown' && typeof block.markdown === 'string') return { kind: 'markdown' as const, markdown: block.markdown }
      if (block.kind === 'table' && typeof block.tableId === 'string') return { kind: 'table' as const, tableId: block.tableId }
      throw new Error('Malformed article block')
    }),
  })) }
}
const article = normalize(source)
export const articles: WritingArticle[] = [article, normalize(toastSource), normalize(harveySource), normalize(vantaSource)]
export default article
