import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Binary, Gauge, Code2 } from 'lucide-react';

export default function RadixSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([170, 45, 75, 90, 802, 24, 2, 66]);
  const [comparing, setComparing] = useState([]); // Elements currently being moved to buckets
  const [activeDigit, setActiveDigit] = useState(null); // 1, 10, 100, etc.
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Radix Engine Ready');
  const [language, setLanguage] = useState('python');
  
  // Speed Management
  const [speed, setSpeed] = useState(500); 
  const speedRef = useRef(500);

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def radixSort(arr):\n  max_val = max(arr)\n  exp = 1\n  while max_val // exp > 0:\n    countingSort(arr, exp)\n    exp *= 10", comp: "O(d * (n + k))" },
    java: { logic: "void radixsort(int arr[], int n) {\n  int m = getMax(arr, n);\n  for (int exp = 1; m / exp > 0; exp *= 10)\n    countSort(arr, n, exp);\n}", comp: "Stable Digit Sort" },
    cpp: { logic: "void radixsort(int arr[], int n) {\n  int m = getMax(arr, n);\n  for (int exp = 1; m / exp > 0; exp *= 10)\n    countSort(arr, n, exp);\n}", comp: "Non-comparison Based" },
    c: { logic: "for (exp = 1; m/exp > 0; exp *= 10)\n  countSort(arr, n, exp);", comp: "Linear Time Complexity" }
  };

  const countingSortForRadix = async (arr, exp) => {
    let n = arr.length;
    let output = new Array(n).fill(0);
    let count = new Array(10).fill(0);

    setStatus(`Processing digit at 10^${Math.log10(exp)} place...`);
    setActiveDigit(exp);
    await delay();

    // Store count of occurrences
    for (let i = 0; i < n; i++) {
      let digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      setComparing([i]);
      await delay();
    }

    // Change count[i] so that it contains position of digit in output[]
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
      let digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      
      // Update visual data to show "collection" from buckets
      let tempArr = [...arr];
      tempArr[i] = 0; // Visual "lifting" of the element
      setData(tempArr);
      await delay();
    }

    // Copy output array back to arr
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      setData([...arr]);
      setComparing([i]);
      await delay();
    }
  };

  const startSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let arr = [...data];
    let m = Math.max(...arr);

    for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
      await countingSortForRadix(arr, exp);
    }

    setComparing([]);
    setActiveDigit(null);
    setIsRunning(false);
    setStatus('Radix Sort Complete');
  };

  const reset = () => {
    setData([170, 45, 75, 90, 802, 24, 2, 66]);
    setComparing([]);
    setActiveDigit(null);
    setIsRunning(false);
    setStatus('Memory Reset');
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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Radix Sort</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize linear-time sorting through distributive bucket allocation.</p>
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
                  className={`w-10 md:w-12 rounded-t-xl transition-all duration-300 border-x border-t border-white/10 ${
                    comparing.includes(i) ? 'bg-fuchsia-600 shadow-[0_0_40px_rgba(217,70,239,0.5)] scale-110 z-20 border-fuchsia-400' : 
                    'bg-white/5'
                  }`}
                  style={{ height: `${(val / Math.max(...data)) * 250 + 20}px` }}
                />
                <div className="mt-4 flex flex-col items-center">
                   {/* Digit Highlight Logic */}
                   <span className="font-mono text-[10px] text-white font-bold tracking-widest">
                      {val.toString().padStart(3, '0').split('').map((digit, idx, arr) => {
                        const isTarget = activeDigit === 1 && idx === 2 || 
                                         activeDigit === 10 && idx === 1 || 
                                         activeDigit === 100 && idx === 0;
                        return <span key={idx} className={isTarget ? 'text-fuchsia-500 underline decoration-2' : 'text-gray-600'}>{digit}</span>
                      })}
                   </span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {activeDigit && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-blue-400 uppercase font-mono text-[10px]">
                  <Binary size={12} />
                  Pass: {activeDigit === 1 ? 'Units' : activeDigit === 10 ? 'Tens' : 'Hundreds'}
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
                    <Gauge size={14} /> Pipeline Speed
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
                <button onClick={startSort} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <BarChart3 size={18} /> INITIATE PASSES
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] md:text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
             <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Code2 size={16} className="text-fuchsia-500" /> Source Logic
             </h3>
             <pre className="p-5 bg-black/40 rounded-2xl text-[10px] md:text-[11px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto whitespace-pre">
                {PSEUDO_CODE[language].logic}
             </pre>
          </div>
        </div>
      </div>
    </div>
  );
}