import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export function SmoothCursor() {
  const mouseX = useMotionValue(-100); // Start offscreen
  const mouseY = useMotionValue(-100);
  
  const springX = useSpring(mouseX, { damping: 25, stiffness: 250, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 250, mass: 0.5 });

  const dotX = useTransform(mouseX, v => v - 6);
  const dotY = useTransform(mouseY, v => v - 6);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isSquare, setIsSquare] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('View');

  // We can't interpolate width/height based on state directly via useTransform,
  // but framer motion handles the `isSquare` change smoothly via `animate` on the component.
  // The position itself will be purely driven by useSpring without state re-renders.

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;

      const isInteractive = target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hover-target') ||
        target.closest('.hover-target');

      const labelTarget = target.closest('[data-cursor-text]') as HTMLElement | null;
      const label = labelTarget?.dataset.cursorText || 'View';
      const isSocialOrSquare = target.closest('[data-cursor-square="true"]') || target.classList.contains('social-link');

      if (isInteractive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
      
      setCursorLabel(label);
      setIsSquare(!!isSocialOrSquare);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Small dot follower */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          willChange: 'transform'
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
      />
      {/* Outer ring / Square */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99] mix-blend-difference flex items-center justify-center transition-colors"
        style={{
          x: useTransform(springX, v => isSquare ? v - 60 : cursorLabel !== 'View' ? v - 46 : v - 24),
          y: useTransform(springY, v => isSquare ? v - 15 : cursorLabel !== 'View' ? v - 17 : v - 24),
          willChange: 'transform, width, height, border-radius'
        }}
        initial={{
          backgroundColor: 'rgba(255, 255, 255, 0)',
        }}
        animate={{
          width: isSquare ? 120 : cursorLabel !== 'View' ? 92 : 48,
          height: isSquare ? 30 : cursorLabel !== 'View' ? 34 : 48,
          borderRadius: isSquare ? '0%' : cursorLabel !== 'View' ? '999px' : '50%',
          scale: isHovering && !isSquare ? 1.5 : 1,
          backgroundColor: isHovering || isSquare ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          border: isHovering || isSquare ? 'none' : '1px solid rgba(255, 255, 255, 0.5)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering && !isSquare ? 1 : 0 }}
          className="text-[8px] font-sans tracking-widest uppercase text-black font-medium absolute mix-blend-normal"
        >
          {cursorLabel}
        </motion.span>
      </motion.div>
    </>
  );
}
