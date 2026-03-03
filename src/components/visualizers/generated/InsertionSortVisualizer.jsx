import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Zap, Gauge, Code2 } from 'lucide-react';

export default function InsertionSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([45, 23, 78, 12, 56, 34, 90]);
  const [comparing, setComparing] = useState([]); // Currently active elements
  const [activeKey, setActiveKey] = useState(null); // The element being inserted
  const [sortedCount, setSortedCount] = useState(0); // Boundary of sorted partition
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
    python: { logic: "for i in range(1, len(arr)):\n    key = arr[i]\n    j = i-1\n    while j >= 0 and key < arr[j]:\n        arr[j+1] = arr[j]\n        j -= 1\n    arr[j+1] = key", comp: "O(n²) - Best: O(n)" },
    java: { logic: "for (int i = 1; i < n; ++i) {\n    int key = arr[i];\n    int j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n        arr[j + 1] = arr[j];\n        j = j - 1;\n    }\n    arr[j + 1] = key;\n}", comp: "Stable / In-place" },
    cpp: { logic: "for (i = 1; i < n; i++) {\n    key = arr[i]; j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n        arr[j + 1] = arr[j];\n        j = j - 1;\n    }\n    arr[j + 1] = key;\n}", comp: "Efficient for small data" },
    c: { logic: "for (i = 1; i < n; i++) {\n    k = a[i]; j = i - 1;\n    while (j >= 0 && a[j] > k) {\n        a[j+1] = a[j]; j--;\n    }\n    a[j+1] = k;\n}", comp: "Basic Comparison Sort" }
  };

  const insertionSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let arr = [...data];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      
      setActiveKey(i);
      setStatus(`Picking key: ${key} at index ${i}`);
      await delay();

      while (j >= 0 && arr[j] > key) {
        setComparing([j, j + 1]);
        setStatus(`Shifting: ${arr[j]} > ${key}`);
        await delay();

        arr[j + 1] = arr[j];
        setData([...arr]);
        j = j - 1;
        await delay();
      }
      
      arr[j + 1] = key;
      setData([...arr]);
      setSortedCount(i + 1);
      setStatus(`Inserted ${key} at position ${j + 1}`);
      await delay();
    }
    
    setActiveKey(null);
    setComparing([]);
    setIsRunning(false);
    setStatus('Engine Idle: Sorting Complete');
  };

  const reset = () => {
    setData([45, 23, 78, 12, 56, 34, 90]);
    setComparing([]);
    setActiveKey(null);
    setSortedCount(0);
    setIsRunning(false);
    setStatus('Memory Purged');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 space-y-10">
      
      {/* 1. PROFESSIONAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Insertion Sort</h1>
            <p className="text-gray-500 font-medium tracking-tight">Visualize the incremental building of the sorted partition.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-end gap-3 md:gap-5 z-10 h-72">
            {data.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-10 md:w-16 rounded-t-2xl transition-all duration-300 ease-out border-x border-t border-white/10 ${
                    activeKey === i ? 'bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] scale-110 z-20' : 
                    comparing.includes(i) ? 'bg-fuchsia-600 border-fuchsia-400' : 
                    i < sortedCount ? 'bg-emerald-500/40 border-emerald-400/50' : 'bg-white/5'
                  }`}
                  style={{ height: `${val * 2.8}px` }}
                />
                <span className={`mt-4 font-mono text-xs ${activeKey === i ? 'text-amber-500 font-bold' : 'text-gray-600'}`}>
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
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-amber-500">
               <Zap size={12} />
               <span className="text-[10px] font-mono uppercase tracking-widest">Active Key: {activeKey !== null ? data[activeKey] : 'None'}</span>
            </div>
          </div>
        </div>

        {/* 3. CONTROLS & LOGIC */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
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
                  type="range" min="50" max="1000" step="50"
                  value={speed} onChange={handleSpeedChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={insertionSort} 
                  disabled={isRunning}
                  className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl"
                >
                  <BarChart3 size={18} /> INITIATE ENGINE
                </button>
                <button 
                  onClick={reset}
                  className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  <RotateCcw size={18} /> RESET MEMORY
                </button>
              </div>
            </div>
          </div>

          {/* Logic Sidecar */}
          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
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
            <pre className="p-5 bg-black/40 rounded-2xl text-[11px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto whitespace-pre">
              {PSEUDO_CODE[language].logic}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}