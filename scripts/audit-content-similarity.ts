import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { SEO_ROUTES, type SeoRoute } from '../src/seo/routes';

const MODEL = 'jina-embeddings-v5-text-small';
const TASK = 'text-matching';
const DIMENSIONS = 1024;
const EMBEDDING_BATCH_PAUSE_MS = 6_000;
// Jina v5 clusters source-led technical articles tightly even when their query
// contracts and artifacts differ. Reserve failure for near-duplicate documents;
// the article-ranking verifier separately enforces unique primary queries and
// explicit cannibalization boundaries.
const THRESHOLD = 0.95;
const PHRASE_WORDS = 16;
const OUTPUT_DIR = path.resolve('audits/content-similarity');
const API_URL = 'https://api.jina.ai/v1/embeddings';
const EXCLUDED_HEADINGS = new Set([
  'article metrics',
  'evidence boundary',
  'internal links',
  'memo details',
  'recommendation boundary',
  'related reading',
  'related research',
  'research sources',
  'source ledger',
]);

function isExcludedHeading(heading: string) {
  const normalized = heading.toLowerCase();
  return EXCLUDED_HEADINGS.has(normalized)
    || normalized.startsWith('atlas-compatible evidence fixture for ')
    || normalized.startsWith('related diagnostics for ');
}

type AuditSection = {
  id: string;
  title: string;
  text: string;
};

type AuditDocument = {
  path: string;
  title: string;
  indexable: boolean;
  hash: string;
  text: string;
  sections: AuditSection[];
};

type EmbeddedSection = AuditSection & {
  vector: number[];
};

type EmbeddedDocument = AuditDocument & {
  vector: number[];
  sections: EmbeddedSection[];
};

type PairResult = {
  leftPath: string;
  leftTitle: string;
  rightPath: string;
  rightTitle: string;
  category: 'indexable' | 'noindex';
  fullDocumentScore: number;
  sectionMaximum: {
    score: number;
    leftSection: string;
    rightSection: string;
  };
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function htmlToText(value: string) {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function routeFile(routePath: string) {
  return path.resolve('dist', routePath === '/' ? 'index.html' : routePath.slice(1), 'index.html');
}

function extractArticle(route: SeoRoute): AuditDocument {
  const file = routeFile(route.path);
  assert(fs.existsSync(file), `${route.path}: static HTML is missing at ${file}. Run npm run build first.`);
  const html = fs.readFileSync(file, 'utf8');
  const articleMatch = html.match(/<article class="route-static-content">([\s\S]*?)<\/article>/i);
  assert(articleMatch, `${route.path}: route-static-content article is missing`);
  const articleHtml = articleMatch[1];
  const h1Match = articleHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = htmlToText(h1Match?.[1] ?? route.h1);
  const h2Pattern = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const headingMatches = [...articleHtml.matchAll(h2Pattern)];
  const firstHeadingIndex = headingMatches[0]?.index ?? articleHtml.length;
  const lead = htmlToText(articleHtml.slice(0, firstHeadingIndex));
  const sections: AuditSection[] = [];

  for (let index = 0; index < headingMatches.length; index += 1) {
    const match = headingMatches[index];
    const heading = htmlToText(match[1]);
    if (isExcludedHeading(heading)) continue;
    const start = (match.index ?? 0) + match[0].length;
    const end = headingMatches[index + 1]?.index ?? articleHtml.length;
    const body = htmlToText(articleHtml.slice(start, end));
    if (body.split(/\s+/).length < 20) continue;
    sections.push({
      id: slugify(heading) || `section-${index + 1}`,
      title: heading,
      text: `${heading}. ${body}`,
    });
  }

  if (lead.split(/\s+/).length >= 20) {
    sections.unshift({ id: 'introduction', title: 'Introduction', text: lead });
  }

  const text = [lead, ...sections.filter((section) => section.id !== 'introduction').map((section) => section.text)]
    .filter(Boolean)
    .join('\n\n');
  assert(text.split(/\s+/).length >= 80, `${route.path}: insufficient article text after boilerplate removal`);

  return {
    path: route.path,
    title,
    indexable: route.includeInSitemap && !route.noindex,
    hash: createHash('sha256').update(text).digest('hex'),
    text,
    sections,
  };
}

function normalizeWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function duplicatedPhrases(documents: AuditDocument[]) {
  const indexable = documents.filter((document) => document.indexable);
  const occurrences = new Map<string, Set<string>>();

  for (const document of indexable) {
    const words = normalizeWords(document.text);
    const seenInDocument = new Set<string>();
    for (let index = 0; index <= words.length - PHRASE_WORDS; index += 1) {
      seenInDocument.add(words.slice(index, index + PHRASE_WORDS).join(' '));
    }
    for (const phrase of seenInDocument) {
      const paths = occurrences.get(phrase) ?? new Set<string>();
      paths.add(document.path);
      occurrences.set(phrase, paths);
    }
  }

  return [...occurrences.entries()]
    .filter(([, paths]) => paths.size > 1)
    .map(([phrase, paths]) => ({ phrase, paths: [...paths].sort() }))
    .sort((a, b) => a.phrase.localeCompare(b.phrase));
}

async function embed(input: string[], apiKey: string) {
  const vectors: number[][] = [];
  const batchSize = 24;

  for (let start = 0; start < input.length; start += batchSize) {
    const batch = input.slice(start, start + batchSize);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Sulayman-Bowles-Portfolio-Content-Audit/1.0',
      },
      body: JSON.stringify({
        model: MODEL,
        task: TASK,
        dimensions: DIMENSIONS,
        input: batch,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Jina embeddings request failed (${response.status}): ${body.slice(0, 500)}`);
    }

    const payload = await response.json() as {
      data?: Array<{ index: number; embedding: number[] }>;
    };
    assert(payload.data?.length === batch.length, 'Jina returned an unexpected embedding count');
    vectors.push(...payload.data.sort((a, b) => a.index - b.index).map((item) => item.embedding));
    if (start + batchSize < input.length) {
      await new Promise((resolve) => setTimeout(resolve, EMBEDDING_BATCH_PAUSE_MS));
    }
  }

  return vectors;
}

function cosine(left: number[], right: number[]) {
  assert(left.length === right.length, 'Embedding dimensions do not match');
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] ** 2;
    rightNorm += right[index] ** 2;
  }
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function meanVector(vectors: number[][]) {
  assert(vectors.length > 0, 'Cannot calculate a document vector without section vectors');
  return Array.from({ length: vectors[0].length }, (_, dimension) =>
    vectors.reduce((sum, vector) => sum + vector[dimension], 0) / vectors.length);
}

function round(value: number) {
  return Number(value.toFixed(6));
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function main() {
  const apiKey = process.env.JINA_API_KEY ?? process.env.JINA_AUTH_TOKEN;
  assert(
    apiKey,
    'Missing JINA_API_KEY. Run through the configured credential environment, for example: doppler run --project atlas --config dev -- npm run audit:content-similarity',
  );

  const routes = SEO_ROUTES.filter((route) => route.section === 'research-article' || route.section === 'technical-seo-guide');
  const documents = routes.map(extractArticle);
  const phrases = duplicatedPhrases(documents);
  const sectionVectors = await embed(
    documents.flatMap((document) => document.sections.map((section) => section.text)),
    apiKey,
  );
  let sectionCursor = 0;
  const embedded: EmbeddedDocument[] = documents.map((document) => {
    const sections = document.sections.map((section) => {
      const sectionVector = sectionVectors[sectionCursor];
      sectionCursor += 1;
      return { ...section, vector: sectionVector };
    });
    return { ...document, vector: meanVector(sections.map((section) => section.vector)), sections };
  });

  const pairs: PairResult[] = [];
  for (let leftIndex = 0; leftIndex < embedded.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < embedded.length; rightIndex += 1) {
      const left = embedded[leftIndex];
      const right = embedded[rightIndex];
      let sectionMaximum = {
        score: Number.NEGATIVE_INFINITY,
        leftSection: '',
        rightSection: '',
      };

      for (const leftSection of left.sections) {
        for (const rightSection of right.sections) {
          const score = cosine(leftSection.vector, rightSection.vector);
          if (score > sectionMaximum.score) {
            sectionMaximum = {
              score,
              leftSection: leftSection.title,
              rightSection: rightSection.title,
            };
          }
        }
      }

      pairs.push({
        leftPath: left.path,
        leftTitle: left.title,
        rightPath: right.path,
        rightTitle: right.title,
        category: left.indexable && right.indexable ? 'indexable' : 'noindex',
        fullDocumentScore: round(cosine(left.vector, right.vector)),
        sectionMaximum: {
          ...sectionMaximum,
          score: round(sectionMaximum.score),
        },
      });
    }
  }

  pairs.sort((a, b) => b.fullDocumentScore - a.fullDocumentScore);
  const indexablePairs = pairs.filter((pair) => pair.category === 'indexable');
  const noindexPairs = pairs.filter((pair) => pair.category === 'noindex');
  const failures = indexablePairs.filter((pair) => pair.fullDocumentScore >= THRESHOLD);
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    model: MODEL,
    task: TASK,
    dimensions: DIMENSIONS,
    embeddingBatchPauseMs: EMBEDDING_BATCH_PAUSE_MS,
    similarity: 'cosine',
    threshold: THRESHOLD,
    phraseRule: {
      minimumWords: PHRASE_WORDS,
      duplicateCount: phrases.length,
      duplicates: phrases,
    },
    corpus: {
      articleCount: documents.length,
      indexableCount: documents.filter((document) => document.indexable).length,
      noindexCount: documents.filter((document) => !document.indexable).length,
      pairCount: pairs.length,
      indexablePairCount: indexablePairs.length,
      noindexPairCount: noindexPairs.length,
      documents: documents.map(({ path: documentPath, title, indexable, hash, sections, text }) => ({
        path: documentPath,
        title,
        indexable,
        contentHash: hash,
        wordCount: normalizeWords(text).length,
        sectionCount: sections.length,
      })),
    },
    result: {
      pass: failures.length === 0 && phrases.length === 0,
      similarityFailures: failures,
    },
    indexablePairs,
    noindexPairs,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
  const csvRows = [
    ['category', 'left_path', 'right_path', 'full_document_score', 'section_maximum', 'left_section', 'right_section'],
    ...pairs.map((pair) => [
      pair.category,
      pair.leftPath,
      pair.rightPath,
      pair.fullDocumentScore,
      pair.sectionMaximum.score,
      pair.sectionMaximum.leftSection,
      pair.sectionMaximum.rightSection,
    ]),
  ];
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'latest.csv'),
    `${csvRows.map((row) => row.map(csvCell).join(',')).join('\n')}\n`,
  );

  console.log(`Jina content similarity: ${documents.length} articles, ${pairs.length} pairs.`);
  console.log(`Indexable maximum: ${indexablePairs[0]?.fullDocumentScore ?? 'n/a'} (${indexablePairs[0]?.leftTitle ?? ''} ↔ ${indexablePairs[0]?.rightTitle ?? ''})`);
  console.log(`Noindex maximum: ${noindexPairs[0]?.fullDocumentScore ?? 'n/a'} (${noindexPairs[0]?.leftTitle ?? ''} ↔ ${noindexPairs[0]?.rightTitle ?? ''})`);
  console.log(`Exact duplicated ${PHRASE_WORDS}-word passages: ${phrases.length}.`);
  console.log(`Report: ${path.join(OUTPUT_DIR, 'latest.json')}`);

  if (failures.length || phrases.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
