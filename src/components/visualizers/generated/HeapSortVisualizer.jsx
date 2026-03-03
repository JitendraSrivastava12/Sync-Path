import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Binary, Gauge, Code2 } from 'lucide-react';

export default function HeapSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([40, 10, 30, 50, 70, 20, 60]);
  const [comparing, setComparing] = useState([]); // Nodes being compared during heapify
  const [sorted, setSorted] = useState([]); // Elements locked in final positions
  const [activeRoot, setActiveRoot] = useState(null); // The root of the current heapify call
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Heap Engine Ready');
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
    python: { logic: "def heapSort(arr):\n  buildMaxHeap(arr)\n  for i in range(n-1, 0, -1):\n    swap(arr[0], arr[i])\n    maxHeapify(arr, 0, i)", comp: "O(n log n) - In-place" },
    java: { logic: "public void sort(int arr[]) {\n  int n = arr.length;\n  for (int i = n / 2 - 1; i >= 0; i--)\n    heapify(arr, n, i);\n  for (int i = n - 1; i > 0; i--) {\n    swap(arr, 0, i);\n    heapify(arr, i, 0);\n  }\n}", comp: "O(n log n) Time" },
    cpp: { logic: "void heapSort(int arr[], int n) {\n  for (int i = n/2-1; i >= 0; i--)\n    heapify(arr, n, i);\n  for (int i = n-1; i > 0; i--) {\n    swap(arr[0], arr[i]);\n    heapify(arr, i, 0);\n  }\n}", comp: "Space: O(1)" },
    c: { logic: "void heapSort(int a[], int n) {\n  for(int i=n/2-1; i>=0; i--) heap(a,n,i);\n  for(int i=n-1; i>0; i--) {\n    t=a[0]; a[0]=a[i]; a[i]=t;\n    heap(a,i,0);\n  }\n}", comp: "Non-recursive Heap" }
  };

  const heapify = async (arr, n, i) => {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    setActiveRoot(i);
    setComparing([l, r]);
    setStatus(`Heapifying subtree at index ${i}`);
    await delay();

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
      setStatus(`Sifting down: Swapping ${arr[i]} and ${arr[largest]}`);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setData([...arr]);
      await delay();
      await heapify(arr, n, largest);
    }
  };

  const startSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let arr = [...data];
    let n = arr.length;

    // Phase 1: Build Max Heap
    setStatus('Phase 1: Building Max Heap Structure...');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    // Phase 2: Extract elements
    setStatus('Phase 2: Extracting Max and Re-heapifying...');
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setData([...arr]);
      setSorted(prev => [i, ...prev]);
      setStatus(`Max element ${arr[i]} moved to sorted partition`);
      await delay();
      await heapify(arr, i, 0);
    }

    setSorted(Array.from({length: n}, (_, i) => i));
    setComparing([]);
    setActiveRoot(null);
    setIsRunning(false);
    setStatus('Heap Sort Complete');
  };

  const reset = () => {
    setData([40, 10, 30, 50, 70, 20, 60]);
    setComparing([]);
    setSorted([]);
    setActiveRoot(null);
    setIsRunning(false);
    setStatus('Heap Memory Reset');
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
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Heap Sort</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize priority-based sorting using a complete binary tree structure.</p>
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
                    activeRoot === i ? 'bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] scale-110 z-20 border-amber-400' : 
                    comparing.includes(i) ? 'bg-fuchsia-600 border-fuchsia-400' : 
                    sorted.includes(i) ? 'bg-emerald-500/40 border-emerald-400/50' : 'bg-white/5'
                  }`}
                  style={{ height: `${val * 3}px` }}
                />
                <span className={`mt-4 font-mono text-[10px] ${activeRoot === i ? 'text-amber-500 font-black' : 'text-gray-600'}`}>
                    {val}
                </span>
                <span className="text-[8px] font-mono text-gray-800">idx: {i}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {activeRoot !== null && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-amber-500">
                  <Binary size={12} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Root Node: {data[activeRoot]}</span>
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
                    <Gauge size={14} /> Sift Speed
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
                  <BarChart3 size={18} /> START HEAP SORT
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
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