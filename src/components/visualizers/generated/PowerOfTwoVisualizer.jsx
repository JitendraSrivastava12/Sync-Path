import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Binary, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function PowerOfTwoVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [val, setVal] = useState(16);
  const [isRunning, setIsRunning] = useState(false);
  const [isPower, setIsPower] = useState(null);
  const [status, setStatus] = useState('Bitwise Engine Standby');
  const [bitDetails, setBitDetails] = useState({ n: '00000000', nMinus1: '00000000', result: '00000000' });
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const toBinary = (num) => (num >>> 0).toString(2).padStart(8, '0');

  const PSEUDO_CODE = {
    python: { logic: "def isPowerOfTwo(n):\n    return n > 0 and (n & (n - 1)) == 0", comp: "O(1) Time Complexity" },
    java: { logic: "public boolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}", comp: "Constant Time Bitwise" },
    cpp: { logic: "bool isPowerOfTwo(int n) {\n    return n > 0 && !(n & (n - 1));\n}", comp: "Bit-Manipulation Trick" },
    c: { logic: "int isPowerOfTwo(int n) {\n  return n > 0 && (n & (n - 1)) == 0;\n}", comp: "O(1) Space" }
  };

  const startCheck = async () => {
    if (isRunning || val <= 0) {
      if (val <= 0) setStatus('Input must be greater than 0');
      return;
    }
    setIsRunning(true);
    setIsPower(null);

    setStatus(`Step 1: Loading n = ${val} (${toBinary(val)})`);
    setBitDetails({ n: toBinary(val), nMinus1: '--------', result: '--------' });
    await delay();

    const minusOne = val - 1;
    setStatus(`Step 2: Calculating n - 1 = ${minusOne} (${toBinary(minusOne)})`);
    setBitDetails(prev => ({ ...prev, nMinus1: toBinary(minusOne) }));
    await delay();

    const bitAnd = val & minusOne;
    setStatus(`Step 3: Performing Bitwise AND (n & n-1)`);
    setBitDetails(prev => ({ ...prev, result: toBinary(bitAnd) }));
    await delay();

    const check = bitAnd === 0;
    setIsPower(check);
    setStatus(check ? `Verification Success: ${val} is a Power of Two!` : `Verification Failed: ${val} is not a Power of Two.`);
    setIsRunning(false);
  };

  const reset = () => {
    setVal(16);
    setIsPower(null);
    setBitDetails({ n: '00000000', nMinus1: '00000000', result: '00000000' });
    setIsRunning(false);
    setStatus('Registers Cleared');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Power of Two</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize the O(1) bit-stripping trick: (n & n-1) == 0.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE BIT ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative w-full z-10 space-y-8">
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-sm space-y-8">
               <div className="grid grid-cols-1 gap-6 font-mono">
                  <div className="flex justify-between items-center text-xl">
                    <span className="text-gray-500 text-sm font-black uppercase">n</span>
                    <span className="text-blue-400 tracking-widest">{bitDetails.n}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl">
                    <span className="text-gray-500 text-sm font-black uppercase">n - 1</span>
                    <span className="text-amber-500 tracking-widest">{bitDetails.nMinus1}</span>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-fuchsia-500 text-sm font-black uppercase">Result (&)</span>
                    <span className={isPower === true ? 'text-emerald-400' : isPower === false ? 'text-red-500' : 'text-white'}>
                      {bitDetails.result}
                    </span>
                  </div>
               </div>

               <div className="flex justify-center pt-4">
                  {isPower === true && <ShieldCheck size={64} className="text-emerald-500 animate-bounce" />}
                  {isPower === false && <ShieldAlert size={64} className="text-red-500" />}
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
              <Binary size={16} className="text-fuchsia-500" /> Arithmetic Input
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <input 
                  type="number" value={val} 
                  onChange={(e) => setVal(parseInt(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Gauge size={14} /> Logic Pace
                    </label>
                    <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                  </div>
                  <input 
                    type="range" min="200" max="2000" step="200"
                    value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startCheck} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> RUN VALIDATION
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET ENGINE
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