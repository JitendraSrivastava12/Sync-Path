import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Share2, Activity, GitBranch,
  Layers, BoxSelect, Terminal
} from 'lucide-react';

export default function TarjanVisualizer() {
  const navigate = useNavigate();
  
  // State: Graph with two clear SCCs: (1,2,3) and (4,5,6)
  const [nodes] = useState([
    { id: 1, x: 100, y: 100 }, { id: 2, x: 250, y: 50 }, { id: 3, x: 250, y: 150 },
    { id: 4, x: 400, y: 100 }, { id: 5, x: 550, y: 50 }, { id: 6, x: 550, y: 150 }
  ]);

  const [edges] = useState([
    { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 1 }, // SCC 1
    { from: 3, to: 4 }, // Connector
    { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 4 }  // SCC 2
  ]);

  const [discovery, setDiscovery] = useState({});
  const [lowLink, setLowLink] = useState({});
  const [stack, setStack] = useState([]);
  const [sccs, setSccs] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Tarjan Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def dfs(u):\n    disc[u] = low[u] = time++\n    stack.push(u)\n    for v in adj[u]:\n        if disc[v] == -1:\n            dfs(v)\n            low[u] = min(low[u], low[v])\n        elif v in stack:\n            low[u] = min(low[u], disc[v])\n    if low[u] == disc[u]: # SCC Found", 
      comp: "O(V + E) Single Pass" 
    },
    java: { 
      logic: "void findSCC(int u) {\n    ids[u] = low[u] = ++time;\n    stack.push(u);\n    onStack[u] = true;\n    for (int v : adj[u]) {\n        if (ids[v] == -1) findSCC(v);\n        if (onStack[v]) low[u] = Math.min(low[u], low[v]);\n    }\n    if (ids[u] == low[u]) popStackUntil(u);\n}", 
      comp: "Recursion & Low-Link" 
    }
  };

  const startTarjan = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let time = 0;
    let disc = {};
    let low = {};
    let st = [];
    let foundSccs = [];
    let onStack = {};

    const dfs = async (u) => {
      disc[u] = low[u] = time++;
      st.push(u);
      onStack[u] = true;
      
      setDiscovery({...disc});
      setLowLink({...low});
      setStack([...st]);
      setActiveNode(u);
      setStatus(`Node ${u}: Assigned ID ${disc[u]}. Tracking Low-Link...`);
      await delay();

      const neighbors = edges.filter(e => e.from === u).map(e => e.to);
      for (let v of neighbors) {
        if (disc[v] === undefined) {
          await dfs(v);
          low[u] = Math.min(low[u], low[v]);
          setLowLink({...low});
          setStatus(`Backtracked to ${u}: Updated Low-Link from child ${v}.`);
          await delay();
        } else if (onStack[v]) {
          low[u] = Math.min(low[u], disc[v]);
          setLowLink({...low});
          setStatus(`Back-edge found: ${u}→${v}. Updating Low-Link.`);
          await delay();
        }
      }

      if (low[u] === disc[u]) {
        let component = [];
        let w;
        setStatus(`SCC Root Identified at Node ${u}! Popping stack...`);
        do {
          w = st.pop();
          onStack[w] = false;
          component.push(w);
          setStack([...st]);
          await delay();
        } while (u !== w);
        foundSccs.push(component);
        setSccs([...foundSccs]);
      }
    };

    for (let node of nodes) {
      if (disc[node.id] === undefined) await dfs(node.id);
    }

    setActiveNode(null);
    setStatus("Cluster Analysis Complete. SCCs identified by color.");
    setIsRunning(false);
  };

  const reset = () => {
    setDiscovery({});
    setLowLink({});
    setStack([]);
    setSccs([]);
    setActiveNode(null);
    setIsRunning(false);
    setStatus('Engine Reset');
  };

  const getSccColor = (nodeId) => {
    const sccIndex = sccs.findIndex(scc => scc.includes(nodeId));
    if (sccIndex === 0) return 'fill-emerald-500/20 stroke-emerald-500 shadow-[0_0_20px_#10b98166]';
    if (sccIndex === 1) return 'fill-blue-500/20 stroke-blue-500 shadow-[0_0_20px_#3b82f666]';
    if (sccIndex === 2) return 'fill-amber-500/20 stroke-amber-500 shadow-[0_0_20px_#f59e0b66]';
    return 'fill-white/5 stroke-white/10';
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Tarjan Engine</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize low-link discovery and recursion stack isolation for SCC clustering.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="600" height="300" className="relative z-10 overflow-visible mb-12">
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
            
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="26" 
                  className={`transition-all duration-300 ${
                    activeNode === node.id ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-[0_0_20px_#d946ef88]' : getSccColor(node.id)
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[12px] font-mono font-bold fill-white">
                  {node.id}
                </text>
                <text x={node.x} y={node.y - 40} textAnchor="middle" className="text-[9px] font-black fill-gray-500">
                  ID: {discovery[node.id] ?? '-'} | LOW: {lowLink[node.id] ?? '-'}
                </text>
              </g>
            ))}
          </svg>

          {/* Stack HUD */}
          <div className="relative z-10 w-full flex flex-col items-center gap-3">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">On-Stack Nodes (LIFO)</span>
             <div className="flex gap-2 min-h-[50px] p-3 bg-white/5 border border-white/10 rounded-2xl">
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
              <BoxSelect size={16} className="text-fuchsia-500" /> SCC Controller
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
                  type="range" min="200" max="2000" step="200"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startTarjan} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> INITIATE DISCOVERY
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET REGISTERS
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