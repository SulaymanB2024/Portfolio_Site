import { useEffect, useState } from 'react';
import { isNavItemActive, navItemId, navLabel, primaryNav } from '../content/siteNavigation';

type InternalHeaderProps = {
  activePath: string;
  tone?: 'light' | 'dark';
  variant?: 'default' | 'home';
};

export function InternalHeader({ activePath, tone = 'light', variant = 'default' }: InternalHeaderProps) {
  const activeItem = primaryNav.find((item) => isNavItemActive(activePath, item.href));
  const [routeNote, setRouteNote] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const useLightGlass = variant === 'home';
  const isDark = tone === 'dark' && !useLightGlass;
  const showRouteNote = variant !== 'home';
  const displayedRouteNote = routeNote ?? activeItem?.description ?? 'Index of work, systems, and supporting links.';
  
  const textClass = isDark ? 'text-canvas' : 'text-ink';
  const textMutedClass = isDark ? 'text-canvas/58' : 'text-ink/56';
  const textMutedNavClass = isDark ? 'text-canvas/56 hover:text-canvas' : 'text-ink/54 hover:text-ink';
  const activeRuleClass = isDark ? 'bg-canvas' : 'bg-ink';
  const hoverSurfaceClass = isDark ? 'hover:bg-canvas/7' : 'hover:bg-ink/[0.035]';
  const bgClass = isDark ? 'frosted-acrylic-dark' : 'frosted-acrylic-light';
  const menuBorderClass = isDark ? 'border-canvas/16' : 'border-ink/16';
  const noteBorderClass = isDark ? 'border-canvas/12' : 'border-ink/12';
  const shellClass = variant === 'home'
    ? 'fixed top-0 left-0 right-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-4 md:px-8 xl:px-10'
    : 'sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-4 md:px-8 xl:px-10';

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={shellClass}>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 cursor-default bg-ink/8 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`site-header relative z-[60] flex items-center justify-between gap-4 ${bgClass} rounded-[8px] px-4 py-3 text-[10px] uppercase md:hidden`}>
        <div className="flex min-h-10 items-center justify-between gap-4">
          <a href="/" id="header-brand-link-mobile" className="min-w-0">
            <span className={`site-header-brand block truncate text-[11px] font-semibold leading-none tracking-[0.34em] ${textClass}`}>SULAYMAN BOWLES</span>
            <span className={`site-header-tagline mt-2 block truncate font-serif text-sm italic normal-case leading-none tracking-normal ${textMutedClass}`}>
              Technical SEO · Search Systems · Finance Research
            </span>
          </a>
        </div>
        <button
          type="button"
          id="header-mobile-menu-button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="header-mobile-menu"
          aria-expanded={mobileMenuOpen}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border text-sm leading-none transition-colors duration-200 ${menuBorderClass} ${hoverSurfaceClass} ${textMutedNavClass}`}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{mobileMenuOpen ? 'x' : '+'}</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          id="header-mobile-menu"
          className={`mobile-nav-sheet fixed left-4 right-4 top-[96px] z-[55] grid max-h-[calc(100dvh-112px)] grid-cols-1 gap-2 overflow-y-auto rounded-[8px] p-3 text-[10px] uppercase shadow-2xl md:hidden ${bgClass}`}
          aria-label="Mobile navigation"
        >
          {primaryNav.map((item, index) => {
            const active = isNavItemActive(activePath, item.href);
            const cleanId = navItemId('header-mobile-nav', item);

            return (
              <a
                key={item.href}
                href={item.href}
                id={cleanId}
                aria-current={active ? 'page' : undefined}
                title={item.description}
                style={{ transitionDelay: `${index * 22}ms` }}
                className={`site-header-link flex min-h-12 items-center justify-between rounded-[6px] border px-4 py-3 tracking-[0.24em] opacity-[0.9] transition-[background-color,color,opacity,transform] duration-200 ${menuBorderClass} ${hoverSurfaceClass} ${active ? textClass : textMutedNavClass}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{navLabel(item)}</span>
                <span aria-hidden="true" className="opacity-40">/</span>
              </a>
            );
          })}
        </nav>
      )}

      <div className={`site-header hidden items-center gap-3 ${bgClass} rounded-[8px] px-5 py-3 text-[10px] uppercase md:grid md:grid-cols-1 lg:grid-cols-[minmax(245px,0.78fr)_minmax(0,1.32fr)] lg:px-6`}>
        <a href="/" id="header-brand-link" className="block min-w-0 justify-self-start transition-opacity duration-200 hover:opacity-72">
          <span className={`site-header-brand block truncate text-[11px] font-semibold leading-none tracking-[0.34em] ${textClass}`}>SULAYMAN BOWLES</span>
          <span className={`site-header-tagline mt-2 block truncate font-serif text-[15px] italic normal-case leading-none tracking-normal ${textMutedClass}`}>
            Technical SEO · Search Systems · Finance Research
          </span>
        </a>
        
        <nav className="flex min-w-0 flex-wrap items-center justify-start gap-x-1 gap-y-1 lg:justify-end" aria-label="Main navigation">
          {primaryNav.map((item) => {
            const active = isNavItemActive(activePath, item.href);
            const cleanId = navItemId('header-nav', item);
            
            return (
              <a
                key={item.href}
                href={item.href}
                id={cleanId}
                aria-current={active ? 'page' : undefined}
                title={item.description}
                onFocus={() => setRouteNote(item.description ?? item.label)}
                onMouseEnter={() => setRouteNote(item.description ?? item.label)}
                onBlur={() => setRouteNote(null)}
                onMouseLeave={() => setRouteNote(null)}
                className={`site-header-link group relative inline-flex min-h-10 items-center justify-center rounded-[6px] px-3 py-2 leading-none tracking-[0.24em] transition-colors duration-200 ${hoverSurfaceClass} ${active ? textClass : textMutedNavClass}`}
              >
                <span className="block whitespace-nowrap">
                  {navLabel(item)}
                </span>
                <span className={`absolute inset-x-3 bottom-1 h-px origin-left transition-opacity duration-200 ${active ? `opacity-100 ${activeRuleClass}` : `opacity-0 ${activeRuleClass} group-hover:opacity-40`}`} />
              </a>
            );
          })}
        </nav>
        {showRouteNote && (
          <div className={`hidden border-t pt-2 text-[9px] uppercase leading-relaxed tracking-[0.2em] ${noteBorderClass} ${textMutedClass} md:block lg:col-span-2`}>
            <span className={textClass}>Route note</span>
            <span className="px-2 opacity-38">/</span>
            <span>{displayedRouteNote}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default InternalHeader;
