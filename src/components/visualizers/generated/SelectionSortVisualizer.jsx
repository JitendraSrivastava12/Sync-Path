import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Search, Gauge, Code2 } from 'lucide-react';

export default function SelectionSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([29, 10, 14, 37, 13, 5, 42]);
  const [comparing, setComparing] = useState([]); // Current element being scanned
  const [minIdx, setMinIdx] = useState(null); // Current minimum found in pass
  const [sorted, setSorted] = useState([]); // Elements in their final positions
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('System Ready');
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
    python: { logic: "for i in range(len(arr)):\n    min_idx = i\n    for j in range(i+1, len(arr)):\n        if arr[j] < arr[min_idx]:\n            min_idx = j\n    arr[i], arr[min_idx] = arr[min_idx], arr[i]", comp: "O(n²) - Constant Swaps" },
    java: { logic: "for (int i = 0; i < n-1; i++) {\n    int min_idx = i;\n    for (int j = i+1; j < n; j++)\n        if (arr[j] < arr[min_idx])\n            min_idx = j;\n    int temp = arr[min_idx];\n    arr[min_idx] = arr[i];\n    arr[i] = temp;\n}", comp: "O(n²) Comparisons" },
    cpp: { logic: "for (i = 0; i < n-1; i++) {\n    min_idx = i;\n    for (j = i+1; j < n; j++)\n        if (arr[j] < arr[min_idx])\n            min_idx = j;\n    swap(arr[min_idx], arr[i]);\n}", comp: "O(1) Auxiliary Space" },
    c: { logic: "for (i = 0; i < n-1; i++) {\n    min = i;\n    for (j = i+1; j < n; j++)\n        if (a[j] < a[min]) min = j;\n    t = a[min]; a[min] = a[i]; a[i] = t;\n}", comp: "Quadratic Time" }
  };

  const selectionSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let arr = [...data];
    let n = arr.length;
    let currentSorted = [];

    for (let i = 0; i < n - 1; i++) {
      let min_idx = i;
      setMinIdx(i);
      setStatus(`New Pass: Setting current min to index ${i}`);
      await delay();

      for (let j = i + 1; j < n; j++) {
        setComparing([j]);
        setStatus(`Scanning: Comparing ${arr[j]} with current min ${arr[min_idx]}`);
        await delay();

        if (arr[j] < arr[min_idx]) {
          min_idx = j;
          setMinIdx(j);
          setStatus(`New minimum found: ${arr[j]}`);
          await delay();
        }
      }

      if (min_idx !== i) {
        setStatus(`Swapping index ${i} (${arr[i]}) with min index ${min_idx} (${arr[min_idx]})`);
        let temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
        setData([...arr]);
        await delay();
      }

      currentSorted.push(i);
      setSorted([...currentSorted]);
    }
    
    setSorted(Array.from({length: n}, (_, i) => i));
    setComparing([]);
    setMinIdx(null);
    setIsRunning(false);
    setStatus('Sorting Complete');
  };

  const reset = () => {
    setData([29, 10, 14, 37, 13, 5, 42]);
    setComparing([]);
    setMinIdx(null);
    setSorted([]);
    setIsRunning(false);
    setStatus('Engine Reset');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-6 md:space-y-12">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4 md:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Selection Sort</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize the search for the absolute minimum in each pass.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-end gap-3 md:gap-5 z-10 h-72">
            {data.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-10 md:w-16 rounded-t-2xl transition-all duration-300 border-x border-t border-white/10 ${
                    minIdx === i ? 'bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] scale-110 z-20 border-amber-400' : 
                    comparing.includes(i) ? 'bg-fuchsia-600 border-fuchsia-400' : 
                    sorted.includes(i) ? 'bg-emerald-500/40 border-emerald-400/50' : 'bg-white/5'
                  }`}
                  style={{ height: `${val * 4}px` }}
                />
                <span className={`mt-4 font-mono text-xs ${minIdx === i ? 'text-amber-500 font-black' : 'text-gray-600'}`}>
                    {val}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {minIdx !== null && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-amber-500">
                  <Search size={12} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Target Min: {data[minIdx]}</span>
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
                    <Gauge size={14} /> Scan Speed
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
                <button onClick={selectionSort} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <BarChart3 size={18} /> INITIATE SCAN
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
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
            <pre className="p-5 bg-black/40 rounded-2xl text-[10px] md:text-[11px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto">
              {PSEUDO_CODE[language].logic}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}