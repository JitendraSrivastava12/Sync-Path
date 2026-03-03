import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, Network, Share2, Search
} from 'lucide-react';

export default function NAryTreeVisualizer() {
  const navigate = useNavigate();
  
  // State: Hardcoded N-Ary Tree (Order N)
  // Root (1) -> Children: (2, 3, 4)
  // Node 2 -> Children: (5, 6)
  // Node 4 -> Children: (7, 8, 9)
  const [nodes, setNodes] = useState([
    { id: 1, x: 250, y: 50, children: [2, 3, 4] },
    { id: 2, x: 120, y: 150, children: [5, 6], parent: 1 },
    { id: 3, x: 250, y: 150, children: [], parent: 1 },
    { id: 4, x: 380, y: 150, children: [7, 8, 9], parent: 1 },
    { id: 5, x: 80, y: 250, parent: 2 },
    { id: 6, x: 160, y: 250, parent: 2 },
    { id: 7, x: 320, y: 250, parent: 4 },
    { id: 8, x: 380, y: 250, parent: 4 },
    { id: 9, x: 440, y: 250, parent: 4 },
  ]);

  const [activeIndex, setActiveIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('N-Ary Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def traverse(root):\n    if not root:\n        return\n    process(root)\n    for child in root.children:\n        traverse(child)", 
      comp: "O(V + E) Traversal" 
    },
    java: { 
      logic: "void traverse(Node root) {\n    if (root == null) return;\n    System.out.println(root.val);\n    for (Node child : root.children) {\n        traverse(child);\n    }\n}", 
      comp: "Generic Recursive Path" 
    }
  };

  const startTraversal = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const dfs = async (nodeId) => {
      setActiveIndex(nodeId);
      setStatus(`Processing Node ${nodeId}... Resolving child pointers.`);
      await delay();

      const node = nodes.find(n => n.id === nodeId);
      if (node && node.children) {
        for (const childId of node.children) {
          await dfs(childId);
        }
      }
    };

    await dfs(1);
    setActiveIndex(null);
    setStatus("Traversal Complete. Entire hierarchy resolved.");
    setIsRunning(false);
  };

  const reset = () => {
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">N-Ary Hierarchy</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize generic tree structures with arbitrary branching factors per node.</p>
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
                    x1={node.x} y1={node.y} x2={child.x} y2={child.y} 
                    stroke="rgba(255,255,255,0.08)" strokeWidth="2" 
                  />
                );
              });
            })}
            
            {/* Multi-Child Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="20" 
                  className={`transition-all duration-300 ${
                    activeIndex === node.id ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-[0_0_20px_#d946ef88]' : 'fill-white/5 stroke-white/10'
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">
                  {node.id}
                </text>
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
              <Network size={16} className="text-fuchsia-500" /> Traversal Controller
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
                  type="range" min="100" max="1500" step="100"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startTraversal} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> DEPTH-FIRST SCAN
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