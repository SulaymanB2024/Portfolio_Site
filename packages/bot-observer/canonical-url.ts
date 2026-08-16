export function trailingSlashRedirectUrl(requestUrl: string): string | null {
  const url = new URL(requestUrl);

  if (
    url.pathname === '/' ||
    url.pathname.startsWith('/.well-known/') ||
    !url.pathname.endsWith('/')
  ) {
    return null;
  }

  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.toString();
}
