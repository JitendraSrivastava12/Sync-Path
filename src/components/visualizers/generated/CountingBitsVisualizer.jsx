import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Binary, Activity, Layers } from 'lucide-react';

export default function CountingBitsVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [n] = useState(7); // Calculate for 0 through 7
  const [results, setResults] = useState(new Array(8).fill(0));
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [dependencyIdx, setDependencyIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Bit Engine Standby');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const toBinary = (num) => num.toString(2).padStart(3, '0');

  const PSEUDO_CODE = {
    python: { logic: "ans = [0] * (n + 1)\nfor i in range(1, n + 1):\n    ans[i] = ans[i >> 1] + (i & 1)\nreturn ans", comp: "O(n) - DP Approach" },
    java: { logic: "int[] ans = new int[n + 1];\nfor (int i = 1; i <= n; i++) {\n    ans[i] = ans[i >> 1] + (i & 1);\n}\nreturn ans;", comp: "Right Shift + LSB" },
    cpp: { logic: "vector<int> ans(n + 1, 0);\nfor (int i = 1; i <= n; i++) {\n    ans[i] = ans[i >> 1] + (i & 1);\n}\nreturn ans;", comp: "Bitwise Recurrence" },
    c: { logic: "for(int i = 1; i <= n; i++) {\n  ans[i] = ans[i >> 1] + (i & 1);\n}", comp: "O(1) Extra Space per bit" }
  };

  const startCounting = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let tempResults = new Array(n + 1).fill(0);
    setResults([...tempResults]);

    setStatus('Initializing DP Table: ans[0] = 0');
    await delay();

    for (let i = 1; i <= n; i++) {
      setCurrentIndex(i);
      const prevIdx = i >> 1; // Same as floor(i/2)
      const lsb = i & 1; // Last significant bit
      
      setDependencyIdx(prevIdx);
      setStatus(`Processing ${i}: ans[${i >> 1}] (${tempResults[prevIdx]}) + LSB (${lsb})`);
      await delay();

      tempResults[i] = tempResults[prevIdx] + lsb;
      setResults([...tempResults]);
      
      setStatus(`Result for ${i} (${toBinary(i)}): ${tempResults[i]} set bits`);
      await delay();
    }

    setCurrentIndex(-1);
    setDependencyIdx(-1);
    setIsRunning(false);
    setStatus(`Sequence Finished: Bit counts for 0 to ${n} stored.`);
  };

  const reset = () => {
    setResults(new Array(8).fill(0));
    setCurrentIndex(-1);
    setDependencyIdx(-1);
    setIsRunning(false);
    setStatus('Registers Cleared');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Counting Bits</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize the Dynamic Programming recurrence $P(i) = P(i/2) + (i \pmod 2)$.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE BIT ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative w-full z-10 space-y-10">
            {/* DP Table Visual */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {results.map((val, i) => {
                const isCurrent = currentIndex === i;
                const isDependency = dependencyIdx === i;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-full aspect-square rounded-2xl flex items-center justify-center font-mono font-bold text-lg md:text-xl transition-all duration-300 border-2 ${
                      isCurrent ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-110 z-20' : 
                      isDependency ? 'bg-blue-600/40 border-blue-400 scale-105' : 
                      'bg-white/5 border-white/10 text-gray-500'
                    }`}>
                      {val}
                    </div>
                    <span className="mt-2 text-[10px] font-mono text-gray-700">{i}</span>
                    <span className="text-[8px] font-mono text-gray-800 tracking-tighter">{toBinary(i)}</span>
                  </div>
                );
              })}
            </div>

            {/* Recurrence HUD */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm">
               <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4 text-center">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-gray-500 uppercase block">Input (i)</span>
                      <div className="text-2xl font-mono font-bold text-white">{currentIndex === -1 ? '--' : currentIndex}</div>
                    </div>
                    <div className="text-xl text-gray-700">→</div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-gray-500 uppercase block">Formula</span>
                      <div className="text-sm font-mono text-fuchsia-400">
                        {"ans[i >> 1] + (i & 1)"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="flex gap-8">
                     <div className="text-center">
                        <span className="text-[8px] font-black text-blue-400 uppercase block mb-1">Shifted Value</span>
                        <span className="text-xl font-mono font-bold">{currentIndex === -1 ? '-' : currentIndex >> 1}</span>
                     </div>
                     <div className="text-center">
                        <span className="text-[8px] font-black text-amber-500 uppercase block mb-1">LSB Bit</span>
                        <span className="text-xl font-mono font-bold">{currentIndex === -1 ? '-' : currentIndex & 1}</span>
                     </div>
                  </div>
               </div>
            </div>
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
              <Activity size={16} className="text-fuchsia-500" /> Bitwise Logic
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Propagation Delay
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="200" max="2000" step="200"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startCounting} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Binary size={18} /> START DP ENGINE
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET DP TABLE
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