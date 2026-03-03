import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Zap, Gauge, Code2 } from 'lucide-react';

export default function ShellSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([62, 15, 88, 42, 12, 75, 30, 95, 22, 50]);
  const [comparing, setComparing] = useState([]); // Indices being compared across the gap
  const [gap, setGap] = useState(0); // Current increment/gap
  const [sorted, setSorted] = useState([]); // Final sorted elements
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Engine Standby');
  const [language, setLanguage] = useState('python');
  
  // Speed Management
  const [speed, setSpeed] = useState(300); 
  const speedRef = useRef(300);

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "gap = n // 2\nwhile gap > 0:\n    for i in range(gap, n):\n        temp = arr[i]\n        j = i\n        while j >= gap and arr[j-gap] > temp:\n            arr[j] = arr[j-gap]\n            j -= gap\n        arr[j] = temp\n    gap //= 2", comp: "O(n log n) to O(n²)" },
    java: { logic: "for (int gap = n/2; gap > 0; gap /= 2) {\n    for (int i = gap; i < n; i++) {\n        int temp = arr[i];\n        int j;\n        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)\n            arr[j] = arr[j - gap];\n        arr[j] = temp;\n    }\n}", comp: "Adaptive Insertion" },
    cpp: { logic: "for (int gap = n/2; gap > 0; gap /= 2) {\n    for (int i = gap; i < n; i++) {\n        int temp = arr[i];\n        int j;\n        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)\n            arr[j] = arr[j - gap];\n        arr[j] = temp;\n    }\n}", comp: "Diminishing Increment" },
    c: { logic: "for (gap = n/2; gap > 0; gap /= 2) {\n  for (i = gap; i < n; i++) {\n    t = a[i];\n    for (j = i; j >= gap && a[j-gap] > t; j -= gap)\n      a[j] = a[j-gap];\n    a[j] = t;\n  }\n}", comp: "In-place Sort" }
  };

  const shellSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let arr = [...data];
    let n = arr.length;

    for (let g = Math.floor(n / 2); g > 0; g = Math.floor(g / 2)) {
      setGap(g);
      setStatus(`New Gap Sequence: ${g}`);
      await delay();

      for (let i = g; i < n; i++) {
        let temp = arr[i];
        let j = i;
        
        setComparing([j, j - g]);
        setStatus(`Gap ${g}: Comparing index ${j} and ${j-g}`);
        await delay();

        while (j >= g && arr[j - g] > temp) {
          setStatus(`Shifting: ${arr[j-g]} > ${temp}`);
          arr[j] = arr[j - g];
          setData([...arr]);
          j -= g;
          setComparing([j, j + g]);
          await delay();
        }
        arr[j] = temp;
        setData([...arr]);
        await delay();
      }
    }

    setSorted(Array.from({length: n}, (_, i) => i));
    setComparing([]);
    setGap(0);
    setIsRunning(false);
    setStatus('Shell Sort Complete');
  };

  const reset = () => {
    setData([62, 15, 88, 42, 12, 75, 30, 95, 22, 50]);
    setComparing([]);
    setSorted([]);
    setGap(0);
    setIsRunning(false);
    setStatus('Buffer Purged');
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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Shell Sort</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize the optimization of Insertion Sort using diminishing increments.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative flex items-end gap-2 md:gap-3 z-10 h-72">
            {data.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-6 md:w-10 rounded-t-xl transition-all duration-300 border-x border-t border-white/10 ${
                    comparing.includes(i) ? 'bg-fuchsia-600 shadow-[0_0_40px_rgba(217,70,239,0.5)] scale-110 z-20 border-fuchsia-400' : 
                    sorted.includes(i) ? 'bg-emerald-500/40 border-emerald-400/50' : 'bg-white/5'
                  }`}
                  style={{ height: `${val * 2.5}px` }}
                />
                <span className={`mt-4 font-mono text-[9px] ${comparing.includes(i) ? 'text-fuchsia-400 font-black' : 'text-gray-600'}`}>
                    {val}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-3xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {gap > 0 && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-3xl rounded-2xl border border-white/10 text-blue-400">
                  <Zap size={12} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Active Gap: {gap}</span>
               </div>
            )}
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Control Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Execution Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="50"
                  value={speed} onChange={handleSpeedChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={shellSort} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <BarChart3 size={18} /> INITIATE SHELL SORT
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] md:text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
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
            <pre className="p-5 bg-black/40 rounded-2xl text-[10px] md:text-[11px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto whitespace-pre">
              {PSEUDO_CODE[language].logic}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}