import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up.js';
import { isNavItemActive, navItemId, navLabel, primaryNav, utilityNav, type SiteNavItem } from '../content/siteNavigation';

type InternalFooterProps = {
  activePath: string;
  tone?: 'light' | 'dark';
};

export function InternalFooter({ activePath, tone = 'light' }: InternalFooterProps) {
  const isDark = tone === 'dark';
  const footerGroups: { label: string; items: SiteNavItem[] }[] = [
    { label: 'Primary', items: primaryNav },
    { label: 'Source', items: utilityNav },
  ];

  const textClass = isDark ? 'text-canvas' : 'text-ink';
  const textMutedClass = isDark ? 'text-canvas/66' : 'text-ink/64';
  const textMutedNavClass = isDark ? 'text-canvas/64 hover:text-canvas' : 'text-ink/62 hover:text-ink';
  const activeRuleClass = isDark ? 'bg-canvas' : 'bg-ink';
  const hoverSurfaceClass = isDark ? 'hover:bg-canvas/7' : 'hover:bg-ink/[0.035]';
  const bgClass = isDark ? 'frosted-acrylic-dark' : 'frosted-acrylic-light';
  const dividerClass = isDark ? 'border-canvas/16' : 'border-ink/16';
  const returnClass = isDark
    ? 'border-canvas/28 text-canvas/64 hover:border-canvas/44 hover:bg-canvas/7 hover:text-canvas'
    : 'border-ink/28 text-ink/62 hover:border-ink/44 hover:bg-ink/[0.035] hover:text-ink';

  return (
    <footer className={`mx-auto w-full max-w-[1480px] px-4 py-4 text-[10px] uppercase ${textMutedClass} md:px-8 xl:px-10`}>
      <div className={`site-footer grid gap-4 rounded-[8px] ${bgClass} px-4 py-4 md:px-6`}>
        <div className="grid gap-5 lg:grid-cols-[minmax(285px,0.68fr)_minmax(0,1.68fr)_minmax(220px,0.52fr)_auto] lg:items-start lg:gap-4">
          <a href="/" id="footer-brand-link" aria-label="Sulayman Bowles — Home" className={`site-brand-link flex min-w-0 items-start gap-3 transition-opacity duration-200 hover:opacity-80 ${textClass}`}>
            <img src="/favicon.svg" width="36" height="36" alt="" aria-hidden="true" className="site-brand-mark h-9 w-9" />
            <span className="block min-w-0">
              <span className="site-footer-brand block truncate text-[11px] font-semibold leading-none tracking-[0.3em]">
                SULAYMAN BOWLES
              </span>
              <span className={`site-footer-tagline mt-2 block max-w-[34ch] text-balance font-serif text-[15px] italic normal-case leading-[1.15] tracking-normal ${textMutedClass}`}>
                Technical SEO · AI Systems · Finance Research
              </span>
            </span>
          </a>

          <nav className="grid min-w-0 gap-2" id="footer-nav" aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.label} className={`grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-1 ${group.label === 'Source' ? `border-t ${dividerClass} pt-2 lg:border-t-0 lg:pt-0` : ''}`}>
                <span className={`pt-3 text-[8px] tracking-[0.2em] ${textMutedClass}`}>{group.label}</span>
                <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1">
                  {group.items.map((item) => {
                    const active = isNavItemActive(activePath, item.href);
                    const cleanId = navItemId(`footer-nav-${group.label.toLowerCase()}`, item);
                    const isExternal = item.href.startsWith('http');

                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        id={cleanId}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer' : undefined}
                        aria-current={active ? 'page' : undefined}
                        title={item.description}
                        className={`site-footer-link group relative inline-flex min-h-10 items-center justify-center rounded-[6px] px-3 py-2 leading-none tracking-[0.24em] transition-colors duration-200 ${hoverSurfaceClass} ${active ? textClass : textMutedNavClass}`}
                      >
                        <span className="block whitespace-nowrap">
                          {navLabel(item)}
                        </span>
                        <span className={`absolute inset-x-3 bottom-1 h-px origin-left transition-opacity duration-200 ${active ? `opacity-100 ${activeRuleClass}` : `opacity-0 ${activeRuleClass} group-hover:opacity-40`}`} />
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="site-footer-meta self-center whitespace-nowrap leading-[1.8] tracking-[0.24em] lg:self-start lg:text-right">
            © 2026 SULAYMAN BOWLES
            <br />
            ALL RIGHTS RESERVED
          </div>

          <a
            href="#top"
            id="footer-back-to-top"
            aria-label="Back to top"
            onClick={(event) => {
              event.preventDefault();
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              window.requestAnimationFrame(() => {
                const target = document.getElementById('top');
                if (!target) return;
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
              });
            }}
            className={`site-footer-return group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border transition-colors duration-200 ${returnClass}`}
          >
            <span aria-hidden="true" className="absolute inset-x-1 bottom-1 h-0 rounded-full bg-current/10 transition-all duration-300 group-hover:h-[calc(100%-0.5rem)]" />
            <ArrowUp aria-hidden="true" className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.5} />
          </a>
        </div>
        <p className={`m-0 max-w-[92ch] border-t ${dividerClass} pt-3 text-[11px] normal-case leading-relaxed tracking-normal ${textMutedClass}`}>
          Measurement disclosure: on an exact production host, this site may use Vercel Web Analytics, Vercel Speed Insights, and a shared Google Analytics 4 portfolio property to record page paths, fixed content-safe interaction labels, and aggregate performance or engagement. The site integration does not send typed content, names, email addresses, user IDs, URL query strings, or fragments. Google Signals and ad-personalization signals are disabled; the providers may still process standard device, network, cookie, performance, and referrer data. This configuration and wording require site-owner and privacy review and do not assert legal compliance.
        </p>
      </div>
    </footer>
  );
}

export default InternalFooter;
