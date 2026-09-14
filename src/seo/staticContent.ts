import type { SeoRoute } from './routes';
import { buildRouteStaticHtml as buildDefaultRouteStaticHtml } from './baseStaticContent';
export { buildSitemapStaticHtml } from './baseStaticContent';

/** Authored layouts and their React readers share one HTML source. */
export function buildRouteStaticHtml(route: SeoRoute) {
  return route.staticHtml ?? buildDefaultRouteStaticHtml(route);
}
