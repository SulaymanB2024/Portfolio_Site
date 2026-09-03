import { GENERATED_SKETCH_LOADERS } from './generatedSketchLoaders';
import type { GenerativeArtwork, SketchId } from './types';

const ARTIST_NAME = '@yuruyurau' as const;
const ARTIST_URL = 'https://x.com/yuruyurau' as const;

const SKETCH_DETAILS = [
  ['yuru-01', 'Tidal Bell', '2083571114543046898'],
  ['yuru-02', 'Orbit Bloom', '2083185617345921400'],
  ['yuru-03', 'Ribbon Nautilus', '2082474544644985022'],
  ['yuru-04', 'Deep Current', '2080977918914969636'],
  ['yuru-05', 'Twin Drift', '2080677794439393704'],
  ['yuru-06', 'Lorenz Lantern', '2053149494439800895'],
  ['yuru-07', 'Red-Tipped Eel', '2052410599662072049'],
  ['yuru-08', 'Pulsing Medusa', '2051676013902639591'],
  ['yuru-09', 'Spiral Jelly', '2031366569448886284'],
  ['yuru-10', 'Symmetric Moth', '2030650578758680723'],
  ['yuru-11', 'Paired Wings', '2030558759433678971'],
  ['yuru-12', 'Lantern Bloom', '2030289783755546783'],
  ['yuru-13', 'Abyssal Flower', '2030288158626353226'],
  ['yuru-14', 'Triptych Current', '2029925600300015634'],
  ['yuru-15', 'Orbital Anemone', '2025603714883743849'],
  ['yuru-16', 'Twin Veil', '2025602268083699720'],
  ['yuru-17', 'Rising Bell', '2025114620676186436'],
  ['yuru-18', 'Night Carousel', '2024832801120661722'],
  ['yuru-19', 'Hollow Crown', '2024809725230297325'],
  ['yuru-20', 'Arc Current', '2024489280064852228'],
  ['yuru-21', 'Fish Flower', '2024121022929363391'],
  ['yuru-22', 'Coil Blossom', '2022999756642103313'],
  ['yuru-23', 'Tendril Fan', '2022995578016387236'],
  ['yuru-24', 'Glass Nautilus', '2022990999358988663'],
  ['yuru-25', 'Halo Wing', '2022990348230984124'],
  ['yuru-26', 'Slow Petal', '2022679723630039439'],
  ['yuru-27', 'Split Bloom', '2022672187250086189'],
  ['yuru-28', 'Sine Anemone', '2022526453779435912'],
  ['yuru-29', 'Long Pulse', '2022524457508835641'],
  ['yuru-30', 'Feather Jelly', '2021238125285036136'],
  ['yuru-31', 'Orbit Seed', '2020509112010936361'],
  ['yuru-32', 'Soft Twins', '2017968467186799048'],
  ['yuru-33', 'Angular Medusa', '2005652330612736419'],
  ['yuru-34', 'Ink Lantern', '1999900774143607224'],
  ['yuru-35', 'Maths Bio Y', '1979113229914620174'],
  ['yuru-36', 'Duffing Firefly', '1977371784300114024'],
  ['yuru-37', 'Fivefold Fan', '1979112131652895116'],
  ['yuru-38', 'Parity Bloom', '1979111285951467874'],
  ['yuru-39', 'Radial Coral', '1979110452538831111'],
  ['yuru-40', 'Lorenz Ribbon', '1977048172347506950'],
  ['yuru-41', 'Lorenz Fan', '1975948181742690578'],
  ['yuru-42', 'Lorenz Projection', '1975590549366448389'],
  ['yuru-43', 'Sevenfold Echo', '1974495782792507630'],
  ['yuru-44', 'Digital Life', '1973405239878492467'],
] as const satisfies readonly [SketchId, string, string][];

export const ARTICLE_GENERATIVE_ART_ASSIGNMENTS = {
  '/research/ai-systems/the-ai-megawatt': 'yuru-04',
  '/research/crawler-engineering/crawl-frontier-state-machine': 'yuru-06',
  '/research/technical-seo/raw-html-rendered-dom-evidence': 'yuru-05',
  '/research/technical-seo/canonicalization-graph-consistency': 'yuru-35',
  '/research/technical-seo/internal-links-directed-retrieval-graph': 'yuru-42',
  '/research/ai-crawlers/robots-txt-courtesy-not-access-control': 'yuru-43',
  '/research/technical-seo/structured-data-without-content-drift': 'yuru-14',
  '/research/data-systems/audit-findings-derived-records': 'yuru-33',
  '/research/ai-systems/replayable-traces-ai-agent-evaluation': 'yuru-40',
  '/research/data-systems/sqlite-crawl-pipelines': 'yuru-36',
  '/research/technical-seo/technical-seo-migration-release-gates': 'yuru-41',
  '/research/financial-systems/who-owns-austin-home-service-companies': 'yuru-10',
  '/research/financial-systems/what-happens-when-an-index-decides-a-company-matters': 'yuru-02',
  '/research/financial-systems/software-buyout-boom-2020-2022-exit-audit': 'yuru-38',
  '/research/financial-systems/how-airlines-borrow-against-loyalty-programs': 'yuru-21',
  '/research/financial-systems/where-online-returns-actually-go': 'yuru-07',
  '/research/financial-systems/hidden-financing-hardware-startups': 'yuru-44',
  '/research/financial-systems/why-texas-toll-roads-stay-tolled': 'yuru-19',
  '/research/financial-systems/west-campus-student-housing': 'yuru-24',
  '/research/financial-systems/waymo-hardware-financing': 'yuru-34',
  '/research/ai-systems/the-first-ai-managers': 'yuru-08',
  '/research/ai-crawlers/ai-search-crawler-policy': 'yuru-01',
  '/research/search-console/technical-seo-public-data-infrastructure': 'yuru-12',
  '/research/personal-seo/canonical-identity-personal-seo': 'yuru-37',
  '/research/data-systems/us-rare-earth-magnet-manufacturing-capacity': 'yuru-20',
  '/markets/archived-research-methodology': 'yuru-39',
  '/markets/who-owns-us-toll-roads': 'yuru-18',
  '/markets/who-owns-texas-toll-roads': 'yuru-32',
  '/viralbench-codex-agent-harness': 'yuru-03',
} as const satisfies Record<string, SketchId>;

export type GenerativeArticlePath = keyof typeof ARTICLE_GENERATIVE_ART_ASSIGNMENTS;

const DARK_FIELD_ARTICLE_PATHS = new Set<GenerativeArticlePath>([
  '/research/ai-systems/the-ai-megawatt',
  '/research/crawler-engineering/crawl-frontier-state-machine',
  '/research/technical-seo/canonicalization-graph-consistency',
  '/research/ai-systems/replayable-traces-ai-agent-evaluation',
  '/research/financial-systems/software-buyout-boom-2020-2022-exit-audit',
  '/research/financial-systems/hidden-financing-hardware-startups',
  '/research/financial-systems/why-texas-toll-roads-stay-tolled',
  '/research/financial-systems/waymo-hardware-financing',
  '/research/ai-systems/the-first-ai-managers',
  '/markets/who-owns-us-toll-roads',
  '/markets/who-owns-texas-toll-roads',
  '/viralbench-codex-agent-harness',
]);

const assignedPathBySketch = Object.fromEntries(
  Object.entries(ARTICLE_GENERATIVE_ART_ASSIGNMENTS).map(([articlePath, sketchId]) => [sketchId, articlePath]),
) as Partial<Record<SketchId, GenerativeArticlePath>>;

export const GENERATIVE_ARTWORK_LIBRARY: readonly GenerativeArtwork[] = SKETCH_DETAILS.map(
  ([sketchId, title, sourcePostId]) => {
    const assignedPath = assignedPathBySketch[sketchId];
    const treatment = assignedPath && DARK_FIELD_ARTICLE_PATHS.has(assignedPath)
      ? 'dark-field'
      : 'paper-field';
    return {
      sketchId,
      title,
      posterSrc: `/images/generative-art/${sketchId}.webp`,
      alt: `Monochrome generative point study “${title},” a mathematical form rendered in black and white.`,
      factory: GENERATED_SKETCH_LOADERS[sketchId],
      treatment,
      attribution: {
        label: 'Original p5.js sketch by @yuruyurau',
        artistName: ARTIST_NAME,
        artistUrl: ARTIST_URL,
        sourceUrl: `https://x.com/yuruyurau/status/${sourcePostId}`,
      },
      status: assignedPath ? 'assigned' : 'reserve',
      assignedPath,
    };
  },
);

export const GENERATIVE_ARTWORK_BY_ID = Object.fromEntries(
  GENERATIVE_ARTWORK_LIBRARY.map((artwork) => [artwork.sketchId, artwork]),
) as Record<SketchId, GenerativeArtwork>;

export const RESERVE_GENERATIVE_ARTWORK = GENERATIVE_ARTWORK_LIBRARY.filter(
  (artwork) => artwork.status === 'reserve',
);

export function getArticleGenerativeArtwork(articlePath: string): GenerativeArtwork {
  const sketchId = ARTICLE_GENERATIVE_ART_ASSIGNMENTS[articlePath as GenerativeArticlePath];
  if (!sketchId) {
    throw new Error(`Public article route is missing a generative-art assignment: ${articlePath}`);
  }
  return GENERATIVE_ARTWORK_BY_ID[sketchId];
}
