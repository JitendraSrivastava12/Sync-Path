import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, MoveHorizontal, Expand, Target } from 'lucide-react';

export default function ManachersVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [inputText, setInputText] = useState("abaaba");
  const [transformed, setTransformed] = useState([]);
  const [p, setP] = useState([]); // Radius array
  const [indices, setIndices] = useState({ i: -1, center: 0, right: 0, mirror: -1 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Manacher Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "T = '#' + '#'.join(s) + '#'\nP = [0] * n\nC = R = 0\nfor i in range(n):\n    mirr = 2*C - i\n    if i < R: P[i] = min(R - i, P[mirr])\n    while T[i + 1 + P[i]] == T[i - 1 - P[i]]:\n        P[i] += 1\n    if i + P[i] > R: C, R = i, i + P[i]", comp: "O(n) Linear Time" },
    java: { logic: "int mirr = 2 * C - i;\nif (i < R) P[i] = Math.min(R - i, P[mirr]);\nwhile (T[i + (1 + P[i])] == T[i - (1 + P[i])])\n    P[i]++;\nif (i + P[i] > R) {\n    C = i;\n    R = i + P[i];\n}", comp: "O(n) Space" }
  };

  const startManachers = async () => {
    if (isRunning) return;
    setIsRunning(true);

    // Phase 1: Transformation
    setStatus("Phase 1: Transforming string with separators (#)");
    const T = `#${inputText.split('').join('#')}#`.split('');
    setTransformed(T);
    const n = T.length;
    const P = new Array(n).fill(0);
    setP([...P]);
    await delay();

    let C = 0; // Center
    let R = 0; // Right boundary

    for (let i = 0; i < n; i++) {
      let mirr = 2 * C - i;
      setIndices({ i, center: C, right: R, mirror: mirr });

      if (i < R) {
        P[i] = Math.min(R - i, P[mirr]);
        setP([...P]);
        setStatus(`Inside Boundary: Mirroring value from index ${mirr}`);
        await delay();
      }

      // Expansion
      setStatus(`Phase 2: Attempting expansion at index ${i}`);
      while (i + 1 + P[i] < n && i - 1 - P[i] >= 0 && T[i + 1 + P[i]] === T[i - 1 - P[i]]) {
        P[i]++;
        setP([...P]);
        await delay();
      }

      // Update Center and Right Boundary
      if (i + P[i] > R) {
        C = i;
        R = i + P[i];
        setIndices({ i, center: C, right: R, mirror: mirr });
        setStatus(`New Boundary: Center moved to ${i}, Right to ${R}`);
        await delay();
      }
    }

    setIsRunning(false);
    setStatus('Analysis Complete: Longest Palindrome identified.');
  };

  const reset = () => {
    setTransformed([]);
    setP([]);
    setIndices({ i: -1, center: 0, right: 0, mirror: -1 });
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Manacher's Algorithm</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the O(n) linear-time longest palindromic substring discovery.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative w-full z-10 space-y-16">
            {/* Transformed String & Radius */}
            <div className="flex justify-center gap-1 overflow-x-auto no-scrollbar py-10">
              {transformed.length > 0 ? transformed.map((char, idx) => {
                const isCurrent = indices.i === idx;
                const isMirror = indices.mirror === idx;
                const isCenter = indices.center === idx;
                const inBoundary = idx <= indices.right && idx >= (2 * indices.center - indices.right);
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 min-w-[30px]">
                    <div className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-mono font-bold rounded-lg border-2 transition-all duration-300 ${
                      isCurrent ? 'bg-fuchsia-600 border-fuchsia-400 scale-110 shadow-[0_0_20px_#d946ef88]' :
                      isMirror ? 'bg-blue-600/40 border-blue-400' :
                      isCenter ? 'bg-amber-500/20 border-amber-500' :
                      inBoundary ? 'bg-white/5 border-white/10 opacity-100' : 'bg-transparent border-white/5 opacity-30'
                    }`}>
                      {char}
                    </div>
                    <div className={`text-xs font-mono ${isCurrent ? 'text-fuchsia-400 font-bold' : 'text-gray-600'}`}>
                      {p[idx]}
                    </div>
                  </div>
                );
              }) : (
                <div className="py-20 text-gray-800 font-mono italic">Enter text to begin transformation...</div>
              )}
            </div>

            {/* Boundary HUD */}
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block mb-1">Mirror Index</span>
                  <div className="text-xl font-mono">{indices.mirror >= 0 ? indices.mirror : '-'}</div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest block mb-1">Center (C)</span>
                  <div className="text-xl font-mono">{indices.center}</div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <span className="text-[8px] font-black text-fuchsia-500 uppercase tracking-widest block mb-1">Right (R)</span>
                  <div className="text-xl font-mono">{indices.right}</div>
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
              <Expand size={16} className="text-fuchsia-500" /> expansion terminal
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Input Text</label>
                  <input 
                    type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Processing Speed
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
                <button onClick={startManachers} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
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