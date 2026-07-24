export type SiteNavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: SiteNavItem[] = [
  { label: 'Work', href: '/work', description: 'Six public artifacts with ownership, system details, status, constraints, and proof.' },
  { label: 'Atlas', href: '/atlas', description: 'Crawl records, raw/render comparison, review states, persistence, and exports.' },
  { label: 'Research', href: '/research', description: 'Search, technical SEO, product, data, markets, and infrastructure research.' },
  { label: 'About', href: '/about', description: 'Technical practice, current work, experience, and operating principles.' },
  { label: 'Resume', href: '/resume', description: 'Recruiter-ready experience, education, skills, and PDF.' },
  { label: 'Contact', href: '/contact', description: 'Direct email and a short project brief.' },
];

export const utilityNav: SiteNavItem[] = [
  { label: 'SEO Audit Method', href: '/method', description: 'Sulayman’s evidence-led process, deliverables, and rerun checks.' },
  { label: 'Void Agency', href: '/void-agency', description: 'Sulayman’s role, public contributions, and relationship to the commercial agency.' },
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
