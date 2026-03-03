import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Hash, Gauge, Code2, Zap, LayoutGrid, ShieldCheck, AlertCircle } from 'lucide-react';

export default function HashSetVisualizer() {
  const navigate = useNavigate();
  const SET_SIZE = 12;
  
  // State Management
  const [buckets, setBuckets] = useState(new Array(SET_SIZE).fill(null));
  const [inputKey, setInputKey] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [collisionIdx, setCollisionIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Set Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(500);
  const [speed, setSpeed] = useState(500);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "if key not in hash_set:\n    index = hash(key) % size\n    hash_set[index] = key", comp: "O(1) Avg Membership" },
    java: { logic: "if (set.add(key)) {\n    // Item was unique and added\n} else {\n    // Item already exists\n}", comp: "HashSet Implementation" },
    cpp: { logic: "auto [it, inserted] = s.insert(key);\nif (inserted) {\n    // Success\n}", comp: "std::unordered_set" },
    c: { logic: "int h = hash(key);\nif(!exists(table, h, key)) {\n  insert(table, h, key);\n}", comp: "Unique Key Storage" }
  };

  const handleAdd = async () => {
    if (!inputKey || isRunning) return;
    setIsRunning(true);
    setCollisionIdx(-1);

    const key = inputKey.trim();
    const index = Math.abs(key.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)) % SET_SIZE;
    
    setStatus(`Hashing "${key}" -> Target Bucket ${index}`);
    setCurrentIndex(index);
    await delay();

    // Check for Duplicates (Simplified for visualization)
    if (buckets.includes(key)) {
      setCollisionIdx(index);
      setStatus(`Rejected: "${key}" already exists in the set.`);
      await delay();
    } else {
      let newBuckets = [...buckets];
      // Linear probing for collisions in our fixed-size visualization
      let probeIdx = index;
      while (newBuckets[probeIdx] !== null) {
        setCollisionIdx(probeIdx);
        setStatus(`Index ${probeIdx} occupied. Probing next...`);
        await delay();
        probeIdx = (probeIdx + 1) % SET_SIZE;
        setCurrentIndex(probeIdx);
      }
      
      newBuckets[probeIdx] = key;
      setBuckets(newBuckets);
      setCollisionIdx(-1);
      setStatus(`Successfully added "${key}" to Set.`);
    }

    setInputKey('');
    setIsRunning(false);
    await delay();
    setCurrentIndex(-1);
  };

  const reset = () => {
    setBuckets(new Array(SET_SIZE).fill(null));
    setStatus('Set Memory Purged');
    setCurrentIndex(-1);
    setCollisionIdx(-1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Hash Set</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize unique key enforcement and $O(1)$ set operations.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative grid grid-cols-3 md:grid-cols-4 gap-4 z-10 w-full">
            {buckets.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-full aspect-square md:aspect-video rounded-2xl flex items-center justify-center border-2 transition-all duration-300 font-mono text-sm md:text-lg ${
                    collisionIdx === i ? 'bg-red-500/20 border-red-500 shadow-[0_0_30px_#ef444488]' :
                    currentIndex === i ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-105' : 
                    val ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/5 text-gray-800'
                  }`}
                >
                  {val || 'EMPTY'}
                </div>
                <span className="mt-2 text-[8px] font-black text-gray-700 uppercase tracking-widest">Bucket_{i}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {status.includes('Rejected') && <AlertCircle className="text-red-500 animate-bounce" size={20} />}
            {status.includes('Successfully') && <ShieldCheck className="text-emerald-500 animate-pulse" size={20} />}
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <LayoutGrid size={16} className="text-fuchsia-500" /> Set Controller
            </h3>
            
            <div className="space-y-6">
              <input 
                type="text" value={inputKey} 
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Unique Key..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
              />

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Hash Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="100" max="1500" step="100"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={handleAdd} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all">
                  <Zap size={16} fill="currentColor" /> ADD TO SET
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> CLEAR SET
                </button>
              </div>
            </div>
          </div>

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
            <pre className="p-5 bg-black/40 rounded-2xl text-[10px] md:text-[11px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto whitespace-pre">
              {PSEUDO_CODE[language].logic}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}