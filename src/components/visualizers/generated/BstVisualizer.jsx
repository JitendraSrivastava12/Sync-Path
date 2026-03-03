import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Share2, GitBranch, Binary, Search } from 'lucide-react';

export default function BstVisualizer() {
  const navigate = useNavigate();
  
  // Simple Tree State (Nodes with x, y coordinates for visualization)
  const [nodes, setNodes] = useState([
    { id: 50, x: 250, y: 50, left: 30, right: 70 },
    { id: 30, x: 150, y: 130, left: 20, right: 40, parent: 50 },
    { id: 70, x: 350, y: 130, left: 60, right: 80, parent: 50 },
    { id: 20, x: 100, y: 210, parent: 30 },
    { id: 40, x: 200, y: 210, parent: 30 },
    { id: 60, x: 300, y: 210, parent: 70 },
    { id: 80, x: 400, y: 210, parent: 70 }
  ]);

  const [activeIndex, setActiveIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('BST Engine Ready');
  const [target, setTarget] = useState(60);
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(800);
  const [speed, setSpeed] = useState(800);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "def search(root, key):\n    if not root or root.val == key:\n        return root\n    if root.val < key:\n        return search(root.right, key)\n    return search(root.left, key)", comp: "O(log n) Average" },
    java: { logic: "public Node search(Node root, int key) {\n    if (root == null || root.key == key)\n        return root;\n    if (root.key < key)\n        return search(root.right, key);\n    return search(root.left, key);\n}", comp: "Recursive Traversal" }
  };

  const startSearch = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let currentId = 50; // Start at root
    setStatus(`Phase 1: Starting at Root (${currentId})`);

    while (currentId !== undefined) {
      setActiveIndex(currentId);
      await delay();

      if (currentId === target) {
        setStatus(`MATCH FOUND! Node ${currentId} is our target.`);
        setIsRunning(false);
        return;
      }

      if (target < currentId) {
        setStatus(`${target} < ${currentId}: Branching LEFT.`);
        const currentObj = nodes.find(n => n.id === currentId);
        currentId = currentObj.left;
      } else {
        setStatus(`${target} > ${currentId}: Branching RIGHT.`);
        const currentObj = nodes.find(n => n.id === currentId);
        currentId = currentObj.right;
      }
      
      if (currentId === undefined) {
        setStatus(`Target ${target} not found in this tree.`);
      }
    }

    setIsRunning(false);
  };

  const reset = () => {
    setActiveIndex(null);
    setIsRunning(false);
    setStatus('Engine Reset');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Binary Search Tree</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize logarithmic branching and hierarchical node discovery.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE BST CANVAS */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[550px] bg-[#0c0214] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <svg width="500" height="300" className="relative z-10 overflow-visible">
            {/* Render Branches */}
            {nodes.map(node => {
              const leftNode = nodes.find(n => n.id === node.left);
              const rightNode = nodes.find(n => n.id === node.right);
              return (
                <g key={`lines-${node.id}`}>
                  {leftNode && <line x1={node.x} y1={node.y} x2={leftNode.x} y2={leftNode.y} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />}
                  {rightNode && <line x1={node.x} y1={node.y} x2={rightNode.x} y2={rightNode.y} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />}
                </g>
              );
            })}
            
            {/* Render Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="22" 
                  className={`transition-all duration-500 border-2 ${
                    activeIndex === node.id 
                      ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-2xl' 
                      : 'fill-white/5 stroke-white/10'
                  }`}
                />
                <text 
                  x={node.x} y={node.y + 5} 
                  textAnchor="middle" 
                  className={`text-[10px] font-mono font-bold ${activeIndex === node.id ? 'fill-white' : 'fill-gray-500'}`}
                >
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

        {/* 3. CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <GitBranch size={16} className="text-fuchsia-500" /> Tree Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Search Target</label>
                  <input 
                    type="number" value={target} onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Gauge size={14} /> Traversal Speed
                    </label>
                    <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                  </div>
                  <input 
                    type="range" min="200" max="2000" step="200"
                    value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startSearch} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Search size={18} /> INITIATE SEARCH
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET TREE
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