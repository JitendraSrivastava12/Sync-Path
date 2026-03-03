import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, TrendingUp, BarChart3, ListOrdered } from 'lucide-react';

export default function LisVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [data] = useState([10, 22, 9, 33, 21, 50, 41, 60]);
  const [lis, setLis] = useState(new Array(8).fill(1));
  const [indices, setIndices] = useState({ i: -1, j: -1 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('LIS Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(400);
  const [speed, setSpeed] = useState(400);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "lis = [1] * n\nfor i in range(1, n):\n  for j in range(0, i):\n    if arr[i] > arr[j] and lis[i] < lis[j] + 1:\n      lis[i] = lis[j] + 1\nreturn max(lis)", comp: "O(n²) Time Complexity" },
    java: { logic: "int[] lis = new int[n];\nArrays.fill(lis, 1);\nfor (int i = 1; i < n; i++) {\n  for (int j = 0; j < i; j++) {\n    if (arr[i] > arr[j])\n      lis[i] = Math.max(lis[i], lis[j] + 1);\n  }\n}", comp: "O(1) Auxiliary Space" }
  };

  const startLIS = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let n = data.length;
    let tempLis = new Array(n).fill(1);
    setLis([...tempLis]);

    setStatus("Phase 1: Initializing LIS table with 1s");
    await delay();

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        setIndices({ i, j });
        
        if (data[i] > data[j]) {
          const newVal = tempLis[j] + 1;
          if (newVal > tempLis[i]) {
            tempLis[i] = newVal;
            setLis([...tempLis]);
            setStatus(`Match! ${data[i]} > ${data[j]}. Updating LIS[${i}] to ${newVal}`);
          } else {
            setStatus(`${data[i]} > ${data[j]}, but existing LIS[${i}] is better.`);
          }
        } else {
          setStatus(`${data[i]} <= ${data[j]}. No increase possible.`);
        }
        await delay();
      }
    }

    setIndices({ i: -1, j: -1 });
    setIsRunning(false);
    setStatus(`Sequence Analysis Complete. Max LIS Length: ${Math.max(...tempLis)}`);
  };

  const reset = () => {
    setLis(new Array(8).fill(1));
    setIndices({ i: -1, j: -1 });
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Longest Increasing Subsequence</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Watch the DP table resolve the optimal increasing sequence length.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE DP ARRAY STAGE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative z-10 w-full space-y-12">
            {/* Value Visualization */}
            <div className="flex justify-center items-end gap-2 md:gap-4 h-48">
              {data.map((val, idx) => {
                const isI = indices.i === idx;
                const isJ = indices.j === idx;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 max-w-[60px]">
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-300 border-x border-t ${
                        isI ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_20px_#d946ef88] scale-110' :
                        isJ ? 'bg-blue-600 border-blue-400 scale-105' : 'bg-white/5 border-white/5'
                      }`}
                      style={{ height: `${val * 2}px` }}
                    />
                    <span className={`mt-2 font-mono text-xs ${isI ? 'text-fuchsia-400 font-bold' : isJ ? 'text-blue-400' : 'text-gray-600'}`}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* DP LIS Table */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block text-center">DP Table: LIS[i]</span>
               <div className="flex justify-center gap-2 md:gap-4">
                  {lis.map((val, idx) => (
                    <div key={idx} className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center font-mono font-bold rounded-2xl border-2 transition-all duration-300 ${
                      indices.i === idx ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_15px_#d946ef66]' :
                      indices.j === idx ? 'bg-blue-600/20 border-blue-400' : 'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                      {val}
                    </div>
                  ))}
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
              <ListOrdered size={16} className="text-fuchsia-500" /> Sequence Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Scan Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="50"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startLIS} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <TrendingUp size={18} /> INITIATE ANALYSIS
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