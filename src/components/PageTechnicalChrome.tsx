type PageTechnicalChromeProps = {
  tone?: 'dark' | 'light';
};

export function PageTechnicalChrome({ tone = 'dark' }: PageTechnicalChromeProps) {
  const markClass = tone === 'dark' ? 'bg-[#f1efe8]/24' : 'bg-ink/24';

  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden select-none lg:block">
      <div className={`absolute left-12 top-12 h-4 w-px ${markClass}`} />
      <div className={`absolute left-8 top-16 h-px w-4 ${markClass}`} />
      <div className={`absolute right-12 top-12 h-4 w-px ${markClass}`} />
      <div className={`absolute right-8 top-16 h-px w-4 ${markClass}`} />
      <div className={`absolute bottom-12 left-12 h-4 w-px ${markClass}`} />
      <div className={`absolute bottom-8 left-8 h-px w-4 ${markClass}`} />
      <div className={`absolute bottom-12 right-12 h-4 w-px ${markClass}`} />
      <div className={`absolute bottom-8 right-8 h-px w-4 ${markClass}`} />
    </div>
  );
}

export default PageTechnicalChrome;
