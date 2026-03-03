import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, BarChart3, Zap, Gauge } from 'lucide-react';

export default function BubbleSortVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data, setData] = useState([45, 20, 75, 32, 10, 60, 40]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('System Ready');
  
  // Speed Management (Ref used for immediate value access in loops)
  const [speed, setSpeed] = useState(400); 
  const speedRef = useRef(400);

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  // Dynamic Delay Clock
  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const bubbleSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let arr = [...data];
    let n = arr.length;
    let currentSorted = [];

    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        // Break if component is reset (isRunning would be set to false)
        setComparing([j, j + 1]);
        setStatus(`Pass ${i + 1}: Index ${j} vs ${j + 1}`);
        await delay();

        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          
          setData([...arr]); 
          swapped = true;
          await delay();
        }
      }
      currentSorted.push(n - 1 - i);
      setSorted([...currentSorted]);
      if (!swapped) break;
    }
    
    setSorted(Array.from({length: n}, (_, i) => i));
    setComparing([]);
    setIsRunning(false);
    setStatus('Array Fully Sorted');
  };

  const reset = () => {
    setData([45, 20, 75, 32, 10, 60, 40]);
    setComparing([]);
    setSorted([]);
    setIsRunning(false);
    setStatus('Memory Purged');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 space-y-10">
      
      {/* PROFESSIONAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Bubble Sort Engine</h1>
            <p className="text-gray-500 font-medium">Multi-pass execution with variable clock speed.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-end gap-3 md:gap-5 z-10 h-72">
            {data.map((val, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-10 md:w-16 rounded-t-2xl transition-all duration-300 ease-out border-x border-t border-white/10 ${
                    comparing.includes(i) ? 'bg-fuchsia-600 shadow-[0_0_40px_#d946ef88] border-fuchsia-400 scale-110' : 
                    sorted.includes(i) ? 'bg-emerald-500/40 border-emerald-400/50 shadow-[0_0_20px_#10b98122]' : 'bg-white/5'
                  }`}
                  style={{ height: `${val * 2.8}px` }}
                />
                <span className={`mt-4 font-mono text-xs ${comparing.includes(i) ? 'text-fuchsia-400 font-bold' : 'text-gray-600'}`}>
                    {val}
                </span>
              </div>
            ))}
          </div>

          {/* HUD OVERLAY */}
          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10">
              <Zap size={12} className="text-yellow-500" />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{speed}ms Delay</span>
            </div>
          </div>
        </div>

        {/* CONTROL DECK */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Execution Control
            </h3>
            
            <div className="space-y-10">
              {/* SPEED SLIDER */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Pipeline Delay
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="50"
                  value={speed} onChange={handleSpeedChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={bubbleSort} 
                  disabled={isRunning}
                  className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20"
                >
                  <BarChart3 size={18} /> INITIATE FULL SORT
                </button>
                <button 
                  onClick={reset}
                  className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  <RotateCcw size={18} /> RESET ENGINE
                </button>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center">
             <p className="text-[10px] text-gray-500 leading-relaxed italic">
                Adjust the pipeline delay in real-time to observe the $O(n^2)$ quadratic complexity at different execution frequencies.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}