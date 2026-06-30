import { Mail } from 'lucide-react';
import { AudioWaveToggle } from './AudioWaveToggle';

type InternalHeaderProps = {
  activePath: string;
  tone?: 'light' | 'dark';
};

const primaryItems = [
  { label: 'Work', href: '/#selected-works' },
  { label: 'Method', href: '/method' },
  { label: 'Contact', href: '/#contact' },
] as const;

const indexItems = [
  { label: 'Atlas', href: '/atlas' },
  { label: 'Markets', href: '/markets' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
  { label: 'AI Info', href: '/ai-information' },
] as const;

function itemIsActive(activePath: string, href: string) {
  return activePath === href || activePath === href.split('#')[0];
}

export function InternalHeader({ activePath, tone = 'light' }: InternalHeaderProps) {
  const isDark = tone === 'dark';

  const textClass = isDark ? 'text-[#f1efe8]' : 'text-ink';
  const mutedClass = isDark ? 'text-[#f1efe8]/56 hover:text-[#f1efe8]' : 'text-ink/56 hover:text-ink';
  const borderClass = isDark ? 'border-[#f1efe8]/12' : 'border-ink/12';
  const panelClass = isDark ? 'bg-[#080807]/88 text-[#f1efe8]' : 'bg-canvas/90 text-ink';
  const iconHoverClass = isDark ? 'hover:bg-[#f1efe8] hover:text-[#080807]' : 'hover:bg-ink hover:text-canvas';

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${borderClass} ${panelClass} backdrop-blur-xl`}>
      <div className="mx-auto flex w-full max-w-[1480px] items-start justify-between gap-4 px-4 py-4 text-[11px] uppercase tracking-normal md:px-8 xl:px-10">
        <a
          href="/"
          id="header-brand-link"
          className={`hover-target pt-1 font-medium leading-none ${textClass}`}
          data-cursor-text="HOME"
          aria-label="Home - Sulayman Bowles"
        >
          S. BOWLES
        </a>

        <details className="group text-right md:hidden">
          <summary className={`hover-target cursor-pointer list-none px-1 py-1 ${mutedClass}`} data-cursor-text="MENU">
            Menu +
          </summary>
          <nav className={`mt-4 grid min-w-[11rem] gap-2 border ${borderClass} ${panelClass} p-3 shadow-2xl`} aria-label="Mobile navigation">
            {[...primaryItems, ...indexItems].map((item) => {
              const active = itemIsActive(activePath, item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  id={`header-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  data-cursor-text={item.label.toUpperCase()}
                  className={`hover-target px-2 py-1.5 text-right transition-colors ${active ? textClass : mutedClass}`}
                >
                  {active ? `[${item.label}]` : item.label}
                </a>
              );
            })}
          </nav>
        </details>

        <div className="hidden items-start gap-7 md:flex">
          <nav className="flex items-center gap-5" aria-label="Primary navigation">
            {primaryItems.map((item) => {
              const active = itemIsActive(activePath, item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  id={`header-primary-${item.label.toLowerCase()}`}
                  data-cursor-text={item.label.toUpperCase()}
                  className={`hover-target transition-colors ${active ? textClass : mutedClass}`}
                >
                  {active ? `[${item.label}]` : item.label}
                </a>
              );
            })}
            <details className="relative">
              <summary className={`hover-target cursor-pointer list-none transition-colors ${mutedClass}`} data-cursor-text="INDEX">
                Index +
              </summary>
              <div className={`absolute right-0 mt-4 grid min-w-[10rem] gap-2 border ${borderClass} ${panelClass} p-3 text-right shadow-2xl`}>
                {indexItems.map((item) => {
                  const active = itemIsActive(activePath, item.href);
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      id={`header-index-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      data-cursor-text={item.label.toUpperCase()}
                      className={`hover-target px-2 py-1 transition-colors ${active ? textClass : mutedClass}`}
                    >
                      {active ? `[${item.label}]` : item.label}
                    </a>
                  );
                })}
              </div>
            </details>
          </nav>

          <div className={`flex items-center gap-4 ${mutedClass}`}>
            <AudioWaveToggle />
            <a
              href="/#contact"
              id="header-contact-icon"
              data-cursor-text="CONTACT"
              aria-label="Contact Sulayman Bowles"
              className={`hover-target grid h-8 w-8 place-items-center rounded-full border ${borderClass} transition-colors ${iconHoverClass}`}
            >
              <Mail size={13} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default InternalHeader;
