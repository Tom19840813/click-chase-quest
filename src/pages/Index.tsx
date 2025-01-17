import React, { useState, useMemo, useCallback } from 'react';
import Square from '../components/Square';
import Compass from '../components/Compass';

const PixelHunter = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [targetSquare, setTargetSquare] = useState(() => Math.floor(Math.random() * 10000));
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  
  const calculateCompassAngle = useCallback((clickedIndex: number) => {
    if (clickedIndex === null) return 0;
    
    const gridSize = 100;
    const targetX = targetSquare % gridSize;
    const targetY = Math.floor(targetSquare / gridSize);
    const clickedX = clickedIndex % gridSize;
    const clickedY = Math.floor(clickedIndex / gridSize);
    
    const deltaX = targetX - clickedX;
    const deltaY = targetY - clickedY;
    
    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI + 90; // Add 90 to point upwards
    
    return angleDeg;
  }, [targetSquare]);

  const handleInteraction = useCallback((index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (clickCount >= 100 || isWon) return;
    
    setClickCount(prev => prev + 1);
    setLastClickedIndex(index);
    
    if (index === targetSquare) {
      setIsWon(true);
    }
  }, [clickCount, isWon, targetSquare]);

  const resetGame = useCallback(() => {
    setClickCount(0);
    setIsWon(false);
    setTargetSquare(Math.floor(Math.random() * 10000));
    setLastClickedIndex(null);
  }, []);

  const compassAngle = useMemo(() => 
    lastClickedIndex !== null ? calculateCompassAngle(lastClickedIndex) : 0,
    [lastClickedIndex, calculateCompassAngle]
  );

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

      <Compass angle={compassAngle} />

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