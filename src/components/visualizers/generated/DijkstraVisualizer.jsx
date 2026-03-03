import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Share2, Map, Navigation, Activity 
} from 'lucide-react';

export default function DijkstraVisualizer() {
  const navigate = useNavigate();
  
  // State: Graph Nodes (V) and Weighted Edges (E)
  const [nodes] = useState([
    { id: 'A', x: 100, y: 150 },
    { id: 'B', x: 250, y: 50 },
    { id: 'C', x: 250, y: 250 },
    { id: 'D', x: 400, y: 150 },
  ]);

  const [edges] = useState([
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 5 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 3 },
  ]);

  const [distances, setDistances] = useState({ A: 0, B: '∞', C: '∞', D: '∞' });
  const [visited, setVisited] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Dijkstra Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def dijkstra(graph, start):\n    dist = {v: inf for v in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, u = heappop(pq)\n        for v, weight in graph[u]:\n            if dist[u] + weight < dist[v]:\n                dist[v] = dist[u] + weight\n                heappush(pq, (dist[v], v))", 
      comp: "O(E log V) Time" 
    },
    java: { 
      logic: "PriorityQueue<Node> pq = new PriorityQueue<>();\nwhile (!pq.isEmpty()) {\n    Node u = pq.poll();\n    for (Edge e : adj[u.id]) {\n        if (dist[u] + e.w < dist[e.v]) {\n            dist[e.v] = dist[u] + e.w;\n            pq.add(new Node(e.v, dist[e.v]));\n        }\n    }\n}", 
      comp: "Greedy Relaxation" 
    }
  };

  const runAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let currentDist = { A: 0, B: Infinity, C: Infinity, D: Infinity };
    let unvisited = ['A', 'B', 'C', 'D'];
    let visitedNodes = new Set();

    setStatus("Phase 1: Initializing distances. Source 'A' set to 0.");
    await delay();

    while (unvisited.length > 0) {
      // Find node with minimum distance
      let u = unvisited.reduce((minNode, node) => 
        currentDist[node] < currentDist[minNode] ? node : minNode, unvisited[0]
      );

      if (currentDist[u] === Infinity) break;

      setActiveNode(u);
      setStatus(`Scanning neighbors of Node ${u} (Current best distance: ${currentDist[u]})`);
      await delay();

      // Relax Edges
      const neighbors = edges.filter(e => e.from === u || e.to === u);
      for (let edge of neighbors) {
        let v = edge.from === u ? edge.to : edge.from;
        if (visitedNodes.has(v)) continue;

        let alt = currentDist[u] + edge.weight;
        if (alt < currentDist[v]) {
          currentDist[v] = alt;
          setDistances({ ...currentDist, B: currentDist.B === Infinity ? '∞' : currentDist.B, C: currentDist.C === Infinity ? '∞' : currentDist.C, D: currentDist.D === Infinity ? '∞' : currentDist.D });
          setStatus(`Relaxing Edge ${u}→${v}: Found shorter path (${alt})`);
          await delay();
        }
      }

      unvisited = unvisited.filter(node => node !== u);
      visitedNodes.add(u);
      setVisited(new Set(visitedNodes));
    }

    setActiveNode(null);
    setStatus("Optimal pathfinding complete. All nodes relaxed.");
    setIsRunning(false);
  };

  const reset = () => {
    setDistances({ A: 0, B: '∞', C: '∞', D: '∞' });
    setVisited(new Set());
    setActiveNode(null);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Dijkstra Engine</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize weighted graph relaxation and shortest path discovery.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="500" height="300" className="relative z-10 overflow-visible">
            {/* Edges */}
            {edges.map((edge, idx) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              return (
                <g key={idx}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 10} textAnchor="middle" className="text-[10px] fill-gray-500 font-bold font-mono">{edge.weight}</text>
                </g>
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
                <text x={node.x} y={node.y + 40} textAnchor="middle" className={`text-[10px] font-black ${distances[node.id] === '∞' ? 'fill-gray-700' : 'fill-fuchsia-500'}`}>
                  DIST: {distances[node.id]}
                </text>
              </g>
            ))}
          </svg>

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
              <Navigation size={16} className="text-fuchsia-500" /> Router Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Logic Speed
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
                <button onClick={runAlgorithm} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> INITIATE ROUTING
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET MAP
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