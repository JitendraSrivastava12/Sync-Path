import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Search, Target, Gauge, Code2, CheckCircle2, XCircle } from 'lucide-react';

export default function LinearSearchVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([56, 12, 89, 43, 67, 91]);
  const [targetValue, setTargetValue] = useState(67);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Search Engine Ready');
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
    python: { logic: "for i in range(len(arr)):\n    if arr[i] == target:\n        return i\nreturn -1", comp: "O(n) - Linear" },
    java: { logic: "for (int i = 0; i < arr.length; i++) {\n    if (arr[i] == target)\n        return i;\n}\nreturn -1;", comp: "Sequential Scan" },
    cpp: { logic: "for (int i = 0; i < n; i++) {\n    if (arr[i] == target)\n        return i;\n}\nreturn -1;", comp: "O(n) Comparisons" },
    c: { logic: "for (i = 0; i < n; i++) {\n    if (a[i] == t) return i;\n}\nreturn -1;", comp: "Iterative Search" }
  };

  const startSearch = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFoundIndex(-1);
    setStatus(`Scanning for Target: ${targetValue}...`);

    for (let i = 0; i < data.length; i++) {
      setCurrentIndex(i);
      setStatus(`Checking index ${i}: ${data[i]} == ${targetValue}?`);
      await delay();

      if (data[i] === targetValue) {
        setFoundIndex(i);
        setStatus(`Match Found! Target at index ${i}`);
        setIsRunning(false);
        return;
      }
    }

    setCurrentIndex(-1);
    setIsRunning(false);
    setStatus('Target not found in memory.');
  };

  const reset = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setIsRunning(false);
    setStatus('Engine Reset');
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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Linear Search</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize sequential memory probing and $O(n)$ search efficiency.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative flex items-center justify-center gap-3 md:gap-4 z-10 w-full overflow-x-auto py-10 no-scrollbar">
            {data.map((val, i) => (
              <div key={i} className="flex flex-col items-center shrink-0">
                <div 
                  className={`w-12 h-16 md:w-16 md:h-20 rounded-2xl flex items-center justify-center font-mono font-bold text-lg md:text-2xl transition-all duration-300 border-2 ${
                    foundIndex === i ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_30px_#10b98188] scale-110' : 
                    currentIndex === i ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-110' : 
                    'bg-white/5 border-white/10 text-gray-500'
                  }`}
                >
                  {val}
                  {foundIndex === i && <CheckCircle2 size={16} className="absolute -top-2 -right-2 text-emerald-400 bg-[#0c0214] rounded-full" />}
                  {currentIndex === i && foundIndex === -1 && data[i] !== targetValue && <XCircle size={16} className="absolute -top-2 -right-2 text-red-500 bg-[#0c0214] rounded-full" />}
                </div>
                <span className="mt-4 text-[10px] font-mono text-gray-700 uppercase">0x0{i}A</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-blue-400">
               <Target size={12} />
               <span className="text-[10px] font-mono uppercase tracking-widest text-white">Target: {targetValue}</span>
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Control Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="flex flex-col gap-4">
                <input 
                  type="number" 
                  value={targetValue} 
                  onChange={(e) => setTargetValue(parseInt(e.target.value))}
                  placeholder="Value to find"
                  className="bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all shadow-inner"
                />
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Probe Interval
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="100" max="1500" step="100"
                  value={speed} onChange={handleSpeedChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startSearch} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> INITIATE SCAN
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET ENGINE
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
            <pre className="p-5 bg-black/40 rounded-2xl text-[10px] md:text-[11px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto">
              {PSEUDO_CODE[language].logic}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}