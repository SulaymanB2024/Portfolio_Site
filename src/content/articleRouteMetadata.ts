import {
  ARTICLE_ROUTE_METADATA as BASE_ARTICLE_ROUTE_METADATA,
  type ArticleRouteMetadata,
} from './articleRouteMetadataBase';

export type { ArticleRouteMetadata } from './articleRouteMetadataBase';

const US_RARE_EARTH_MAGNET_CAPACITY_ROUTE: ArticleRouteMetadata = {
  "kind": "research",
  "path": "/research/financial-systems/us-rare-earth-magnet-capacity-audit",
  "aliases": [
    "/markets/us-rare-earth-magnet-capacity-audit"
  ],
  "title": "America's 38,000-Tonne Magnet Buildout Is Not Yet a 38,000-Tonne Supply Chain",
  "seoTitle": "U.S. Rare Earth Magnet Capacity: A 38,000-Tonne Audit",
  "seoDescription": "Audit 38,000 tonnes of announced U.S. NdFeB magnet capacity by plant status, product form, feedstock, process yield, and direct demand.",
  "date": "2026.08.16",
  "dateModified": "2026.08.16",
  "indexable": true,
  "staticSummary": "The United States has disclosed roughly 38,000 tonnes per year of sintered NdFeB project capacity, but only a small share sits at plants reporting commercial shipments; most of the stack remains in ramp or future construction, and the popular 37,000-tonne demand comparison includes magnets embedded in imported goods. The arithmetic is almost irresistible. Add the explicit annual capacity disclosed for the principal U.S. sintered neodymium-iron-boron magnet projects and the total reaches 37,584 to 38,048 metric tonnes per year. The range depends on whether two announcements that say only “tons” mean U.S. short tons or metric tonnes. Set that beside the Department of Energy's high-growth forecast of 37,000 metric tonnes of total U.S. demand in 2030, and the policy story appears complete: America has announced enough factories to cover the market. [1]",
  "image": "/images/social/og-research.png"
};

export const ARTICLE_ROUTE_METADATA: ArticleRouteMetadata[] = [
  US_RARE_EARTH_MAGNET_CAPACITY_ROUTE,
  ...BASE_ARTICLE_ROUTE_METADATA,
];
