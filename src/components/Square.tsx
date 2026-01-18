import React, { memo } from 'react';

interface SquareProps {
  index: number;
  isTarget: boolean;
  isWon: boolean;
  isClicked: boolean;
  proximityColor?: string;
  onInteraction: (index: number) => void;
}

const Square: React.FC<SquareProps> = memo(({ index, isTarget, isWon, isClicked, proximityColor, onInteraction }) => {
  // Determine color based on state
  let bgColor = 'rgba(139, 92, 246, 0.05)'; // Default: Dark subtle violet
  let borderStyle = 'border-white/5';

  if (isClicked) {
    // Brighter, neon-inspired color for used spaces
    bgColor = 'rgba(139, 92, 246, 0.4)'; // Vibrant Violet
    borderStyle = 'border-violet-400/30';
  }

  // Scanned areas take priority visually
  if (proximityColor) {
    bgColor = proximityColor;
  }

  return (
    <div
      className={`w-full h-full cursor-crosshair transition-all duration-200 relative border-[0.1px] 
        ${borderStyle}
        ${isClicked ? 'shadow-[inset_0_0_8px_rgba(139,92,246,0.2)]' : 'hover:bg-white/10'}
        ${isClicked && !isWon ? 'bg-violet-500/40' : ''}
      `}
      style={{ backgroundColor: bgColor }}
      onClick={() => onInteraction(index)}
    >
      {/* Glow dot for used spaces */}
      {isClicked && !isWon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]"></div>
        </div>
      )}

      {/* Target Reveal - High Voltage Cyan */}
      {isWon && isTarget && (
        <div className="w-full h-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-pulse z-10 border-2 border-white"></div>
      )}
    </div>
  );
});

export default Square;