export type SiteNavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: SiteNavItem[] = [
  { label: 'Work', href: '/work', description: 'Selected project work and proof links.' },
  { label: 'Atlas', href: '/atlas', description: 'Technical SEO audit console.' },
  { label: 'Markets', href: '/markets', description: 'Finance and market research archive.' },
  { label: 'Method', href: '/method', description: 'Void Agency technical SEO process.' },
  { label: 'About', href: '/about', description: 'Profile, experience, and operating principles.' },
  { label: 'Resume', href: '/resume', description: 'Resume and proof links.' },
  { label: 'Contact', href: '/contact', description: 'Audit intake and contact form.' },
];

export const utilityNav: SiteNavItem[] = [
  { label: 'Book', href: '/simple', description: 'First-person text edition and personal monograph.' },
  { label: 'AI Information', href: '/ai-information', description: 'Entity reference for search and AI systems.' },
  { label: 'Research', href: '/research', description: 'Citation-ready public research assets and source files.' },
  { label: 'Sitemap', href: '/sitemap', description: 'Plain HTML links to public pages.' },
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
