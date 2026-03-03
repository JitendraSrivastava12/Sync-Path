import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Hash, Target, Gauge, Code2, Zap, Boxes, ShieldAlert } from 'lucide-react';

export default function HashTableVisualizer() {
  const navigate = useNavigate();
  const TABLE_SIZE = 10;
  
  // State Management
  const [table, setTable] = useState(new Array(TABLE_SIZE).fill(null));
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [collisionIdx, setCollisionIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Hash Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(500);
  const [speed, setSpeed] = useState(500);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "hash = key % size\nwhile table[hash] is not None:\n    hash = (hash + 1) % size\ntable[hash] = value", comp: "O(1) Average" },
    java: { logic: "int index = key.hashCode() % size;\nwhile (table[index] != null) {\n    index = (index + 1) % size;\n}\ntable[index] = value;", comp: "Linear Probing" },
    cpp: { logic: "size_t idx = hash<string>{}(key) % n;\nwhile (occupied[idx]) {\n    idx = (idx + 1) % n;\n}\ntable[idx] = val;", comp: "Open Addressing" },
    c: { logic: "int h = hash(key);\nwhile(table[h].occupied) {\n  h = (h + 1) % SIZE;\n}\ntable[h] = item;", comp: "Static Memory" }
  };

  const insert = async () => {
    if (!inputKey || !inputValue || isRunning) return;
    setIsRunning(true);
    setCollisionIdx(-1);

    let key = inputKey;
    let val = inputValue;
    let index = parseInt(key) % TABLE_SIZE;
    
    // Validate if key is a number for this visualizer
    if (isNaN(index)) {
        setStatus("Error: Please enter a numeric key");
        setIsRunning(false);
        return;
    }

    setStatus(`Hashing Key "${key}" -> Index ${index}`);
    setCurrentIndex(index);
    await delay();

    let newTable = [...table];
    let probeCount = 0;

    // Linear Probing logic
    while (newTable[index] !== null) {
      setCollisionIdx(index);
      setStatus(`Collision at index ${index}! Probing next...`);
      await delay();
      
      index = (index + 1) % TABLE_SIZE;
      setCurrentIndex(index);
      probeCount++;
      
      if (probeCount >= TABLE_SIZE) {
        setStatus("Error: Hash Table Full (Overflow)");
        setCollisionIdx(-1);
        setCurrentIndex(-1);
        setIsRunning(false);
        return;
      }
    }

    newTable[index] = { key, val };
    setTable(newTable);
    setCollisionIdx(-1);
    setStatus(`Successfully placed at index ${index}`);
    setInputKey('');
    setInputValue('');
    setIsRunning(false);
    
    await delay();
    setCurrentIndex(-1);
  };

  const reset = () => {
    setTable(new Array(TABLE_SIZE).fill(null));
    setCurrentIndex(-1);
    setCollisionIdx(-1);
    setStatus('Table Purged');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Hash Table</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize $O(1)$ mapping and Linear Probing collision resolution.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative grid grid-cols-2 md:grid-cols-5 gap-4 z-10 w-full">
            {table.map((entry, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-full h-24 md:h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                    collisionIdx === i ? 'bg-red-500/20 border-red-500 shadow-[0_0_30px_#ef444488]' :
                    currentIndex === i ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-105' : 
                    entry ? 'bg-emerald-500/10 border-emerald-400/50 shadow-[0_0_15px_#10b98122]' : 'bg-white/5 border-white/5'
                  }`}
                >
                  <span className="text-[10px] font-mono text-gray-700 mb-1">Bucket {i}</span>
                  {entry ? (
                    <div className="text-center">
                      <div className="text-xs font-black text-white truncate px-2">{entry.key}</div>
                      <div className="text-[10px] text-emerald-400 opacity-80 italic">{entry.val}</div>
                    </div>
                  ) : (
                    <span className="text-gray-800 font-mono text-xs italic">NULL</span>
                  )}
                </div>
                {currentIndex === i && <Hash size={12} className="mt-2 text-fuchsia-500 animate-bounce" />}
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Boxes size={16} className="text-fuchsia-500" /> Data Input
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" value={inputKey} 
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Key (Number)"
                  className="bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                />
                <input 
                  type="text" value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Value"
                  className="bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Probe Interval
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
                <button onClick={insert} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> INSERT PAIR
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> CLEAR TABLE
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