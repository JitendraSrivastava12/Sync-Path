import React, { useState } from 'react';
import { LogIn, LogOut, Eye, RotateCcw, Code2, Cpu, ArrowLeft, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QueueVisualizer() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([10, 20, 30]);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('Queue Active');
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('python');

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const PSEUDO_CODE = {
    python: { enq: "queue.append(val)", deq: "queue.pop(0)", peek: "queue[0]", comp: "O(n) for pop(0)" },
    java: { enq: "queue.add(val);", deq: "queue.poll();", peek: "queue.peek();", comp: "O(1) - LinkedList" },
    cpp: { enq: "q.push(val);", deq: "q.pop();", peek: "q.front();", comp: "O(1) - Standard" },
    c: { enq: "q[++rear] = val;", deq: "val = q[++front];", peek: "return q[front+1];", comp: "O(1) - Static" }
  };

  const enqueue = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    setStatus(`ENQUEUE: ${val} -> REAR`);
    setHighlights(['rear-target']);
    await delay(500);
    setQueue([...queue, val]);
    setHighlights([queue.length]);
    setStatus(`Success: ${val} added`);
    setInputValue('');
    await delay(800);
    setHighlights([]);
  };

  const dequeue = async () => {
    if (queue.length === 0) {
      setStatus("Underflow Error");
      return;
    }
    setStatus(`DEQUEUE: Extracting FRONT...`);
    setHighlights([0]);
    await delay(600);
    const newQueue = [...queue];
    newQueue.shift();
    setQueue(newQueue);
    setHighlights([]);
    setStatus(`Success: Shifted out`);
  };

  const peek = async () => {
    if (queue.length === 0) return;
    setHighlights([0]);
    setStatus(`PEEK: Front is ${queue[0]}`);
    await delay(1200);
    setHighlights([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* 1. RESPONSIVE HEADER WITH BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* GO BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold text-xs sm:text-sm md:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">FIFO Queue Engine</h1>
            <p className="text-gray-400 font-medium tracking-tight text-xs sm:text-sm">Visualize First-In-First-Out data flow & pointer sync.</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
           <div className="px-2 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[8px] sm:text-xs font-mono text-gray-400 uppercase tracking-widest">
             Type: <span className="text-fuchsia-500">Linear</span>
           </div>
           <div className="px-2 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[8px] sm:text-xs font-mono text-gray-400 uppercase tracking-widest">
             Front/Rear: <span className="text-blue-400">Dynamic</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0f011a] rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/5 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="relative flex items-center w-full overflow-x-auto pb-12 pt-16 no-scrollbar z-10">
              <div className="flex items-center gap-3 md:gap-4 px-8 mx-auto border-y-[4px] border-white/10 bg-white/[0.01] min-w-max py-6">
                {queue.map((val, i) => (
                  <div key={i} className="relative flex flex-col items-center">
                    {i === 0 && (
                      <div className="absolute -top-12 flex flex-col items-center">
                        <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">Front</span>
                        <ArrowRight size={14} className="text-blue-400 rotate-90" />
                      </div>
                    )}
                    {i === queue.length - 1 && queue.length > 1 && (
                      <div className="absolute -top-12 flex flex-col items-center">
                        <span className="text-[8px] font-bold text-fuchsia-400 uppercase tracking-widest mb-1">Rear</span>
                        <ArrowRight size={14} className="text-fuchsia-500 rotate-90" />
                      </div>
                    )}
                    <div className={`
                      w-10 sm:w-14 h-10 sm:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-300 border-2
                      ${highlights.includes(i) ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-110 z-20' : 'border-white/10 bg-white/5 text-gray-400'}
                    `}>
                      {val}
                    </div>
                  </div>
                ))}
                {queue.length === 0 && (
                  <div className="px-12 py-6 text-[10px] font-black text-gray-800 uppercase tracking-widest italic">Empty</div>
                )}
              </div>
            </div>

            {/* STATUS HUD */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-2xl rounded-xl border border-white/10">
              <div className="relative flex h-2 w-2">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]"></div>
              </div>
              <span className="text-[8px] sm:text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>

          {/* COMMAND CENTER */}
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between backdrop-blur-xl">
            <input 
              type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value" className="input-field px-3 py-2 text-sm w-full md:w-32"
            />
            <div className="flex gap-2 w-full md:w-auto flex-wrap">
              <button onClick={enqueue} className="btn-action flex-1 bg-fuchsia-600 hover:bg-fuchsia-500"><LogIn size={16} /> ENQ</button>
              <button onClick={dequeue} className="btn-action flex-1 bg-white/5 border border-white/10 hover:bg-white/10"><LogOut size={16} /> DEQ</button>
              <button onClick={peek} className="btn-action flex-1 bg-white/5 border border-white/10 hover:bg-white/10"><Eye size={16} /> PEEK</button>
              <button onClick={() => {setQueue([]); setStatus('Reset'); setHighlights([])}} className="btn-action px-3 bg-white/5 border border-white/10 hover:bg-white/10"><RotateCcw size={16} /></button>
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}
        <aside className="space-y-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col space-y-4 text-[10px]">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-500 uppercase flex items-center gap-1">
                <Globe size={12} className="text-fuchsia-500" /> Environment
              </h3>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent font-black text-fuchsia-500 outline-none cursor-pointer uppercase">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>

            <div>
              <p className="font-bold text-gray-600 mb-1 uppercase">FIFO Operations</p>
              <div className="p-2 bg-black/40 rounded-xl font-mono text-blue-300 border border-white/5 whitespace-pre">
                {PSEUDO_CODE[language].enq}{"\n"}{PSEUDO_CODE[language].deq}
              </div>
            </div>

            <div>
              <p className="font-bold text-gray-600 mb-1 uppercase">Complexity</p>
              <div className="p-2 bg-black/40 rounded-xl font-mono text-fuchsia-400 border border-white/5">{PSEUDO_CODE[language].comp}</div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .input-field {
          @apply bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all placeholder:text-gray-500;
        }
        .btn-action {
          @apply flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 text-white shadow;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}