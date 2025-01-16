import React, { useState, useMemo, useCallback } from 'react';

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
      w-full h-full cursor-pointer
      ${isTarget && isWon ? 'bg-black' : 'bg-blue-200'}
      hover:bg-blue-300 active:bg-blue-300
      transition-colors duration-150
    `}
  />
);

const PixelHunter = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [targetSquare, setTargetSquare] = useState(() => Math.floor(Math.random() * 10000));
  
  const handleInteraction = useCallback((index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (clickCount >= 100 || isWon) return;
    
    setClickCount(prev => prev + 1);
    
    if (index === targetSquare) {
      setIsWon(true);
    }
  }, [clickCount, isWon, targetSquare]);

  const resetGame = useCallback(() => {
    setClickCount(0);
    setIsWon(false);
    setTargetSquare(Math.floor(Math.random() * 10000));
  }, []);

  const squares = useMemo(() => 
    Array.from({ length: 10000 }).map((_, index) => (
      <Square
        key={index}
        index={index}
        isTarget={index === targetSquare}
        isWon={isWon}
        onInteraction={handleInteraction}
      />
    )),
    [targetSquare, isWon, handleInteraction]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-3xl font-bold mb-4 text-blue-900">Pixel Hunter</h1>
      
      <div className="text-2xl font-bold mb-4 text-blue-800">
        Clicks: {clickCount}/100
      </div>

      <div 
        className="w-[300px] h-[300px] border-2 border-blue-300 rounded-lg shadow-lg overflow-hidden touch-none"
        aria-label="Pixel hunting grid"
      >
        <div className="grid grid-cols-100 w-full h-full">
          {squares}
        </div>
      </div>

      {isWon && (
        <div className="text-green-600 text-xl font-bold text-center animate-bounce">
          You won! Found it in {clickCount} tries!
        </div>
      )}

      {clickCount >= 100 && !isWon && (
        <div className="text-red-600 text-xl font-bold text-center">
          Game Over! No more tries left.
        </div>
      )}

      {(clickCount >= 100 || isWon) && (
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 active:bg-blue-700 
                   transform transition-transform hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default PixelHunter;