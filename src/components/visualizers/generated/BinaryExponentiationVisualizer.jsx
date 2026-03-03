import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Binary, Hash, Calculator } from 'lucide-react';

export default function BinaryExponentiationVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [base, setBase] = useState(3);
  const [exponent, setExponent] = useState(13);
  const [result, setResult] = useState(1);
  const [currentBase, setCurrentBase] = useState(3);
  const [currentExp, setCurrentExp] = useState(13);
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Computation Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "res = 1\nwhile n > 0:\n    if n % 2 == 1:\n        res *= a\n    a *= a\n    n //= 2\nreturn res", comp: "O(log n) Efficiency" },
    java: { logic: "long res = 1;\nwhile (n > 0) {\n    if ((n & 1) == 1)\n        res *= a;\n    a *= a;\n    n >>= 1;\n}\nreturn res;", comp: "Bitwise Optimization" },
    cpp: { logic: "long long res = 1;\nwhile (n > 0) {\n    if (n & 1) res *= a;\n    a *= a;\n    n >>= 1;\n}\nreturn res;", comp: "Iterative Squaring" },
    c: { logic: "long res = 1;\nwhile(n > 0) {\n  if(n % 2 == 1) res *= a;\n  a *= a; n /= 2;\n}\nreturn res;", comp: "Logarithmic Power" }
  };

  const startCalculation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setSteps([]);
    
    let a = base;
    let n = exponent;
    let res = 1;

    setCurrentBase(a);
    setCurrentExp(n);
    setResult(res);

    setStatus('Phase 1: Initializing Binary Pipeline');
    await delay();

    while (n > 0) {
      const isOdd = n % 2 === 1;
      setStatus(isOdd ? `Exponent ${n} is ODD: Multiplying result by current base.` : `Exponent ${n} is EVEN: Result remains same.`);
      
      if (isOdd) {
        res *= a;
        setResult(res);
      }
      
      setSteps(prev => [...prev, { n, a, res, bit: isOdd ? 1 : 0 }]);
      await delay();

      n = Math.floor(n / 2);
      a *= a;

      if (n > 0) {
        setStatus(`Squaring base and halving exponent...`);
        setCurrentBase(a);
        setCurrentExp(n);
        await delay();
      }
    }

    setIsRunning(false);
    setStatus(`Computation Complete: ${base}^${exponent} = ${res}`);
  };

  const reset = () => {
    setBase(3);
    setExponent(13);
    setResult(1);
    setCurrentBase(3);
    setCurrentExp(13);
    setSteps([]);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Binary Exponentiation</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize logarithmic power calculation through squaring and bit-shifting.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-between min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative w-full z-10 space-y-12">
            {/* Registers Display */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest mb-2 block">Current Base (a)</span>
                <span className="text-2xl font-mono font-bold truncate block">{currentBase.toLocaleString()}</span>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 block">Exponent (n)</span>
                <span className="text-2xl font-mono font-bold block">{currentExp}</span>
              </div>
              <div className="bg-fuchsia-600/10 p-6 rounded-3xl border border-fuchsia-500/20 text-center">
                <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-2 block">Accumulator (res)</span>
                <span className="text-2xl font-mono font-bold truncate block">{result.toLocaleString()}</span>
              </div>
            </div>

            {/* History Pipeline */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] text-center">Calculation Stack</p>
              <div className="flex flex-col-reverse gap-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${step.bit ? 'bg-fuchsia-600' : 'bg-gray-800'}`}>
                        {step.bit}
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">
                        {step.bit ? `(res × ${step.a.toLocaleString()})` : '(skip multiply)'}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-fuchsia-400">→ {step.res.toLocaleString()}</span>
                  </div>
                ))}
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
              <Calculator size={16} className="text-fuchsia-500" /> Arithmetic Input
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base (a)</label>
                  <input 
                    type="number" value={base} onChange={(e) => setBase(parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Power (n)</label>
                  <input 
                    type="number" value={exponent} onChange={(e) => setExponent(parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Pipeline Clock
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="200" max="2000" step="200"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startCalculation} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Binary size={18} /> START CALCULATION
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> CLEAR REGISTERS
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