import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Search, MoveHorizontal, Layout } from 'lucide-react';

export default function ZAlgorithmVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [pattern, setPattern] = useState("abc");
  const [text, setText] = useState("xabcabcy");
  const [combined, setCombined] = useState("");
  const [zArray, setZArray] = useState([]);
  const [indices, setIndices] = useState({ i: -1, l: 0, r: 0, k: -1 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Z-Engine Standby');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(700);
  const [speed, setSpeed] = useState(700);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "S = pattern + '$' + text\nZ = [0] * len(S)\nL, R = 0, 0\nfor i in range(1, n):\n    if i <= R:\n        Z[i] = min(R - i + 1, Z[i - L])\n    while i + Z[i] < n and S[Z[i]] == S[i + Z[i]]:\n        Z[i] += 1\n    if i + Z[i] - 1 > R:\n        L, R = i, i + Z[i] - 1", comp: "O(n + m) Linear Time" },
    java: { logic: "int L = 0, R = 0;\nfor (int i = 1; i < n; i++) {\n    if (i <= R) Z[i] = Math.min(R - i + 1, Z[i - L]);\n    while (i + Z[i] < n && s.charAt(Z[i]) == s.charAt(i + Z[i]))\n        Z[i]++;\n    if (i + Z[i] - 1 > R) {\n        L = i; R = i + Z[i] - 1;\n    }\n}", comp: "Pattern Matching Logic" }
  };

  const startZAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);

    const S = `${pattern}$${text}`;
    setCombined(S);
    const n = S.length;
    const Z = new Array(n).fill(0);
    setZArray([...Z]);
    
    let L = 0;
    let R = 0;

    setStatus(`Phase 1: Concatenating Pattern + $ + Text`);
    await delay();

    for (let i = 1; i < n; i++) {
      let k = i - L;
      setIndices({ i, l: L, r: R, k });
      
      setStatus(`Processing Index ${i} ('${S[i]}')`);
      await delay();

      if (i <= R) {
        Z[i] = Math.min(R - i + 1, Z[k]);
        setZArray([...Z]);
        setStatus(`Inside [L,R] window: Inheriting Z[${k}] = ${Z[k]}`);
        await delay();
      }

      // Naive expansion
      while (i + Z[i] < n && S[Z[i]] === S[i + Z[i]]) {
        Z[i]++;
        setZArray([...Z]);
        setStatus(`Match found! Expanding Z[${i}] to ${Z[i]}`);
        await delay();
      }

      // Update [L, R]
      if (i + Z[i] - 1 > R) {
        L = i;
        R = i + Z[i] - 1;
        setIndices({ i, l: L, r: R, k });
        setStatus(`New Z-Box found: [L:${L}, R:${R}]`);
        await delay();
      }
    }

    setIsRunning(false);
    setStatus('Analysis Complete: Pattern matches found where Z[i] == Pattern Length.');
  };

  const reset = () => {
    setCombined("");
    setZArray([]);
    setIndices({ i: -1, l: 0, r: 0, k: -1 });
    setIsRunning(false);
    setStatus('Engine Reset');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Z-Algorithm</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the linear-time string searching engine using the Z-Array property.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative w-full z-10 space-y-16">
            {/* Combined String & Z-Values */}
            <div className="flex justify-center gap-1 overflow-x-auto no-scrollbar py-10">
              {combined ? combined.split('').map((char, idx) => {
                const isCurrent = indices.i === idx;
                const inBox = idx >= indices.l && idx <= indices.r && indices.r !== 0;
                const isMatch = zArray[idx] === pattern.length && idx > pattern.length;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 min-w-[32px]">
                    <div className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-mono font-bold rounded-lg border-2 transition-all duration-300 ${
                      isMatch ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_#10b98144]' :
                      isCurrent ? 'bg-fuchsia-600 border-fuchsia-400 scale-110 shadow-[0_0_20px_#d946ef88]' :
                      inBox ? 'bg-blue-600/20 border-blue-500 opacity-100' : 'bg-transparent border-white/5 opacity-30'
                    }`}>
                      {char}
                    </div>
                    <div className={`text-xs font-mono font-bold ${isCurrent ? 'text-fuchsia-400' : 'text-gray-600'}`}>
                      {zArray[idx] || 0}
                    </div>
                  </div>
                );
              }) : (
                <div className="py-20 text-gray-800 font-mono italic">Enter pattern and text to start...</div>
              )}
            </div>

            {/* Z-Box HUD */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Left Boundary (L)</span>
                  <div className="text-2xl font-mono font-bold">{indices.l}</div>
               </div>
               <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[9px] font-black text-fuchsia-500 uppercase tracking-widest block mb-1">Right Boundary (R)</span>
                  <div className="text-2xl font-mono font-bold">{indices.r}</div>
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

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Layout size={16} className="text-fuchsia-500" /> String controller
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pattern</label>
                  <input 
                    type="text" value={pattern} onChange={(e) => setPattern(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Text</label>
                  <input 
                    type="text" value={text} onChange={(e) => setText(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Scan Speed
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
                <button onClick={startZAlgorithm} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> INITIATE ENGINE
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET
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