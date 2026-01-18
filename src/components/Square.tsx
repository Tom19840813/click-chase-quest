import React, { memo } from 'react';

interface SquareProps {
  index: number;
  isTarget: boolean;
  isWon: boolean;
  proximityColor?: string;
  onInteraction: (index: number, e: any) => void;
}

const Square: React.FC<SquareProps> = memo(({ index, isTarget, isWon, proximityColor, onInteraction }) => {
  return (
    <div
      className={`w-full h-full cursor-crosshair transition-all duration-300 relative border-[0.1px] border-white/5`}
      style={{ backgroundColor: proximityColor || 'rgba(139, 92, 246, 0.05)' }}
      onClick={(e) => onInteraction(index, e)}
    >
      {(isWon || proximityColor) && isTarget && (
        <div className="w-full h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
      )}
    </div>
  );
});

export default Square;