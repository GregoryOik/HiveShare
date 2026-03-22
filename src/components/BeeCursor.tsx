import React, { useState, useEffect } from 'react';

interface BeeCursorProps {
  containerId?: string;
}

const BeeCursor = ({ containerId }: BeeCursorProps) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    let lastX = -100;
    let lastY = -100;

    const updatePosition = (e: MouseEvent) => {
      // If containerId is provided, only show cursor if over that container
      if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
          const rect = container.getBoundingClientRect();
          const shadowBuffer = 50; // Add a small buffer for smoother entry/exit
          const isOver = (
            e.clientX >= rect.left - shadowBuffer && 
            e.clientX <= rect.right + shadowBuffer && 
            e.clientY >= rect.top - shadowBuffer && 
            e.clientY <= rect.bottom + shadowBuffer
          );
          
          if (!isOver) {
            setIsVisible(false);
            return;
          }
        }
      }

      setIsVisible(true);
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        if (deltaX > 2) setIsFlipped(true);
        else if (deltaX < -2) setIsFlipped(false);

        const tilt = deltaY * 0.8;
        setRotation(Math.max(-35, Math.min(35, tilt)));
      } else {
        setRotation(0);
      }

      setPosition({ x: e.clientX, y: e.clientY });
      lastX = e.clientX;
      lastY = e.clientY;

      const target = e.target as HTMLElement;
      setIsHovering(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null
      );
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [containerId]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      <style>{`
        ${containerId ? `#${containerId}, #${containerId} *` : 'body, a, button, [role="button"], input, select, textarea, .cursor-pointer'} {
          cursor: none !important;
        }
      `}</style>
      <div 
        className="fixed pointer-events-none z-[9999] flex items-center justify-center transition-opacity duration-300"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.4 : 1})`,
          transition: 'transform 0.15s ease-out, opacity 0.3s ease-in-out',
          filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))',
          opacity: isVisible ? 1 : 0
        }}
      >
        <span 
          className="text-3xl leading-none" 
          style={{ 
            transform: `scaleX(${isFlipped ? -1 : 1}) rotate(${isFlipped ? -rotation : rotation}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          🐝
        </span>
      </div>
    </>
  );
};

export default BeeCursor;
