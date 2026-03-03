import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Search, Target, Gauge, Code2, CheckCircle2, XCircle } from 'lucide-react';

export default function TernarySearchVisualizer() {
  const navigate = useNavigate();
  
  // State Management (Pre-sorted for Ternary Search)
  const [data] = useState([ 22, 35, 40, 45, 50, 68, 72, 85, 94, 110]);
  const [targetValue, setTargetValue] = useState(72);
  const [pointers, setPointers] = useState({ low: -1, m1: -1, m2: -1, high: -1 });
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Ternary Engine Standby');
  const [language, setLanguage] = useState('python');
  
  // Speed Management
  const [speed, setSpeed] = useState(800); 
  const speedRef = useRef(800);

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "m1 = l + (r-l)//3\nm2 = r - (r-l)//3\nif key == arr[m1]: return m1\nif key == arr[m2]: return m2\nif key < arr[m1]: r = m1-1\nelif key > arr[m2]: l = m2+1\nelse: l, r = m1+1, m2-1", comp: "O(log₃ n) - Logarithmic" },
    java: { logic: "int m1 = l + (r - l) / 3;\nint m2 = r - (r - l) / 3;\nif (arr[m1] == key) return m1;\nif (arr[m2] == key) return m2;\nif (key < arr[m1]) return search(l, m1 - 1);\nelse if (key > arr[m2]) return search(m2 + 1, r);\nelse return search(m1 + 1, m2 - 1);", comp: "Double Midpoint" },
    cpp: { logic: "int mid1 = l + (r - l) / 3;\nint mid2 = r - (r - l) / 3;\nif (ar[mid1] == key) return mid1;\nif (ar[mid2] == key) return mid2;\nif (key < ar[mid1]) r = mid1 - 1;\nelse if (key > ar[mid2]) l = mid2 + 1;\nelse { l = mid1 + 1; r = mid2 - 1; }", comp: "Three-way Partition" },
    c: { logic: "m1 = l+(r-l)/3; m2 = r-(r-l)/3;\nif(a[m1]==k) return m1;\nif(a[m2]==k) return m2;\nif(k < a[m1]) r=m1-1;\nelse if(k > a[m2]) l=m2+1;\nelse { l=m1+1; r=m2-1; }", comp: "Recursive/Iterative" }
  };

  const startSearch = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFoundIndex(-1);
    
    let l = 0;
    let r = data.length - 1;

    while (l <= r) {
      const m1 = l + Math.floor((r - l) / 3);
      const m2 = r - Math.floor((r - l) / 3);
      
      setPointers({ low: l, m1, m2, high: r });
      setStatus(`Calculating Midpoints: m1=${m1}, m2=${m2}`);
      await delay();

      // Check midpoints
      if (data[m1] === targetValue) {
        setFoundIndex(m1);
        setStatus(`Match Found at Mid1 (Index ${m1})`);
        setIsRunning(false);
        return;
      }
      if (data[m2] === targetValue) {
        setFoundIndex(m2);
        setStatus(`Match Found at Mid2 (Index ${m2})`);
        setIsRunning(false);
        return;
      }

      // Shrink search space
      if (targetValue < data[m1]) {
        setStatus(`${targetValue} < ${data[m1]}: Scanning Left Third`);
        r = m1 - 1;
      } else if (targetValue > data[m2]) {
        setStatus(`${targetValue} > ${data[m2]}: Scanning Right Third`);
        l = m2 + 1;
      } else {
        setStatus(`Target is between ${data[m1]} and ${data[m2]}: Scanning Middle Third`);
        l = m1 + 1;
        r = m2 - 1;
      }
      setPointers({ low: l, m1, m2, high: r });
      await delay();
    }

    setPointers({ low: -1, m1: -1, m2: -1, high: -1 });
    setIsRunning(false);
    setStatus('Target not located in memory.');
  };

  const reset = () => {
    setPointers({ low: -1, m1: -1, m2: -1, high: -1 });
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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Ternary Search</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the three-way division of sorted data structures.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative flex items-center justify-center gap-1 md:gap-2 z-10 w-full overflow-x-auto py-16 no-scrollbar">
            {data.map((val, i) => {
              const isActive = i >= pointers.low && i <= pointers.high;
              const isM1 = pointers.m1 === i;
              const isM2 = pointers.m2 === i;
              const isFound = foundIndex === i;

              return (
                <div key={i} className="flex flex-col items-center shrink-0">
                  <div 
                    className={`w-8 h-12 md:w-12 md:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-sm md:text-lg transition-all duration-500 border-2 ${
                      isFound ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_30px_#10b98188] scale-110' : 
                      isM1 || isM2 ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-110' : 
                      isActive ? 'bg-white/5 border-white/20 text-white' : 
                      'bg-transparent border-white/5 text-gray-800'
                    }`}
                  >
                    {val}
                  </div>
                  <div className="mt-3 flex flex-col items-center h-8 font-black uppercase text-[7px] tracking-tighter">
                    {pointers.low === i && <span className="text-blue-400">L</span>}
                    {isM1 && <span className="text-fuchsia-500">M1</span>}
                    {isM2 && <span className="text-fuchsia-500">M2</span>}
                    {pointers.high === i && <span className="text-blue-400">H</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-blue-400 font-mono text-[10px] uppercase">
               Target: {targetValue}
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Partition Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="flex flex-col gap-4">
                <input 
                  type="number" 
                  value={targetValue} 
                  onChange={(e) => setTargetValue(parseInt(e.target.value))}
                  placeholder="Target Value"
                  className="bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all shadow-inner"
                />
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Logic Pace
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="300" max="2000" step="100"
                  value={speed} onChange={handleSpeedChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startSearch} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> START TERNARY SCAN
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET MEMORY
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