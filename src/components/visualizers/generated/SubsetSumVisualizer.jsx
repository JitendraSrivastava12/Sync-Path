import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, GitBranch, Plus, Minus, Target } from 'lucide-react';

export default function SubsetSumVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [elements] = useState([3, 1, 4]);
  const [targetSum, setTargetSum] = useState(4);
  const [currentSubset, setCurrentSubset] = useState([]);
  const [allSubsets, setAllSubsets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Decision Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def find_subsets(idx, current):\n  if idx == len(nums):\n    if sum(current) == target:\n      res.append(current[:])\n    return\n  # Include\n  current.append(nums[idx])\n  find_subsets(idx + 1, current)\n  # Exclude\n  current.pop()\n  find_subsets(idx + 1, current)", comp: "O(2ⁿ) Complexity" },
    java: { logic: "void backtrack(int idx, List<Integer> current) {\n  if (idx == nums.length) {\n    if (currentSum == target) res.add(new ArrayList<>(current));\n    return;\n  }\n  current.add(nums[idx]);\n  backtrack(idx + 1, current);\n  current.remove(current.size() - 1);\n  backtrack(idx + 1, current);\n}", comp: "Include/Exclude Logic" }
  };

  const findSubsets = async (idx, current, runningSum) => {
    setCurrentIndex(idx);
    
    // Base Case
    if (idx === elements.length) {
      const isTarget = runningSum === targetSum;
      const subsetCopy = [...current];
      setAllSubsets(prev => [...prev, { data: subsetCopy, isTarget }]);
      
      setStatus(isTarget ? `Target Matched: [${subsetCopy.join(', ')}]` : `Leaf Reached: [${subsetCopy.join(', ')}]`);
      await delay();
      return;
    }

    const val = elements[idx];

    // Branch 1: Include
    setStatus(`Decision: Include ${val} in subset`);
    setCurrentSubset([...current, val]);
    await delay();
    await findSubsets(idx + 1, [...current, val], runningSum + val);

    // Branch 2: Exclude
    setCurrentIndex(idx); // Return context for visual clarity
    setStatus(`Decision: Exclude ${val} from subset`);
    setCurrentSubset([...current]);
    await delay();
    await findSubsets(idx + 1, [...current], runningSum);
  };

  const startVisualizer = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setAllSubsets([]);
    setCurrentSubset([]);
    await findSubsets(0, [], 0);
    setIsRunning(false);
    setCurrentIndex(-1);
    setStatus('Power Set Generation Complete.');
  };

  const reset = () => {
    setCurrentSubset([]);
    setAllSubsets([]);
    setCurrentIndex(-1);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Subset Sum</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the O(2ⁿ) recursive state space using the Include-Exclude pattern.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL STAGE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative z-10 w-full space-y-12">
            {/* Input Array with Pointer */}
            <div className="flex justify-center gap-4 items-end h-32">
              {elements.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-mono font-bold text-xl md:text-2xl border-2 transition-all duration-300 ${
                    currentIndex === idx ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_30px_#d946ef88] scale-110' : 'bg-white/5 border-white/10 text-gray-600'
                  }`}>
                    {val}
                  </div>
                  {currentIndex === idx && <Zap size={16} className="text-fuchsia-500 animate-bounce" />}
                </div>
              ))}
            </div>

            {/* Current Accumulator */}
            <div className="flex justify-center gap-2 py-4">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest self-center mr-4">Active Subset:</span>
              {currentSubset.map((val, i) => (
                <div key={i} className="px-4 py-2 bg-fuchsia-600 rounded-xl text-xs font-bold animate-in slide-in-from-bottom-2">
                  {val}
                </div>
              ))}
              {currentSubset.length === 0 && <span className="text-gray-800 italic text-xs">Empty [ ]</span>}
            </div>

            {/* Set Bank */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] block text-center">Power Set Archive</span>
               <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto no-scrollbar p-4 bg-white/[0.02] rounded-3xl border border-white/5">
                  {allSubsets.map((item, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded-full font-mono text-[10px] border transition-all animate-in zoom-in ${
                      item.isTarget ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'bg-white/5 border-white/10 text-gray-600'
                    }`}>
                      [{item.data.join(', ') || '∅'}]
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
              <GitBranch size={16} className="text-fuchsia-500" /> Decision Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} /> Goal Sum
                  </label>
                  <input 
                    type="number" value={targetSum} 
                    onChange={(e) => setTargetSum(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Gauge size={14} /> Execution Speed
                    </label>
                    <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                  </div>
                  <input 
                    type="range" min="100" max="2000" step="100"
                    value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startVisualizer} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> GENERATE SUBSETS
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