import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, Binary, Layers, Search, ArrowUpCircle
} from 'lucide-react';

export default function HeapVisualizer() {
  const navigate = useNavigate();
  
  // State: Initial Max Heap (Array Representation)
  const [heap, setHeap] = useState([90, 80, 70, 40, 30, 20, 10]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [swapIndex, setSwapIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Heap Engine Standby');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(700);
  const [speed, setSpeed] = useState(700);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def heapify_up(index):\n    parent = (index - 1) // 2\n    if index > 0 and heap[index] > heap[parent]:\n        heap[index], heap[parent] = heap[parent], heap[index]\n        heapify_up(parent)", 
      comp: "O(log n) Insertion" 
    },
    java: { 
      logic: "void heapifyUp(int i) {\n    int p = (i - 1) / 2;\n    if (i > 0 && arr[i] > arr[p]) {\n        swap(i, p);\n        heapifyUp(p);\n    }\n}", 
      comp: "Priority Queue Logic" 
    }
  };

  const insertValue = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const newValue = 95; // Simulating inserting a value larger than the root
    let currentHeap = [...heap, newValue];
    setHeap(currentHeap);
    let idx = currentHeap.length - 1;
    
    setStatus(`Inserted ${newValue} at leaf. Initiating Heapify-Up...`);
    setActiveIndex(idx);
    await delay();

    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      setActiveIndex(idx);
      setSwapIndex(parentIdx);
      
      setStatus(`Comparing Child (${currentHeap[idx]}) with Parent (${currentHeap[parentIdx]})`);
      await delay();

      if (currentHeap[idx] > currentHeap[parentIdx]) {
        setStatus(`Violation: Child > Parent. Swapping indices ${idx} and ${parentIdx}...`);
        [currentHeap[idx], currentHeap[parentIdx]] = [currentHeap[parentIdx], currentHeap[idx]];
        setHeap([...currentHeap]);
        idx = parentIdx;
        await delay();
      } else {
        setStatus("Heap Property Satisfied.");
        break;
      }
    }

    setActiveIndex(null);
    setSwapIndex(null);
    setStatus("Max-Heap Restored.");
    setIsRunning(false);
  };

  const reset = () => {
    setHeap([90, 80, 70, 40, 30, 20, 10]);
    setActiveIndex(null);
    setSwapIndex(null);
    setIsRunning(false);
    setStatus('Registers Cleared');
  };

  // Helper to calculate Tree node positions
  const getNodePos = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const posInLevel = index - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);
    const x = (500 / (totalInLevel + 1)) * (posInLevel + 1);
    const y = 50 + level * 80;
    return { x, y };
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Binary Heap</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the logarithmic array-to-tree priority mapping.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Tree Visualization */}
          <svg width="500" height="300" className="relative z-10 overflow-visible mb-12">
            {heap.map((val, idx) => {
              const { x, y } = getNodePos(idx);
              const parentIdx = Math.floor((idx - 1) / 2);
              const pPos = idx > 0 ? getNodePos(parentIdx) : null;
              
              return (
                <g key={`node-${idx}`}>
                  {pPos && (
                    <line 
                      x1={x} y1={y} x2={pPos.x} y2={pPos.y} 
                      stroke="rgba(255,255,255,0.1)" strokeWidth="2" 
                    />
                  )}
                  <circle 
                    cx={x} cy={y} r="20" 
                    className={`transition-all duration-500 ${
                      activeIndex === idx ? 'fill-fuchsia-600 stroke-fuchsia-400' :
                      swapIndex === idx ? 'fill-blue-600/40 stroke-blue-400' : 
                      'fill-white/5 stroke-white/10'
                    }`}
                    strokeWidth="2"
                  />
                  <text x={x} y={y + 5} textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">
                    {val}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Array Representation */}
          <div className="relative z-10 w-full flex flex-wrap justify-center gap-1">
            {heap.map((val, idx) => (
              <div key={`arr-${idx}`} className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center border-2 font-mono text-xs transition-all duration-300 ${
                  activeIndex === idx ? 'bg-fuchsia-600 border-fuchsia-400 z-20 scale-110 shadow-[0_0_15px_#d946ef88]' :
                  swapIndex === idx ? 'bg-blue-600/20 border-blue-400' : 'bg-white/5 border-white/5 text-gray-400'
                }`}>
                  {val}
                </div>
                <span className="text-[8px] text-gray-700 mt-1">[{idx}]</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <div className={`h-2.5 w-2.5 rounded-full bg-fuchsia-500 ${isRunning ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Layers size={16} className="text-fuchsia-500" /> Heap Controller
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Bubble Speed
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
                <button onClick={insertValue} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <ArrowUpCircle size={18} /> INSERT 95 (HEAPIFY-UP)
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET HEAP
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