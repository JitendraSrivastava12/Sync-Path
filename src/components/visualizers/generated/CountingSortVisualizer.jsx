import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Hash, Gauge, Code2 } from 'lucide-react';

export default function CountingSortVisualizer() {
  const navigate = useNavigate();
  const MAX_VAL = 9; // Range of elements [0-9]
  
  // State Management
  const [data, setData] = useState([4, 2, 2, 8, 3, 3, 1]);
  const [counts, setCounts] = useState(new Array(MAX_VAL + 1).fill(0));
  const [activeIdx, setActiveIdx] = useState(null); 
  const [activeCountIdx, setActiveCountIdx] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Frequency Engine Ready');
  const [language, setLanguage] = useState('python');
  
  // Speed Management
  const [speed, setSpeed] = useState(400); 
  const speedRef = useRef(400);

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "count = [0] * (max + 1)\nfor x in arr: count[x] += 1\nfor i in range(1, len(count)): \n    count[i] += count[i-1]\n# Build output...", comp: "O(n + k) - Linear" },
    java: { logic: "int count[] = new int[max + 1];\nfor (int i = 0; i < n; ++i) \n    count[arr[i]]++;\nfor (int i = 1; i <= max; ++i) \n    count[i] += count[i - 1];", comp: "Non-Comparison Sort" },
    cpp: { logic: "vector<int> count(max + 1, 0);\nfor (int x : arr) count[x]++;\nfor (int i = 1; i <= max; i++) \n    count[i] += count[i-1];", comp: "O(n+k) Stable" },
    c: { logic: "int count[MAX];\nfor(i=0; i<n; i++) count[a[i]]++;\nfor(i=1; i<=max; i++) count[i]+=count[i-1];", comp: "Integer-only Sort" }
  };

  const startSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let arr = [...data];
    let n = arr.length;
    let countArr = new Array(MAX_VAL + 1).fill(0);
    let output = new Array(n).fill(0);

    // Phase 1: Frequency Counting
    setStatus('Phase 1: Generating Frequency Map...');
    for (let i = 0; i < n; i++) {
      setActiveIdx(i);
      const val = arr[i];
      setActiveCountIdx(val);
      countArr[val]++;
      setCounts([...countArr]);
      await delay();
    }
    setActiveIdx(null);

    // Phase 2: Prefix Sum (Cumulative)
    setStatus('Phase 2: Calculating Cumulative Offsets...');
    for (let i = 1; i <= MAX_VAL; i++) {
      setActiveCountIdx(i);
      countArr[i] += countArr[i - 1];
      setCounts([...countArr]);
      await delay();
    }

    // Phase 3: Build Output
    setStatus('Phase 3: Mapping values to Output Buffer...');
    for (let i = n - 1; i >= 0; i--) {
      setActiveIdx(i);
      const val = arr[i];
      setActiveCountIdx(val);
      output[countArr[val] - 1] = val;
      countArr[val]--;
      setCounts([...countArr]);
      
      // Update data visually to show reconstruction
      let visualArr = [...output];
      setData(visualArr);
      await delay();
    }

    setActiveIdx(null);
    setActiveCountIdx(null);
    setIsRunning(false);
    setStatus('Counting Sort Sequence Complete');
  };

  const reset = () => {
    setData([4, 2, 2, 8, 3, 3, 1]);
    setCounts(new Array(MAX_VAL + 1).fill(0));
    setActiveIdx(null);
    setActiveCountIdx(null);
    setIsRunning(false);
    setStatus('Engine Purged');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-6 md:space-y-12 text-white">
      
      {/* 1. PROFESSIONAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6 md:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Counting Sort</h1>
            <p className="text-gray-400 font-medium text-xs md:text-lg tracking-tight text-balance">Visualize linear-time sorting through direct index mapping and frequency accumulation.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-between min-h-[500px] md:min-h-[600px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* INPUT ARRAY DISPLAY */}
          <div className="relative w-full text-center z-10">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Input Sequence</p>
            <div className="flex justify-center gap-2 md:gap-3">
              {data.map((val, i) => (
                <div key={i} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-mono font-bold border-2 transition-all duration-300 ${activeIdx === i ? 'bg-fuchsia-600 border-fuchsia-400 scale-110 shadow-[0_0_20px_#d946ef88]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                  {val}
                </div>
              ))}
            </div>
          </div>

          {/* FREQUENCY COUNT ARRAY (The Magic Part) */}
          <div className="relative w-full text-center z-10">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Count Map (Frequency)</p>
            <div className="flex justify-center gap-1 md:gap-2">
              {counts.map((count, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-8 h-12 md:w-10 md:h-16 flex flex-col justify-end border-x border-t border-white/10 rounded-t-lg transition-all duration-300 ${activeCountIdx === i ? 'bg-blue-600/40 border-blue-400 shadow-[0_0_15px_#60a5fa44]' : 'bg-white/5'}`}>
                    <div className="text-center font-mono text-[10px] mb-1">{count}</div>
                  </div>
                  <div className="mt-2 w-8 md:w-10 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-gray-600">
                    [{i}]
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HUD STATUS */}
          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Control Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Pipeline Clock
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="100" max="1000" step="100"
                  value={speed} onChange={handleSpeedChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startSort} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <BarChart3 size={18} /> INITIATE ENGINE
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] md:text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
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