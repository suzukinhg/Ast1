import { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('interactive');
      
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        translateX: cursorX,
        translateY: cursorY,
        left: -12,
        top: -12,
      }}
      className="fixed pointer-events-none z-[9999] hidden md:block"
      animate={{
        scale: isHovering ? 2.5 : 1,
      }}
    >
      <div className={`w-6 h-6 rounded-full border border-brand-primary/30 flex items-center justify-center transition-colors duration-300 ${isHovering ? 'bg-brand-primary/5 border-brand-primary/50' : ''}`}>
        <div className="w-1 h-1 bg-brand-primary rounded-full" />
      </div>
    </motion.div>
  );
}
