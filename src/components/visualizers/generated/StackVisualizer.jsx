import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, Eye, RotateCcw, Code2, Cpu, ArrowRight, ArrowLeft, Globe } from 'lucide-react';

export default function StackVisualizer() {
  const navigate = useNavigate();
  const [stack, setStack] = useState([10, 20, 30]);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('System Ready');
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('python');

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  // --- POLYMORPHIC PSEUDOCODE ---
  const PSEUDO_CODE = {
    python: { push: "stack.append(val)", pop: "stack.pop()", peek: "stack[-1]", comp: "O(1) - Amortized" },
    java: { push: "stack.push(val);", pop: "stack.pop();", peek: "stack.peek();", comp: "O(1) - Constant" },
    cpp: { push: "s.push(val);", pop: "s.pop();", peek: "s.top();", comp: "O(1) - Constant" },
    c: { push: "stack[++top] = val;", pop: "return stack[top--];", peek: "return stack[top];", comp: "O(1) - Static" }
  };

  // --- CORE OPERATIONS ---
  const push = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    setStatus(`PUSH: Allocating memory for ${val}...`);
    
    setHighlights(['active-input']);
    await delay(400);
    setStack([...stack, val]);
    setHighlights([stack.length]); 
    setStatus(`Success: ${val} pushed to TOP`);
    setInputValue('');
    
    await delay(800);
    setHighlights([]);
  };

  const pop = async () => {
    if (stack.length === 0) {
      setStatus("Error: Stack Underflow");
      return;
    }
    const targetIdx = stack.length - 1;
    setStatus(`POP: Removing element ${stack[targetIdx]}...`);
    setHighlights([targetIdx]);
    
    await delay(600);
    const newStack = [...stack];
    newStack.pop();
    setStack(newStack);
    setHighlights([]);
    setStatus(`Success: TOP element purged`);
  };

  const peek = async () => {
    if (stack.length === 0) {
      setStatus("Stack is Empty");
      return;
    }
    const topIdx = stack.length - 1;
    setHighlights([topIdx]);
    setStatus(`PEEK: Current TOP is ${stack[topIdx]}`);
    await delay(1200);
    setHighlights([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-6 md:space-y-12">
      
      {/* 1. PROFESSIONAL HEADER WITH BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold text-xs md:text-base rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>

          <div>
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter mb-1">LIFO Stack Engine</h1>
            <p className="text-gray-400 font-medium text-xs md:text-lg tracking-tight">Visualize Last-In-First-Out access patterns.</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
           <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Type: <span className="text-fuchsia-500">Linear</span>
           </div>
           <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Complexity: <span className="text-blue-400">O(1)</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
        
        {/* 2. THE VISUAL ENGINE (The "Well") */}
        <div className="lg:col-span-3 flex flex-col items-center justify-end space-y-8 min-h-[400px] md:min-h-[600px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-20 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Dynamic Top Pointer */}
          {stack.length > 0 && (
            <div className="absolute left-1/2 -translate-x-24 md:-translate-x-40 flex items-center gap-3 md:gap-6 transition-all duration-700 ease-out z-20" 
                 style={{ bottom: `${stack.length * (window.innerWidth < 768 ? 60 : 88) + (window.innerWidth < 768 ? 40 : 84)}px` }}>
              <div className="flex flex-col items-end">
                <span className="text-[8px] md:text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">Top</span>
              </div>
              <ArrowRight size={20} className="text-fuchsia-500" />
            </div>
          )}

          {/* The Stack Column */}
          <div className="flex flex-col-reverse w-32 md:w-56 border-x-[4px] md:border-x-[6px] border-b-[4px] md:border-b-[6px] border-white/10 rounded-b-[1.5rem] md:rounded-b-[2.5rem] p-3 md:p-6 gap-3 md:gap-5 bg-white/[0.01] z-10">
            {stack.map((val, i) => (
              <div key={i} className={`
                w-full h-12 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center font-mono font-bold text-lg md:text-2xl transition-all duration-500 border-2
                ${highlights.includes(i) ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-[0_0_30px_rgba(217,70,239,0.3)] scale-105 z-20' : 'border-white/10 bg-white/5 text-gray-400'}
              `}>
                {val}
              </div>
            ))}
            {stack.length === 0 && (
              <div className="h-16 md:h-32 flex items-center justify-center text-[8px] md:text-[11px] font-black text-gray-800 uppercase tracking-widest italic">Underflow</div>
            )}
          </div>

          {/* Status HUD */}
          <div className="absolute bottom-4 left-4 md:bottom-12 md:left-12 flex items-center gap-2 md:gap-4 px-4 py-2 md:px-6 md:py-3 bg-black/60 backdrop-blur-3xl rounded-xl md:rounded-2xl border border-white/10 shadow-2xl">
            <div className="relative flex h-2 w-2 md:h-3 md:w-3">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]"></div>
            </div>
            <span className="text-[9px] md:text-[11px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
          </div>
        </div>

        {/* 3. CONTROL CENTER & PSEUDOCODE */}
        <div className="lg:col-span-2 space-y-4 md:space-y-8">
          <div className="p-6 md:p-10 bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Terminal
            </h3>
            <div className="flex flex-col gap-4 md:gap-6">
              <input 
                type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                placeholder="Integer Value" className="bg-black/40 border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-7 md:py-5 text-white text-sm md:text-base font-mono focus:border-fuchsia-500/50 outline-none transition-all shadow-inner"
              />
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <button onClick={push} className="btn-stack bg-fuchsia-600 hover:bg-fuchsia-500">
                  <ArrowUp size={16} /> <span className="text-[9px] md:text-[11px]">PUSH</span>
                </button>
                <button onClick={pop} className="btn-stack bg-white/5 border border-white/10 hover:bg-white/10">
                  <ArrowDown size={16} /> <span className="text-[9px] md:text-[11px]">POP</span>
                </button>
                <button onClick={peek} className="btn-stack bg-white/5 border border-white/10 hover:bg-white/10">
                  <Eye size={16} /> <span className="text-[9px] md:text-[11px]">PEEK</span>
                </button>
              </div>
              <button onClick={() => {setStack([]); setStatus('Purged');}} className="mt-2 text-[8px] md:text-[10px] font-bold text-gray-700 hover:text-red-400 flex items-center justify-center gap-2 uppercase tracking-widest transition-all group">
                <RotateCcw size={14} className="group-hover:rotate-180 transition-all duration-500" /> Clear Memory
              </button>
            </div>
          </div>

          {/* Logic Sidecar (Hidden on very small mobile) */}
          <div className="hidden sm:block p-6 md:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem]">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                <Globe size={16} className="text-fuchsia-500" /> Logic
              </h3>
              <select 
                value={language} onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[10px] md:text-[11px] font-black text-fuchsia-500 outline-none cursor-pointer uppercase"
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>
            <div className="space-y-6 md:space-y-10">
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-gray-700 mb-2 uppercase tracking-widest">Snippet</p>
                <div className="p-4 md:p-5 bg-black/40 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-mono text-blue-300 border border-white/5 leading-relaxed">
                  {PSEUDO_CODE[language].push} <br/> {PSEUDO_CODE[language].pop}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-stack {
          @apply flex items-center justify-center gap-1 md:gap-3 py-3 md:py-5 rounded-xl md:rounded-2xl font-black tracking-widest text-white transition-all active:scale-95 shadow-xl;
        }
      `}</style>
    </div>
  );
}