import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, BarChart3, TrendingUp, Target } from 'lucide-react';

export default function KadaneVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const [currentSum, setCurrentSum] = useState(0);
  const [maxSum, setMaxSum] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [bestRange, setBestRange] = useState({ start: 0, end: 0 });
  const [activeStart, setActiveStart] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Kadane Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "max_so_far = current_max = arr[0]\nfor x in arr[1:]:\n    current_max = max(x, current_max + x)\n    max_so_far = max(max_so_far, current_max)\nreturn max_so_far", comp: "O(n) Linear Time" },
    java: { logic: "int maxSoFar = nums[0], currentMax = nums[0];\nfor (int i = 1; i < nums.length; i++) {\n    currentMax = Math.max(nums[i], currentMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currentMax);\n}\nreturn maxSoFar;", comp: "One-Pass Optimization" }
  };

  const startKadane = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let currentMax = data[0];
    let globalMax = data[0];
    let start = 0;
    let end = 0;
    let tempStart = 0;

    setCurrentSum(currentMax);
    setMaxSum(globalMax);
    setCurrentIndex(0);
    setStatus(`Initializing: Starting with first element ${data[0]}`);
    await delay();

    for (let i = 1; i < data.length; i++) {
      setCurrentIndex(i);
      
      if (data[i] > currentMax + data[i]) {
        currentMax = data[i];
        tempStart = i;
        setStatus(`Reset: Current element ${data[i]} is greater than combined sum. Starting new subarray.`);
      } else {
        currentMax += data[i];
        setStatus(`Extend: Adding ${data[i]} to current subarray sum.`);
      }
      
      setCurrentSum(currentMax);
      setActiveStart(tempStart);
      await delay();

      if (currentMax > globalMax) {
        globalMax = currentMax;
        start = tempStart;
        end = i;
        setMaxSum(globalMax);
        setBestRange({ start, end });
        setStatus(`New Record! Global maximum updated to ${globalMax}.`);
      }
      await delay();
    }

    setCurrentIndex(-1);
    setIsRunning(false);
    setStatus(`Analysis Complete. Max Subarray Sum: ${globalMax}`);
  };

  const reset = () => {
    setCurrentSum(0);
    setMaxSum(0);
    setCurrentIndex(-1);
    setBestRange({ start: 0, end: 0 });
    setActiveStart(0);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Kadane's Algorithm</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the linear-time search for the contiguous maximum subarray sum.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL STAGE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative z-10 w-full space-y-16">
            {/* Histogram Bars */}
            <div className="flex justify-center items-end gap-2 md:gap-3 h-48">
              {data.map((val, idx) => {
                const isCurrent = currentIndex === idx;
                const inBest = isRunning ? false : (idx >= bestRange.start && idx <= bestRange.end);
                const inActive = currentIndex !== -1 && idx >= activeStart && idx <= currentIndex;
                
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 max-w-[50px]">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 border-x border-t ${
                        isCurrent ? 'bg-fuchsia-500 border-fuchsia-300 scale-110 z-20 shadow-[0_0_20px_#d946ef88]' :
                        inBest ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_15px_#10b98166]' :
                        inActive ? 'bg-blue-600 border-blue-400 opacity-80' : 'bg-white/5 border-white/5 opacity-30'
                      }`}
                      style={{ height: `${Math.abs(val) * 15 + 10}px`, marginBottom: val < 0 ? '0px' : '0px' }}
                    />
                    <span className={`mt-2 font-mono text-[10px] ${isCurrent ? 'text-fuchsia-400 font-bold' : 'text-gray-600'}`}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Metrics HUD */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Current Sub-Sum</span>
                  <div className="text-2xl font-mono font-bold">{currentSum}</div>
               </div>
               <div className="bg-fuchsia-600/10 p-5 rounded-2xl border border-fuchsia-500/20 text-center">
                  <span className="text-[9px] font-black text-fuchsia-400 uppercase tracking-widest block mb-1">Max Found So Far</span>
                  <div className="text-2xl font-mono font-bold">{maxSum}</div>
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
              <BarChart3 size={16} className="text-fuchsia-500" /> Array Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Propagation Speed
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
                <button onClick={startKadane} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <TrendingUp size={18} /> INITIATE SCAN
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