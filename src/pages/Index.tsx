import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Square from '../components/Square';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Zap, Target, Binary, Trophy, Cpu, Layers, Settings2 } from "lucide-react";

const DIFFICULTIES = {
  EASY: { label: 'EASY', size: 25, energyCost: 1, reward: 20 },
  MEDIUM: { label: 'MEDIUM', size: 50, energyCost: 2, reward: 50 },
  HARD: { label: 'HARD', size: 100, energyCost: 5, reward: 200 },
};

const CyberHunt = () => {
  // Global Persistence
  const [level, setLevel] = useState(() => Number(localStorage.getItem('cyberhunt_level')) || 1);
  const [exp, setExp] = useState(() => Number(localStorage.getItem('cyberhunt_exp')) || 0);
  const [pixels, setPixels] = useState(() => Number(localStorage.getItem('cyberhunt_pixels')) || 0);

  // Game Configuration
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.MEDIUM);
  const [energy, setEnergy] = useState(100);

  // Session State
  const [isWon, setIsWon] = useState(false);
  const [targetSquare, setTargetSquare] = useState(0);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());
  const [scanResult, setScanResult] = useState<Record<number, string>>({});

  const { toast } = useToast();

  const totalPixels = difficulty.size * difficulty.size;

  useEffect(() => {
    localStorage.setItem('cyberhunt_level', level.toString());
    localStorage.setItem('cyberhunt_exp', exp.toString());
    localStorage.setItem('cyberhunt_pixels', pixels.toString());
  }, [level, exp, pixels]);

  // Initial Target Placement
  useEffect(() => {
    setTargetSquare(Math.floor(Math.random() * (difficulty.size * difficulty.size)));
  }, [difficulty]);

  const getDistance = (i1: number, i2: number) => {
    const s = difficulty.size;
    const x1 = i1 % s;
    const y1 = Math.floor(i1 / s);
    const x2 = i2 % s;
    const y2 = Math.floor(i2 / s);
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const handleInteraction = useCallback((index: number) => {
    if (energy < difficulty.energyCost || isWon || clickedIndices.has(index)) return;

    setEnergy(prev => Math.max(0, prev - difficulty.energyCost));
    setClickedIndices(prev => new Set(prev).add(index));
    setLastClickedIndex(index);

    if (index === targetSquare) {
      setIsWon(true);
      setPixels(prev => prev + difficulty.reward);
      setExp(prev => prev + (difficulty.reward / 2));
      toast({
        title: "CORE BREACHED",
        description: `Target acquired. +${difficulty.reward} Pixels.`,
      });
    }
  }, [energy, isWon, targetSquare, difficulty, clickedIndices, toast]);

  const useSonarScan = () => {
    if (energy < 20) return;
    setEnergy(prev => prev - 20);

    const newScan: Record<number, string> = {};
    for (let i = 0; i < totalPixels; i++) {
      const dist = getDistance(i, targetSquare);
      if (dist < (difficulty.size / 5)) {
        newScan[i] = dist < 2 ? 'rgba(34, 211, 238, 0.4)' : 'rgba(139, 92, 246, 0.2)';
      }
    }
    setScanResult(newScan);
    setTimeout(() => setScanResult({}), 2000);
  };

  const resetGame = () => {
    setIsWon(false);
    setTargetSquare(Math.floor(Math.random() * totalPixels));
    setLastClickedIndex(null);
    setClickedIndices(new Set());
    setScanResult({});
    setEnergy(100);
  };

  const changeDifficulty = (newDiff: typeof DIFFICULTIES.EASY) => {
    setDifficulty(newDiff);
    resetGame();
  };

  return (
    <div className="min-h-screen app-shell bg-[#030305] text-white flex flex-col md:flex-row p-6 gap-8">
      {/* Sidebar: Stats & Settings */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-80 space-y-6"
      >
        <div className="glass neon-border p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black tracking-tighter">QUEST v2.1</h1>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-white/40">NEURAL ENERGY</span>
              <span className="text-xl font-mono text-cyan-400">{energy.toFixed(0)}/100</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${energy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="glass p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Settings2 size={14} />
            <span className="text-[10px] font-bold tracking-[0.2em]">DIFFICULTY SELECT</span>
          </div>
          <div className="flex flex-col gap-2">
            {Object.values(DIFFICULTIES).map((d) => (
              <Button
                key={d.label}
                variant={difficulty.label === d.label ? "default" : "outline"}
                className={`h-10 justify-start font-bold text-xs tracking-widest ${difficulty.label === d.label ? 'bg-cyan-400 text-black' : 'border-white/5 text-white/40'}`}
                onClick={() => changeDifficulty(d)}
              >
                {d.label} ({d.size}x{d.size})
              </Button>
            ))}
          </div>
        </div>

        {/* Powerups */}
        <div className="glass p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold tracking-widest text-white/50">UTILITIES</h3>
          <Button
            className="w-full justify-between h-14 bg-white/5 hover:bg-white/10 border-white/5"
            onClick={useSonarScan}
            disabled={energy < 20 || isWon}
          >
            <div className="flex items-center gap-3">
              <Binary size={18} className="text-cyan-400" />
              <span>Sonar Scan</span>
            </div>
            <span className="text-xs opacity-50">20 NRG</span>
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
          <div className="flex justify-center gap-4">
            <span className="text-cyan-400/60 font-mono text-[10px] tracking-[0.3em]">SEC: {difficulty.label}</span>
            <span className="text-violet-400/60 font-mono text-[10px] tracking-[0.3em]">REWARD: {difficulty.reward}px</span>
          </div>
        </div>

        <div className="relative p-2 glass rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div
            className="grid w-[300px] h-[300px] md:w-[600px] md:h-[600px] overflow-hidden rounded-xl border border-white/10"
            style={{
              gridTemplateColumns: `repeat(${difficulty.size}, 1fr)`,
              gridTemplateRows: `repeat(${difficulty.size}, 1fr)`
            }}
          >
            {Array.from({ length: totalPixels }).map((_, i) => (
              <Square
                key={`${difficulty.label}-${i}`}
                index={i}
                isTarget={i === targetSquare}
                isWon={isWon}
                isClicked={clickedIndices.has(i)}
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
                <h3 className="text-4xl font-black mb-2">NODE SECURED</h3>
                <p className="text-cyan-400 font-mono mb-8">System synchronization complete.</p>
                <Button
                  size="lg"
                  className="bg-cyan-400 text-black font-black hover:bg-cyan-300 px-12 rounded-full"
                  onClick={resetGame}
                >
                  NEW SESSION
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-8 font-mono text-xs text-white/30">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-cyan-400" />
            <span>TRIED: {clickedIndices.size} NODES</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            <span>REMAINING: {totalPixels - clickedIndices.size}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CyberHunt;
