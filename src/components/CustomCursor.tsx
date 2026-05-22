import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Check if device supports hover (typically false for touch devices)
    const mediaQuery = window.matchMedia('(hover: none)');
    if (mediaQuery.matches) {
      setIsHidden(true);
      return;
    }

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverElement = target.closest('.hover-target');
      
      if (hoverElement) {
        setIsHovering(true);
        const text = hoverElement.getAttribute('data-cursor-text');
        setHoverText(text || '');
      } else {
        setIsHovering(false);
        setHoverText('');
      }
    };
    
    const handleMouseLeaveWindow = () => setIsHidden(true);
    const handleMouseEnterWindow = () => setIsHidden(false);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-canvas pointer-events-none z-[100]"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      />
      
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-canvas/40 pointer-events-none z-[100] backdrop-blur-[2px]"
        animate={{
          x: position.x - (isHovering ? 40 : 12),
          y: position.y - (isHovering ? 40 : 12),
          width: isHovering ? 80 : 24,
          height: isHovering ? 80 : 24,
          backgroundColor: isHovering ? 'rgba(235, 232, 225, 0.1)' : 'rgba(235, 232, 225, 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.5 }}
      >
        <AnimatePresence>
          {isHovering && hoverText && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[9px] uppercase tracking-[0.2em] text-canvas font-sans mix-blend-difference"
            >
              {hoverText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
