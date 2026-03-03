import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, LayoutGrid, ShieldAlert, CheckCircle2, Binary } from 'lucide-react';

export default function SudokuSolverVisualizer() {
  const navigate = useNavigate();
  
  // Initial partial board (0 represents empty)
  const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  // State Management
  const [board, setBoard] = useState(initialBoard.map(row => [...row]));
  const [currentCell, setCurrentCell] = useState({ r: -1, c: -1 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Solver Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(50); // Sudoku needs higher speed due to state density
  const [speed, setSpeed] = useState(50);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const isValid = (grid, r, c, k) => {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(c / 3) + i % 3;
      if (grid[r][i] === k || grid[i][c] === k || grid[m][n] === k) return false;
    }
    return true;
  };

  const solve = async (grid) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          setCurrentCell({ r, c });
          for (let k = 1; k <= 9; k++) {
            if (isValid(grid, r, c, k)) {
              grid[r][c] = k;
              setBoard(grid.map(row => [...row]));
              setStatus(`Placing ${k} at [${r}, ${c}]`);
              await delay();
              
              if (await solve(grid)) return true;

              // Backtrack
              grid[r][c] = 0;
              setBoard(grid.map(row => [...row]));
              setStatus(`Backtracking from [${r}, ${c}]...`);
              await delay();
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const startSolving = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const grid = board.map(row => [...row]);
    const success = await solve(grid);
    setIsRunning(false);
    setCurrentCell({ r: -1, c: -1 });
    setStatus(success ? 'Sudoku Solved!' : 'No Solution Found.');
  };

  const reset = () => {
    setBoard(initialBoard.map(row => [...row]));
    setCurrentCell({ r: -1, c: -1 });
    setIsRunning(false);
    setStatus('Engine Reset');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Sudoku Backtracker</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the O(9ⁿ) recursive search through the Sudoku state space.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE GRID ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 grid grid-cols-9 bg-white/5 p-1 rounded-xl border-4 border-white/10 shadow-2xl">
            {board.map((row, rIdx) => 
              row.map((cell, cIdx) => {
                const isActive = currentCell.r === rIdx && currentCell.c === cIdx;
                const isInitial = initialBoard[rIdx][cIdx] !== 0;
                const rightBorder = (cIdx + 1) % 3 === 0 && cIdx !== 8;
                const bottomBorder = (rIdx + 1) % 3 === 0 && rIdx !== 8;

                return (
                  <div 
                    key={`${rIdx}-${cIdx}`}
                    className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center font-mono text-sm md:text-lg transition-all duration-100 border ${
                      isActive ? 'bg-fuchsia-600 text-white z-20 scale-110 shadow-[0_0_20px_#d946ef88]' :
                      isInitial ? 'bg-white/5 text-blue-400 font-black' : 'text-gray-400'
                    } ${rightBorder ? 'border-r-4 border-r-white/20' : 'border-white/5'} ${bottomBorder ? 'border-b-4 border-b-white/20' : 'border-white/5'}`}
                  >
                    {cell !== 0 ? cell : ''}
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
              <Binary size={16} className="text-fuchsia-500" /> Computation Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Backtrack Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="1" max="500" step="10"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startSolving} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> RUN SOLVER
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET GRID
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}