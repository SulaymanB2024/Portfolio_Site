import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

type ScrollProgressProps = {
  tone?: 'light' | 'dark';
};

export function ScrollProgress({ tone = 'light' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const [sectionLabel, setSectionLabel] = useState('Top');
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const trackClass = tone === 'dark' ? 'bg-ink/15' : 'bg-canvas/20';
  const barClass = tone === 'dark' ? 'bg-ink' : 'bg-canvas';
  const textClass = tone === 'dark' ? 'text-ink/45' : 'text-canvas/50';

  useEffect(() => {
    let frameId = 0;

    const formatLabel = (value: string) =>
      value
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

    const labelForSection = (section: HTMLElement) => {
      const explicitLabel = section.dataset.scrollLabel ?? section.getAttribute('aria-label');
      const sourceLabel = explicitLabel ?? (section.id ? formatLabel(section.id) : section.querySelector('h1, h2, h3')?.textContent);
      const label = formatLabel(sourceLabel ?? 'Section');
      return label.length > 24 ? `${label.slice(0, 22).trim()}...` : label;
    };

    const updateLabel = () => {
      frameId = 0;

      const candidates = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-label], section, article[id], main[id]'));
      const probeY = Math.max(120, window.innerHeight * 0.34);
      let activeLabel = 'Top';

      candidates.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          activeLabel = labelForSection(section);
        }
      });

      setSectionLabel((current) => (current === activeLabel ? current : activeLabel));
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateLabel);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return (
    <div className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-[1px] h-32 ${trackClass} z-50 pointer-events-none hidden md:block`}>
      <motion.div
        className={`w-full ${barClass} origin-top`}
        style={{ scaleY, height: '100%' }}
      />
      <div className={`absolute -left-2 top-0 mt-3 max-w-28 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[8px] uppercase tracking-[0.22em] ${textClass} -translate-x-full`}>
        {sectionLabel}
      </div>
      <div className={`absolute -left-2 bottom-0 mb-3 font-sans text-[8px] transform -translate-x-full ${textClass} uppercase tracking-[0.3em]`}>
        End
      </div>
    </div>
  );
}
