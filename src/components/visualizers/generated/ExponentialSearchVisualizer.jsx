import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Search, Target, Gauge, Code2, Zap, ArrowRightCircle } from 'lucide-react';

export default function ExponentialSearchVisualizer() {
  const navigate = useNavigate();
  
  // State Management (Sorted for search efficiency)
  const [data] = useState([ 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,]);
  const [targetValue, setTargetValue] = useState(70);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [pointers, setPointers] = useState({ low: -1, high: -1 });
  const [phase, setPhase] = useState('IDLE'); // IDLE, JUMP, BINARY
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Expansion Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "if arr[0] == x: return 0\ni = 1\nwhile i < n and arr[i] <= x:\n    i = i * 2\nreturn binarySearch(arr, i//2, min(i, n-1), x)", comp: "O(log i) - Positional" },
    java: { logic: "if (arr[0] == x) return 0;\nint i = 1;\nwhile (i < n && arr[i] <= x)\n    i = i * 2;\nreturn Arrays.binarySearch(arr, i/2, Math.min(i, n-1), x);", comp: "Doubling Search" },
    cpp: { logic: "if (arr[0] == x) return 0;\nint i = 1;\nwhile (i < n && arr[i] <= x)\n    i = i * 2;\nreturn binarySearch(arr, i/2, min(i, n-1), x);", comp: "Efficient for Unbounded" },
    c: { logic: "if(a[0] == x) return 0;\nint i = 1;\nwhile(i < n && a[i] <= x) i *= 2;\nreturn binSearch(a, i/2, min(i, n-1), x);", comp: "Exponential Jump" }
  };

  const startSearch = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFoundIndex(-1);
    setPhase('JUMP');

    let n = data.length;
    
    // Check first element
    setCurrentIndex(0);
    setStatus("Initial Check: Index 0");
    await delay();
    if (data[0] === targetValue) {
      setFoundIndex(0);
      setIsRunning(false);
      return;
    }

    // Exponential Jumps
    let i = 1;
    while (i < n && data[i] <= targetValue) {
      setCurrentIndex(i);
      setStatus(`Exponential Jump: i = ${i} (Value: ${data[i]})`);
      await delay();
      if (data[i] === targetValue) {
        setFoundIndex(i);
        setIsRunning(false);
        return;
      }
      i = i * 2;
    }

    // Binary Search Phase
    setPhase('BINARY');
    let low = i / 2;
    let high = Math.min(i, n - 1);
    setPointers({ low, high });
    setStatus(`Range Found: Binary Searching between [${low} - ${high}]`);
    await delay();

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      setCurrentIndex(mid);
      setStatus(`Binary Probe: Index ${mid} (Value: ${data[mid]})`);
      await delay();

      if (data[mid] === targetValue) {
        setFoundIndex(mid);
        setStatus(`Match confirmed at index ${mid}`);
        setIsRunning(false);
        return;
      }

      if (data[mid] < targetValue) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      setPointers({ low, high });
    }

    setCurrentIndex(-1);
    setIsRunning(false);
    setStatus('Target not found in expanded range.');
  };

  const reset = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setPointers({ low: -1, high: -1 });
    setPhase('IDLE');
    setIsRunning(false);
    setStatus('Engine Reset');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* 1. ARCHITECTURAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Exponential Search</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize the doubling window strategy for localized search efficiency.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-center justify-center gap-2 md:gap-3 z-10 w-full overflow-x-auto py-16 no-scrollbar">
            {data.map((val, i) => {
              const isCurrent = currentIndex === i;
              const isFound = foundIndex === i;
              const inRange = i >= pointers.low && i <= pointers.high && phase === 'BINARY';

              return (
                <div key={i} className="flex flex-col items-center shrink-0">
                  <div 
                    className={`w-10 h-14 md:w-14 md:h-20 rounded-2xl flex items-center justify-center font-mono font-bold text-base md:text-xl transition-all duration-500 border-2 ${
                      isFound ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_30px_#10b98188] scale-110' : 
                      isCurrent ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-110' : 
                      inRange ? 'bg-blue-500/10 border-blue-500/50 text-white' : 
                      'bg-white/5 border-white/5 text-gray-700'
                    }`}
                  >
                    {val}
                  </div>
                  <div className="mt-3 text-[8px] font-black uppercase tracking-tighter h-4">
                    {isCurrent && <Zap size={10} className="text-fuchsia-500 animate-bounce" />}
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
            <div className={`flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 ${phase === 'JUMP' ? 'text-amber-500' : 'text-blue-400'}`}>
               <ArrowRightCircle size={12} />
               <span className="text-[10px] font-mono uppercase tracking-widest">Phase: {phase}</span>
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Control Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="flex flex-col gap-4">
                <input 
                  type="number" value={targetValue} 
                  onChange={(e) => setTargetValue(parseInt(e.target.value))}
                  placeholder="Target Value"
                  className="bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                />
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Expansion Speed
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
                <button onClick={startSearch} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> INITIATE SCAN
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET ENGINE
                </button>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
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