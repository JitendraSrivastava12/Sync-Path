import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, CircleDot, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function FastSlowPointersVisualizer() {
  const navigate = useNavigate();
  
  // State Management (Linked list nodes)
  const [nodes] = useState([
    { id: 0, next: 1 }, { id: 1, next: 2 }, { id: 2, next: 3 },
    { id: 3, next: 4 }, { id: 4, next: 5 }, { id: 5, next: 2 } // 5 points back to 2 (Cycle)
  ]);
  
  const [pointers, setPointers] = useState({ slow: 0, fast: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [cycleDetected, setCycleDetected] = useState(false);
  const [status, setStatus] = useState('Detection Engine Standby');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "slow, fast = head, head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n    if slow == fast: return True\nreturn False", comp: "O(n) - Cycle Detection" },
    java: { logic: "ListNode slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow == fast) return true;\n}\nreturn false;", comp: "Floyd's Algorithm" },
    cpp: { logic: "while (fast && fast->next) {\n    slow = slow->next;\n    fast = fast->next->next;\n    if (slow == fast) return true;\n}\nreturn false;", comp: "Space: O(1)" },
    c: { logic: "while(f && f->next) {\n  s = s->next;\n  f = f->next->next;\n  if(s == f) return 1;\n}\nreturn 0;", comp: "Two-Pointer Strategy" }
  };

  const startDetection = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCycleDetected(false);
    
    let slow = 0;
    let fast = 0;

    setStatus('Phase 1: Initializing Pointers at Head');
    await delay();

    while (true) {
      // Move pointers
      slow = nodes[slow].next;
      fast = nodes[nodes[fast].next].next;
      
      setPointers({ slow, fast });
      setStatus(`Slow at node ${slow}, Fast at node ${fast}`);
      await delay();

      if (slow === fast) {
        setCycleDetected(true);
        setStatus('COLLISION DETECTED! Cycle confirmed at intercept point.');
        setIsRunning(false);
        return;
      }

      // Safety break for non-cyclic visualization (not used here but good practice)
      if (fast === null || nodes[fast].next === null) {
        setStatus('Fast reached end. No cycle detected.');
        setIsRunning(false);
        return;
      }
    }
  };

  const reset = () => {
    setPointers({ slow: 0, fast: 0 });
    setCycleDetected(false);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Fast & Slow Pointers</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize cyclic intercept logic and $O(1)$ space detection.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex flex-wrap justify-center gap-8 md:gap-12 z-10 w-full max-w-2xl">
            {nodes.map((node, i) => {
              const isSlow = pointers.slow === i;
              const isFast = pointers.fast === i;
              const isCollision = isSlow && isFast && cycleDetected;

              return (
                <div key={i} className="relative flex flex-col items-center">
                  <div 
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center font-mono font-bold text-lg md:text-xl transition-all duration-500 border-2 ${
                      isCollision ? 'bg-red-500/20 border-red-500 shadow-[0_0_40px_#ef4444] scale-125' : 
                      isSlow || isFast ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88]' : 
                      'bg-white/5 border-white/10 text-gray-700'
                    }`}
                  >
                    {i}
                    {node.id === 5 && <div className="absolute -top-6 text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">BACKPTR → 2</div>}
                  </div>
                  
                  <div className="mt-4 flex flex-col items-center gap-1">
                    {isSlow && <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Tortoise (1x)</span>}
                    {isFast && <span className="text-[7px] font-black text-fuchsia-500 uppercase tracking-widest">Hare (2x)</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {cycleDetected && (
              <div className="flex items-center gap-3 px-5 py-2.5 bg-red-500/10 backdrop-blur-2xl rounded-2xl border border-red-500/20 text-red-500 font-mono text-[10px] uppercase">
                <AlertTriangle size={12} /> Cycle Confirmed
              </div>
            )}
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Zap size={16} className="text-fuchsia-500" /> Velocity Control
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Propagation Delay
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
                <button onClick={startDetection} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> INITIATE PURSUIT
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