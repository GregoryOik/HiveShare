import React, { useState, useEffect } from 'react';

interface BeeTrailProps {
  enabled?: boolean;
}

export default function BeeCompanion({ enabled = true }: BeeTrailProps) {
  const [beePos, setBeePos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [facingLeft, setFacingLeft] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [buzzMessage, setBuzzMessage] = useState<string | null>(null);
  const [pollenCount, setPollenCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('hiveshare_pollen') || '0', 10);
    } catch {
      return 0;
    }
  });

  const beeSayings = [
    'Bzzzt! Raw enzymes at work! 🍯',
    '30,000 wings flap together!',
    'Petros says hello from Cape Tenaro! 🇬🇷',
    '84% wild thyme pollen collected!',
    'Never heated. Never pasteurized! ✨',
    'Bzz! Queen Penelope is laying well today 👑',
    'Arcadian fir trees are sweet this morning!',
  ];

  // Follow cursor with smooth delay
  useEffect(() => {
    let animId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // Keep slightly offset from pointer so it doesn't block clicks
      setTargetPos({ x: e.clientX + 24, y: e.clientY - 24 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      setBeePos(prev => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        
        if (Math.abs(dx) > 1) {
          setFacingLeft(dx < 0);
        }

        return {
          x: prev.x + dx * 0.08,
          y: prev.y + dy * 0.08,
        };
      });
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [targetPos]);

  const handleBeeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = pollenCount + 1;
    setPollenCount(newCount);
    try {
      localStorage.setItem('hiveshare_pollen', newCount.toString());
    } catch {
      // ignore
    }

    const randomQuote = beeSayings[Math.floor(Math.random() * beeSayings.length)];
    setBuzzMessage(randomQuote);
    setTimeout(() => {
      setBuzzMessage(null);
    }, 3200);
  };

  if (!enabled) return null;

  return (
    <div
      className="fixed pointer-events-none z-[999] transition-opacity duration-300 hidden md:block"
      style={{
        transform: `translate3d(${beePos.x}px, ${beePos.y}px, 0)`,
        left: 0,
        top: 0,
      }}
    >
      {/* Speech Bubble */}
      {buzzMessage && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-auto bg-[#2A1B0A] text-[#FFFDF7] text-[11px] font-mono py-1 px-2.5 rounded shadow-lg border border-honey/40 whitespace-nowrap animate-in fade-in zoom-in duration-200"
          style={{ zIndex: 1000 }}
        >
          {buzzMessage}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2A1B0A]" />
        </div>
      )}

      {/* Interactive Bee Avatar */}
      <button
        onClick={handleBeeClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Buzzy: Apiary scout bee. Click to collect pollen!"
        className={`pointer-events-auto cursor-pointer relative group p-1.5 focus:outline-none transition-transform duration-150 ${
          facingLeft ? '-scale-x-100' : 'scale-x-100'
        } ${isHovered ? 'scale-125' : 'scale-100'}`}
        aria-label="HiveShare Little Scout Bee"
      >
        <span className="text-xl select-none inline-block animate-bounce drop-shadow-[0_2px_8px_rgba(200,134,10,0.4)]">
          🐝
        </span>

        {/* Tiny golden pollen counter badge */}
        {pollenCount > 0 && (
          <span
            className={`absolute -bottom-1 -right-1 bg-honey text-[#2A1B0A] text-[9px] font-mono font-bold px-1 rounded-full shadow-xs border border-white/40 ${
              facingLeft ? '-scale-x-100' : ''
            }`}
          >
            {pollenCount}
          </span>
        )}
      </button>
    </div>
  );
}
