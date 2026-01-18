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
  let bgColor = 'rgba(139, 92, 246, 0.05)'; // Default

  if (isClicked) {
    bgColor = 'rgba(255, 255, 255, 0.1)'; // Clicked state
  }

  if (proximityColor) {
    bgColor = proximityColor;
  }

  return (
    <div
      className={`w-full h-full cursor-crosshair transition-all duration-300 relative border-[0.1px] border-white/5
        ${isClicked ? 'opacity-40' : 'hover:bg-white/10'}
      `}
      style={{ backgroundColor: bgColor }}
      onClick={() => onInteraction(index)}
    >
      {/* Visual indicator for a clicked square to make it obvious */}
      {isClicked && !isWon && (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      )}

      {/* Target Reveal */}
      {isWon && isTarget && (
        <div className="w-full h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse z-10"></div>
      )}
    </div>
  );
});

export default Square;