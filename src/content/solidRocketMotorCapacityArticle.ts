import type { ResearchArticle } from './articleModels';
import { SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_A } from './solidRocketMotorCapacitySectionsA';
import { SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_B } from './solidRocketMotorCapacitySectionsB';
import { SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_C } from './solidRocketMotorCapacitySectionsC';
import { SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_D } from './solidRocketMotorCapacitySectionsD';
import { SOLID_ROCKET_MOTOR_CAPACITY_SOURCES } from './solidRocketMotorCapacitySources';

export const SOLID_ROCKET_MOTOR_CAPACITY_ARTICLE_SLUG = 'us-solid-rocket-motor-capacity-audit';
export const SOLID_ROCKET_MOTOR_CAPACITY_ARTICLE_PATH =
  `/research/financial-systems/${SOLID_ROCKET_MOTOR_CAPACITY_ARTICLE_SLUG}`;

export const SOLID_ROCKET_MOTOR_CAPACITY_ARTICLE: ResearchArticle = {
  "kind": "research",
  "cluster": "financial-systems",
  "slug": "us-solid-rocket-motor-capacity-audit",
  "number": "16",
  "category": "DEFENSE INDUSTRIAL BASE",
  "title": "America’s Solid-Rocket-Motor Buildout Is Real. The Capacity Numbers Are Not Additive.",
  "seoTitle": "U.S. Solid Rocket Motor Capacity Audit: 2018-2029",
  "subtitle": "A plant-by-plant audit of 2018-2029 expansion claims shows more tactical suppliers and more propellant capability, but no defensible national total and no broad escape from program qualification or upstream concentration.",
  "seoDescription": "A 31-record audit of U.S. solid rocket motor plants, capacity claims, supplier readiness, qualification, ammonium perchlorate, HTPB, and 2029 bottlenecks.",
  "artwork": {
    "kind": "study",
    "variant": "triptych",
    "label": "Defense industrial base / plant-level audit",
    "note": "Thirty-one public facility-capability records use 11 different metric families; they cannot be added into one national motor count."
  },
  "date": "2026.08.16",
  "dateModified": "2026.08.16",
  "lastVerified": "2026.08.16",
  "readTime": "28 MIN",
  "author": "SULAYMAN BOWLES",
  "thesis": "The U.S. solid-rocket-motor buildout is real and should materially broaden tactical and selected medium-class supply, but public capacity claims cannot be summed and do not prove interchangeable, program-qualified competition across large and strategic motors.",
  "conclusion": {
    "title": "Measure qualified alternatives, not announced capacity",
    "content": "By 2029, tactical and selected medium-class markets should have more supplier options than they did in 2017. Large and strategic markets will remain more dependent on the incumbents unless entrants demonstrate qualified, sustained deliveries. The decision-useful measure is the number of named programs with multiple qualified sources, accepted lots at rate, and independent upstream supply paths."
  },
  "evidenceBoundary": "Public-source audit through August 16, 2026. Company releases establish what operators disclosed, not independently verified achieved rates. The research does not calculate wartime sufficiency, classified demand, inventory, product-mix-adjusted national output, yield, or accepted deliveries by facility. Readiness scores are derived public-evidence judgments, not engineering certifications.",
  "metrics": [
    {
      "label": "Facility-capability records",
      "value": "31"
    },
    {
      "label": "Metric families",
      "value": "11"
    },
    {
      "label": "Public sources",
      "value": "33"
    },
    {
      "label": "Forward horizon",
      "value": "2029"
    }
  ],
  "resources": [
    {
      "label": "Complete Word edition",
      "href": "/research/us-solid-rocket-motor-capacity-audit.docx",
      "description": "The complete 14-page article with figures, tables, methodology, and linked source register.",
      "format": "DOCX"
    },
    {
      "label": "Plant-level capacity dataset",
      "href": "/research/us-solid-rocket-motor-capacity-audit.csv",
      "description": "Thirty-one public facility-capability records in native units with class, status, readiness, capital, overlap, source, confidence, and limitations.",
      "format": "CSV"
    },
    {
      "label": "Source ledger",
      "href": "/research/us-solid-rocket-motor-source-ledger.csv",
      "description": "Thirty-three sources with dates, supported claims, relevant definitions, and principal limitations.",
      "format": "CSV"
    },
    {
      "label": "Calculation output",
      "href": "/research/us-solid-rocket-motor-calculations.json",
      "description": "Machine-readable results for the consequential derived arithmetic and dataset invariants.",
      "format": "JSON"
    },
    {
      "label": "Native-unit disclosure figure",
      "href": "/images/research/solid-rocket-motor-capacity-native-units.svg",
      "description": "Full-resolution chart of the 11 public disclosure families in the audited dataset.",
      "format": "SVG"
    },
    {
      "label": "Supplier readiness matrix",
      "href": "/images/research/solid-rocket-motor-readiness-matrix.svg",
      "description": "Full-resolution public-evidence matrix by supplier and motor class.",
      "format": "SVG"
    }
  ],
  "content": [
    "The United States is building substantially more solid-rocket-motor capacity. Northrop Grumman says it can process 30 million pounds of propellant a year today and is moving toward nearly 50 million pounds by 2028. L3Harris is constructing a large-motor complex in Camden, Arkansas, while planning a more than $1 billion expansion in Orange County, Virginia. Anduril has opened a tactical-motor plant in Mississippi. X-Bow has installed modular energetics equipment in Texas. Ursa Major has completed a Navy-funded manufacturing pathfinder in Colorado. Prometheus Energetics broke ground on a four-line campus in Indiana. American Pacific is expanding the concentrated domestic ammonium-perchlorate base by more than 50 percent. [S05-S09, S12-S24]",
    "Those facts do not produce a national “motors per year” total. The 31 facility and capability records collected for this article use 11 different metric families: motor counts, pounds of energetics, tons with no stated time basis, production multipliers, percentage changes, facility area, capital commitments, test milestones, qualification milestones, scenario conversions, and claims with no normalized output. The motor counts themselves cover products ranging from palm-sized devices to truck-sized stages. Adding them would create precision without meaning.",
    "The strongest supportable conclusion is narrower and more useful. By 2029, the United States should have materially more physical manufacturing capability and a broader set of tactical and some medium-class suppliers. Incumbents are likely to provide most of the usable near-term increase because they already possess qualified designs, trained workforces, sub-tier relationships, and active production programs. New entrants are making real progress, but public evidence does not show interchangeable, program-qualified competition across large and strategic motor classes. The buildout attacks one layer of the problem. Program qualification, test capacity, ammonium perchlorate, HTPB binder, and third-tier components remain separate gates.",
    "That distinction matters for procurement. A plant can be operational but not qualified for the motor a program needs. A supplier can cast propellant but lack a qualified nozzle, case, igniter, liner, or acceptance process. A company can report a production multiplier without disclosing the starting rate. A government can fund a second source, yet receive no deployable motor until validation, qualification, and system integration are complete. “More capacity” is directionally true. “The bottleneck is solved” is not supported by the public record."
  ],
  "sections": [
    ...SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_A,
    ...SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_B,
    ...SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_C,
    ...SOLID_ROCKET_MOTOR_CAPACITY_SECTIONS_D
  ],
  "sources": SOLID_ROCKET_MOTOR_CAPACITY_SOURCES
};
