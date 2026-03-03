import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Layers, GitBranch, Shuffle } from 'lucide-react';

export default function PermutationVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [elements] = useState([1, 2, 3]);
  const [currentArr, setCurrentArr] = useState([1, 2, 3]);
  const [permutations, setPermutations] = useState([]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Permutation Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def permute(arr, l, r):\n  if l == r:\n    res.append(arr[:])\n  for i in range(l, r + 1):\n    arr[l], arr[i] = arr[i], arr[l]\n    permute(arr, l + 1, r)\n    arr[l], arr[i] = arr[i], arr[l] # Backtrack", comp: "O(n * n!) Complexity" },
    java: { logic: "private void backtrack(List<Integer> nums, int start) {\n  if (start == nums.size()) {\n    res.add(new ArrayList<>(nums));\n    return;\n  }\n  for (int i = start; i < nums.size(); i++) {\n    Collections.swap(nums, start, i);\n    backtrack(nums, start + 1);\n    Collections.swap(nums, start, i);\n  }\n}", comp: "Recursive Swapping" }
  };

  const generatePermutations = async (arr, l, r) => {
    if (l === r) {
      const found = [...arr];
      setPermutations(prev => [...prev, found]);
      setStatus(`Leaf Reached: Added [${found.join(', ')}] to result.`);
      await delay();
      return;
    }

    for (let i = l; i <= r; i++) {
      // Highlight swap
      setActiveIndices([l, i]);
      setStatus(`Swapping index ${l} and ${i} to fix element ${arr[i]}`);
      await delay();

      // Perform swap
      [arr[l], arr[i]] = [arr[i], arr[l]];
      setCurrentArr([...arr]);
      await delay();

      // Recurse
      await generatePermutations(arr, l + 1, r);

      // Backtrack (swap back)
      setActiveIndices([l, i]);
      setStatus(`Backtracking: Swapping back index ${l} and ${i}`);
      [arr[l], arr[i]] = [arr[i], arr[l]];
      setCurrentArr([...arr]);
      await delay();
      setActiveIndices([]);
    }
  };

  const startVisualizer = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setPermutations([]);
    const arr = [1, 2, 3];
    await generatePermutations(arr, 0, arr.length - 1);
    setIsRunning(false);
    setStatus('All Permutations Generated.');
  };

  const reset = () => {
    setCurrentArr([1, 2, 3]);
    setPermutations([]);
    setActiveIndices([]);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Permutation Engine</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the O(n!) recursive swap-and-backtrack state space.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE VISUAL STAGE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative z-10 w-full space-y-16">
            {/* Active Array State */}
            <div className="flex justify-center gap-4">
              {currentArr.map((val, idx) => (
                <div key={idx} className={`w-16 h-20 md:w-24 md:h-32 rounded-3xl flex items-center justify-center font-mono font-bold text-2xl md:text-4xl transition-all duration-300 border-2 ${
                  activeIndices.includes(idx) ? 'bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_40px_#d946ef88] scale-110' : 'bg-white/5 border-white/10 text-gray-400'
                }`}>
                  {val}
                </div>
              ))}
            </div>

            {/* Generated List HUD */}
            <div className="space-y-4">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] block text-center">Resultant Set (Found: {permutations.length})</span>
               <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto no-scrollbar p-4 bg-white/[0.02] rounded-3xl border border-white/5">
                  {permutations.map((p, i) => (
                    <div key={i} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-xs animate-in zoom-in">
                      [{p.join(', ')}]
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
              <GitBranch size={16} className="text-fuchsia-500" /> Recursion Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Recursion Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="100" max="2000" step="100"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startVisualizer} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Shuffle size={18} /> GENERATE ALL
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