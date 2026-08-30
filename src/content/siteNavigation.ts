export type SiteNavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: SiteNavItem[] = [
  { label: 'Work', href: '/work', description: 'A complete project-family ledger plus six flagship records, with ownership, status, visibility, and evidence boundaries.' },
  { label: 'Atlas', href: '/atlas', description: 'An in-development crawl and evidence system with capability and public-proof status.' },
  { label: 'Research', href: '/research', description: 'Four connected clusters for AI systems, search systems, technical SEO, and markets models.' },
  { label: 'About', href: '/about', description: 'Technical practice, current work, experience, and operating principles.' },
  { label: 'Resume', href: '/resume', description: 'Recruiter-ready experience, education, skills, and PDF.' },
  { label: 'Contact', href: '/contact', description: 'Direct email and a short project brief.' },
];

export const utilityNav: SiteNavItem[] = [
  { label: 'SEO Audit Method', href: '/method', description: 'Technical SEO audit services, process, deliverables, and rerun checks.' },
  { label: 'Austin Technical SEO', href: '/austin-technical-seo', description: 'Austin technical SEO consultant, crawlability pilot, and audit entry point.' },
  { label: 'Void Agency', href: 'https://www.void-agency.com/', description: 'External site for the fixed-scope technical SEO practice.' },
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
