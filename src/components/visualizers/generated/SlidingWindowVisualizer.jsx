import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Box, Gauge, Code2, Zap, ArrowRight, TrendingUp } from 'lucide-react';

export default function SlidingWindowVisualizer() {
  const navigate = useNavigate();
  const WINDOW_SIZE = 3;
  
  // State Management
  const [data] = useState([4, 2, 1, 7, 8, 1, 2, 8, 1, 0]);
  const [windowRange, setWindowRange] = useState({ start: 0, end: 2 });
  const [currentSum, setCurrentSum] = useState(0);
  const [maxSum, setMaxSum] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Window Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "w_sum = sum(arr[:k])\nmax_s = w_sum\nfor i in range(len(arr) - k):\n    w_sum = w_sum - arr[i] + arr[i+k]\n    max_s = max(max_s, w_sum)", comp: "O(n) - Linear" },
    java: { logic: "int wSum = 0;\nfor(int i=0; i<k; i++) wSum += arr[i];\nfor(int i=k; i<arr.length; i++) {\n    wSum += arr[i] - arr[i-k];\n    max = Math.max(max, wSum);\n}", comp: "Window Re-use" },
    cpp: { logic: "int current = accumulate(v.begin(), v.begin()+k, 0);\nfor (int i=k; i<v.size(); i++) {\n    current += v[i] - v[i-k];\n    res = max(res, current);\n}", comp: "Two-Pointer Logic" },
    c: { logic: "for(i=0; i<k; i++) sum += a[i];\nfor(i=k; i<n; i++) {\n  sum = sum + a[i] - a[i-k];\n  if(sum > max) max = sum;\n}", comp: "Optimized Loop" }
  };

  const startVisualization = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setMaxSum(0);
    
    // Initial Window Sum
    let current = 0;
    setStatus(`Phase 1: Computing initial window [0-${WINDOW_SIZE - 1}]`);
    setWindowRange({ start: 0, end: WINDOW_SIZE - 1 });
    
    for (let i = 0; i < WINDOW_SIZE; i++) {
      current += data[i];
      setCurrentSum(current);
      await delay();
    }
    setMaxSum(current);
    await delay();

    // Slide Phase
    setStatus("Phase 2: Sliding window and reusing sums...");
    for (let i = 1; i <= data.length - WINDOW_SIZE; i++) {
      const newStart = i;
      const newEnd = i + WINDOW_SIZE - 1;
      
      setWindowRange({ start: newStart, end: newEnd });
      
      // The math: subtract previous element, add new element
      const valToRemove = data[i - 1];
      const valToAdd = data[newEnd];
      
      setStatus(`Sum: ${current} - ${valToRemove} (left) + ${valToAdd} (right)`);
      current = current - valToRemove + valToAdd;
      setCurrentSum(current);
      
      if (current > maxSum) {
        setMaxSum(current);
        setStatus(`New Max Sum Found: ${current}!`);
      }
      
      await delay();
    }

    setIsRunning(false);
    setStatus('Analysis Complete');
  };

  const reset = () => {
    setWindowRange({ start: 0, end: 2 });
    setCurrentSum(0);
    setMaxSum(0);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Sliding Window</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize memory reuse and $O(n)$ subarray optimization.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[500px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-end justify-center gap-2 md:gap-4 z-10 w-full h-64">
            {data.map((val, i) => {
              const inWindow = i >= windowRange.start && i <= windowRange.end;
              return (
                <div key={i} className="flex flex-col items-center flex-1 max-w-[50px]">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-500 border-x border-t ${
                      inWindow 
                        ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_25px_#d946ef66] scale-105 z-20' 
                        : 'bg-white/5 border-white/5 opacity-30'
                    }`}
                    style={{ height: `${val * 20 + 20}px` }}
                  />
                  <span className={`mt-3 font-mono text-xs ${inWindow ? 'text-white font-bold' : 'text-gray-800'}`}>
                    {val}
                  </span>
                </div>
              );
            })}
            
            {/* The actual "Window" frame */}
            <div 
              className="absolute bottom-6 border-2 border-fuchsia-500/50 bg-fuchsia-500/5 rounded-2xl transition-all duration-500 pointer-events-none"
              style={{
                left: `calc(${(windowRange.start / data.length) * 100}% + 4px)`,
                width: `calc(${((windowRange.end - windowRange.start + 1) / data.length) * 100}% - 8px)`,
                height: 'calc(100% - 20px)'
              }}
            />
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-emerald-400 font-mono text-[10px] uppercase">
               <TrendingUp size={12} className="mr-1" /> Max Sum: {maxSum}
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-blue-400 font-mono text-[10px] uppercase">
               Current: {currentSum}
            </div>
          </div>
        </div>

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Box size={16} className="text-fuchsia-500" /> Control Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Slide Interval
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
                <button onClick={startVisualization} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <ArrowRight size={18} /> INITIATE SLIDE
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