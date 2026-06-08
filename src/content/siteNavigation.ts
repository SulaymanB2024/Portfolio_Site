export type SiteNavItem = {
  label: string;
  href: string;
  cursorText?: string;
  description?: string;
};

export const primaryNav: SiteNavItem[] = [
  { label: 'Work', href: '/#selected-works', cursorText: 'WORK', description: 'Selected project work.' },
  { label: 'Atlas', href: '/atlas', cursorText: 'ATLAS', description: 'Technical SEO audit console.' },
  { label: 'Markets', href: '/markets', cursorText: 'MARKETS', description: 'Finance and market research archive.' },
  { label: 'Method', href: '/method', cursorText: 'METHOD', description: 'Void Agency technical SEO process.' },
  { label: 'About', href: '/about', cursorText: 'ABOUT', description: 'Profile, experience, and operating principles.' },
  { label: 'Resume', href: '/resume', cursorText: 'RESUME', description: 'Resume and proof links.' },
  { label: 'Contact', href: '/#contact', cursorText: 'CONTACT', description: 'Audit intake and contact form.' },
];

export const utilityNav: SiteNavItem[] = [
  { label: 'Book', href: '/simple', cursorText: 'BOOK', description: 'First-person text edition and personal monograph.' },
  { label: 'AI Information', href: '/ai-information', cursorText: 'INFO', description: 'Entity reference for search and AI systems.' },
  { label: 'Sitemap', href: '/sitemap', cursorText: 'SITEMAP', description: 'Plain HTML links to public pages.' },
];

export function navLabel(item: SiteNavItem) {
  return item.label.toUpperCase();
}

export function navItemId(prefix: string, item: SiteNavItem) {
  return `${prefix}-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function isNavItemActive(activePath: string, href: string) {
  if (href.includes('#')) {
    return activePath === href;
  }

  const path = href.split('#')[0] || '/';
  return activePath === path;
}
