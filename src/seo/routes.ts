/** Compose the established portfolio catalog with the authored project collection. */
import {
  SEO_ROUTES as BASE_ROUTES,
  getRouteVisualMode as baseRouteVisualMode,
  normalizeInputPath,
  SITE_LASTMOD,
  type SeoRoute,
  type RouteVisualMode,
  type RouteTone,
} from './baseRouteCatalog';
import { latestContentDate } from '../utils/publicationDate';
import { findWorkStudy } from '../content/workStudies';
import { WORK_STUDY_ROUTES, withWorkIndexMetadata } from './workStudyRoutes';

export { SITE_LASTMOD, NOT_FOUND_ROUTE, normalizeInputPath } from './baseRouteCatalog';
export type { SeoRoute, RouteSection, RouteVisualMode, RouteTone } from './baseRouteCatalog';

const composedRoutes: SeoRoute[] = [...BASE_ROUTES.map(withWorkIndexMetadata), ...WORK_STUDY_ROUTES];
export const SEO_ROUTES: SeoRoute[] = composedRoutes.map(route => route.path === '/sitemap'
  ? { ...route, lastmod: latestContentDate(composedRoutes.filter(item => item.includeInSitemap && item.path !== '/sitemap').map(item => item.lastmod ?? SITE_LASTMOD)) }
  : route);

export function normalizePath(path: string) {
  const normalized = normalizeInputPath(path);
  const route = SEO_ROUTES.find(item => item.path === normalized || item.aliases.includes(normalized));
  return route?.path ?? normalized;
}
export function getSeoRoute(path: string) {
  const canonicalPath = normalizePath(path);
  return SEO_ROUTES.find(route => route.path === canonicalPath);
}
export function getRouteVisualMode(path: string): RouteVisualMode {
  const canonicalPath = normalizePath(path);
  if (canonicalPath === '/work' || findWorkStudy(canonicalPath)) return 'canvas-sample';
  return baseRouteVisualMode(canonicalPath);
}
export function getRouteTone(path: string): RouteTone {
  return getRouteVisualMode(path) === 'dark-evidence' ? 'dark' : 'light';
}
export function getCanonicalRoutes() {
  return SEO_ROUTES.filter(route => route.includeInSitemap);
}
