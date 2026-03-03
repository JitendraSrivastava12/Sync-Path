import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Eye, RotateCcw, ArrowLeft, Globe, Cpu, RefreshCw } from 'lucide-react';

export default function CircularQueueVisualizer() {
  const navigate = useNavigate();
  const SIZE = 8; // Fixed size for circular logic
  const [queue, setQueue] = useState(new Array(SIZE).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('Ring Buffer Initialized');
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('python');

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const PSEUDO_CODE = {
    python: { enq: "rear = (rear + 1) % size", deq: "front = (front + 1) % size", comp: "O(1) Fixed Space" },
    java: { enq: "rear = (rear + 1) % SIZE;", deq: "front = (front + 1) % SIZE;", comp: "Static Memory" },
    cpp: { enq: "rear = (rear + 1) % n;", deq: "front = (front + 1) % n;", comp: "No Element Shifting" },
    c: { enq: "rear = (rear + 1) % MAX;", deq: "front = (front + 1) % MAX;", comp: "Modulo Wrap-around" }
  };

  const enqueue = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);

    // Check Full Condition
    if ((rear + 1) % SIZE === front) {
      setStatus("Overflow: Ring Buffer is Full");
      return;
    }

    setStatus(`Calculating Index: (rear + 1) % ${SIZE}...`);
    const nextRear = (rear + 1) % SIZE;
    setHighlights([nextRear]);
    await delay(600);

    let newQueue = [...queue];
    newQueue[nextRear] = val;
    
    if (front === -1) setFront(0);
    setRear(nextRear);
    setQueue(newQueue);
    
    setStatus(`Enqueued ${val} at index ${nextRear}`);
    setInputValue('');
    await delay(800);
    setHighlights([]);
  };

  const dequeue = async () => {
    if (front === -1) {
      setStatus("Underflow: Buffer Empty");
      return;
    }

    setStatus(`Dequeuing from Front (Index ${front})...`);
    setHighlights([front]);
    await delay(600);

    let newQueue = [...queue];
    newQueue[front] = null;

    if (front === rear) {
      setFront(-1);
      setRear(-1);
    } else {
      setFront((front + 1) % SIZE);
    }

    setQueue(newQueue);
    setHighlights([]);
    setStatus(`Success: Front pointer wrapped/advanced`);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter mb-1">Circular Ring Engine</h1>
            <p className="text-gray-400 font-medium text-xs md:text-lg tracking-tight">Visualize modulo-based wrap-around and static memory reuse.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Logic: <span className="text-fuchsia-500">Modulo Wrap</span>
           </div>
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Size: <span className="text-blue-400">{SIZE}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* 2. THE CIRCULAR VISUALIZER */}
        <div className="lg:col-span-3 flex items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* THE RING */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-[8px] border-white/5 flex items-center justify-center">
            {queue.map((val, i) => {
              const angle = (i * 360) / SIZE;
              return (
                <div 
                  key={i}
                  className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500
                    ${highlights.includes(i) ? 'border-fuchsia-500 bg-fuchsia-500/20 shadow-[0_0_30px_#d946ef44] scale-110 z-20' : 'border-white/10 bg-white/5'}
                    ${front === i ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-[#0c0214]' : ''}
                    ${rear === i ? 'ring-2 ring-fuchsia-500 ring-offset-4 ring-offset-[#0c0214]' : ''}
                  `}
                  style={{ transform: `rotate(${angle}deg) translate(0, -${window.innerWidth < 768 ? '120px' : '150px'}) rotate(-${angle}deg)` }}
                >
                  <span className="text-xs font-mono text-gray-600 mb-1">{i}</span>
                  <span className="font-bold text-lg">{val ?? '-'}</span>
                  
                  {/* Pointer Tags */}
                  {front === i && <div className="absolute -top-8 text-[8px] font-black text-blue-400 uppercase">Front</div>}
                  {rear === i && <div className="absolute -bottom-8 text-[8px] font-black text-fuchsia-400 uppercase">Rear</div>}
                </div>
              );
            })}

            {/* Central HUD */}
            <div className="text-center">
              <RefreshCw className={`mx-auto text-white/10 mb-2 ${status.includes('Shifting') ? 'animate-spin' : ''}`} size={40} />
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{status}</div>
            </div>
          </div>
        </div>

        {/* 3. CONTROL CENTER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Ring Terminal
            </h3>
            <div className="flex flex-col gap-6">
              <input 
                type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                placeholder="Data Value" className="bg-black/40 border border-white/5 rounded-2xl px-7 py-4 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all shadow-inner"
              />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={enqueue} className="btn-action bg-fuchsia-600 hover:bg-fuchsia-500">
                  <LogIn size={18} /> ENQUEUE
                </button>
                <button onClick={dequeue} className="btn-action bg-white/5 border border-white/10 hover:bg-white/10">
                  <LogOut size={18} /> DEQUEUE
                </button>
              </div>
              <button 
                onClick={() => { setQueue(new Array(SIZE).fill(null)); setFront(-1); setRear(-1); setStatus('Buffer Reset'); }}
                className="text-[10px] text-gray-600 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
              >
                <RotateCcw size={14} /> Clear Ring Memory
              </button>
            </div>
          </div>

          {/* Logic Sidecar */}
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                <Globe size={16} className="text-fuchsia-500" /> Logic Snippet
              </h3>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[11px] font-black text-fuchsia-500 outline-none cursor-pointer uppercase">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-black/40 rounded-xl text-[10px] font-mono text-blue-300 border border-white/5 leading-relaxed">
                {PSEUDO_CODE[language].enq} <br/> {PSEUDO_CODE[language].deq}
              </div>
              <div className="p-4 bg-black/40 rounded-xl text-[10px] font-mono text-fuchsia-400 border border-white/5">
                Efficiency: {PSEUDO_CODE[language].comp}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-action { @apply flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black tracking-widest transition-all active:scale-95 shadow-xl; }
      `}</style>
    </div>
  );
}