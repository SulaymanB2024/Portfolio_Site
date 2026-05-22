import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ShutterWipe() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    (window as any).triggerShutter = (active: boolean) => {
      setIsActive(active);
    };

    return () => {
      delete (window as any).triggerShutter;
    };
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-[200] pointer-events-auto flex flex-col">
          <motion.div 
            className="w-full h-1/2 bg-ink"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.8 }}
          />
          <motion.div 
            className="w-full h-1/2 bg-ink"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.8 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
