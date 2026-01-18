import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Square from '../components/Square';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Zap, Target, Binary, Trophy, ShieldAlert, Cpu, Layers } from "lucide-react";

const GRID_SIZE = 100;
const TOTAL_PIXELS = GRID_SIZE * GRID_SIZE;

const CyberHunt = () => {
  // Game State
  const [level, setLevel] = useState(() => Number(localStorage.getItem('cyberhunt_level')) || 1);
  const [exp, setExp] = useState(() => Number(localStorage.getItem('cyberhunt_exp')) || 0);
  const [energy, setEnergy] = useState(100);
  const [pixels, setPixels] = useState(() => Number(localStorage.getItem('cyberhunt_pixels')) || 0);

  useEffect(() => {
    localStorage.setItem('cyberhunt_level', level.toString());
    localStorage.setItem('cyberhunt_exp', exp.toString());
    localStorage.setItem('cyberhunt_pixels', pixels.toString());
  }, [level, exp, pixels]);

  // Instance State
  const [clickCount, setClickCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [targetSquare, setTargetSquare] = useState(() => Math.floor(Math.random() * TOTAL_PIXELS));
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [scanResult, setScanResult] = useState<Record<number, string>>({});

  const { toast } = useToast();

  // Sounds (Mock)
  const playSound = (type: string) => {
    // In a real app we'd trigger Audio objects
    console.log(`Playing sound: ${type}`);
  };

  const getDistance = (i1: number, i2: number) => {
    const x1 = i1 % GRID_SIZE;
    const y1 = Math.floor(i1 / GRID_SIZE);
    const x2 = i2 % GRID_SIZE;
    const y2 = Math.floor(i2 / GRID_SIZE);
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const handleInteraction = useCallback((index: number) => {
    if (energy <= 0 || isWon) return;

    setClickCount(prev => prev + 1);
    setEnergy(prev => Math.max(0, prev - 1));
    setLastClickedIndex(index);

    if (index === targetSquare) {
      setIsWon(true);
      const winPixels = Math.max(10, 100 - clickCount);
      setPixels(prev => prev + winPixels);
      setExp(prev => prev + 50);
      playSound('win');
      toast({
        title: "CORE BREACHED",
        description: `Target acquired in ${clickCount + 1} cycles. +${winPixels} Pixels.`,
      });
    } else {
      playSound('click');
    }
  }, [energy, isWon, targetSquare, clickCount, toast]);

  // Powerups
  const useSonarScan = () => {
    if (energy < 20) return;
    setEnergy(prev => prev - 20);

    const newScan: Record<number, string> = {};
    for (let i = 0; i < TOTAL_PIXELS; i++) {
      const dist = getDistance(i, targetSquare);
      if (dist < 15) {
        newScan[i] = dist < 5 ? 'rgba(34, 211, 238, 0.3)' : 'rgba(139, 92, 246, 0.2)';
      }
    }
    setScanResult(newScan);
    setTimeout(() => setScanResult({}), 2000);
    playSound('scan');
  };

  const useNeuralOverload = () => {
    if (energy < 50) return;
    setEnergy(prev => prev - 50);
    // Eliminate random 20%
    toast({ title: "NEURAL OVERLOAD", description: "Filtering 2,000 irrelevant data nodes..." });
  };

  const resetGame = () => {
    setClickCount(0);
    setIsWon(false);
    setTargetSquare(Math.floor(Math.random() * TOTAL_PIXELS));
    setLastClickedIndex(null);
    setScanResult({});
  };

  return (
    <div className="min-h-screen app-shell bg-[#030305] text-white flex flex-col md:flex-row p-6 gap-8">
      {/* Sidebar: Stats */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-80 space-y-6"
      >
        <div className="glass neon-border p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black tracking-tighter">QUEST v2.0</h1>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-white/40">NEURAL ENERGY</span>
              <span className="text-xl font-mono text-cyan-400">{energy}/100</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${energy}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="glass p-3 rounded-xl border-white/5 text-center">
                <p className="text-[10px] font-bold text-white/40 mb-1">DATA PIXELS</p>
                <p className="text-lg font-mono text-yellow-500">{pixels}</p>
              </div>
              <div className="glass p-3 rounded-xl border-white/5 text-center">
                <p className="text-[10px] font-bold text-white/40 mb-1">EXP LEVEL</p>
                <p className="text-lg font-mono text-violet-400">{level}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold tracking-widest text-white/50">POWER-UPS</h3>
          <Button
            className="w-full justify-between h-14 bg-white/5 hover:bg-white/10 border-white/5"
            onClick={useSonarScan}
            disabled={energy < 20}
          >
            <div className="flex items-center gap-3">
              <Binary size={18} className="text-cyan-400" />
              <span>Sonar Scan</span>
            </div>
            <span className="text-xs opacity-50">20 NRG</span>
          </Button>
          <Button
            className="w-full justify-between h-14 bg-white/5 hover:bg-white/10 border-white/5"
            onClick={useNeuralOverload}
            disabled={energy < 50}
          >
            <div className="flex items-center gap-3">
              <Layers size={18} className="text-violet-400" />
              <span>Neural Overload</span>
            </div>
            <span className="text-xs opacity-50">50 NRG</span>
          </Button>
        </div>
      </motion.aside>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-8 relative">
        <div className="scanline"></div>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
            CYBER HUNT
          </h2>
          <p className="text-cyan-400/60 font-mono text-xs tracking-[0.5em]">LOCATE THE HIDDEN BIT</p>
        </div>

        <div className="relative p-2 glass rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-100 w-[300px] h-[300px] md:w-[600px] md:h-[600px] overflow-hidden rounded-xl border border-white/10">
            {Array.from({ length: TOTAL_PIXELS }).map((_, i) => (
              <Square
                key={i}
                index={i}
                isTarget={i === targetSquare}
                isWon={isWon}
                proximityColor={scanResult[i]}
                onInteraction={handleInteraction}
              />
            ))}
          </div>

          <AnimatePresence>
            {isWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-cyan-400/10 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-cyan-400/50"
              >
                <Trophy size={80} className="text-cyan-400 mb-4 animate-bounce" />
                <h3 className="text-4xl font-black mb-2">SYSTEM BREACHED</h3>
                <p className="text-cyan-400 font-mono mb-8">Node retrieved successfully.</p>
                <Button
                  size="lg"
                  className="bg-cyan-400 text-black font-black hover:bg-cyan-300 px-12 rounded-full"
                  onClick={resetGame}
                >
                  NEXT SECTOR
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-8 font-mono text-sm text-white/30">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-cyan-400" />
            <span>CYCLES: {clickCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            <span>Uptime: 99.9%</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CyberHunt;
