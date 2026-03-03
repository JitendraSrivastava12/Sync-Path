import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Hash, Gauge, Code2, Zap, ShieldCheck, ShieldAlert, Fingerprint } from 'lucide-react';

export default function BloomFilterVisualizer() {
  const navigate = useNavigate();
  const BIT_SIZE = 16;
  
  // State Management
  const [bitArray, setBitArray] = useState(new Array(BIT_SIZE).fill(0));
  const [insertedKeys, setInsertedKeys] = useState([]);
  const [inputKey, setInputKey] = useState('');
  const [activeIndices, setActiveIndices] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Probabilistic Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def add(item):\n  for i in range(k_hashes):\n    idx = hash(item, i) % size\n    bit_array[idx] = 1\n\ndef check(item):\n  return all(bit_array[hash(item, i) % size] for i in range(k_hashes))", comp: "O(k) Time / O(m) Space" },
    java: { logic: "public void add(T item) {\n    for (Function<T, Integer> f : hashFunctions) {\n        bitSet.set(f.apply(item) % size);\n    }\n}", comp: "No Deletion Possible" },
    cpp: { logic: "void insert(string key) {\n    for(int i=0; i<k; i++) {\n        int idx = spooky_hash(key, i) % M;\n        bits[idx] = true;\n    }\n}", comp: "False Positives Exist" },
    c: { logic: "void add(char* key) {\n  for(int i=0; i<K; i++) {\n    bits[hash(key, i) % M] = 1;\n  }\n}", comp: "Bit Manipulation" }
  };

  // Simplified multi-hash simulation
  const getHashes = (key) => {
    const h1 = Math.abs(key.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)) % BIT_SIZE;
    const h2 = Math.abs(key.split('').reverse().reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)) % BIT_SIZE;
    const h3 = (h1 + h2 * 7) % BIT_SIZE;
    return [h1, h2, h3];
  };

  const handleAdd = async () => {
    if (!inputKey || isRunning) return;
    setIsRunning(true);
    const indices = getHashes(inputKey);
    
    setStatus(`Hashing "${inputKey}" through 3 functions...`);
    setActiveIndices(indices);
    await delay();

    const newBits = [...bitArray];
    indices.forEach(idx => newBits[idx] = 1);
    
    setBitArray(newBits);
    setInsertedKeys([...insertedKeys, inputKey]);
    setStatus(`Bits at indices ${indices.join(', ')} set to 1.`);
    
    await delay();
    setActiveIndices([]);
    setInputKey('');
    setIsRunning(false);
  };

  const handleCheck = async () => {
    if (!inputKey || isRunning) return;
    setIsRunning(true);
    const indices = getHashes(inputKey);
    
    setStatus(`Checking membership for "${inputKey}"...`);
    setActiveIndices(indices);
    await delay();

    const isMaybeIn = indices.every(idx => bitArray[idx] === 1);
    
    if (isMaybeIn) {
      setStatus(`Possibly Present: All bits are set.`);
    } else {
      setStatus(`Definitely Not Present: Found zero bit.`);
    }

    await delay();
    setActiveIndices([]);
    setInputKey('');
    setIsRunning(false);
  };

  const reset = () => {
    setBitArray(new Array(BIT_SIZE).fill(0));
    setInsertedKeys([]);
    setStatus('Bit-Vector Purged');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Bloom Filter</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize space-efficient set membership with zero false negatives.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 z-10 w-full">
            {bitArray.map((bit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 border-2 font-mono font-black text-xl md:text-2xl ${
                    activeIndices.includes(i) ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-105' : 
                    bit === 1 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/5 text-gray-800'
                  }`}
                >
                  {bit}
                </div>
                <span className="mt-2 text-[9px] font-mono text-gray-700">BIT_{i}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {status.includes('Possibly') ? <ShieldAlert className="text-amber-500 animate-pulse" /> : status.includes('Definitely') ? <ShieldCheck className="text-emerald-500" /> : null}
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Fingerprint size={16} className="text-fuchsia-500" /> Input Terminal
            </h3>
            
            <div className="space-y-6">
              <input 
                type="text" value={inputKey} 
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="String key (e.g. 'user_123')"
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
              />

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Hash Latency
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="100" max="1500" step="100"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleAdd} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-[10px] font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all">
                  <Play size={16} fill="currentColor" /> ADD ITEM
                </button>
                <button onClick={handleCheck} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-blue-600 rounded-2xl text-[10px] font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all">
                  <Hash size={16} /> CHECK ITEM
                </button>
              </div>
              <button onClick={reset} className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest text-white hover:bg-white/10 transition-all">
                <RotateCcw size={16} /> CLEAR VECTOR
              </button>
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