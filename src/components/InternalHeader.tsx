import type { ReactNode } from 'react';
import { MagneticButton } from './MagneticButton';
import { AudioWaveToggle } from './AudioWaveToggle';

type InternalHeaderProps = {
  activePath: string;
  tone?: 'light' | 'dark';
};

const navItems = [
  { label: 'WORK', href: '/#selected-works' },
  { label: 'ATLAS', href: '/atlas' },
  { label: 'MARKETS', href: '/markets' },
  { label: 'METHOD', href: '/method' },
  { label: 'ABOUT', href: '/about' },
  { label: 'RESUME', href: '/resume' },
  { label: 'AI INFO', href: '/ai-information' },
] as const;

export function InternalHeader({ activePath, tone = 'light' }: InternalHeaderProps) {
  const isDark = tone === 'dark';
  
  const textClass = isDark ? 'text-[#f1efe8]' : 'text-ink';
  const textMutedClass = isDark ? 'text-[#f1efe8]/54' : 'text-ink/54';
  const textMutedNavClass = isDark ? 'text-[#f1efe8]/58 hover:text-[#f1efe8]' : 'text-ink/58 hover:text-ink';
  const bgClass = isDark ? 'frosted-acrylic-dark' : 'frosted-acrylic-light';
  const borderContactClass = isDark ? 'border-[#f1efe8]/28' : 'border-ink/28';
  const textContactClass = isDark ? 'text-[#f1efe8]/75 hover:text-[#f1efe8]' : 'text-ink/75 hover:text-ink';
  const menuBorderClass = isDark ? 'border-[#f1efe8]/16' : 'border-ink/16';

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
      <div className={`grid gap-4 ${bgClass} px-5 py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] md:hidden`}>
        <div className="flex items-center justify-between gap-4">
          <a href="/" id="header-brand-link-mobile" className="hover-target min-w-0" data-cursor-text="HOME">
            <span className={`block font-medium ${textClass}`}>SULAYMAN BOWLES</span>
            <span className={`mt-2 block font-serif text-sm italic normal-case tracking-normal ${textMutedClass}`}>
              Technical SEO · AI Search · Finance/Data
            </span>
          </a>
          <a 
            href="/#contact" 
            id="header-contact-link-mobile" 
            data-cursor-text="CONTACT" 
            aria-label="Contact Sulayman Bowles"
            className={`hover-target h-8 w-8 flex-shrink-0 rounded-full border ${borderContactClass} transition-colors ${isDark ? 'hover:bg-[#f1efe8] hover:text-[#080807]' : 'hover:bg-ink hover:text-canvas'}`}
          />
        </div>
        <details className={`group border-t ${menuBorderClass} pt-3`}>
          <summary className={`hover-target flex cursor-pointer list-none items-center justify-between ${textMutedNavClass}`}>
            <span>MENU</span>
            <span aria-hidden="true" className="transition-transform group-open:rotate-45">+</span>
          </summary>
          <nav className="mt-4 grid grid-cols-2 gap-3" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const active = activePath === item.href || (item.href === '/ai-information' && activePath === '/ai-information');
              const cleanId = `header-mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  id={cleanId}
                  data-cursor-text={item.label}
                  className={`hover-target border ${menuBorderClass} px-3 py-3 transition-colors ${active ? textClass : textMutedNavClass}`}
                >
                  {item.label}
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
          {navItems.map((item) => {
            const active = activePath === item.href || (item.href === '/ai-information' && activePath === '/ai-information');
            const cleanId = `header-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
            
            return (
              <MagneticButton key={item.href} strength={0.25}>
                <a
                  href={item.href}
                  id={cleanId}
                  data-cursor-text={item.label}
                  className={`hover-target relative group overflow-visible px-3 py-1 transition-colors ${active ? textClass : textMutedNavClass}`}
                >
                  <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">
                    {item.label}
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
        
        <div className="flex items-center gap-6 justify-self-start md:justify-self-end">
          <AudioWaveToggle />
          <MagneticButton strength={0.2}>
            <a 
              href="/#contact" 
              id="header-contact-link" 
              data-cursor-text="CONTACT" 
              className={`hover-target flex items-center gap-4 ${textContactClass} transition-colors`}
            >
              <span className={`h-7 w-7 rounded-full border ${borderContactClass} flex-shrink-0`} />
              <span>CONTACT</span>
            </a>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}

export default InternalHeader;
