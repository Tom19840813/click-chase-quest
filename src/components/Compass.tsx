import React from 'react';

interface CompassProps {
  angle: number;
}

const Compass: React.FC<CompassProps> = ({ angle }) => {
  return (
    <div className="relative w-16 h-16 mb-4">
      <div 
        className="absolute inset-0 border-2 border-blue-500 rounded-full"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
                      border-l-[8px] border-l-transparent
                      border-b-[16px] border-b-red-500
                      border-r-[8px] border-r-transparent
                      origin-center" 
             style={{ transform: 'rotate(-90deg)' }} />
      </div>
    </div>
  );
};

export default Compass;