import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, Database, Share2, PlusSquare
} from 'lucide-react';

export default function BTreeVisualizer() {
  const navigate = useNavigate();
  
  // State: Hardcoded B-Tree (Order 3: Max 2 keys, 3 children)
  // Root: [20] -> Left: [10], Right: [30, 40]
  const [nodes, setNodes] = useState([
    { id: 'root', keys: [20], x: 250, y: 50, children: ['L1', 'R1'] },
    { id: 'L1', keys: [10], x: 150, y: 150, parent: 'root' },
    { id: 'R1', keys: [30, 40], x: 350, y: 150, parent: 'root' },
  ]);

  const [activeIndex, setActiveIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('B-Tree Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def insert_non_full(x, k):\n    i = len(x.keys) - 1\n    if x.leaf:\n        x.keys.append(None)\n        while i >= 0 and k < x.keys[i]:\n            x.keys[i+1] = x.keys[i]\n            i -= 1\n        x.keys[i+1] = k\n    else:\n        # Find child to recurse", 
      comp: "O(log n) Disk Optimized" 
    },
    java: { 
      logic: "void splitChild(Node x, int i, Node y) {\n    Node z = new Node(y.t);\n    for (int j = 0; j < t - 1; j++)\n        z.keys[j] = y.keys[j + t];\n    x.children[i + 1] = z;\n    x.keys[i] = y.keys[t - 1];\n}", 
      comp: "Multi-way Branching" 
    }
  };

  const simulateInsert = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    setStatus("Inserting Key 50 into Node [30, 40]...");
    setActiveIndex('R1');
    await delay();

    setStatus("Overflow Detected! Node [30, 40, 50] exceeds Order 3.");
    await delay();

    setStatus("Splitting Node... Promoting Median (40) to Root.");
    
    // Transform state to a balanced split
    const newNodes = [
      { id: 'root', keys: [20, 40], x: 250, y: 50, children: ['L1', 'M1', 'R1'] },
      { id: 'L1', keys: [10], x: 100, y: 150, parent: 'root' },
      { id: 'M1', keys: [30], x: 250, y: 150, parent: 'root' },
      { id: 'R1', keys: [50], x: 400, y: 150, parent: 'root' },
    ];
    
    setNodes(newNodes);
    await delay();

    setActiveIndex(null);
    setStatus("Tree Rebalanced. Height remains minimal.");
    setIsRunning(false);
  };

  const reset = () => {
    setNodes([
      { id: 'root', keys: [20], x: 250, y: 50, children: ['L1', 'R1'] },
      { id: 'L1', keys: [10], x: 150, y: 150, parent: 'root' },
      { id: 'R1', keys: [30, 40], x: 350, y: 150, parent: 'root' },
    ]);
    setActiveIndex(null);
    setIsRunning(false);
    setStatus('Registers Cleared');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">B-Tree Index</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize high-fanout node splitting used in large-scale database storage.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="500" height="300" className="relative z-10 overflow-visible">
            {/* Branches */}
            {nodes.map(node => {
              if (!node.children) return null;
              return node.children.map(childId => {
                const child = nodes.find(n => n.id === childId);
                if (!child) return null;
                return (
                  <line 
                    key={`${node.id}-${child.id}`}
                    x1={node.x} y1={node.y + 20} x2={child.x} y2={child.y - 20} 
                    stroke="rgba(255,255,255,0.1)" strokeWidth="2" 
                  />
                );
              });
            })}
            
            {/* B-Tree Multi-key Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-700">
                <rect 
                  x={node.x - (node.keys.length * 20)} y={node.y - 20} 
                  width={node.keys.length * 40} height="40" rx="8"
                  className={`transition-all duration-500 ${
                    activeIndex === node.id ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-[0_0_20px_#d946ef88]' : 'fill-white/5 stroke-white/10'
                  }`}
                  strokeWidth="2"
                />
                {node.keys.map((key, i) => (
                  <text 
                    key={`${node.id}-key-${i}`}
                    x={node.x - (node.keys.length * 20) + 20 + (i * 40)} y={node.y + 5} 
                    textAnchor="middle" className="text-[12px] font-mono font-bold fill-white"
                  >
                    {key}
                  </text>
                ))}
              </g>
            ))}
          </svg>

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
              <Database size={16} className="text-fuchsia-500" /> Storage Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Operation Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="500" max="2000" step="100"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={simulateInsert} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <PlusSquare size={18} /> INSERT KEY 50 (SPLIT)
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET INDEX
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