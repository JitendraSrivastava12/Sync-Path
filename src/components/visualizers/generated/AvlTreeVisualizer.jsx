import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, RefreshCcw, 
  AlertTriangle, Terminal
} from 'lucide-react';

export default function AvlTreeVisualizer() {
  const navigate = useNavigate();
  
  // Initial State: A Right-Right Heavy Imbalance Case
  const initialNodes = [
    { id: 40, x: 250, y: 50, left: 20, right: 60, bf: -1 },
    { id: 20, x: 150, y: 130, left: 10, bf: 0, parent: 40 },
    { id: 10, x: 100, y: 210, bf: 0, parent: 20 },
    { id: 60, x: 350, y: 130, right: 80, bf: -1, parent: 40 },
    { id: 80, x: 420, y: 210, right: 90, bf: -1, parent: 60 },
    { id: 90, x: 480, y: 290, bf: 0, parent: 80 } 
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [activeIndex, setActiveIndex] = useState(null);
  const [imbalanceNode, setImbalanceNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('AVL System Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(1000);
  const [speed, setSpeed] = useState(1000);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def get_balance(node):\n    return height(node.left) - height(node.right)\n\nif balance < -1:\n    if get_balance(node.right) <= 0:\n        return left_rotate(node)\n    else:\n        node.right = right_rotate(node.right)\n        return left_rotate(node)", 
      comp: "O(log n) Time" 
    },
    java: { 
      logic: "int balance = getBalance(N);\nif (balance < -1 && getBalance(N.right) <= 0)\n    return leftRotate(N);\nif (balance < -1 && getBalance(N.right) > 0) {\n    N.right = rightRotate(N.right);\n    return leftRotate(N);\n}", 
      comp: "Height Balanced" 
    }
  };

  const executeRebalance = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    setStatus("Scanning Tree Topology for Constraint Violations...");
    setActiveIndex(40); await delay();
    setActiveIndex(60); await delay();
    
    setImbalanceNode(60);
    setStatus("CRITICAL: Node 60 BF is -2. Right-Right (RR) Case detected.");
    await delay();

    setStatus("Executing Left Rotation on Pivot Node 60...");
    setActiveIndex(80); 
    
    // Balanced state coordinates
    const balancedNodes = [
      { id: 40, x: 250, y: 50, left: 20, right: 80, bf: -1 },
      { id: 20, x: 150, y: 130, left: 10, bf: 0, parent: 40 },
      { id: 10, x: 100, y: 210, bf: 0, parent: 20 },
      { id: 80, x: 350, y: 130, left: 60, right: 90, bf: 0, parent: 40 },
      { id: 60, x: 300, y: 210, bf: 0, parent: 80 },
      { id: 90, x: 400, y: 210, bf: 0, parent: 80 }
    ];
    
    setNodes(balancedNodes);
    await delay();

    setImbalanceNode(null);
    setActiveIndex(null);
    setStatus("System Restored: Maximum depth optimized to O(log n).");
    setIsRunning(false);
  };

  const reset = () => {
    setNodes(initialNodes);
    setActiveIndex(null);
    setImbalanceNode(null);
    setIsRunning(false);
    setStatus('AVL System Reset');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white selection:bg-fuchsia-500/30">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">AVL Self-Balance</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Diagnostic visualization of height-balanced tree restructuring.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* VISUAL CANVAS */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="600" height="400" className="relative z-10 overflow-visible scale-90 md:scale-100">
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
            
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-1000 ease-in-out">
                <circle 
                  cx={node.x} cy={node.y} r="24" 
                  className={`transition-all duration-700 ${
                    imbalanceNode === node.id ? 'fill-red-600/20 stroke-red-500 animate-pulse' :
                    activeIndex === node.id ? 'fill-fuchsia-600 stroke-fuchsia-400' : 
                    'fill-white/5 stroke-white/10'
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[12px] font-mono font-bold fill-white">
                  {node.id}
                </text>
                <text x={node.x + 28} y={node.y - 18} className={`text-[9px] font-black uppercase ${imbalanceNode === node.id ? 'fill-red-500' : 'fill-fuchsia-500/60'}`}>
                  BF: {imbalanceNode === node.id ? '-2' : node.bf}
                </text>
              </g>
            ))}
          </svg>

          <div className="absolute bottom-10 left-10 right-10 flex justify-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
              <Terminal size={14} className="text-fuchsia-500" />
              <span className="text-[10px] font-mono text-gray-200 uppercase tracking-[0.15em]">{status}</span>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <RefreshCcw size={16} className="text-fuchsia-500" /> Rebalance Engine
            </h3>
            
            <div className="space-y-8">
              {/* Diagnostic Alert with &gt; Fix */}
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Constraint Violation</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                    Balance Factor ($BF = H_L - H_R$) detected at $|BF| &gt; 1$. 
                    The engine must execute a rotation to maintain $O(\log n)$ search depth.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Logic Latency
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
                <button onClick={executeRebalance} disabled={isRunning} className="flex items-center justify-center gap-3 py-4 bg-fuchsia-600 rounded-xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={16} fill="currentColor" /> RUN REBALANCE
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={16} /> RESET TOPOLOGY
                </button>
              </div>
            </div>
          </div>

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