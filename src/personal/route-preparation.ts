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

/** Failed page code must leave the current page mounted; article data owns its retry UI. */
export async function completeRoutePreparation(
  resources: ReturnType<typeof prepareRouteResources>,
  isCurrent: () => boolean,
  commit: () => void | Promise<void>,
  failed: () => void,
) {
  const [page] = await resources
  if (!isCurrent()) return
  if (page.status === 'rejected') {
    failed()
    return
  }
  await commit()
}
