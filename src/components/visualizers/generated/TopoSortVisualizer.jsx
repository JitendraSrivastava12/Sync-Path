import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Share2, Activity, GitBranch,
  ListOrdered, CheckCircle2, Clock
} from 'lucide-react';

export default function TopoSortVisualizer() {
  const navigate = useNavigate();
  
  // State: Directed Acyclic Graph (DAG)
  // 1 -> 2, 1 -> 3
  // 2 -> 4
  // 3 -> 4, 3 -> 5
  // 4 -> 6
  const [nodes] = useState([
    { id: 1, x: 100, y: 150, inDegree: 0 },
    { id: 2, x: 220, y: 80, inDegree: 1 },
    { id: 3, x: 220, y: 220, inDegree: 1 },
    { id: 4, x: 340, y: 80, inDegree: 2 },
    { id: 5, x: 340, y: 220, inDegree: 1 },
    { id: 6, x: 460, y: 150, inDegree: 1 },
  ]);

  const [edges] = useState([
    { from: 1, to: 2 }, { from: 1, to: 3 },
    { from: 2, to: 4 }, { from: 3, to: 4 },
    { from: 3, to: 5 }, { from: 4, to: 6 }
  ]);

  const [currentInDegrees, setCurrentInDegrees] = useState({ 1: 0, 2: 1, 3: 1, 4: 2, 5: 1, 6: 1 });
  const [sortedOrder, setSortedOrder] = useState([]);
  const [queue, setQueue] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Scheduler Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "in_degree = {u: 0 for u in G}\nfor u in G: \n  for v in G[u]: in_degree[v] += 1\nqueue = [u for u in G if in_degree[u] == 0]\nwhile queue:\n  u = queue.pop(0)\n  res.append(u)\n  for v in G[u]:\n    in_degree[v] -= 1\n    if in_degree[v] == 0: queue.append(v)", 
      comp: "O(V + E) Linear Time" 
    },
    java: { 
      logic: "Queue<Integer> q = new LinkedList<>();\nfor(int i=0; i<V; i++) if(inDegree[i] == 0) q.add(i);\nwhile(!q.isEmpty()) {\n  int u = q.poll();\n  order.add(u);\n  for(int v : adj[u]) {\n    if(--inDegree[v] == 0) q.add(v);\n  }\n}", 
      comp: "Dependency Resolution" 
    }
  };

  const startSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let inDegreeMap = { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1, 6: 1 };
    let q = [1];
    let order = [];
    
    setQueue([...q]);
    setCurrentInDegrees({...inDegreeMap});
    setStatus("Phase 1: Identifying nodes with In-Degree 0 (No dependencies).");
    await delay();

    while (q.length > 0) {
      let u = q.shift();
      setQueue([...q]);
      setActiveNode(u);
      order.push(u);
      setSortedOrder([...order]);
      setStatus(`Processing Task ${u}: Satisfying downstream dependencies...`);
      await delay();

      // Find neighbors to reduce their in-degree
      const neighbors = edges.filter(e => e.from === u).map(e => e.to);
      for (let v of neighbors) {
        inDegreeMap[v] -= 1;
        setCurrentInDegrees({...inDegreeMap});
        setStatus(`Reducing In-Degree of Node ${v} to ${inDegreeMap[v]}`);
        await delay();

        if (inDegreeMap[v] === 0) {
          q.push(v);
          setQueue([...q]);
          setStatus(`Node ${v} unlocked! Adding to Queue.`);
          await delay();
        }
      }
    }

    setActiveNode(null);
    setStatus("Topological Sorting Complete. Linear schedule generated.");
    setIsRunning(false);
  };

  const reset = () => {
    setCurrentInDegrees({ 1: 0, 2: 1, 3: 1, 4: 2, 5: 1, 6: 1 });
    setSortedOrder([]);
    setQueue([]);
    setActiveNode(null);
    setIsRunning(false);
    setStatus('Scheduler Reset');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Topo-Sort Engine</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize Directed Acyclic Graph (DAG) scheduling and dependency resolution.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="550" height="300" className="relative z-10 overflow-visible mb-12">
            {/* Edges */}
            {edges.map((edge, idx) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              return (
                <g key={idx}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                  <circle cx={to.x - (to.x - from.x)/6} cy={to.y - (to.y - from.y)/6} r="3" className="fill-fuchsia-500/40" />
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="24" 
                  className={`transition-all duration-300 ${
                    activeNode === node.id ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-[0_0_20px_#d946ef88]' : 
                    sortedOrder.includes(node.id) ? 'fill-emerald-500/20 stroke-emerald-500' : 'fill-white/5 stroke-white/10'
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[12px] font-mono font-bold fill-white">
                  {node.id}
                </text>
                {/* In-Degree Badge */}
                <g transform={`translate(${node.x + 15}, ${node.y - 15})`}>
                    <circle r="10" className="fill-black/80 stroke-white/20" />
                    <text textAnchor="middle" dy="3" className="text-[9px] fill-fuchsia-400 font-bold">{currentInDegrees[node.id]}</text>
                </g>
              </g>
            ))}
          </svg>

          {/* Sorted Result HUD */}
          <div className="relative z-10 w-full flex flex-col items-center gap-3">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Resolved Schedule</span>
             <div className="flex gap-2 min-h-[50px] p-3 bg-white/5 border border-white/10 rounded-2xl">
                {sortedOrder.length === 0 && <span className="text-gray-700 text-[10px] self-center px-4 italic">No Tasks Scheduled</span>}
                {sortedOrder.map((val, idx) => (
                  <div key={idx} className="w-10 h-10 flex items-center justify-center bg-emerald-500/20 border border-emerald-500 rounded-lg font-mono text-sm font-bold text-emerald-400 animate-in zoom-in">
                    {val}
                  </div>
                ))}
             </div>
          </div>

          <div className="absolute bottom-10 left-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <Clock size={14} className="text-fuchsia-500" />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <ListOrdered size={16} className="text-fuchsia-500" /> Kahn's Controller
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Resolution Speed
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
                <button onClick={startSort} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> RESOLVE DEPENDENCIES
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET PIPELINE
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