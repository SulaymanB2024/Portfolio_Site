import { getArticlePath } from './articleRegistry';
import {
  US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_ARTICLE,
} from './usRareEarthMagnetCapacityAuditArticle';
import { PUBLICATION_INDEX as BASE_PUBLICATION_INDEX } from './publicationIndexBase';

export type { PublicationIndexItem } from './publicationIndexBase';
export { PUBLICATION_CATEGORY_SUMMARY } from './publicationIndexBase';

export const PUBLICATION_INDEX = [
  {
    category: 'Markets and investing' as const,
    title: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_ARTICLE.title,
    href: getArticlePath(US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_ARTICLE),
    description: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_ARTICLE.subtitle,
    date: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_ARTICLE.date,
    featured: true,
  },
  ...BASE_PUBLICATION_INDEX,
] as const;
