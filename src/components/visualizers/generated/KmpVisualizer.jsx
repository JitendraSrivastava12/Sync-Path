import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Search, TextSelect, FastForward } from 'lucide-react';

export default function KmpVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [lps, setLps] = useState([]);
  const [indices, setIndices] = useState({ i: -1, j: -1 });
  const [phase, setPhase] = useState('IDLE'); // IDLE, LPS, SEARCH
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Pattern Engine Standby');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def computeLPS(pat):\n    lps = [0] * len(pat)\n    length = 0\n    i = 1\n    while i < len(pat):\n        if pat[i] == pat[length]:\n            length += 1\n            lps[i] = length\n            i += 1\n        elif length != 0:\n            length = lps[length-1]\n        else:\n            lps[i] = 0\n            i += 1", comp: "O(n + m) Time" },
    java: { logic: "int i = 0, j = 0;\nwhile (i < N) {\n    if (pat.charAt(j) == txt.charAt(i)) {\n        i++; j++;\n    }\n    if (j == M) {\n        return i - j;\n    } else if (i < N && pat.charAt(j) != txt.charAt(i)) {\n        if (j != 0) j = lps[j - 1];\n        else i = i + 1;\n    }\n}", comp: "No Backtracking" }
  };

  const computeLPS = async (pat) => {
    setPhase('LPS');
    let m = pat.length;
    let tempLps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    setStatus("Phase 1: Computing LPS Array (Prefix/Suffix matching)");
    setLps([...tempLps]);

    while (i < m) {
      setIndices({ i, j: len });
      if (pat[i] === pat[len]) {
        len++;
        tempLps[i] = len;
        setLps([...tempLps]);
        i++;
        setStatus(`Match! LPS[${i-1}] = ${len}`);
      } else {
        if (len !== 0) {
          len = tempLps[len - 1];
          setStatus(`Mismatch. Falling back to LPS[${len}]`);
        } else {
          tempLps[i] = 0;
          setLps([...tempLps]);
          i++;
          setStatus(`No prefix match for index ${i-1}`);
        }
      }
      await delay();
    }
    return tempLps;
  };

  const startKMP = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFoundIndex(-1);

    const lpsArray = await computeLPS(pattern);
    
    setPhase('SEARCH');
    setStatus("Phase 2: Executing Pattern Search on Text");
    let n = text.length;
    let m = pattern.length;
    let i = 0; // index for text
    let j = 0; // index for pattern

    while (i < n) {
      setIndices({ i, j });
      await delay();

      if (pattern[j] === text[i]) {
        i++;
        j++;
        setStatus(`Character match at Text[${i-1}] and Pattern[${j-1}]`);
      }

      if (j === m) {
        setFoundIndex(i - j);
        setStatus(`PATTERN FOUND at index ${i - j}!`);
        setIsRunning(false);
        return;
      } else if (i < n && pattern[j] !== text[i]) {
        if (j !== 0) {
          setStatus(`Mismatch! Jumping Pattern pointer from ${j} to LPS[${j-1}] = ${lpsArray[j-1]}`);
          j = lpsArray[j - 1];
        } else {
          setStatus(`Mismatch! Moving Text pointer to index ${i+1}`);
          i = i + 1;
        }
      }
    }

    setIsRunning(false);
    setStatus('Search finished. No pattern match found.');
  };

  const reset = () => {
    setLps([]);
    setIndices({ i: -1, j: -1 });
    setFoundIndex(-1);
    setPhase('IDLE');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">KMP String Match</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Knuth-Morris-Pratt: Linear time pattern matching without backtracking.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative w-full z-10 space-y-12">
            {/* Text Array */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block text-center">Source Text</span>
               <div className="flex justify-center gap-1 overflow-x-auto no-scrollbar py-2">
                 {text.split('').map((char, idx) => (
                   <div key={idx} className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-mono font-bold rounded-lg border-2 transition-all duration-300 ${
                     foundIndex !== -1 && idx >= foundIndex && idx < foundIndex + pattern.length ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_#10b98166]' :
                     indices.i === idx ? 'bg-fuchsia-600 border-fuchsia-400 scale-110 z-20 shadow-[0_0_20px_#d946ef88]' : 'bg-white/5 border-white/5 text-gray-600'
                   }`}>
                     {char}
                   </div>
                 ))}
               </div>
            </div>

            {/* Pattern Array */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block text-center">Pattern & LPS Table</span>
               <div className="flex flex-col items-center gap-2">
                 <div className="flex justify-center gap-1">
                   {pattern.split('').map((char, idx) => (
                     <div key={idx} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-mono font-bold rounded-lg border-2 transition-all duration-300 ${
                          indices.j === idx ? 'bg-blue-600 border-blue-400 scale-110 z-20 shadow-[0_0_20px_#2563eb88]' : 'bg-white/5 border-white/10 text-gray-400'
                        }`}>
                          {char}
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black/40 border border-white/5 rounded text-[10px] font-mono text-fuchsia-400">
                          {lps[idx] !== undefined ? lps[idx] : '-'}
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
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
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Pattern Terminal
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source Text</label>
                  <input 
                    type="text" value={text} onChange={(e) => setText(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pattern to Find</label>
                  <input 
                    type="text" value={pattern} onChange={(e) => setPattern(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Scan Frequency
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
                <button onClick={startKMP} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> INITIATE SEARCH
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