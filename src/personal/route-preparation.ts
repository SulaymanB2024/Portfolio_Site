/** Start independent route code and manuscript loads together, retaining each retry UI. */
export function prepareRouteResources(
  route: string,
  loadPage: (route: string) => Promise<unknown>,
  loadArticle: (slug: string) => Promise<unknown>,
) {
  const page = Promise.resolve().then(() => loadPage(route))
  const data = route.startsWith('writing/')
    ? Promise.resolve().then(() => loadArticle(route.slice('writing/'.length)))
    : Promise.resolve()
  // A failure cannot commit before the other resource is ready or failed.
  return Promise.allSettled([page, data])
}
