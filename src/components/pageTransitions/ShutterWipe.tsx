import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

declare global {
  interface Window {
    triggerShutter?: (active: boolean) => void;
  }
}

type ShutterWipeProps = {
  panels?: number;
  panelClassName?: string;
  wrapperClassName?: string;
  duration?: number;
  delayStep?: number;
};

export function ShutterWipe({
  panels = 5,
  panelClassName = 'bg-ink border-r border-canvas/5',
  wrapperClassName = 'fixed inset-0 z-[200] pointer-events-none flex h-screen w-screen',
  duration = 0.6,
  delayStep = 0.05,
}: ShutterWipeProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    window.triggerShutter = (active: boolean) => {
      setIsActive(active);
    };

    return () => {
      delete window.triggerShutter;
    };
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <div className={wrapperClassName} aria-hidden="true">
          {Array.from({ length: panels }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-full pointer-events-auto ${panelClassName}`}
              style={{ width: `${100 / panels}%` }}
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{
                type: 'tween',
                ease: [0.76, 0, 0.24, 1],
                duration,
                delay: index * delayStep,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
