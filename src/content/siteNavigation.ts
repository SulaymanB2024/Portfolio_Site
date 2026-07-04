export type SiteNavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: SiteNavItem[] = [
  { label: 'Work', href: '/work', description: 'Selected project work and supporting links.' },
  { label: 'Atlas', href: '/atlas', description: 'Technical SEO audit console.' },
  { label: 'Method', href: '/method', description: 'Void Agency technical SEO process.' },
  { label: 'Research', href: '/research', description: 'Readable notes on search systems, Atlas, and markets.' },
  { label: 'About', href: '/about', description: 'Profile, experience, and operating principles.' },
  { label: 'Resume', href: '/resume', description: 'Resume and supporting links.' },
  { label: 'Contact', href: '/contact', description: 'Audit intake and contact form.' },
];

export const utilityNav: SiteNavItem[] = [
  { label: 'Book', href: '/simple', description: 'First-person text edition and personal monograph.' },
  { label: 'Markets', href: '/markets', description: 'Finance and market research archive.' },
  { label: 'Void Agency', href: '/void-agency', description: 'Void Agency technical SEO practice page.' },
  { label: 'Tech Ledger', href: 'https://sulayman-bowles.tech/', description: 'Technical projects, experiments, and project ledger.' },
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
