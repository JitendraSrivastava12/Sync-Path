import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Target, Gauge, Code2 } from 'lucide-react';

export default function QuickSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([52, 15, 89, 42, 10, 75, 30, 64]);
  const [pivotIdx, setPivotIdx] = useState(null); // The pivot chosen for partitioning
  const [comparing, setComparing] = useState([]); // Elements being compared with pivot
  const [sorted, setSorted] = useState([]); // Elements in their final positions
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
    python: { logic: "def quickSort(arr):\n  pivot = arr[len(arr)//2]\n  left = [x for x in arr if x < pivot]\n  middle = [x for x in arr if x == pivot]\n  right = [x for x in arr if x > pivot]\n  return quickSort(left) + middle + quickSort(right)", comp: "O(n log n) - Average" },
    java: { logic: "int partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = (low - 1);\n    for (int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            swap(arr, i, j);\n        }\n    }\n    swap(arr, i + 1, high);\n    return (i + 1);\n}", comp: "O(n log n) In-place" },
    cpp: { logic: "void quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}", comp: "Divide & Conquer" },
    c: { logic: "void qSort(int a[], int l, int r) {\n  if (l >= r) return;\n  int p = partition(a, l, r);\n  qSort(a, l, p-1);\n  qSort(a, p+1, r);\n}", comp: "Recursive Pivot" }
  };

  // --- CORE QUICK SORT LOGIC ---
  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    setPivotIdx(high);
    setStatus(`Pivot Selected: ${pivot} at index ${high}`);
    await delay();

    let i = low - 1;
    for (let j = low; j < high; j++) {
      setComparing([j, high]);
      setStatus(`Comparing ${arr[j]} with pivot ${pivot}`);
      await delay();

      if (arr[j] < pivot) {
        i++;
        setStatus(`Shifting ${arr[j]} to left partition`);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setData([...arr]);
        await delay();
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setData([...arr]);
    setPivotIdx(i + 1);
    setStatus(`Pivot placed in final position at index ${i+1}`);
    await delay();
    
    return i + 1;
  };

  const quickSortRecursive = async (arr, low, high) => {
    if (low <= high) {
      let pi = await partition(arr, low, high);
      
      // Update sorted list
      setSorted(prev => [...prev, pi]);
      
      await quickSortRecursive(arr, low, pi - 1);
      await quickSortRecursive(arr, pi + 1, high);
    }
  };

  const startSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let arr = [...data];
    await quickSortRecursive(arr, 0, arr.length - 1);
    setSorted(Array.from({length: arr.length}, (_, i) => i));
    setComparing([]);
    setPivotIdx(null);
    setIsRunning(false);
    setStatus('Quick Sort Sequence Complete');
  };

  const reset = () => {
    setData([52, 15, 89, 42, 10, 75, 30, 64]);
    setComparing([]);
    setPivotIdx(null);
    setSorted([]);
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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Quick Sort</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Recursive partitioning and pivot-based divide and conquer.</p>
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
                    pivotIdx === i ? 'bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] scale-110 z-20 border-amber-400' : 
                    comparing.includes(i) ? 'bg-fuchsia-600 border-fuchsia-400' : 
                    sorted.includes(i) ? 'bg-emerald-500/40 border-emerald-400/50' : 'bg-white/5'
                  }`}
                  style={{ height: `${val * 2.8}px` }}
                />
                <span className={`mt-4 font-mono text-[10px] ${pivotIdx === i ? 'text-amber-500 font-black' : 'text-gray-600'}`}>
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
            {pivotIdx !== null && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-amber-500">
                  <Target size={12} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Active Pivot: {data[pivotIdx]}</span>
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
                    <Gauge size={14} /> Recursion Speed
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