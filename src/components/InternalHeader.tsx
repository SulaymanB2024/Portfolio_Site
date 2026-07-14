import { useEffect, useRef, useState } from 'react';
import { isNavItemActive, navItemId, navLabel, primaryNav } from '../content/siteNavigation';

type InternalHeaderProps = {
  activePath: string;
  tone?: 'light' | 'dark';
  variant?: 'default' | 'home' | 'final-frame';
  minimalBrand?: boolean;
};

export function InternalHeader({ activePath, tone = 'light', variant = 'default', minimalBrand = false }: InternalHeaderProps) {
  const activeItem = primaryNav.find((item) => isNavItemActive(activePath, item.href));
  const [routeNote, setRouteNote] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const isFinalFrame = variant === 'final-frame';
  const isDark = tone === 'dark';
  const showRouteNote = variant !== 'home' && !isFinalFrame;
  const displayedRouteNote = routeNote ?? activeItem?.description ?? 'Index of work, systems, and supporting links.';
  
  const textClass = isDark ? 'text-canvas' : 'text-ink';
  const textMutedClass = isDark ? 'text-canvas/64' : 'text-ink/60';
  const textMutedNavClass = isDark ? 'text-canvas/70 hover:text-canvas' : 'text-ink/64 hover:text-ink';
  const activeRuleClass = isDark ? 'bg-canvas' : 'bg-ink';
  const hoverSurfaceClass = isDark ? 'hover:bg-canvas/[0.035]' : 'hover:bg-ink/[0.025]';
  const bgClass = isDark ? 'site-header-surface-dark' : 'site-header-surface-light';
  const menuBorderClass = isDark ? 'border-canvas/16' : 'border-ink/16';
  const surfaceClass = isFinalFrame ? 'relative z-[60]' : 'site-header relative z-[60]';
  const shellClass = variant === 'home'
    ? 'fixed inset-x-0 top-0 z-50 w-full'
    : 'sticky top-0 z-50 w-full';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePath]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableNodes = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const focusable: HTMLElement[] = focusableNodes ? [...focusableNodes] : [];
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (mobileMenuButtonRef.current?.isConnected) {
        mobileMenuButtonRef.current.focus({ preventScroll: true });
      }
    };
  }, [mobileMenuOpen]);

  return (
    <header className={shellClass}>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={-1}
          className="fixed inset-0 z-40 cursor-default bg-ink/8 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`${surfaceClass} site-header-editorial mx-auto flex min-h-[72px] max-w-[1480px] items-stretch justify-between ${bgClass} text-[10px] uppercase md:hidden`}>
        <div className="flex min-w-0 flex-1 items-center px-5">
          <a href="/" id="header-brand-link-mobile" className="min-w-0">
            <span className={`site-header-brand block truncate text-[11px] font-semibold leading-none tracking-[0.34em] ${textClass}`}>SULAYMAN BOWLES</span>
            {!minimalBrand && (
              <span className={`site-header-tagline mt-2 block truncate font-serif text-sm italic normal-case leading-none tracking-normal ${textMutedClass}`}>
                Technical SEO · Search Systems · Finance Research
              </span>
            )}
          </a>
        </div>
        <button
          ref={mobileMenuButtonRef}
          type="button"
          id="header-mobile-menu-button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="header-mobile-menu"
          aria-expanded={mobileMenuOpen}
          className={`inline-flex min-w-[78px] shrink-0 items-center justify-center gap-2 border-l text-[9px] leading-none tracking-[0.22em] transition-colors duration-200 ${menuBorderClass} ${hoverSurfaceClass} ${textMutedNavClass}`}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span>INDEX</span>
          <span aria-hidden="true" className="text-sm font-light tracking-normal">{mobileMenuOpen ? 'x' : '+'}</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          ref={mobileMenuRef}
          id="header-mobile-menu"
          className={`site-header-mobile-sheet fixed inset-x-0 bottom-0 top-[72px] z-[55] grid content-start overflow-y-auto text-[10px] uppercase md:hidden ${bgClass}`}
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
                className={`site-header-link group grid min-h-[72px] grid-cols-[3rem_1fr_auto] items-center border-b px-5 tracking-[0.24em] transition-[background-color,color,opacity,transform] duration-200 ${menuBorderClass} ${hoverSurfaceClass} ${active ? textClass : textMutedNavClass}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span aria-hidden="true" className="font-serif text-lg italic tracking-normal opacity-42">{String(index + 1).padStart(2, '0')}</span>
                <span>{navLabel(item)}</span>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 opacity-42 transition-transform duration-200 group-hover:translate-x-1" fill="none">
                  <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </a>
            );
          })}
        </nav>
      )}

      <div className={`${isFinalFrame ? 'relative' : 'site-header'} site-header-editorial mx-auto hidden min-h-[82px] max-w-[1480px] items-stretch ${bgClass} text-[10px] uppercase md:grid md:grid-cols-[minmax(265px,0.72fr)_minmax(0,1.28fr)]`}>
        <a href="/" id="header-brand-link" className={`flex min-w-0 flex-col justify-center border-r px-8 transition-opacity duration-200 hover:opacity-72 ${menuBorderClass}`}>
          <span className={`site-header-brand block truncate text-[11px] font-semibold leading-none tracking-[0.38em] ${textClass}`}>SULAYMAN BOWLES</span>
          {!minimalBrand && (
            <span className={`site-header-tagline mt-2 block truncate font-serif text-[15px] italic normal-case leading-none tracking-normal ${textMutedClass}`}>
              Technical SEO · Search Systems · Finance Research
            </span>
          )}
        </a>

        <div className={`grid min-w-0 ${minimalBrand ? 'grid-rows-1' : 'grid-rows-[1fr_auto]'}`}>
          <nav className="flex min-w-0 items-stretch justify-end" aria-label="Main navigation">
          {primaryNav.map((item, index) => {
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
                className={`site-header-link group relative inline-flex min-w-0 items-center justify-center gap-1.5 px-3 leading-none tracking-[0.22em] transition-colors duration-200 xl:px-4 ${hoverSurfaceClass} ${active ? textClass : textMutedNavClass}`}
              >
                <span aria-hidden="true" className="hidden font-serif text-[10px] italic tracking-normal opacity-38 xl:inline">{String(index + 1).padStart(2, '0')}</span>
                <span className="block whitespace-nowrap">
                  {navLabel(item)}
                </span>
                <span className={`absolute inset-x-3 bottom-0 h-px origin-left transition-opacity duration-200 ${active ? `opacity-100 ${activeRuleClass}` : `opacity-0 ${activeRuleClass} group-hover:opacity-40`}`} />
              </a>
            );
          })}
          </nav>
          {!minimalBrand && (
            <div className={`flex min-h-6 items-center justify-end border-t px-4 font-serif text-[11px] italic normal-case leading-none tracking-normal ${menuBorderClass} ${textMutedClass}`}>
              <span className={showRouteNote ? '' : 'sr-only'}>{displayedRouteNote}</span>
              {!showRouteNote && <span aria-hidden="true">Index of work, systems, and supporting links.</span>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default InternalHeader;
