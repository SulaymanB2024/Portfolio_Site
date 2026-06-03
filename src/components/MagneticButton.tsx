import { useRef, useState, useEffect, ReactNode } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  key?: any;
}

export function MagneticButton({ children, className = '', strength = 0.5 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stretch, setStretch] = useState({ scaleX: 1, scaleY: 1, rotate: 0 });

  const handleMouse = (e: MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const middleX = clientX - centerX;
    const middleY = clientY - centerY;
    
    setPosition({ x: middleX * strength, y: middleY * strength });

    // Stretch physics
    const distance = Math.sqrt(middleX * middleX + middleY * middleY);
    const maxDist = Math.max(width, height) / 2;
    const intensity = Math.min(distance / maxDist, 1);
    const angle = Math.atan2(middleY, middleX);

    setStretch({
      scaleX: 1 + (intensity * 0.15),
      scaleY: 1 - (intensity * 0.1),
      rotate: angle * (180 / Math.PI)
    });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setStretch({ scaleX: 1, scaleY: 1, rotate: 0 });
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouse);
      element.addEventListener('mouseleave', reset);
      return () => {
        element.removeEventListener('mousemove', handleMouse);
        element.removeEventListener('mouseleave', reset);
      };
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      className={`inline-block ${className}`}
    >
      <motion.div
        animate={{ 
          scaleX: stretch.scaleX, 
          scaleY: stretch.scaleY, 
          rotate: stretch.rotate 
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ transformOrigin: "center" }}
      >
        <motion.div 
          animate={{ rotate: -stretch.rotate }} 
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
