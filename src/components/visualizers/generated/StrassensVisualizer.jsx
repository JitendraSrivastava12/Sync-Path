import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Grid3X3, Layers, Binary } from 'lucide-react';

export default function StrassensVisualizer() {
  const navigate = useNavigate();
  
  // State Management for 4x4 Matrices
  const [matrixA] = useState([
    [1, 2, 3, 4], [5, 6, 7, 8], [1, 0, 1, 0], [0, 1, 0, 1]
  ]);
  const [matrixB] = useState([
    [1, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 1, 1]
  ]);
  
  const [activeSub, setActiveSub] = useState(null); // Which quadrant is being processed
  const [activeProduct, setActiveProduct] = useState(null); // M1 through M7
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Matrix Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const STRASSEN_INFO = [
    { id: 'M1', logic: "(A11 + A22) * (B11 + B22)", desc: "Main Diagonal Sum" },
    { id: 'M2', logic: "(A21 + A22) * B11", desc: "Lower Row Sum" },
    { id: 'M3', logic: "A11 * (B12 - B22)", desc: "Upper Right Difference" },
    { id: 'M4', logic: "A22 * (B21 - B11)", desc: "Lower Left Difference" },
    { id: 'M5', logic: "(A11 + A12) * B22", desc: "Upper Row Sum" },
    { id: 'M6', logic: "(A21 - A11) * (B11 + B12)", desc: "Left Column Difference" },
    { id: 'M7', logic: "(A12 - A22) * (B21 + B22)", desc: "Right Column Difference" }
  ];

  const startStrassen = async () => {
    if (isRunning) return;
    setIsRunning(true);

    setStatus('Phase 1: Partitioning 4x4 into 2x2 Sub-matrices');
    setActiveSub('ALL');
    await delay();

    for (const p of STRASSEN_INFO) {
      setActiveProduct(p.id);
      setStatus(`Calculating ${p.id}: ${p.logic}`);
      await delay();
    }

    setActiveProduct(null);
    setActiveSub(null);
    setStatus('Phase 2: Combining Products into Resultant Matrix');
    setIsRunning(false);
  };

  const reset = () => {
    setActiveSub(null);
    setActiveProduct(null);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Strassen's Algorithm</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight">Visualize sub-matrix partitioning and the optimized 7-multiplication logic.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-12 z-10 w-full justify-center">
            {/* Matrix A */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block text-center">Matrix A</span>
               <div className="grid grid-cols-4 gap-1 p-2 bg-white/5 rounded-xl border border-white/10">
                 {matrixA.flat().map((val, i) => (
                   <div key={i} className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center font-mono text-xs md:text-sm rounded ${activeSub ? 'border border-fuchsia-500/30 bg-fuchsia-500/5' : 'bg-white/5'}`}>
                     {val}
                   </div>
                 ))}
               </div>
            </div>

            <div className="text-2xl font-black text-fuchsia-500">×</div>

            {/* Matrix B */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block text-center">Matrix B</span>
               <div className="grid grid-cols-4 gap-1 p-2 bg-white/5 rounded-xl border border-white/10">
                 {matrixB.flat().map((val, i) => (
                   <div key={i} className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center font-mono text-xs md:text-sm rounded ${activeSub ? 'border border-blue-500/30 bg-blue-500/5' : 'bg-white/5'}`}>
                     {val}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Product HUD Overlay */}
          {activeProduct && (
            <div className="absolute top-10 right-10 animate-in zoom-in duration-300">
               <div className="bg-fuchsia-600 p-6 rounded-3xl shadow-[0_0_50px_rgba(217,70,239,0.3)] border border-fuchsia-400">
                  <span className="text-[10px] font-black text-white/70 uppercase mb-1 block">Active Product</span>
                  <div className="text-2xl font-black tracking-tighter">{activeProduct}</div>
               </div>
            </div>
          )}

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
              <Layers size={16} className="text-fuchsia-500" /> Computation Stack
            </h3>
            
            <div className="space-y-8">
               <div className="grid grid-cols-1 gap-2">
                  {STRASSEN_INFO.map((item) => (
                    <div key={item.id} className={`p-3 rounded-xl border transition-all duration-300 flex justify-between items-center ${activeProduct === item.id ? 'bg-fuchsia-500/20 border-fuchsia-500' : 'bg-white/5 border-white/5 opacity-40'}`}>
                      <div>
                        <div className="text-[10px] font-black">{item.id}</div>
                        <div className="text-[9px] font-mono text-gray-400">{item.logic}</div>
                      </div>
                      <div className="text-[8px] font-black text-fuchsia-400 uppercase">{item.desc}</div>
                    </div>
                  ))}
               </div>

              <div className="flex flex-col gap-4">
                <button onClick={startStrassen} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> START RECURSION
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}