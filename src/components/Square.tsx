import React from 'react';

interface SquareProps {
  index: number;
  isTarget: boolean;
  isWon: boolean;
  onInteraction: (index: number, e: React.MouseEvent | React.TouchEvent) => void;
}

const Square: React.FC<SquareProps> = ({ index, isTarget, isWon, onInteraction }) => (
  <div
    role="button"
    tabIndex={0}
    aria-label={`Square ${index + 1}`}
    onTouchStart={(e) => onInteraction(index, e)}
    onClick={(e) => onInteraction(index, e)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onInteraction(index, e as unknown as React.MouseEvent);
      }
    }}
    className={`
      w-full h-full cursor-pointer relative
      ${isTarget && isWon ? 'after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[5px] after:h-[5px] after:bg-black' : 'bg-blue-200'}
      hover:bg-blue-300 active:bg-blue-300
      transition-colors duration-150
    `}
  />
);

export default Square;