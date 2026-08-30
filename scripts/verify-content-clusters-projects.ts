import { CONTENT_CLUSTERS, getContentClusterForCategory, getPublicationsForCluster } from '../src/content/contentClusters';
import { PUBLICATION_INDEX } from '../src/content/publicationIndex';
import { PROJECT_INDEX } from '../src/content/projectIndex';
import { getSeoRoute } from '../src/seo/routes';
import { buildRouteStaticHtml } from '../src/seo/staticContent';

const REQUIRED_PROJECT_FAMILY_IDS = [
  'atlas-engine',
  'void-agency',
  'content-spy-helios',
  'portfolio-site',
  'technical-ledger',
  'austin-crawlability-pilot',
  'king-maker',
  'queen-maker',
  'viralbench-codex',
  'linedown-desk',
  'project-delta',
  'applypilot-contribution',
  'dropkit-sui',
  'privacy-token-prototypes',
  'challenge-solver',
  'coin-app-research',
  'texas-toll-road-research',
  'race-the-case',
  'datahack-wind',
  'imc-prosperity',
  'sezzle-model',
  'coal-forecasting',
  'energy-trading',
  'solana-balance-engine',
  'funding-research-studio',
  'portfolio-design-archive',
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function unique(values: readonly string[], label: string) {
  assert(new Set(values).size === values.length, `${label}: expected unique values`);
}

assert(CONTENT_CLUSTERS.length === 4, `content clusters: expected 4, received ${CONTENT_CLUSTERS.length}`);
unique(CONTENT_CLUSTERS.map((cluster) => cluster.id), 'content cluster IDs');
unique(CONTENT_CLUSTERS.map((cluster) => cluster.path), 'content cluster paths');
unique(CONTENT_CLUSTERS.map((cluster) => cluster.category), 'content cluster publication categories');
unique(PUBLICATION_INDEX.map((publication) => publication.href), 'publication paths');

for (const publication of PUBLICATION_INDEX) {
  const cluster = getContentClusterForCategory(publication.category);
  assert(cluster, `${publication.href}: no primary content cluster`);
  assert(
    getPublicationsForCluster(cluster).filter((item) => item.href === publication.href).length === 1,
    `${publication.href}: expected exactly one primary cluster assignment`,
  );
}

assert(
  PROJECT_INDEX.length === REQUIRED_PROJECT_FAMILY_IDS.length,
  `project ledger: expected ${REQUIRED_PROJECT_FAMILY_IDS.length} families, received ${PROJECT_INDEX.length}`,
);
unique(PROJECT_INDEX.map((project) => project.id), 'project family IDs');
unique(PROJECT_INDEX.map((project) => project.title), 'project family titles');

const projectIds = new Set(PROJECT_INDEX.map((project) => project.id));
for (const requiredId of REQUIRED_PROJECT_FAMILY_IDS) {
  assert(projectIds.has(requiredId), `project ledger: missing required family ${requiredId}`);
}

const clusterIds = new Set(CONTENT_CLUSTERS.map((cluster) => cluster.id));
for (const project of PROJECT_INDEX) {
  assert(clusterIds.has(project.clusterId), `${project.id}: invalid cluster ${project.clusterId}`);
  assert(project.ownershipLabel.trim().length > 0, `${project.id}: ownership is missing`);
  assert(project.statusLabel.trim().length > 0, `${project.id}: status is missing`);
  assert(project.visibilityLabel.trim().length > 0, `${project.id}: visibility is missing`);
  assert(project.summary.length >= 60, `${project.id}: summary is too short`);
  assert(project.evidenceBoundary.length >= 60, `${project.id}: evidence boundary is too short`);
  assert(
    !project.href || project.href.startsWith('/') || project.href.startsWith('https://'),
    `${project.id}: public href must be an internal path or HTTPS URL`,
  );
  for (const relatedPath of project.relatedPaths) {
    assert(getSeoRoute(relatedPath), `${project.id}: related route is missing: ${relatedPath}`);
  }
}

const researchRoute = getSeoRoute('/research');
const workRoute = getSeoRoute('/work');
assert(researchRoute, 'research route is missing');
assert(workRoute, 'work route is missing');
const researchStatic = buildRouteStaticHtml(researchRoute);
const workStatic = buildRouteStaticHtml(workRoute);

for (const cluster of CONTENT_CLUSTERS) {
  const route = getSeoRoute(cluster.path);
  assert(route, `${cluster.path}: cluster route is missing`);
  assert(researchStatic.includes(`href="${cluster.path}"`), `${cluster.path}: research hub link is missing`);
  assert(workStatic.includes(`href="${cluster.path}"`), `${cluster.path}: work-ledger cluster link is missing`);

  const clusterStatic = buildRouteStaticHtml(route);
  for (const publication of getPublicationsForCluster(cluster)) {
    assert(
      publication.href === cluster.path
        ? clusterStatic.includes(publication.title)
        : clusterStatic.includes(`href="${publication.href}"`),
      `${cluster.path}: missing publication ${publication.href}`,
    );
  }
  for (const project of PROJECT_INDEX.filter((item) => item.clusterId === cluster.id)) {
    assert(clusterStatic.includes(project.title), `${cluster.path}: missing connected project ${project.title}`);
  }
  for (const featuredPath of cluster.featuredPaths) {
    assert(
      getPublicationsForCluster(cluster).some((publication) => publication.href === featuredPath),
      `${cluster.path}: featured record is outside the cluster: ${featuredPath}`,
    );
  }
}

for (const project of PROJECT_INDEX) {
  assert(workStatic.includes(project.title), `/work: missing project family ${project.title}`);
}

console.log(
  `Content-cluster and project-ledger verification passed: ${CONTENT_CLUSTERS.length} clusters, ${PUBLICATION_INDEX.length} uniquely assigned publications, and ${PROJECT_INDEX.length} project families.`,
);
