import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Added Cpu and ChevronRight to the imports below
import { Plus, Trash2, RotateCcw, ArrowRight, ArrowLeft, Globe, Cpu, ChevronRight } from 'lucide-react';

export default function LinkedListVisualizer() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([
    { id: 1, val: 15, next: 2 },
    { id: 2, val: 42, next: null },
  ]);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('Head Pointer Initialized');
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('python');

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const PSEUDO_CODE = {
    python: { insert: "new_node.next = head; head = new_node", delete: "prev.next = curr.next", comp: "O(1) at Head / O(n) Search" },
    java: { insert: "newNode.next = head; head = newNode;", delete: "prev.next = temp.next;", comp: "O(1) Insertion" },
    cpp: { insert: "newNode->next = head; head = newNode;", delete: "prev->next = curr->next;", comp: "O(1) Pointer Update" },
    c: { insert: "newNode->next = *head; *head = newNode;", delete: "free(temp);", comp: "O(1) Manual Link" }
  };

  const insertAtHead = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    const newId = Date.now();
    
    setStatus(`Allocating memory for Node(${val})...`);
    await delay(600);
    
    setStatus("Linking: NewNode.next = Head");
    setHighlights(['new-link']);
    await delay(800);

    const newNode = { id: newId, val, next: nodes.length > 0 ? nodes[0].id : null };
    setNodes([newNode, ...nodes]);
    setHighlights([]);
    setStatus(`Success: Head updated to Node(${val})`);
    setInputValue('');
  };

  const deleteHead = async () => {
    if (nodes.length === 0) {
      setStatus("Error: List Underflow");
      return;
    }
    setStatus("Deallocating Head Node...");
    setHighlights([nodes[0].id]);
    await delay(600);
    
    setNodes(nodes.slice(1));
    setHighlights([]);
    setStatus("Success: Head pointer shifted to Next");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-6 md:space-y-12">
      
      {/* 1. ARCHITECTURAL HEADER WITH BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 md:py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold text-xs md:text-base rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>

          <div>
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter mb-1">Linked Node Engine</h1>
            <p className="text-gray-400 font-medium text-xs md:text-lg tracking-tight">Visualize non-contiguous memory and pointer-based traversal.</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
           <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Storage: <span className="text-fuchsia-500">Heap / Linked</span>
           </div>
           <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Head: <span className="text-blue-400">0x{nodes[0]?.id.toString(16).slice(-3) || 'NULL'}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
        
        {/* 2. THE VISUAL ENGINE (The Chain) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-20 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-center gap-2 md:gap-8 z-10 overflow-x-auto no-scrollbar w-full py-20 px-10">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                {/* Node Structure */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`
                    relative flex w-24 md:w-32 h-14 md:h-16 rounded-2xl border-2 transition-all duration-500
                    ${highlights.includes(node.id) ? 'border-fuchsia-500 bg-fuchsia-500/20 shadow-[0_0_30px_rgba(217,70,239,0.3)]' : 'border-white/10 bg-white/5'}
                  `}>
                    <div className="flex-1 flex items-center justify-center border-r border-white/10 font-mono font-bold text-white">
                      {node.val}
                    </div>
                    <div className="w-8 md:w-10 flex items-center justify-center bg-white/5 rounded-r-2xl">
                      <div className={`w-2 h-2 rounded-full ${node.next ? 'bg-fuchsia-500' : 'bg-red-900'}`} />
                    </div>
                    {i === 0 && (
                      <div className="absolute -top-10 left-0 text-[8px] font-black text-blue-400 uppercase tracking-widest">
                        Head Pointer
                      </div>
                    )}
                  </div>
                  <span className="mt-3 text-[7px] font-mono text-gray-600">ADDR: 0x{node.id.toString(16).slice(-4)}</span>
                </div>

                {/* Connection Arrow */}
                {node.next && (
                  <div className="flex items-center shrink-0">
                    <div className="w-8 md:w-12 h-px bg-gradient-to-r from-fuchsia-500 to-transparent" />
                    <ChevronRight size={16} className="text-fuchsia-500 -ml-2" />
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {nodes.length === 0 && (
              <div className="mx-auto text-[11px] font-black text-gray-800 uppercase tracking-[0.4em]">Empty List</div>
            )}
          </div>

          {/* Status HUD */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl">
            <div className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[9px] md:text-[11px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
          </div>
        </div>

        {/* 3. CONTROL TERMINAL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> Linked Controls
            </h3>
            <div className="flex flex-col gap-4">
              <input 
                type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                placeholder="Node Value" className="bg-black/40 border border-white/5 rounded-xl md:rounded-2xl px-5 py-4 text-white text-sm font-mono focus:border-fuchsia-500/50 outline-none transition-all shadow-inner"
              />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={insertAtHead} className="btn-action flex-1 bg-fuchsia-600 hover:bg-fuchsia-500">
                  <Plus size={16} /> INSERT HEAD
                </button>
                <button onClick={deleteHead} className="btn-action flex-1 bg-white/5 border border-white/10 hover:bg-white/10">
                  <Trash2 size={16} className="text-red-400" /> DELETE HEAD
                </button>
              </div>
              <button onClick={() => {setNodes([]); setStatus('Heap Purged');}} className="text-[9px] text-gray-600 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-all group">
                <RotateCcw size={12} className="group-hover:rotate-180 transition-all duration-500" /> Clear Heap
              </button>
            </div>
          </div>

          {/* Logic Sidecar */}
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                <Globe size={16} className="text-fuchsia-500" /> Environment
              </h3>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[11px] font-black text-fuchsia-500 outline-none cursor-pointer uppercase">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-black/40 rounded-xl text-[10px] font-mono text-blue-300 border border-white/5 leading-relaxed">
                {PSEUDO_CODE[language].insert}
              </div>
              <div className="p-4 bg-black/40 rounded-xl text-[10px] font-mono text-fuchsia-400 border border-white/5">
                Metric: {PSEUDO_CODE[language].comp}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field { @apply bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all; }
        .btn-action { @apply flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 text-white shadow-xl; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}