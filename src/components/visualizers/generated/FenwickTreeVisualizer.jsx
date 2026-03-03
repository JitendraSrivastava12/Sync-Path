import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, Binary, Search, Target, Hash
} from 'lucide-react';

export default function FenwickTreeVisualizer() {
  const navigate = useNavigate();
  
  // State: Source data and BIT (Fenwick Tree) representation
  // Source: [1, 2, 3, 4, 5, 6, 7, 8]
  // BIT:    [0, 1, 3, 3, 10, 5, 11, 7, 36] (1-indexed for bit math)
  const [data] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [bit, setBit] = useState([0, 1, 3, 3, 10, 5, 11, 7, 36]);
  
  const [activeIndex, setActiveIndex] = useState(null);
  const [queryIdx, setQueryIdx] = useState(7);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('BIT Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(700);
  const [speed, setSpeed] = useState(700);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def query(i):\n    s = 0\n    while i > 0:\n        s += bit[i]\n        i -= i & (-i) # Move to parent\n    return s", 
      comp: "O(log n) Prefix Sum" 
    },
    java: { 
      logic: "int query(int i) {\n    int sum = 0;\n    while (i > 0) {\n        sum += bit[i];\n        i -= i & -i;\n    }\n    return sum;\n}", 
      comp: "Binary Index Logic" 
    }
  };

  const startQuery = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let i = queryIdx;
    let sum = 0;
    setStatus(`Calculating Prefix Sum up to Index ${i}...`);
    await delay();

    while (i > 0) {
      setActiveIndex(i);
      sum += bit[i];
      const lsb = i & -i;
      
      setStatus(`Index ${i} (Binary: ${i.toString(2)}): Adding ${bit[i]} to total. LSB is ${lsb}.`);
      await delay();

      i -= lsb;
      if (i > 0) {
        setStatus(`Jumping to parent index: ${i}`);
        await delay();
      }
    }

    setActiveIndex(null);
    setStatus(`Query Complete. Total Prefix Sum: ${sum}`);
    setIsRunning(false);
  };

  const reset = () => {
    setActiveIndex(null);
    setIsRunning(false);
    setStatus('Registers Cleared');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Fenwick Engine</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize Binary Indexed Tree logic through LSB jumps and logarithmic accumulation.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 w-full space-y-12">
            {/* BIT Array Visualization */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block text-center">Binary Indexed Tree (BIT)</span>
               <div className="flex flex-wrap justify-center gap-2">
                 {bit.slice(1).map((val, idx) => {
                   const actualIdx = idx + 1;
                   const isActive = activeIndex === actualIdx;
                   return (
                     <div key={actualIdx} className="flex flex-col items-center">
                        <div className={`w-12 h-16 flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                          isActive ? 'bg-fuchsia-600 border-fuchsia-400 z-20 scale-110 shadow-[0_0_20px_#d946ef88]' : 'bg-white/5 border-white/10 text-gray-500'
                        }`}>
                          <span className="text-xs font-mono font-bold text-white">{val}</span>
                          <span className="text-[8px] opacity-40 mt-1 font-mono">{actualIdx.toString(2).padStart(4, '0')}</span>
                        </div>
                        <span className="text-[9px] mt-2 text-gray-700 font-bold">i:{actualIdx}</span>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* Range Responsibility Graphic */}
            <div className="space-y-4 pt-10 border-t border-white/5">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block text-center">Range Responsibility Matrix</span>
              <div className="h-32 relative">
                {bit.slice(1).map((_, idx) => {
                  const i = idx + 1;
                  const lsb = i & -i;
                  const width = (lsb / bit.length) * 100;
                  const left = ((i - lsb) / bit.length) * 100;
                  return (
                    <div 
                      key={i}
                      className={`absolute h-4 rounded-full transition-all duration-500 ${activeIndex === i ? 'bg-fuchsia-500 shadow-[0_0_10px_#d946ef]' : 'bg-white/10'}`}
                      style={{ 
                        width: `${width}%`, 
                        left: `${left + 5}%`, 
                        top: `${idx * 14}px`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Hash size={16} className="text-fuchsia-500" /> Arithmetic Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">Prefix Sum Limit (i)</label>
                  <input 
                    type="number" min="1" max="8" value={queryIdx}
                    onChange={(e) => setQueryIdx(parseInt(e.target.value) || 1)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Gauge size={14} /> Jump Speed
                    </label>
                    <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                  </div>
                  <input 
                    type="range" min="100" max="1500" step="100"
                    value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startQuery} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> SUMMATE RANGE
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET REGISTERS
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