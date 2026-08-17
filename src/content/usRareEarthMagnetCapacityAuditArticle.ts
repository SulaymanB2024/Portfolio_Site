import type { ResearchArticle } from './articleModels';
import {
  US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_CONTENT,
  US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_METRICS,
  US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_RESOURCES,
} from './usRareEarthMagnetCapacityAuditOverview';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_1 } from './usRareEarthMagnetCapacityAuditSections1';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_2 } from './usRareEarthMagnetCapacityAuditSections2';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_3 } from './usRareEarthMagnetCapacityAuditSections3';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_4 } from './usRareEarthMagnetCapacityAuditSections4';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_5 } from './usRareEarthMagnetCapacityAuditSections5';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_6 } from './usRareEarthMagnetCapacityAuditSections6';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_7 } from './usRareEarthMagnetCapacityAuditSections7';
import { US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SOURCES } from './usRareEarthMagnetCapacityAuditSources';

export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SLUG =
  'us-rare-earth-magnet-capacity-audit';
export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_PATH =
  `/research/financial-systems/${US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SLUG}`;

export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_ARTICLE = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SLUG,
  aliases: ['/markets/us-rare-earth-magnet-capacity-audit'],
  number: '19',
  category: 'INDUSTRIAL SYSTEMS',
  title: "America's 38,000-Tonne Magnet Buildout Is Not Yet a 38,000-Tonne Supply Chain",
  seoTitle: 'U.S. Rare Earth Magnet Capacity: A 38,000-Tonne Audit',
  subtitle:
    'A plant-by-plant audit of U.S. sintered NdFeB nameplate capacity, commissioning status, product form, material flow, and the demand denominator.',
  seoDescription:
    'Audit 38,000 tonnes of announced U.S. NdFeB magnet capacity by plant status, product form, feedstock, process yield, and direct demand.',
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Capacity / qualification / material flow',
    note: 'The audit separates nameplate capacity from qualified output, product form, upstream inputs, and addressable demand.',
  },
  date: '2026.08.16',
  lastVerified: '2026.08.16',
  readTime: '26 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'The United States has disclosed roughly 38,000 tonnes per year of sintered NdFeB project capacity, but only a small share sits at plants reporting commercial shipments; most of the stack remains in ramp or future construction, and the popular 37,000-tonne demand comparison includes magnets embedded in imported goods.',
  conclusion: {
    title: 'Count qualified saleable tonnes, not announcements',
    content:
      'The announced buildout is a serious industrial shift, but national self-sufficiency has not been demonstrated. The decisive evidence will be qualified saleable output at repeatable yield, secure non-Chinese or trusted-allied upstream inputs, downstream customer absorption, and redundancy across grades, equipment, and suppliers.',
  },
  evidenceBoundary:
    'This audit records explicit public nameplate claims and classifies their maturity as of August 16, 2026. Nameplate is not utilization; commissioning is not qualification; commercial shipments do not disclose annual output. Two capacity claims use undefined “tons” and are retained as a range. The material balance is a sensitivity analysis, not a forecast of virgin feed purchases. No transparent current dataset was found for direct U.S. magnet demand by grade and downstream manufacturing location.',
  metrics: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_METRICS,
  resources: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_RESOURCES,
  content: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_CONTENT,
  sections: [
    ...US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_1,
    ...US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_2,
    ...US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_3,
    ...US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_4,
    ...US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_5,
    ...US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_6,
    ...US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_7,
  ],
  sources: US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SOURCES,
  indexable: true,
} satisfies ResearchArticle;
