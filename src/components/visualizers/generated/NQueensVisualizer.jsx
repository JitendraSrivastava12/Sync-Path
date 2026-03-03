import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, LayoutGrid, ShieldAlert, CheckCircle2, Crown } from 'lucide-react';

export default function NQueensVisualizer() {
  const navigate = useNavigate();
  const N = 4; // Standard 4x4 for clear visualization
  
  // State Management
  const [board, setBoard] = useState(Array(N).fill(null).map(() => Array(N).fill(0)));
  const [currentPos, setCurrentPos] = useState({ row: -1, col: -1 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Backtracking Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def solve(col):\n  if col >= N: return True\n  for i in range(N):\n    if isSafe(i, col):\n      board[i][col] = 1\n      if solve(col + 1): return True\n      board[i][col] = 0 # Backtrack", comp: "O(N!) Complexity" },
    java: { logic: "boolean solve(int col) {\n  if (col >= N) return true;\n  for (int i = 0; i < N; i++) {\n    if (isSafe(i, col)) {\n      board[i][col] = 1;\n      if (solve(col + 1)) return true;\n      board[i][col] = 0;\n    }\n  }\n  return false;\n}", comp: "Recursive DFS" }
  };

  const isSafe = (grid, row, col) => {
    // Check row on left side
    for (let i = 0; i < col; i++) if (grid[row][i]) return false;
    // Check upper diagonal on left side
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (grid[i][j]) return false;
    // Check lower diagonal on left side
    for (let i = row, j = col; j >= 0 && i < N; i++, j--) if (grid[i][j]) return false;
    return true;
  };

  const solve = async (grid, col) => {
    if (col >= N) return true;

    for (let i = 0; i < N; i++) {
      setCurrentPos({ row: i, col });
      setStatus(`Testing Row ${i}, Col ${col}...`);
      await delay();

      if (isSafe(grid, i, col)) {
        grid[i][col] = 1;
        setBoard(grid.map(row => [...row]));
        setStatus(`Safe! Placing Queen at [${i}, ${col}]`);
        await delay();

        if (await solve(grid, col + 1)) return true;

        // BACKTRACK
        setStatus(`Dead end at Col ${col + 1}. Backtracking from [${i}, ${col}]...`);
        grid[i][col] = 0;
        setBoard(grid.map(row => [...row]));
        await delay();
      } else {
        setStatus(`Conflict detected at [${i}, ${col}]. Skipping...`);
      }
    }
    return false;
  };

  const startVisualizer = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const freshBoard = Array(N).fill(null).map(() => Array(N).fill(0));
    setBoard(freshBoard);
    
    const success = await solve(freshBoard, 0);
    setIsRunning(false);
    setCurrentPos({ row: -1, col: -1 });
    setStatus(success ? 'Solution Found!' : 'No Solution Exists for this N.');
  };

  const reset = () => {
    setBoard(Array(N).fill(null).map(() => Array(N).fill(0)));
    setCurrentPos({ row: -1, col: -1 });
    setIsRunning(false);
    setStatus('Board Cleared');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">N-Queens Solver</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the recursive backtracking state space and constraint satisfaction.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE CHESSBOARD ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          
          <div className="relative z-10 grid grid-cols-4 gap-2 md:gap-4 p-4 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
            {board.map((row, rIdx) => 
              row.map((cell, cIdx) => {
                const isCurrent = currentPos.row === rIdx && currentPos.col === cIdx;
                const isQueen = cell === 1;
                const isDark = (rIdx + cIdx) % 2 === 1;

                return (
                  <div 
                    key={`${rIdx}-${cIdx}`}
                    className={`w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                      isQueen ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-105' :
                      isCurrent ? 'bg-blue-600/40 border-blue-400 animate-pulse' :
                      isDark ? 'bg-white/5 border-transparent' : 'bg-transparent border-transparent'
                    }`}
                  >
                    {isQueen && <Crown size={32} className="text-white drop-shadow-lg" />}
                    {isCurrent && !isQueen && <div className="w-4 h-4 rounded-full bg-blue-400/50" />}
                  </div>
                )
              })
            )}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <LayoutGrid size={16} className="text-fuchsia-500" /> Solver Control
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Recursion Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="100" max="1500" step="100"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startVisualizer} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> START RECURSION
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET BOARD
                </button>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8 text-white">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                <Code2 size={16} className="text-fuchsia-500" /> Source Logic
              </h3>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[11px] font-black text-fuchsia-500 outline-none cursor-pointer uppercase">
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            <pre className="p-5 bg-black/40 rounded-2xl text-[10px] md:text-[11px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto whitespace-pre">
              {PSEUDO_CODE[language].logic}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}