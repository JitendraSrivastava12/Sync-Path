import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Target, Gauge, Code2, Zap, MoveHorizontal, CheckCircle2 } from 'lucide-react';

export default function TwoPointersVisualizer() {
  const navigate = useNavigate();
  
  // State Management (Pre-sorted for Two Sum logic)
  const [data] = useState([7, 11, 15, 18, 23, 29, 35]);
  const [targetSum, setTargetSum] = useState(30);
  const [pointers, setPointers] = useState({ left: 0, right: 6 });
  const [foundIndices, setFoundIndices] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Engine Standby');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(700);
  const [speed, setSpeed] = useState(700);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "l, r = 0, len(arr) - 1\nwhile l < r:\n    curr = arr[l] + arr[r]\n    if curr == target: return [l, r]\n    elif curr < target: l += 1\n    else: r -= 1", comp: "O(n) - Single Pass" },
    java: { logic: "int l = 0, r = arr.length - 1;\nwhile (l < r) {\n    int sum = arr[l] + arr[r];\n    if (sum == target) return new int[]{l, r};\n    if (sum < target) l++;\n    else r--;\n}", comp: "Constant Space O(1)" },
    cpp: { logic: "int l = 0, r = n - 1;\nwhile (l < r) {\n    int s = a[l] + a[r];\n    if (s == target) return {l, r};\n    s < target ? l++ : r--;\n}", comp: "Sorted Convergent Search" },
    c: { logic: "while(l < r) {\n  int s = a[l] + a[r];\n  if(s == t) break;\n  if(s < t) l++; else r--;\n}", comp: "Optimized Traversal" }
  };

  const startSearch = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFoundIndices([]);
    
    let l = 0;
    let r = data.length - 1;

    while (l < r) {
      setPointers({ left: l, right: r });
      const current = data[l] + data[r];
      setStatus(`Probing: ${data[l]} + ${data[r]} = ${current}`);
      await delay();

      if (current === targetSum) {
        setFoundIndices([l, r]);
        setStatus(`Target Found! Indices ${l} and ${r}`);
        setIsRunning(false);
        return;
      }

      if (current < targetSum) {
        setStatus(`${current} < ${targetSum}: Moving LEFT pointer forward to increase sum.`);
        l++;
      } else {
        setStatus(`${current} > ${targetSum}: Moving RIGHT pointer backward to decrease sum.`);
        r--;
      }
      await delay();
    }

    setIsRunning(false);
    setStatus('No pair found for this target.');
  };

  const reset = () => {
    setPointers({ left: 0, right: 8 });
    setFoundIndices([]);
    setIsRunning(false);
    setStatus('Memory Purged');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Two Pointers</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize linear convergence and optimal sorted-array searching.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-center justify-center gap-2 md:gap-4 z-10 w-full overflow-x-auto py-20 no-scrollbar">
            {data.map((val, i) => {
              const isLeft = pointers.left === i;
              const isRight = pointers.right === i;
              const isTarget = foundIndices.includes(i);

              return (
                <div key={i} className="flex flex-col items-center shrink-0">
                  <div 
                    className={`w-12 h-16 md:w-16 md:h-20 rounded-2xl flex items-center justify-center font-mono font-bold text-lg md:text-2xl transition-all duration-500 border-2 ${
                      isTarget ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_30px_#10b98188] scale-110' : 
                      isLeft || isRight ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-110' : 
                      'bg-white/5 border-white/10 text-gray-700'
                    }`}
                  >
                    {val}
                    {isTarget && <CheckCircle2 size={16} className="absolute -top-2 -right-2 text-emerald-400 bg-[#0c0214] rounded-full" />}
                  </div>
                  
                  <div className="mt-4 h-6 font-black uppercase text-[8px] tracking-[0.2em]">
                    {isLeft && <span className="text-fuchsia-500 animate-pulse">Left Pointer</span>}
                    {isRight && <span className="text-fuchsia-500 animate-pulse">Right Pointer</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-blue-400 font-mono text-[10px] uppercase">
               Target Sum: {targetSum}
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <MoveHorizontal size={16} className="text-fuchsia-500" /> Convergence Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="flex flex-col gap-4">
                <input 
                  type="number" value={targetSum} 
                  onChange={(e) => setTargetSum(parseInt(e.target.value))}
                  placeholder="Target Sum"
                  className="bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                />
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Logic Pace
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
                <button onClick={startSearch} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> INITIATE PROBE
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET
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
                <option value="cpp">C++</option>
                <option value="c">C</option>
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