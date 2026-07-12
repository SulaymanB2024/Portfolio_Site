export type SiteNavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: SiteNavItem[] = [
  { label: 'Work', href: '/work', description: 'Six distinct public artifacts with role, status, and evidence.' },
  { label: 'Atlas', href: '/atlas', description: 'Technical SEO crawl and evidence console.' },
  { label: 'Research', href: '/research', description: 'Search, technical SEO, product, data, markets, and infrastructure research.' },
  { label: 'About', href: '/about', description: 'Current work, experience, and why the projects connect.' },
  { label: 'Resume', href: '/resume', description: 'Recruiter-ready experience, education, skills, and PDF.' },
  { label: 'Contact', href: '/contact', description: 'Direct email and a short project brief.' },
];

export const utilityNav: SiteNavItem[] = [
  { label: 'Method', href: '/method', description: 'Void Agency technical SEO process.' },
  { label: 'Austin SEO', href: '/austin-technical-seo', description: 'Austin crawlability pilot and fixed-scope audit entry point.' },
  { label: 'Void Agency', href: '/void-agency', description: 'Canonical organization record for the service practice.' },
  { label: 'Text Edition', href: '/simple', description: 'First-person text edition and personal monograph.' },
  { label: 'AI Information', href: '/ai-information', description: 'Compact source roles and current profile context.' },
  { label: 'HTML Sitemap', href: '/sitemap', description: 'Plain links to every public canonical route.' },
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
