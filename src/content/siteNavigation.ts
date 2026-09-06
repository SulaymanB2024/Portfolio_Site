export type SiteNavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: SiteNavItem[] = [
  { label: 'Work', href: '/work', description: 'Six public records with ownership, system details, status, constraints, and supporting evidence.' },
  { label: 'Atlas', href: '/atlas', description: 'An in-development crawl and evidence system with capability and public-proof status.' },
  { label: 'Research', href: '/research', description: 'Search, technical SEO, product, data, markets, and infrastructure research.' },
  { label: 'About', href: '/about', description: 'Technical practice, current work, experience, and operating principles.' },
  { label: 'Resume', href: '/resume', description: 'Recruiter-ready experience, education, skills, and PDF.' },
  { label: 'Contact', href: '/contact', description: 'Direct email and a short project brief.' },
];

export const utilityNav: SiteNavItem[] = [
  { label: 'HTML Sitemap', href: '/sitemap', description: 'Human-readable directory of retained public routes.' },
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
