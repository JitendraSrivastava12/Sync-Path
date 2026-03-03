import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, RefreshCcw, 
  AlertTriangle, Terminal, Palette
} from 'lucide-react';

export default function RedBlackTreeVisualizer() {
  const navigate = useNavigate();
  
  // Initial State: Demonstrating a "Double Red" violation at node 15
  const initialNodes = [
    { id: 20, x: 250, y: 50, left: 10, right: 30, color: 'BLACK', bf: 0 },
    { id: 10, x: 150, y: 130, right: 15, color: 'RED', parent: 20 },
    { id: 30, x: 350, y: 130, color: 'RED', parent: 20 },
    { id: 15, x: 200, y: 210, color: 'RED', parent: 10 } // New node causing violation
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [activeIndex, setActiveIndex] = useState(null);
  const [violationNode, setViolationNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('RBT System Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def fix_insert(self, k):\n    while k.parent.color == 'RED':\n        if k.parent == k.parent.parent.left:\n            uncle = k.parent.parent.right\n            if uncle.color == 'RED': # Case 1\n                k.parent.color = 'BLACK'\n                uncle.color = 'BLACK'\n                k.parent.parent.color = 'RED'", 
      comp: "O(log n) Time" 
    },
    java: { 
      logic: "while (node.parent.color == RED) {\n    if (node.parent == node.parent.parent.left) {\n        Node uncle = node.parent.parent.right;\n        if (uncle.color == RED) {\n            node.parent.color = BLACK;\n            uncle.color = BLACK;\n            node.parent.parent.color = RED;\n        }\n    }\n}", 
      comp: "Rules-based Balancing" 
    }
  };

  const executeFixup = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Step 1: Scanning
    setStatus("Scanning for Property Violations...");
    setActiveIndex(15); await delay();
    setActiveIndex(10); await delay();
    
    // Step 2: Detection
    setViolationNode(15);
    setStatus("PROPERTY VIOLATION: Double Red detected at Node 15 and Parent 10.");
    await delay();

    // Step 3: Recoloring (Case 1: Uncle is Red)
    setStatus("Case 1: Uncle (Node 30) is RED. Performing Recoloring...");
    const recoloredNodes = nodes.map(node => {
        if (node.id === 10 || node.id === 30) return { ...node, color: 'BLACK' };
        if (node.id === 20) return { ...node, color: 'RED' };
        return node;
    });
    setNodes(recoloredNodes);
    await delay();

    // Step 4: Root must be black
    setStatus("Rule 1 Violation: Root must be BLACK. Recoloring Root...");
    const finalNodes = recoloredNodes.map(node => {
        if (node.id === 20) return { ...node, color: 'BLACK' };
        return node;
    });
    setNodes(finalNodes);
    await delay();

    setViolationNode(null);
    setActiveIndex(null);
    setStatus("RBT Properties Restored. System Stable.");
    setIsRunning(false);
  };

  const reset = () => {
    setNodes(initialNodes);
    setActiveIndex(null);
    setViolationNode(null);
    setIsRunning(false);
    setStatus('RBT System Reset');
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Red-Black Tree</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize node-coloring constraints and rebalancing fix-ups.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL CANVAS ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="600" height="400" className="relative z-10 overflow-visible scale-90 md:scale-100">
            {/* Branches */}
            {nodes.map(node => {
              const leftNode = nodes.find(n => n.id === node.left);
              const rightNode = nodes.find(n => n.id === node.right);
              return (
                <g key={`branch-${node.id}`} className="opacity-20">
                  {leftNode && <line x1={node.x} y1={node.y} x2={leftNode.x} y2={leftNode.y} stroke="white" strokeWidth="2" />}
                  {rightNode && <line x1={node.x} y1={node.y} x2={rightNode.x} y2={rightNode.y} stroke="white" strokeWidth="2" />}
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-700 ease-in-out">
                <circle 
                  cx={node.x} cy={node.y} r="26" 
                  className={`transition-all duration-700 ${
                    node.color === 'RED' ? 'fill-red-600 stroke-red-400' : 'fill-gray-900 stroke-gray-700'
                  } ${activeIndex === node.id ? 'ring-4 ring-fuchsia-500' : ''} ${violationNode === node.id ? 'animate-bounce shadow-[0_0_30px_#ef4444]' : ''}`}
                  strokeWidth="3"
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
              <Terminal size={14} className="text-fuchsia-500" />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-[0.15em]">{status}</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Palette size={16} className="text-fuchsia-500" /> Color Fix-up
            </h3>
            
            <div className="space-y-8">
              {/* Diagnostic Alert */}
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Double Red Violation</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                    Property 4: If a node is RED, then both its children must be BLACK. The engine will recolor or rotate to restore the Black-Height.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Propagation Delay
                  </label>
                  <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                </div>
                <input 
                  type="range" min="300" max="2000" step="100"
                  value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={executeFixup} disabled={isRunning} className="flex items-center justify-center gap-3 py-4 bg-fuchsia-600 rounded-xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={16} fill="currentColor" /> EXECUTE FIX-UP
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={16} /> RESET STATE
                </button>
              </div>
            </div>
          </div>

          {/* Logic Terminal */}
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                <Code2 size={16} className="text-fuchsia-500" /> Source Logic
              </h3>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[11px] font-black text-fuchsia-500 outline-none cursor-pointer uppercase">
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            <pre className="p-5 bg-black/40 rounded-xl text-[10px] font-mono text-blue-300 border border-white/5 leading-relaxed overflow-x-auto">
              {PSEUDO_CODE[language].logic}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}