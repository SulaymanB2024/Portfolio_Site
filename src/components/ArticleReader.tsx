import { motion } from 'motion/react';
import { useEffect } from 'react';
import { getMarketThesisByIndex } from '../content/marketTheses';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ArticleReaderProps {
  isOpen: boolean;
  onClose: () => void;
  thesisId: number;
}

export default function ArticleReader({ isOpen, onClose, thesisId }: ArticleReaderProps) {
  const data = getMarketThesisByIndex(thesisId);
  const readerRef = useFocusTrap(isOpen);
  const titleId = `memo-reader-title-${data.slug}`;
  const subtitleId = `memo-reader-subtitle-${data.slug}`;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Slide Panel */}
      <motion.div
        ref={readerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%', transition: { duration: 0.24, ease: 'easeInOut' } }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full w-full max-w-4xl flex-col border-l border-canvas/12 bg-ink text-canvas shadow-2xl md:flex-row"
      >
        {/* Dotted grid texture background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, var(--color-canvas) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Left sidebar / Metadata */}
        <div className="relative z-10 flex flex-col justify-between border-b border-canvas/12 p-6 md:w-80 md:border-b-0 md:border-r md:p-8 shrink-0">
          <div className="space-y-8 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.32em] text-canvas/45">MEMO {data.number}</span>
              <button
                id="memo-reader-close-btn"
                onClick={onClose}
                aria-label="Close memo reader"
                className="text-[9px] uppercase tracking-[0.25em] text-canvas/54 hover:text-canvas border border-canvas/16 px-2.5 py-1.5 transition-colors bg-ink"
              >
                [ CLOSE ]
              </button>
            </div>

            <div className="border-t border-canvas/12 pt-6 space-y-4">
              <div>
                <div className="text-[8px] uppercase tracking-[0.24em] text-canvas/42 mb-1">DATE</div>
                <div className="text-[10px] tracking-[0.16em] font-sans text-canvas/80">{data.date}</div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-[0.24em] text-canvas/42 mb-1">READ TIME</div>
                <div className="text-[10px] tracking-[0.16em] font-sans text-canvas/80">{data.readTime}</div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-[0.24em] text-canvas/42 mb-1">AUTHOR</div>
                <div className="text-[10px] tracking-[0.16em] uppercase text-canvas/80">{data.author}</div>
              </div>
            </div>

            <div className="border-t border-canvas/12 pt-6">
              <div className="text-[9px] uppercase tracking-[0.24em] text-canvas/45 mb-4">RESEARCH INDICATORS</div>
              <div className="space-y-3.5 text-[9.5px] uppercase tracking-[0.18em]">
                <div className="flex justify-between border-b border-canvas/8 pb-2">
                  <span className="text-canvas/48">CONFIDENCE</span>
                  <span className="text-accent font-semibold">{data.conviction}</span>
                </div>
                <div className="flex justify-between border-b border-canvas/8 pb-2">
                  <span className="text-canvas/48">HORIZON</span>
                  <span className="text-canvas/80">{data.horizon}</span>
                </div>
                <div className="flex justify-between border-b border-canvas/8 pb-2">
                  <span className="text-canvas/48">SAMPLE WEIGHT</span>
                  <span className="text-canvas/80 font-sans">{data.allocation}</span>
                </div>
              </div>
            </div>

            <a
              href={`/markets/${data.slug}`}
              className="inline-flex w-fit border border-canvas/16 px-3 py-2 text-[9px] uppercase tracking-[0.22em] text-canvas/62 transition-colors hover:border-canvas/36 hover:text-canvas"
            >
              Open canonical page
            </a>
          </div>

          <div className="hidden md:block text-[8px] leading-relaxed text-canvas/32 font-sans uppercase tracking-[0.18em] border-t border-canvas/12 pt-6">
            VOID PORTFOLIO RESEARCH SYSTEM //
            <br />
            CONFIDENTIAL ACADEMIC MEMORANDUM.
          </div>
        </div>

        {/* Right scrollable panel for long-form reading */}
        <div className="relative z-10 flex-grow overflow-y-auto px-6 py-8 md:p-12 lg:p-16 select-text">
          {/* Decorative Corner marks (Real CSS Borders) */}
          <div className="pointer-events-none absolute top-4 left-4 h-3 w-3 border-t border-l border-canvas/20" />
          <div className="pointer-events-none absolute top-4 right-4 h-3 w-3 border-t border-r border-canvas/20" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-canvas/20" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-canvas/20" />

          <article className="max-w-2xl">
            <span className="text-[9.5px] font-medium uppercase tracking-[0.38em] text-accent">{data.category}</span>
            
            <h1 id={titleId} className="mt-4 font-serif text-3xl italic leading-[1.12] text-canvas md:text-4xl lg:text-5xl">
              {data.title}
            </h1>
            
            <p id={subtitleId} className="mt-6 text-sm italic leading-relaxed text-canvas/64 border-l-2 border-canvas/24 pl-4">
              {data.subtitle}
            </p>

            <hr className="my-10 border-canvas/12 border-dashed" />

            {/* Content blocks with Dropcap in the first block */}
            <div className="space-y-8 text-base leading-relaxed text-canvas/72 font-sans">
              {data.content.map((paragraph, index) => {
                if (index === 0) {
                  const firstChar = paragraph.charAt(0);
                  const rest = paragraph.slice(1);
                  return (
                    <p key={index}>
                      <span className="float-left text-[3.85rem] font-serif italic mr-2.5 mt-1 leading-[0.8] text-accent select-none">
                        {firstChar}
                      </span>
                      {rest}
                    </p>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>

            {/* Monetarist / Quantitative Formula Box */}
            <div className="my-10 border border-canvas/12 bg-ink p-6 relative overflow-hidden group">
              {/* Terminal Grid Background */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,var(--color-canvas)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-canvas)_1px,transparent_1px)] bg-[size:10px_10px]" />
              
              {/* Internal corner marks */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-canvas/20" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-canvas/20" />

              <div className="text-[8.5px] uppercase tracking-[0.24em] text-accent mb-4 text-center font-sans font-medium">
                {data.formulaLabel}
              </div>
              <div className="flex justify-center items-center py-8 border-y border-canvas/8 text-canvas text-base md:text-lg overflow-x-auto font-sans select-all bg-ink/30 shadow-inner">
                <span className="px-4 text-canvas filter drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-canvas)_15%,transparent)] font-semibold tracking-normal">{data.formula}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 text-[7.5px] text-canvas/34 tracking-[0.18em] font-sans sm:flex-row sm:justify-between">
                <span>QUANT_ENGINE // MODEL_0{data.number}</span>
                <span>COLLATERAL_RATIO // SECULAR_GROWTH</span>
              </div>
            </div>

            {/* Bottom Risk Segment */}
            <div className="mt-12 border-t border-canvas/12 pt-8">
              <h4 className="text-[10px] uppercase tracking-[0.28em] text-risk/80 mb-3">KEY RISK VECTOR</h4>
              <p className="text-xs leading-relaxed text-canvas/52">
                {data.risks}
              </p>
            </div>
          </article>
        </div>
      </motion.div>
    </motion.div>
  );
}
