import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getMuted, setMuted } from '../utils/audio';

export function AudioWaveToggle() {
  const [muted, setMutedState] = useState(true); // Default to muted since browser blocks audio on start until interaction

  useEffect(() => {
    // Sync with global state once mounted (loads from localStorage)
    setMutedState(getMuted());
  }, []);

  const handleToggle = () => {
    const nextState = !muted;
    setMutedState(nextState);
    setMuted(nextState);
  };

  return (
    <button
      onClick={handleToggle}
      className="hover-target flex items-center gap-3 cursor-pointer focus:outline-none py-1 select-none pointer-events-auto transition-opacity hover:opacity-80"
      aria-label={muted ? 'Unmute interface sounds' : 'Mute interface sounds'}
      data-cursor-text={muted ? 'UNMUTE' : 'MUTE'}
    >
      <span className="font-sans text-[8px] tracking-[0.25em] opacity-60 uppercase font-medium">
        {muted ? 'SOUND OFF' : 'SOUND ON'}
      </span>
      <div className="flex items-end justify-center gap-[2.5px] h-3 w-5">
        {[0, 1, 2, 3].map((index) => {
          // Bouncing heights for the soundwave bars
          const minH = 2;
          const maxH = index === 0 || index === 3 ? 8 : 12;
          const speed = index === 0 ? 0.7 : index === 1 ? 0.9 : index === 2 ? 0.6 : 0.8;

          return (
            <motion.span
              key={index}
              className="w-[1.5px] bg-current rounded-full origin-bottom"
              style={{ height: minH }}
              animate={
                muted
                  ? { height: minH }
                  : {
                      height: [minH, maxH, minH],
                      transition: {
                        duration: speed,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.1,
                      },
                    }
              }
            />
          );
        })}
      </div>
    </button>
  );
}

export default AudioWaveToggle;
