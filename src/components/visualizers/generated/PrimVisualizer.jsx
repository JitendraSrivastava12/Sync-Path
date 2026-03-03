import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Share2, Activity, GitBranch,
  Target, Layers, Trees
} from 'lucide-react';

export default function PrimVisualizer() {
  const navigate = useNavigate();
  
  // State: Graph Topology
  const [nodes] = useState([
    { id: 'A', x: 100, y: 150 },
    { id: 'B', x: 250, y: 50 },
    { id: 'C', x: 250, y: 250 },
    { id: 'D', x: 400, y: 150 },
  ]);

  const [edges] = useState([
    { id: 1, from: 'A', to: 'C', weight: 1 },
    { id: 2, from: 'C', to: 'D', weight: 2 },
    { id: 3, from: 'A', to: 'B', weight: 3 },
    { id: 4, from: 'B', to: 'D', weight: 4 },
    { id: 5, from: 'B', to: 'C', weight: 5 },
  ]);

  const [mstEdges, setMstEdges] = useState(new Set());
  const [reachedNodes, setReachedNodes] = useState(new Set());
  const [activeEdgeId, setActiveEdgeId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Prim Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "visited = {start_node}\npq = [(weight, start, neighbor) for ...]\nwhile pq:\n    w, u, v = heappop(pq)\n    if v not in visited:\n        visited.add(v)\n        mst.append((u, v, w))\n        # Add new edges to pq", 
      comp: "O(E log V) with Priority Queue" 
    },
    java: { 
      logic: "PriorityQueue<Edge> pq = new PriorityQueue<>();\nreached.add(start);\naddEdges(start);\nwhile (!pq.isEmpty()) {\n    Edge e = pq.poll();\n    if (!reached.contains(e.to)) {\n        mst.add(e);\n        reached.add(e.to);\n    }\n}", 
      comp: "Greedy Vertex Expansion" 
    }
  };

  const startPrim = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let reached = new Set(['A']);
    let currentMst = new Set();
    setReachedNodes(new Set(reached));
    
    setStatus("Phase 1: Starting at Node A. Evaluating neighbors.");
    await delay();

    while (reached.size < nodes.length) {
      let minEdge = null;
      let minWeight = Infinity;

      // Find the minimum edge connecting a reached node to an unreached node
      for (let edge of edges) {
        const uReached = reached.has(edge.from);
        const vReached = reached.has(edge.to);

        // One node must be reached, the other must not (The "Cut" rule)
        if ((uReached && !vReached) || (!uReached && vReached)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }

      if (minEdge) {
        setActiveEdgeId(minEdge.id);
        setStatus(`Evaluating Frontier: Edge ${minEdge.from}-${minEdge.to} is the cheapest (${minEdge.weight}).`);
        await delay();

        reached.add(minEdge.from);
        reached.add(minEdge.to);
        currentMst.add(minEdge.id);
        
        setReachedNodes(new Set(reached));
        setMstEdges(new Set(currentMst));
        setStatus(`Connecting: Node ${reached.has(minEdge.from) ? minEdge.to : minEdge.from} added to the MST.`);
        await delay();
      } else {
        break; 
      }
    }

    setActiveEdgeId(null);
    setStatus("MST Complete. Minimum connectivity achieved.");
    setIsRunning(false);
  };

  const reset = () => {
    setMstEdges(new Set());
    setReachedNodes(new Set());
    setActiveEdgeId(null);
    setIsRunning(false);
    setStatus('Engine Reset');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Prim's MST</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize greedy vertex expansion and the evolution of a minimum spanning tree.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="500" height="300" className="relative z-10 overflow-visible">
            {/* Edges */}
            {edges.map((edge) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              const isMst = mstEdges.has(edge.id);
              const isActive = activeEdgeId === edge.id;
              
              return (
                <g key={edge.id}>
                  <line 
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                    className={`transition-all duration-300 ${
                        isActive ? 'stroke-fuchsia-500 stroke-[4px] animate-pulse' : 
                        isMst ? 'stroke-emerald-500 stroke-[3px]' : 'stroke-white/5 stroke-[1px]'
                    }`}
                  />
                  <text 
                    x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 10} 
                    className={`text-[10px] font-bold font-mono ${isMst ? 'fill-emerald-400' : 'fill-gray-600'}`}
                  >
                    w:{edge.weight}
                  </text>
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="22" 
                  className={`transition-all duration-500 ${
                    reachedNodes.has(node.id) ? 'fill-emerald-500/10 stroke-emerald-500 shadow-[0_0_15px_#10b98166]' : 'fill-[#0c0214] stroke-white/20'
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[12px] font-mono font-bold fill-white">
                  {node.id}
                </text>
              </g>
            ))}
          </svg>

          {/* Status HUD */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
               <Trees size={14} className="text-fuchsia-500" />
               <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Target size={16} className="text-fuchsia-500" /> Expansion Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Expansion Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="200" max="2000" step="200"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startPrim} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> START EXPANSION
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