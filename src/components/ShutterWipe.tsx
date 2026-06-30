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
        <div className="fixed inset-0 z-[200] pointer-events-none flex w-screen h-screen">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div 
              key={i}
              className="h-full bg-ink border-r border-canvas/5 pointer-events-auto"
              style={{ width: '20%' }}
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: 'tween',
                ease: [0.76, 0, 0.24, 1],
                duration: 0.6,
                delay: i * 0.05
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
