import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Layers, Gauge, Code2 } from 'lucide-react';

export default function MergeSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [comparing, setComparing] = useState([]); // Elements currently being merged
  const [sorted, setSorted] = useState([]); // Elements in their final positions
  const [activeRange, setActiveRange] = useState([]); // Current sub-problem range
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Engine Standby');
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
    python: { logic: "def mergeSort(arr):\n  if len(arr) > 1:\n    mid = len(arr)//2\n    L = arr[:mid]\n    R = arr[mid:]\n    mergeSort(L)\n    mergeSort(R)\n    # Merge Logic...", comp: "O(n log n) - Stable" },
    java: { logic: "void sort(int arr[], int l, int r) {\n  if (l < r) {\n    int m = l + (r - l) / 2;\n    sort(arr, l, m);\n    sort(arr, m + 1, r);\n    merge(arr, l, m, r);\n  }\n}", comp: "O(n) Extra Space" },
    cpp: { logic: "void mergeSort(int array[], int const begin, int const end) {\n  if (begin >= end) return;\n  auto mid = begin + (end - begin) / 2;\n  mergeSort(array, begin, mid);\n  mergeSort(array, mid + 1, end);\n  merge(array, begin, mid, end);\n}", comp: "Stable Sorting" },
    c: { logic: "void mergeSort(int a[], int l, int r) {\n  if (l < r) {\n    int m = l+(r-l)/2;\n    mergeSort(a, l, m);\n    mergeSort(a, m+1, r);\n    merge(a, l, m, r);\n  }\n}", comp: "Divide & Conquer" }
  };

  // --- CORE MERGE SORT LOGIC ---
  const merge = async (arr, l, m, r) => {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = arr.slice(l, m + 1);
    let R = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
      setComparing([l + i, m + 1 + j]);
      setStatus(`Merging partitions: ${L[i]} vs ${R[j]}`);
      await delay();

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      setData([...arr]);
      k++;
      await delay();
    }

    while (i < n1) {
      arr[k] = L[i];
      setData([...arr]);
      i++; k++;
      await delay();
    }

    while (j < n2) {
      arr[k] = R[j];
      setData([...arr]);
      j++; k++;
      await delay();
    }
  };

  const mergeSortRecursive = async (arr, l, r) => {
    if (l >= r) return;
    
    setActiveRange([l, r]);
    let m = Math.floor(l + (r - l) / 2);
    
    setStatus(`Dividing at index ${m}`);
    await delay();
    
    await mergeSortRecursive(arr, l, m);
    await mergeSortRecursive(arr, m + 1, r);
    
    setActiveRange([l, r]);
    await merge(arr, l, m, r);
  };

  const startSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let arr = [...data];
    await mergeSortRecursive(arr, 0, arr.length - 1);
    setSorted(Array.from({length: arr.length}, (_, i) => i));
    setComparing([]);
    setActiveRange([]);
    setIsRunning(false);
    setStatus('Merge Complete: Array Sorted');
  };

  const reset = () => {
    setData([38, 27, 43, 3, 9, 82, 10]);
    setComparing([]);
    setSorted([]);
    setActiveRange([]);
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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Merge Sort</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize stable sorting through recursive division and buffer merging.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative flex items-end gap-3 md:gap-5 z-10 h-72">
            {data.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-8 md:w-12 rounded-t-2xl transition-all duration-300 border-x border-t border-white/10 ${
                    comparing.includes(i) ? 'bg-fuchsia-600 shadow-[0_0_40px_rgba(217,70,239,0.5)] scale-110 z-20 border-fuchsia-400' : 
                    (i >= activeRange[0] && i <= activeRange[1]) ? 'bg-blue-500/30 border-blue-400/50' :
                    sorted.includes(i) ? 'bg-emerald-500/40 border-emerald-400/50' : 'bg-white/5'
                  }`}
                  style={{ height: `${val * 2.8}px` }}
                />
                <span className={`mt-4 font-mono text-[10px] ${comparing.includes(i) ? 'text-fuchsia-400 font-black' : 'text-gray-600'}`}>
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
            {activeRange.length > 0 && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-blue-400">
                  <Layers size={12} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Active Range: [{activeRange[0]}-{activeRange[1]}]</span>
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
                    <Gauge size={14} /> Merge Speed
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
                <button onClick={startSort} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <BarChart3 size={18} /> INITIATE RECURSION
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] md:text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
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