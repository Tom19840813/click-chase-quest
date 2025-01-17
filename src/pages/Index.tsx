import React, { useState, useMemo, useCallback } from 'react';
import Square from '../components/Square';
import Compass from '../components/Compass';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const PixelHunter = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [targetSquare, setTargetSquare] = useState(() => Math.floor(Math.random() * 10000));
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  
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
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    setLastClickedIndex(index);
    
    if (index === targetSquare) {
      setIsWon(true);
    } else if (newClickCount === 100) {
      toast({
        title: "Game Over!",
        description: "You've run out of clicks. The target has been revealed!",
        variant: "destructive",
      });
    }
  }, [clickCount, isWon, targetSquare, toast]);

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
        isWon={isWon || clickCount >= 100}
        onInteraction={handleInteraction}
      />
    )),
    [targetSquare, isWon, handleInteraction, clickCount]
  );

  const handleDownload = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixel Hunter Game</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .grid-cols-100 {
            grid-template-columns: repeat(100, minmax(0, 1fr));
        }
    </style>
</head>
<body>
    <div class="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gradient-to-b from-blue-50 to-white">
        <h1 class="text-3xl font-bold mb-4 text-blue-900">Pixel Hunter</h1>
        
        <div id="clickCounter" class="text-2xl font-bold mb-4 text-blue-800">
            Clicks: 0/100
        </div>

        <div id="compass" class="relative w-16 h-16 mb-4">
            <div class="absolute inset-0 border-2 border-blue-500 rounded-full">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
                          border-l-[8px] border-l-transparent
                          border-b-[16px] border-b-red-500
                          border-r-[8px] border-r-transparent">
                </div>
            </div>
        </div>

        <div class="w-[300px] h-[300px] border-2 border-blue-300 rounded-lg shadow-lg overflow-hidden touch-none">
            <div id="grid" class="grid grid-cols-100 w-full h-full">
            </div>
        </div>

        <div id="gameStatus" class="text-xl font-bold text-center"></div>
        
        <button id="resetButton" 
                class="hidden px-6 py-3 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 active:bg-blue-700 
                       transform transition-transform hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-blue-400">
            New Game
        </button>
    </div>

    <script>
        class PixelHunterGame {
            constructor() {
                this.clickCount = 0;
                this.isWon = false;
                this.targetSquare = Math.floor(Math.random() * 10000);
                this.lastClickedIndex = null;
                this.setupGame();
            }

            setupGame() {
                const grid = document.getElementById('grid');
                grid.innerHTML = '';
                
                for (let i = 0; i < 10000; i++) {
                    const square = document.createElement('div');
                    square.className = 'w-full h-full cursor-pointer bg-blue-200 hover:bg-blue-300 active:bg-blue-300 transition-colors duration-150';
                    square.addEventListener('click', () => this.handleSquareClick(i));
                    grid.appendChild(square);
                }

                this.updateUI();
            }

            calculateCompassAngle(clickedIndex) {
                const gridSize = 100;
                const targetX = this.targetSquare % gridSize;
                const targetY = Math.floor(this.targetSquare / gridSize);
                const clickedX = clickedIndex % gridSize;
                const clickedY = Math.floor(clickedIndex / gridSize);
                
                const deltaX = targetX - clickedX;
                const deltaY = targetY - clickedY;
                
                const angleRad = Math.atan2(deltaY, deltaX);
                return (angleRad * 180) / Math.PI + 90;
            }

            handleSquareClick(index) {
                if (this.clickCount >= 100 || this.isWon) return;
                
                this.clickCount++;
                this.lastClickedIndex = index;
                
                if (index === this.targetSquare) {
                    this.isWon = true;
                }
                
                this.updateUI();
                
                if (this.clickCount === 100 && !this.isWon) {
                    this.showGameOver();
                }
            }

            updateUI() {
                document.getElementById('clickCounter').textContent = \`Clicks: \${this.clickCount}/100\`;
                
                if (this.lastClickedIndex !== null) {
                    const compass = document.getElementById('compass').firstElementChild;
                    compass.style.transform = \`rotate(\${this.calculateCompassAngle(this.lastClickedIndex)}deg)\`;
                }
                
                const gameStatus = document.getElementById('gameStatus');
                const resetButton = document.getElementById('resetButton');
                
                if (this.isWon) {
                    gameStatus.textContent = \`You won! Found it in \${this.clickCount} tries!\`;
                    gameStatus.className = 'text-green-600 text-xl font-bold text-center animate-bounce';
                    resetButton.classList.remove('hidden');
                    this.revealTarget();
                } else if (this.clickCount >= 100) {
                    this.showGameOver();
                }
            }

            showGameOver() {
                const gameStatus = document.getElementById('gameStatus');
                gameStatus.textContent = 'Game Over! No more tries left.';
                gameStatus.className = 'text-red-600 text-xl font-bold text-center';
                document.getElementById('resetButton').classList.remove('hidden');
                this.revealTarget();
            }

            revealTarget() {
                const squares = document.getElementById('grid').children;
                squares[this.targetSquare].innerHTML = '<div class="w-[5px] h-[5px] bg-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>';
            }

            reset() {
                this.clickCount = 0;
                this.isWon = false;
                this.targetSquare = Math.floor(Math.random() * 10000);
                this.lastClickedIndex = null;
                document.getElementById('gameStatus').textContent = '';
                document.getElementById('resetButton').classList.add('hidden');
                document.getElementById('compass').firstElementChild.style.transform = 'rotate(0deg)';
                this.setupGame();
            }
        }

        const game = new PixelHunterGame();
        document.getElementById('resetButton').addEventListener('click', () => game.reset());
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pixel-hunter-game.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold mb-4 text-blue-900">Pixel Hunter</h1>
        <Button
          onClick={handleDownload}
          className="mb-4"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Game
        </Button>
      </div>
      
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
