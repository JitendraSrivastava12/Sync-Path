import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Share2, Layers, Binary, Activity,
  ArrowDownCircle
} from 'lucide-react';

export default function DfsVisualizer() {
  const navigate = useNavigate();
  
  // State: Graph Topology
  const [nodes] = useState([
    { id: 1, x: 250, y: 50 },
    { id: 2, x: 150, y: 130 },
    { id: 3, x: 350, y: 130 },
    { id: 4, x: 80, y: 230 },
    { id: 5, x: 220, y: 230 },
    { id: 6, x: 420, y: 230 },
  ]);

  const [edges] = useState([
    { from: 1, to: 2 }, { from: 1, to: 3 },
    { from: 2, to: 4 }, { from: 2, to: 5 },
    { from: 3, to: 6 }, { from: 5, to: 6 }
  ]);

  const [stack, setStack] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('DFS Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def dfs(graph, u, visited):\n    visited.add(u)\n    process(u)\n    for v in graph[u]:\n        if v not in visited:\n            dfs(graph, v, visited)", 
      comp: "O(V + E) Complexity" 
    },
    java: { 
      logic: "void dfs(int u) {\n    visited[u] = true;\n    for (int v : adj[u]) {\n        if (!visited[v]) {\n            dfs(v);\n        }\n    }\n}", 
      comp: "Recursive Backtracking" 
    }
  };

  const startDfs = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let visitedSet = new Set();
    let currentStack = [];

    const traverse = async (u) => {
      visitedSet.add(u);
      currentStack.push(u);
      
      setVisited(new Set(visitedSet));
      setStack([...currentStack]);
      setActiveNode(u);
      setStatus(`Entering Node ${u}. Diving deeper into branch...`);
      await delay();

      // Find neighbors
      const neighbors = edges
        .filter(e => e.from === u || e.to === u)
        .map(e => (e.from === u ? e.to : e.from));

      for (let v of neighbors) {
        if (!visitedSet.has(v)) {
          await traverse(v);
          // Return focus to current node after returning from recursion
          setActiveNode(u);
          setStack([...currentStack]);
          setStatus(`Backtracking to Node ${u}. Checking remaining branches.`);
          await delay();
        }
      }
      
      currentStack.pop();
      setStack([...currentStack]);
    };

    await traverse(1);
    setActiveNode(null);
    setStatus("Traversal Complete. All branches fully explored.");
    setIsRunning(false);
  };

  const reset = () => {
    setStack([]);
    setVisited(new Set());
    setActiveNode(null);
    setIsRunning(false);
    setStatus('Registers Cleared');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white selection:bg-fuchsia-500/30">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">DFS Pathfinding</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize recursive depth-first exploration and backtracking logic.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="500" height="300" className="relative z-10 overflow-visible mb-12">
            {/* Edges */}
            {edges.map((edge, idx) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              return (
                <line 
                  key={idx} x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                  stroke="rgba(255,255,255,0.08)" strokeWidth="2" 
                />
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="22" 
                  className={`transition-all duration-300 ${
                    activeNode === node.id ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-[0_0_20px_#d946ef88]' : 
                    visited.has(node.id) ? 'fill-emerald-500/20 stroke-emerald-500' : 'fill-white/5 stroke-white/10'
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[12px] font-mono font-bold fill-white">
                  {node.id}
                </text>
              </g>
            ))}
          </svg>

          {/* Call Stack Visualization */}
          <div className="relative z-10 w-full flex flex-col items-center gap-3">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recursion Stack (LIFO)</span>
             <div className="flex gap-2 min-h-[50px] p-2 bg-white/5 border border-white/10 rounded-xl">
                {stack.length === 0 && <span className="text-gray-700 text-[10px] self-center px-4 italic">Stack Empty</span>}
                {stack.map((val, idx) => (
                  <div key={idx} className="w-10 h-10 flex items-center justify-center bg-fuchsia-600/20 border border-fuchsia-500 rounded-lg font-mono text-sm font-bold text-fuchsia-400 animate-in slide-in-from-bottom-2">
                    {val}
                  </div>
                ))}
             </div>
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <Activity size={14} className="text-fuchsia-500" />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Layers size={16} className="text-fuchsia-500" /> Stack Controller
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
                <button onClick={startDfs} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <ArrowDownCircle size={18} fill="currentColor" /> START RECURSION
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