import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, RotateCcw, ArrowLeft, Globe, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DequeVisualizer() {
  const navigate = useNavigate();
  const [deque, setDeque] = useState([20, 30, 40]);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('Deque Engine Initialized');
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('python');

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const PSEUDO_CODE = {
    python: { f_enq: "dq.appendleft(val)", r_enq: "dq.append(val)", f_deq: "dq.popleft()", r_deq: "dq.pop()", comp: "O(1) Both Ends" },
    java: { f_enq: "dq.addFirst(val);", r_enq: "dq.addLast(val);", f_deq: "dq.removeFirst();", r_deq: "dq.removeLast();", comp: "Interface: Deque" },
    cpp: { f_enq: "dq.push_front(val);", r_enq: "dq.push_back(val);", f_deq: "dq.pop_front();", r_deq: "dq.pop_back();", comp: "std::deque" },
    c: { f_enq: "insertFront(val);", r_enq: "insertRear(val);", f_deq: "deleteFront();", r_deq: "deleteRear();", comp: "Circular Array Logic" }
  };

  // --- OPERATIONS ---
  const addFront = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    setStatus(`PUSH FRONT: Inserting ${val} at index 0...`);
    setHighlights(['front']);
    await delay(500);
    setDeque([val, ...deque]);
    setHighlights([0]);
    setInputValue('');
    await delay(800);
    setHighlights([]);
    setStatus('Successfully added to Front');
  };

  const addRear = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    setStatus(`PUSH REAR: Appending ${val} to end...`);
    setHighlights(['rear']);
    await delay(500);
    setDeque([...deque, val]);
    setHighlights([deque.length]);
    setInputValue('');
    await delay(800);
    setHighlights([]);
    setStatus('Successfully added to Rear');
  };

  const removeFront = async () => {
    if (deque.length === 0) return setStatus("Underflow: Deque Empty");
    setStatus("POP FRONT: Removing head element...");
    setHighlights([0]);
    await delay(600);
    setDeque(deque.slice(1));
    setHighlights([]);
    setStatus("Front element purged");
  };

  const removeRear = async () => {
    if (deque.length === 0) return setStatus("Underflow: Deque Empty");
    setStatus("POP REAR: Removing tail element...");
    setHighlights([deque.length - 1]);
    await delay(600);
    setDeque(deque.slice(0, -1));
    setHighlights([]);
    setStatus("Rear element purged");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-6 md:space-y-12 text-white">
      
      {/* 1. ARCHITECTURAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 md:py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] rounded-full shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter mb-1 uppercase">Deque Double-Engine</h1>
            <p className="text-gray-400 font-medium text-xs md:text-lg tracking-tight">Visualize symmetric data injection and extraction.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             End: <span className="text-fuchsia-500">Double</span>
           </div>
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Complexity: <span className="text-blue-400">O(1)</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-center gap-4 z-10 py-20 px-10 overflow-x-auto no-scrollbar w-full justify-center">
            {deque.map((val, i) => (
              <div key={i} className="flex flex-col items-center shrink-0 animate-in zoom-in-95 duration-300">
                <div className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-mono font-bold text-xl md:text-2xl transition-all duration-500 border-2
                  ${highlights.includes(i) ? 'border-fuchsia-500 bg-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,239,0.3)] scale-110 z-20' : 'border-white/10 bg-white/5 text-gray-400'}
                `}>
                  {val}
                </div>
                <div className="mt-4 text-[10px] font-mono text-gray-700 uppercase tracking-tighter">
                  {i === 0 ? 'Front' : i === deque.length - 1 ? 'Rear' : `idx:${i}`}
                </div>
              </div>
            ))}
            {deque.length === 0 && <div className="text-[11px] font-black text-gray-800 uppercase tracking-widest italic">Buffer Empty</div>}
          </div>

          {/* Flow Direction UI */}
          <div className="absolute inset-x-12 flex justify-between opacity-10 pointer-events-none">
            <ChevronLeft size={100} />
            <ChevronRight size={100} />
          </div>

          {/* Status HUD */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl">
            <div className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[9px] md:text-[11px] font-mono uppercase tracking-widest">{status}</span>
          </div>
        </div>

        {/* 3. DUAL-ENDED CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Deque Terminal
            </h3>
            <div className="flex flex-col gap-6">
              <input 
                type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                placeholder="Packet Value" className="bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all shadow-inner"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <p className="text-[8px] font-bold text-gray-600 uppercase text-center">Front Operations</p>
                   <button onClick={addFront} className="btn-deque bg-blue-600 hover:bg-blue-500 w-full"><LogIn size={16} className="rotate-180" /> PUSH</button>
                   <button onClick={removeFront} className="btn-deque bg-white/5 border border-white/10 w-full"><LogOut size={16} /> POP</button>
                </div>
                <div className="space-y-2">
                   <p className="text-[8px] font-bold text-gray-600 uppercase text-center">Rear Operations</p>
                   <button onClick={addRear} className="btn-deque bg-fuchsia-600 hover:bg-fuchsia-500 w-full"><LogIn size={16} /> PUSH</button>
                   <button onClick={removeRear} className="btn-deque bg-white/5 border border-white/10 w-full"><LogOut size={16} className="rotate-180" /> POP</button>
                </div>
              </div>
              
              <button onClick={() => {setDeque([20,30,40]); setStatus('Ready'); setHighlights([])}} className="text-[10px] text-gray-600 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
                <RotateCcw size={14} /> System Reset
              </button>
            </div>
          </div>

          {/* Logic Sidecar */}
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                <Globe size={16} className="text-fuchsia-500" /> Source Snippet
              </h3>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[11px] font-black text-fuchsia-500 outline-none cursor-pointer uppercase">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl text-[10px] font-mono text-blue-300 border border-white/5 leading-relaxed">
                {language === 'python' ? PSEUDO_CODE[language].f_enq : PSEUDO_CODE[language].f_deq}
              </div>
              <div className="p-4 bg-black/40 rounded-xl text-[10px] font-mono text-fuchsia-400 border border-white/5">
                Metric: {PSEUDO_CODE[language].comp}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-deque { @apply flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-xl; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}