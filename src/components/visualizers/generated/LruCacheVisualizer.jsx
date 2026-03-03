import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Hash, Gauge, Code2, Zap, Layers, Trash2, History } from 'lucide-react';

export default function LruCacheVisualizer() {
  const navigate = useNavigate();
  const CAPACITY = 4;
  
  // State Management
  const [cache, setCache] = useState([]); // Array representation of the Doubly Linked List
  const [lookup, setLookup] = useState({}); // Hash Map representation
  const [activeKey, setActiveKey] = useState(null);
  const [status, setStatus] = useState('Cache Engine Ready');
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState({ key: '', val: '' });
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def get(key):\n  if key in map:\n    node = map[key]\n    move_to_head(node)\n    return node.val\n\ndef put(key, val):\n  if key in map:\n    update_val_and_move_to_head(key)\n  else:\n    if len(map) >= cap:\n      evict_tail()\n    add_new_head(key, val)", comp: "O(1) Get / O(1) Put" },
    java: { logic: "public int get(int key) {\n    Node node = map.get(key);\n    if (node == null) return -1;\n    moveToHead(node);\n    return node.value;\n}", comp: "LinkedHashMap Logic" },
    cpp: { logic: "void put(int key, int value) {\n    if (m.find(key) != m.end()) {\n        l.erase(m[key]);\n    }\n    l.push_front({key, value});\n    m[key] = l.begin();\n    if (m.size() > cap) {\n        m.erase(l.back().first);\n        l.pop_back();\n    }\n}", comp: "List + Unordered_map" },
    c: { logic: "struct Node* n = find(key);\nif(n) detach(n); \nelse {\n  if(count == CAP) evictTail();\n  n = createNode(key, val);\n}\ninsertHead(n);", comp: "Manual Pointer Mgmt" }
  };

  const handleAccess = async () => {
    if (!inputValue.key || isRunning) return;
    setIsRunning(true);
    const key = inputValue.key;
    const val = inputValue.val || `val_${key}`;

    setActiveKey(key);
    
    if (lookup[key]) {
      setStatus(`Cache Hit! Moving "${key}" to MRU (Head)`);
      await delay();
      
      // Re-order: Remove from current position and move to front
      const filtered = cache.filter(item => item.key !== key);
      const updatedItem = { key, val };
      setCache([updatedItem, ...filtered]);
    } else {
      setStatus(`Cache Miss! Inserting "${key}" at Head`);
      await delay();

      let currentCache = [...cache];
      if (currentCache.length >= CAPACITY) {
        const evicted = currentCache.pop();
        setStatus(`Capacity Reached. Evicting LRU (Tail): "${evicted.key}"`);
        setCache([...currentCache]);
        await delay();
        
        const newLookup = { ...lookup };
        delete newLookup[evicted.key];
        setLookup(newLookup);
        currentCache = [...currentCache];
      }

      const newItem = { key, val };
      setCache([newItem, ...currentCache]);
      setLookup(prev => ({ ...prev, [key]: true }));
    }

    setInputValue({ key: '', val: '' });
    setIsRunning(false);
    await delay();
    setActiveKey(null);
    setStatus('Cache Synchronized');
  };

  const reset = () => {
    setCache([]);
    setLookup({});
    setStatus('Cache Purged');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">LRU Cache Engine</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize temporal locality and $O(1)$ eviction policy.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL ENGINE (The List) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-between min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative w-full text-center z-10 flex flex-col items-center gap-12">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
              {/* MRU LABEL */}
              <div className="flex flex-col items-center gap-2 opacity-40">
                <Zap size={16} className="text-fuchsia-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">Most Recent</span>
              </div>

              <div className="flex gap-4 md:gap-6 items-center flex-wrap justify-center">
                {cache.map((item, i) => (
                  <div key={item.key} className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-500">
                    <div className={`
                      w-16 h-16 md:w-24 md:h-24 rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-500
                      ${activeKey === item.key ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_40px_rgba(217,70,239,0.4)] scale-110' : 'bg-white/5 border-white/10'}
                    `}>
                      <span className="text-[10px] font-mono text-gray-500 mb-1">K:{item.key}</span>
                      <span className="text-sm md:text-lg font-black">{item.val}</span>
                    </div>
                    {i < cache.length - 1 && <div className="h-px w-4 md:w-8 bg-white/10" />}
                  </div>
                ))}
                {cache.length === 0 && <div className="py-12 text-gray-800 font-mono italic">Cache Empty</div>}
              </div>

              {/* LRU LABEL */}
              <div className="flex flex-col items-center gap-2 opacity-40">
                <History size={16} className="text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">Least Recent</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-emerald-400 font-mono text-[10px]">
               Size: {cache.length} / {CAPACITY}
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Layers size={16} className="text-fuchsia-500" /> Data I/O
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" value={inputValue.key} 
                  onChange={(e) => setInputValue({...inputValue, key: e.target.value})}
                  placeholder="Key"
                  className="bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                />
                <input 
                  type="text" value={inputValue.val} 
                  onChange={(e) => setInputValue({...inputValue, val: e.target.value})}
                  placeholder="Value (Opt)"
                  className="bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={handleAccess} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> ACCESS / PUT
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> PURGE CACHE
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