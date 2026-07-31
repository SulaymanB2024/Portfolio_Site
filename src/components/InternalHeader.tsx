import { useEffect, useRef, useState } from 'react';
import { isNavItemActive, navItemId, navLabel, primaryNav } from '../content/siteNavigation';

type InternalHeaderProps = {
  activePath: string;
  tone?: 'light' | 'dark';
  variant?: 'default' | 'home' | 'final-frame';
  minimalBrand?: boolean;
};

const routeDescriptions: Record<string, string> = {
  '/method': 'Technical SEO audits: scope, evidence, deliverables, and rerun checks.',
  '/sitemap': 'Plain links to every public canonical route.',
  '/404': 'Route not found. Return to public work, research, or the sitemap.',
};

export function InternalHeader({ activePath, tone = 'light', variant = 'default', minimalBrand = false }: InternalHeaderProps) {
  const activeItem = primaryNav.find((item) => isNavItemActive(activePath, item.href));
  const [routeNote, setRouteNote] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const mobileMenuScrollYRef = useRef(0);
  const isFinalFrame = variant === 'final-frame';
  const isDark = tone === 'dark';
  const showRouteNote = variant !== 'home' && !isFinalFrame;
  const defaultRouteNote = activeItem?.description ?? routeDescriptions[activePath] ?? 'Index of work, systems, and supporting links.';
  const displayedRouteNote = routeNote ?? defaultRouteNote;
  
  const textClass = isDark ? 'text-canvas' : 'text-ink';
  const textMutedClass = isDark ? 'text-canvas/64' : 'text-ink/60';
  const textMutedNavClass = isDark ? 'text-canvas/70 hover:text-canvas' : 'text-ink/64 hover:text-ink';
  const activeRuleClass = isDark ? 'bg-canvas' : 'bg-ink';
  const hoverSurfaceClass = isDark ? 'hover:bg-canvas/[0.035]' : 'hover:bg-ink/[0.025]';
  const bgClass = isDark ? 'site-header-surface-dark' : 'site-header-surface-light';
  const menuBorderClass = isDark ? 'border-canvas/16' : 'border-ink/16';
  const surfaceClass = isFinalFrame ? 'relative z-[60]' : 'site-header relative z-[60]';
  const shellClass = mobileMenuOpen || variant === 'home'
    ? 'fixed inset-x-0 top-0 z-50 w-full'
    : 'sticky top-0 z-50 w-full';
  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      mobileMenuScrollYRef.current = window.scrollY;
    }
    setMobileMenuOpen((open) => !open);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePath]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const lockedScrollY = mobileMenuScrollYRef.current;
    const previousBodyStyle = {
      overflow: document.body.style.overflow,
      overscrollBehavior: document.body.style.overscrollBehavior,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const previousRootStyle = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    };
    const headerElement = mobileMenuButtonRef.current?.closest('header');
    const backgroundSiblings = headerElement?.parentElement
      ? [...headerElement.parentElement.children].filter(
          (element): element is HTMLElement => element instanceof HTMLElement && element !== headerElement,
        )
      : [];
    const previousBackgroundState = backgroundSiblings.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute('aria-hidden'),
    }));
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

      const menuNodes = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const focusable: HTMLElement[] = [
        ...(mobileMenuButtonRef.current ? [mobileMenuButtonRef.current] : []),
        ...(menuNodes ? [...menuNodes] : []),
      ];

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const activeIndex = focusable.findIndex((element) => element === document.activeElement);
      const nextIndex = activeIndex === -1
        ? 0
        : (activeIndex + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;

      event.preventDefault();
      focusable[nextIndex].focus();
    };

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = '100%';
    backgroundSiblings.forEach((element) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.documentElement.style.overflow = previousRootStyle.overflow;
      document.documentElement.style.overscrollBehavior = previousRootStyle.overscrollBehavior;
      document.body.style.overflow = previousBodyStyle.overflow;
      document.body.style.overscrollBehavior = previousBodyStyle.overscrollBehavior;
      document.body.style.position = previousBodyStyle.position;
      document.body.style.top = previousBodyStyle.top;
      document.body.style.width = previousBodyStyle.width;
      window.scrollTo(0, lockedScrollY);
      previousBackgroundState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', ariaHidden);
        }
      });
      window.removeEventListener('keydown', handleKeyDown);
      if (mobileMenuButtonRef.current?.isConnected) {
        mobileMenuButtonRef.current.focus({ preventScroll: true });
      }
    };
  }, [mobileMenuOpen]);

  return (
    <header className={shellClass}>
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 cursor-default bg-ink/8 backdrop-blur-[2px] xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`${surfaceClass} site-header-editorial mx-auto flex min-h-[72px] max-w-[1480px] items-stretch justify-between ${bgClass} text-[10px] uppercase xl:hidden`}>
        <div className="flex min-w-0 flex-1 items-center px-5">
          <a href="/" id="header-brand-link-mobile" className="block w-full min-w-0">
            <span className={`site-header-brand block whitespace-nowrap text-[11px] font-semibold leading-none tracking-[0.34em] ${textClass}`}>SULAYMAN BOWLES</span>
            {!minimalBrand && (
              <span className={`site-header-tagline mt-2 block truncate font-serif text-[13px] italic normal-case leading-none tracking-normal ${textMutedClass}`}>
                Technical SEO · AI Systems · Finance Research
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
          onClick={toggleMobileMenu}
        >
          <span>INDEX</span>
          <span aria-hidden="true" className="text-sm font-light tracking-normal">{mobileMenuOpen ? 'x' : '+'}</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="header-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site index"
          className={`site-header-mobile-sheet fixed inset-x-0 bottom-0 top-[72px] z-[55] overflow-y-auto overscroll-contain text-[10px] uppercase xl:hidden ${bgClass}`}
        >
          <nav className="grid content-start" aria-label="Mobile navigation">
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
        </div>
      )}

      <div className={`${isFinalFrame ? 'relative' : 'site-header'} site-header-editorial mx-auto hidden min-h-[82px] max-w-[1480px] items-stretch ${bgClass} text-[10px] uppercase xl:grid xl:grid-cols-[minmax(265px,0.72fr)_minmax(0,1.28fr)]`}>
        <a href="/" id="header-brand-link" className={`flex min-w-0 flex-col justify-center border-r px-8 transition-opacity duration-200 hover:opacity-72 ${menuBorderClass}`}>
          <span className={`site-header-brand block truncate text-[11px] font-semibold leading-none tracking-[0.38em] ${textClass}`}>SULAYMAN BOWLES</span>
          {!minimalBrand && (
            <span className={`site-header-tagline mt-2 block truncate font-serif text-[15px] italic normal-case leading-none tracking-normal ${textMutedClass}`}>
              Technical SEO · AI Systems · Finance Research
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
              {!showRouteNote && <span aria-hidden="true">{defaultRouteNote}</span>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default InternalHeader;
