import { MagneticButton } from './MagneticButton';
import { isNavItemActive, navItemId, navLabel, primaryNav } from '../content/siteNavigation';

type InternalHeaderProps = {
  activePath: string;
  tone?: 'light' | 'dark';
  variant?: 'default' | 'home';
};

export function InternalHeader({ activePath, tone = 'light', variant = 'default' }: InternalHeaderProps) {
  const isDark = tone === 'dark';
  
  const textClass = isDark ? 'text-[#f1efe8]' : 'text-ink';
  const textMutedClass = isDark ? 'text-[#f1efe8]/54' : 'text-ink/54';
  const textMutedNavClass = isDark ? 'text-[#f1efe8]/58 hover:text-[#f1efe8]' : 'text-ink/58 hover:text-ink';
  const bgClass = isDark ? 'frosted-acrylic-dark' : 'frosted-acrylic-light';
  const menuBorderClass = isDark ? 'border-[#f1efe8]/16' : 'border-ink/16';
  const shellClass = variant === 'home'
    ? 'fixed top-0 left-0 right-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-4 md:px-8 xl:px-10'
    : 'sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10';

  return (
    <header className={shellClass}>
      <div className={`grid gap-4 ${bgClass} px-5 py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] md:hidden`}>
        <div className="flex items-center justify-between gap-4">
          <a href="/" id="header-brand-link-mobile" className="hover-target min-w-0" data-cursor-text="HOME">
            <span className={`block font-medium ${textClass}`}>SULAYMAN BOWLES</span>
            <span className={`mt-2 block font-serif text-sm italic normal-case tracking-normal ${textMutedClass}`}>
              Technical SEO · AI Search · Finance/Data
            </span>
          </a>
        </div>
        <details className={`group border-t ${menuBorderClass} pt-3`}>
          <summary className={`hover-target flex min-h-11 cursor-pointer list-none items-center justify-between ${textMutedNavClass}`}>
            <span>MENU</span>
            <span aria-hidden="true" className="transition-transform group-open:rotate-45">+</span>
          </summary>
          <nav className="mt-4 grid grid-cols-2 gap-3" aria-label="Mobile navigation">
            {primaryNav.map((item) => {
              const active = isNavItemActive(activePath, item.href);
              const cleanId = navItemId('header-mobile-nav', item);
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  id={cleanId}
                  data-cursor-text={item.cursorText ?? navLabel(item)}
                  className={`hover-target flex min-h-11 items-center border ${menuBorderClass} px-3 py-3 transition-colors ${active ? textClass : textMutedNavClass}`}
                >
                  {navLabel(item)}
                </a>
              );
            })}
          </nav>
        </details>
      </div>

      <div className={`hidden items-center gap-5 ${bgClass} px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] md:grid md:grid-cols-[1fr_auto_1fr]`}>
        <MagneticButton strength={0.12} className="justify-self-start">
          <a href="/" id="header-brand-link" className="hover-target" data-cursor-text="HOME">
            <span className={`block font-medium ${textClass}`}>SULAYMAN BOWLES</span>
            <span className={`mt-2 block font-serif text-sm italic normal-case tracking-normal ${textMutedClass}`}>
              Technical SEO · AI Search · Finance/Data
            </span>
          </a>
        </MagneticButton>
        
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 md:justify-center md:gap-x-5" aria-label="Main navigation">
          {primaryNav.map((item) => {
            const active = isNavItemActive(activePath, item.href);
            const cleanId = navItemId('header-nav', item);
            
            return (
              <MagneticButton key={item.href} strength={0.25}>
                <a
                  href={item.href}
                  id={cleanId}
                  data-cursor-text={item.cursorText ?? navLabel(item)}
                  className={`hover-target relative group overflow-visible px-3 py-1 transition-colors ${active ? textClass : textMutedNavClass}`}
                >
                  <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">
                    {navLabel(item)}
                  </span>
                  <span className={`absolute left-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${textClass}`}>
                    [
                  </span>
                  <span className={`absolute right-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${textClass}`}>
                    ]
                  </span>
                </a>
              </MagneticButton>
            );
          })}
        </nav>
        
        <div className="justify-self-start md:justify-self-end" aria-hidden="true" />
      </div>
    </header>
  );
}

export default InternalHeader;
