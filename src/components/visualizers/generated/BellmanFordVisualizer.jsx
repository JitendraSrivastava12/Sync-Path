import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Share2, Activity, AlertOctagon,
  RefreshCcw, MoveRight
} from 'lucide-react';

export default function BellmanFordVisualizer() {
  const navigate = useNavigate();
  
  // State: Graph with a negative edge (B -> C is -5)
  const [nodes] = useState([
    { id: 'A', x: 100, y: 150 },
    { id: 'B', x: 250, y: 70 },
    { id: 'C', x: 250, y: 230 },
    { id: 'D', x: 400, y: 150 },
  ]);

  const [edges] = useState([
    { from: 'A', to: 'B', weight: 6 },
    { from: 'A', to: 'C', weight: 7 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: -4 }, // Negative edge
    { from: 'C', to: 'D', weight: 9 },
    { from: 'D', to: 'A', weight: 2 },
  ]);

  const [distances, setDistances] = useState({ A: 0, B: '∞', C: '∞', D: '∞' });
  const [activeEdge, setActiveEdge] = useState(null);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasNegativeCycle, setHasNegativeCycle] = useState(false);
  const [status, setStatus] = useState('Bellman-Ford Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(600);
  const [speed, setSpeed] = useState(600);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "dist = [inf] * V\ndist[src] = 0\nfor _ in range(V - 1):\n    for u, v, w in edges:\n        if dist[u] + w < dist[v]:\n            dist[v] = dist[u] + w\n# Check for negative cycles\nfor u, v, w in edges:\n    if dist[u] + w < dist[v]:\n        print('Negative Cycle!')", 
      comp: "O(V * E) Time" 
    },
    java: { 
      logic: "for (int i = 1; i < V; ++i) {\n    for (Edge e : edges) {\n        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v])\n            dist[e.v] = dist[e.u] + e.w;\n    }\n}", 
      comp: "Robust Pathfinding" 
    }
  };

  const startAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setHasNegativeCycle(false);
    
    let currentDist = { A: 0, B: Infinity, C: Infinity, D: Infinity };
    const V = nodes.length;

    setStatus("Initiating V-1 Iterations (Total: 3)");
    await delay();

    for (let i = 1; i < V; i++) {
      setIteration(i);
      setStatus(`Iteration ${i}: Relaxing all ${edges.length} edges...`);
      
      for (let j = 0; j < edges.length; j++) {
        const edge = edges[j];
        setActiveEdge(j);
        
        const u = edge.from;
        const v = edge.to;
        const w = edge.weight;

        if (currentDist[u] !== Infinity && currentDist[u] + w < currentDist[v]) {
          currentDist[v] = currentDist[u] + w;
          setDistances({ 
            ...currentDist, 
            A: currentDist.A, 
            B: currentDist.B === Infinity ? '∞' : currentDist.B, 
            C: currentDist.C === Infinity ? '∞' : currentDist.C, 
            D: currentDist.D === Infinity ? '∞' : currentDist.D 
          });
          setStatus(`Relaxing ${u}→${v}: New Min Dist for ${v} is ${currentDist[v]}`);
        }
        await delay();
      }
    }

    // Final Check for Negative Cycle
    setStatus("Final Pass: Checking for Negative Cycles...");
    for (let edge of edges) {
        if (currentDist[edge.from] + edge.weight < currentDist[edge.to]) {
            setHasNegativeCycle(true);
            setStatus("CRITICAL: Negative Cycle detected! Shortest path is undefined.");
            setIsRunning(false);
            return;
        }
    }

    setActiveEdge(null);
    setStatus("Optimization Complete. All paths stable.");
    setIsRunning(false);
  };

  const reset = () => {
    setDistances({ A: 0, B: '∞', C: '∞', D: '∞' });
    setIteration(0);
    setActiveEdge(null);
    setHasNegativeCycle(false);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Bellman-Ford</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Robust edge relaxation and negative-cycle detection engine.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="500" height="350" className="relative z-10 overflow-visible">
            {/* Edges with Directional Arrows */}
            {edges.map((edge, idx) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              const isActive = activeEdge === idx;
              
              return (
                <g key={idx}>
                  <line 
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                    className={`transition-all duration-300 ${isActive ? 'stroke-fuchsia-500 stroke-[4px]' : 'stroke-white/10 stroke-[2px]'}`} 
                  />
                  <text 
                    x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 10} 
                    className={`text-[12px] font-black font-mono ${edge.weight < 0 ? 'fill-red-400' : 'fill-gray-500'}`}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="22" 
                  className={`transition-all duration-300 ${
                    hasNegativeCycle ? 'fill-red-500/20 stroke-red-500' : 
                    distances[node.id] !== '∞' ? 'fill-fuchsia-500/20 stroke-fuchsia-500' : 'fill-white/5 stroke-white/10'
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[12px] font-mono font-bold fill-white">
                  {node.id}
                </text>
                <text x={node.x} y={node.y + 40} textAnchor="middle" className="text-[10px] font-black fill-fuchsia-400/80">
                  DIST: {distances[node.id]}
                </text>
              </g>
            ))}
          </svg>

          {/* Iteration & Cycle HUD */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
               <Activity size={14} className="text-fuchsia-500" />
               <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
            {iteration > 0 && (
              <div className="px-6 py-3 bg-fuchsia-600 rounded-2xl text-[10px] font-black tracking-tighter">
                ITERATION: {iteration} / 3
              </div>
            )}
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <RefreshCcw size={16} className="text-fuchsia-500" /> Relaxation Terminal
            </h3>
            
            <div className="space-y-10">
              {hasNegativeCycle && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 animate-pulse">
                  <AlertOctagon size={20} className="text-red-500 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Negative Cycle Detected</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      An infinite reduction loop was identified during the $V^{th}$ pass. Paths in this graph cannot be optimized.
                    </p>
                  </div>
                </div>
              )}

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
                <button onClick={startAlgorithm} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> START SCAN
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