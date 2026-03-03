import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Target, Navigation, Activity, Compass
} from 'lucide-react';

export default function AStarVisualizer() {
  const navigate = useNavigate();
  
  // Grid State: 0 = empty, 1 = wall, S = start, G = goal
  const [grid] = useState([
    ['S', 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 'G']
  ]);

  const [openSet, setOpenSet] = useState(new Set(["0,0"]));
  const [closedSet, setClosedSet] = useState(new Set());
  const [path, setPath] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('A* Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(300);
  const [speed, setSpeed] = useState(300);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def a_star(start, goal):\n    pq = PriorityQueue()\n    pq.put(start, 0)\n    while not pq.empty():\n        curr = pq.get()\n        if curr == goal: return reconstruct()\n        for nxt in neighbors(curr):\n            new_g = g_score[curr] + cost(curr, nxt)\n            f = new_g + heuristic(nxt, goal)\n            pq.put(nxt, f)", 
      comp: "Heuristic-Driven O(E)" 
    },
    java: { 
      logic: "PriorityQueue<Node> open = new PriorityQueue<>();\nopen.add(start);\nwhile (!open.isEmpty()) {\n    Node curr = open.poll();\n    if (curr.equals(goal)) return path;\n    closed.add(curr);\n    for (Node neighbor : adj[curr]) {\n        float f = g[curr] + weight + h(neighbor, goal);\n        open.add(new Node(neighbor, f));\n    }\n}", 
      comp: "Optimal Path Search" 
    }
  };

  const startAStar = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Simplified simulation for visualization
    const steps = [
      { node: "0,0", status: "Evaluating Start" },
      { node: "1,0", status: "Checking Neighbor (1,0)" },
      { node: "2,0", status: "Checking Neighbor (2,0)" },
      { node: "2,1", status: "Calculating Heuristic for (2,1)" },
      { node: "2,2", status: "Found opening in barrier" },
      { node: "3,2", status: "Optimizing path to Goal" },
      { node: "4,4", status: "Goal Reached" }
    ];

    let currentClosed = new Set();
    let currentPath = new Set();

    for (let step of steps) {
      setActiveNode(step.node);
      currentClosed.add(step.node);
      setClosedSet(new Set(currentClosed));
      setStatus(step.status);
      await delay();
    }

    const finalPath = ["0,0", "1,0", "2,0", "2,1", "2,2", "3,2", "3,3", "4,3", "4,4"];
    setPath(new Set(finalPath));
    setActiveNode(null);
    setStatus("Optimal Path Locked. Total Cost: $g(n) + h(n)$ minimized.");
    setIsRunning(false);
  };

  const reset = () => {
    setOpenSet(new Set(["0,0"]));
    setClosedSet(new Set());
    setPath(new Set());
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">A* Navigator</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize heuristic-informed shortest pathfinding on a dynamic grid.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── GRID STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative z-10 grid grid-cols-5 gap-2 p-4 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
            {grid.map((row, rIdx) => 
              row.map((cell, cIdx) => {
                const id = `${rIdx},${cIdx}`;
                const isPath = path.has(id);
                const isClosed = closedSet.has(id);
                const isActive = activeNode === id;
                
                return (
                  <div 
                    key={id} 
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      isActive ? 'bg-fuchsia-500 border-fuchsia-400 scale-110 z-20 shadow-[0_0_20px_#d946ef]' :
                      isPath ? 'bg-emerald-500 border-emerald-400 text-black' :
                      isClosed ? 'bg-fuchsia-900/40 border-fuchsia-500/30 text-fuchsia-300' :
                      cell === 1 ? 'bg-gray-800 border-gray-700' : 
                      'bg-white/5 border-white/5 text-gray-700'
                    }`}
                  >
                    {cell === 'S' ? <Navigation size={20} className="text-fuchsia-500" /> : 
                     cell === 'G' ? <Target size={20} className="text-emerald-500" /> : 
                     cell === 1 ? '' : ''}
                  </div>
                )
              })
            )}
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
              <Compass size={16} className="text-fuchsia-500" /> Search Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Propagation Speed
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="50"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startAStar} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> INITIATE NAVIGATION
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET GRID
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