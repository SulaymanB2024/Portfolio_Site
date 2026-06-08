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

  const textClass = isDark ? 'text-[#f1efe8]' : 'text-ink';
  const textMutedClass = isDark ? 'text-[#f1efe8]/54' : 'text-ink/54';
  const textMutedNavClass = isDark ? 'text-[#f1efe8]/58 hover:text-[#f1efe8]' : 'text-ink/58 hover:text-ink';
  const borderClass = isDark ? 'border-[#f1efe8]/12' : 'border-ink/12';
  const borderCircleClass = isDark ? 'border-[#f1efe8]/26' : 'border-ink/26';
  const hoverBgClass = isDark ? 'hover:bg-[#f1efe8] hover:text-[#080807]' : 'hover:bg-ink hover:text-canvas';

  return (
    <footer className={`mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-8 border-t ${borderClass} px-4 py-8 text-[10px] uppercase tracking-[0.3em] ${textMutedClass} md:grid-cols-[1fr_auto_1fr_auto] md:px-8 xl:px-10`}>
      <div>
        <div className={textClass}>SULAYMAN BOWLES</div>
        <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">
          Technical SEO · AI Search · Finance/Data
        </div>
      </div>
      
      <nav className="grid gap-5" id="footer-nav" aria-label="Footer navigation">
        {footerGroups.map((group) => (
          <div key={group.label} className="flex flex-wrap gap-5">
            {group.items.map((item) => {
              const active = isNavItemActive(activePath, item.href);
              const cleanId = navItemId(`footer-nav-${group.label.toLowerCase()}`, item);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  id={cleanId}
                  data-cursor-text={item.cursorText ?? navLabel(item)}
                  className={`hover-target relative group inline-flex min-h-11 items-center overflow-visible px-2 py-1 transition-colors ${active ? textClass : textMutedNavClass}`}
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
              );
            })}
          </div>
        ))}
      </nav>
      
      <div className="md:text-right">
        © 2026 SULAYMAN BOWLES
        <br />
        ALL RIGHTS RESERVED
      </div>

      <a
        href="#top"
        id="footer-back-to-top"
        aria-label="Back to top"
        data-cursor-text="TOP"
        className={`hover-target h-11 w-11 rounded-full border ${borderCircleClass} transition-colors ${hoverBgClass}`}
      />
    </footer>
  );
}

export default InternalFooter;
