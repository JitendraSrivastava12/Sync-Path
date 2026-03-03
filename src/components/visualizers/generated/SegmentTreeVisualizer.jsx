import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, Layers, Search, Target
} from 'lucide-react';

export default function SegmentTreeVisualizer() {
  const navigate = useNavigate();
  
  // State: Initial Array and its Segment Tree representation
  const [data] = useState([1, 3, 5, 7, 9, 11]);
  // Segment tree for sum: [36, 9, 27, 4, 5, 16, 11, 1, 3, null, null, 7, 9, null, null]
  const [tree, setTree] = useState([36, 9, 27, 4, 5, 16, 11, 1, 3, 7, 9]);
  
  // Mapping nodes to their ranges [L, R]
  const ranges = [
    [0, 5], [0, 2], [3, 5], [0, 1], [2, 2], [3, 4], [5, 5], [0, 0], [1, 1], [3, 3], [4, 4]
  ];

  const [activeIndex, setActiveIndex] = useState(null);
  const [queryRange, setQueryRange] = useState({ l: 1, r: 4 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Segment Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def query(node, start, end, l, r):\n    if r < start or end < l:\n        return 0\n    if l <= start and end <= r:\n        return tree[node]\n    mid = (start + end) // 2\n    return query(2*node, start, mid, l, r) + \\\n           query(2*node+1, mid+1, end, l, r)", 
      comp: "O(log n) Range Query" 
    },
    java: { 
      logic: "int query(int node, int start, int end, int l, int r) {\n    if (r < start || end < l) return 0;\n    if (l <= start && end <= r) return tree[node];\n    int mid = (start + end) / 2;\n    return query(2*node, start, mid, l, r) + \n           query(2*node+1, mid+1, end, l, r);\n}", 
      comp: "Interval Sum Logic" 
    }
  };

  const startQuery = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const { l, r } = queryRange;
    setStatus(`Initiating Range Sum Query for [${l}, ${r}]...`);
    
    // Recursive DFS simulation
    const traverse = async (nodeIdx) => {
      if (nodeIdx >= ranges.length) return;
      
      const [start, end] = ranges[nodeIdx];
      setActiveIndex(nodeIdx);
      await delay();

      // Case 1: Out of range
      if (r < start || end < l) {
        setStatus(`Node [${start}, ${end}]: Completely outside query range. Skipping.`);
        await delay();
        return;
      }

      // Case 2: Completely inside
      if (l <= start && end <= r) {
        setStatus(`Node [${start}, ${end}]: Completely inside. Adding ${tree[nodeIdx]} to sum.`);
        await delay();
        return;
      }

      // Case 3: Partial overlap
      setStatus(`Node [${start}, ${end}]: Partial overlap. Splitting into children...`);
      await delay();
      
      const leftChild = 2 * nodeIdx + 1;
      const rightChild = 2 * nodeIdx + 2;
      
      await traverse(leftChild);
      setActiveIndex(nodeIdx); // Return focus to parent
      await traverse(rightChild);
    };

    await traverse(0);
    setActiveIndex(null);
    setStatus(`Query Complete. Range Sum found in O(log n) steps.`);
    setIsRunning(false);
  };

  const reset = () => {
    setActiveIndex(null);
    setIsRunning(false);
    setStatus('Registers Cleared');
  };

  // Helper for Tree coordinates
  const getNodePos = (index) => {
    const configs = [
      { x: 250, y: 40 },  // 0: [0, 5]
      { x: 120, y: 120 }, // 1: [0, 2]
      { x: 380, y: 120 }, // 2: [3, 5]
      { x: 60, y: 200 },  // 3: [0, 1]
      { x: 180, y: 200 }, // 4: [2, 2]
      { x: 320, y: 200 }, // 5: [3, 4]
      { x: 440, y: 200 }, // 6: [5, 5]
      { x: 30, y: 280 },  // 7: [0, 0]
      { x: 90, y: 280 },  // 8: [1, 1]
      { x: 290, y: 280 }, // 9: [3, 3]
      { x: 350, y: 280 }  // 10: [4, 4]
    ];
    return configs[index];
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Segment Tree</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize interval-based range queries and logarithmic data partitioning.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="500" height="350" className="relative z-10 overflow-visible mb-10">
            {/* Branches */}
            {tree.map((_, idx) => {
              const pos = getNodePos(idx);
              const leftIdx = 2 * idx + 1;
              const rightIdx = 2 * idx + 2;
              return (
                <g key={`branch-${idx}`}>
                  {leftIdx < ranges.length && (
                    <line x1={pos.x} y1={pos.y} x2={getNodePos(leftIdx).x} y2={getNodePos(leftIdx).y} stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  )}
                  {rightIdx < ranges.length && (
                    <line x1={pos.x} y1={pos.y} x2={getNodePos(rightIdx).x} y2={getNodePos(rightIdx).y} stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  )}
                </g>
              );
            })}
            
            {/* Interval Nodes */}
            {tree.map((val, idx) => {
              const { x, y } = getNodePos(idx);
              const [l, r] = ranges[idx];
              const isActive = activeIndex === idx;
              
              return (
                <g key={`node-${idx}`} className="transition-all duration-500">
                  <rect 
                    x={x - 25} y={y - 20} width="50" height="40" rx="8"
                    className={`transition-all duration-300 ${
                      isActive ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-[0_0_20px_#d946ef88]' : 'fill-white/5 stroke-white/10'
                    }`}
                    strokeWidth="2"
                  />
                  <text x={x} y={y - 2} textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">{val}</text>
                  <text x={x} y={y + 12} textAnchor="middle" className="text-[8px] fill-gray-500 font-mono">[{l},{r}]</text>
                </g>
              );
            })}
          </svg>

          {/* Source Array */}
          <div className="relative z-10 flex gap-2">
            {data.map((val, idx) => (
              <div key={idx} className={`w-10 h-10 flex items-center justify-center border-2 font-mono text-xs transition-all ${
                idx >= queryRange.l && idx <= queryRange.r ? 'bg-fuchsia-600/20 border-fuchsia-500 text-white' : 'bg-white/5 border-white/5 text-gray-700'
              }`}>
                {val}
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
              <Target size={16} className="text-fuchsia-500" /> Query Controller
            </h3>
            
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">Left (L)</label>
                  <input 
                    type="number" min="0" max="5" value={queryRange.l}
                    onChange={(e) => setQueryRange({...queryRange, l: parseInt(e.target.value)})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">Right (R)</label>
                  <input 
                    type="number" min="0" max="5" value={queryRange.r}
                    onChange={(e) => setQueryRange({...queryRange, r: parseInt(e.target.value)})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startQuery} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> EXECUTE SUM QUERY
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET ENGINE
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