import React from 'react';

interface SquareProps {
  index: number;
  isTarget: boolean;
  isWon: boolean;
  onInteraction: (index: number, e: React.MouseEvent | React.TouchEvent) => void;
}

const Square: React.FC<SquareProps> = ({ index, isTarget, isWon, onInteraction }) => {
  return (
    <div
      className={`w-full h-full cursor-zoom-in bg-blue-200 hover:bg-blue-300 active:bg-blue-300 transition-colors duration-150 relative`}
      onClick={(e) => onInteraction(index, e)}
      onTouchStart={(e) => onInteraction(index, e)}
    >
      {isWon && isTarget && (
        <div className="w-[5px] h-[5px] bg-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      )}
    </div>
  );
};

export default Square;