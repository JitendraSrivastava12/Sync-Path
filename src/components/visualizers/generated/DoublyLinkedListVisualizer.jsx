import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, RotateCcw, ArrowLeft, Globe, Cpu, ChevronRight, ChevronLeft } from 'lucide-react';

export default function DoublyLinkedListVisualizer() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([
    { id: 1, val: 24, prev: null, next: 2 },
    { id: 2, val: 89, prev: 1, next: null }
  ]);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('System Ready');
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('python');

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const PSEUDO_CODE = {
    python: { insert: "new.next = head; head.prev = new; head = new", delete: "node.prev.next = node.next; node.next.prev = node.prev", comp: "O(1) Insertion/Deletion" },
    java: { insert: "newNode.next = head; head.prev = newNode;", delete: "curr.prev.next = curr.next;", comp: "O(1) with pointer reference" },
    cpp: { insert: "newNode->next = head; head->prev = newNode;", delete: "temp->prev->next = temp->next;", comp: "O(1) Bi-directional link" },
    c: { insert: "new->next = *head; (*head)->prev = new;", delete: "free(temp);", comp: "O(1) Manual Pointer Sync" }
  };

  const insertHead = async () => {
    if (!inputValue) return;
    const val = parseInt(inputValue);
    const newId = Date.now();
    
    setStatus(`Allocating DoublyLinkedNode(${val})...`);
    await delay(500);
    
    setStatus("Syncing Pointers: New.next = Head & Head.prev = New");
    setHighlights(['pointer-sync']);
    await delay(800);

    const newNode = { 
      id: newId, 
      val, 
      prev: null, 
      next: nodes.length > 0 ? nodes[0].id : null 
    };

    const updatedNodes = nodes.map((node, i) => 
      i === 0 ? { ...node, prev: newId } : node
    );

    setNodes([newNode, ...updatedNodes]);
    setHighlights([]);
    setStatus(`Success: Bidirectional links established at Head`);
    setInputValue('');
  };

  const deleteHead = async () => {
    if (nodes.length === 0) {
      setStatus("Underflow: List Empty");
      return;
    }
    setStatus("Breaking Bidirectional Links...");
    setHighlights([nodes[0].id]);
    await delay(600);
    
    const newNodes = nodes.slice(1).map((node, i) => 
      i === 0 ? { ...node, prev: null } : node
    );
    
    setNodes(newNodes);
    setHighlights([]);
    setStatus("Success: Head purged, new Head.prev set to NULL");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-6 md:space-y-12">
      
      {/* 1. ARCHITECTURAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 md:py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold text-xs md:text-base rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>

          <div>
            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter mb-1">Doubly Linked Engine</h1>
            <p className="text-gray-400 font-medium text-xs md:text-lg tracking-tight">Visualize bidirectional traversal and dual-pointer overhead.</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
           <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Pointers: <span className="text-fuchsia-500">Prev & Next</span>
           </div>
           <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             Complexity: <span className="text-blue-400">O(1)</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12">
        
        {/* 2. THE VISUAL ENGINE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-[#0c0214] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-20 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative flex items-center gap-4 md:gap-12 z-10 overflow-x-auto no-scrollbar w-full py-24 px-10">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                {/* Node Structure */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`
                    relative flex w-32 md:w-40 h-16 md:h-20 rounded-2xl border-2 transition-all duration-500
                    ${highlights.includes(node.id) ? 'border-fuchsia-500 bg-fuchsia-500/20 shadow-[0_0_30px_rgba(217,70,239,0.3)]' : 'border-white/10 bg-white/5'}
                  `}>
                    {/* Prev Pointer Port */}
                    <div className="w-8 md:w-10 flex items-center justify-center border-r border-white/10 bg-white/5 rounded-l-2xl">
                      <div className={`w-2 h-2 rounded-full ${node.prev !== null ? 'bg-blue-500' : 'bg-red-900'}`} />
                    </div>
                    {/* Data Field */}
                    <div className="flex-1 flex items-center justify-center font-mono font-bold text-white text-xl">
                      {node.val}
                    </div>
                    {/* Next Pointer Port */}
                    <div className="w-8 md:w-10 flex items-center justify-center border-l border-white/10 bg-white/5 rounded-r-2xl">
                      <div className={`w-2 h-2 rounded-full ${node.next !== null ? 'bg-fuchsia-500' : 'bg-red-900'}`} />
                    </div>
                    
                    {i === 0 && <span className="absolute -top-8 left-0 text-[8px] font-black text-blue-400 uppercase tracking-widest">Head</span>}
                    {i === nodes.length - 1 && <span className="absolute -top-8 right-0 text-[8px] font-black text-fuchsia-500 uppercase tracking-widest">Tail</span>}
                  </div>
                  <span className="mt-3 text-[7px] font-mono text-gray-600 tracking-tighter uppercase">Memory: 0x{node.id.toString(16).slice(-4)}</span>
                </div>

                {/* Bi-directional Arrows */}
                {node.next && (
                  <div className="flex flex-col justify-center shrink-0 -mx-2 md:-mx-6 z-0">
                    <div className="flex items-center">
                      <div className="w-10 md:w-16 h-px bg-fuchsia-500/40" />
                      <ChevronRight size={12} className="text-fuchsia-500 -ml-2" />
                    </div>
                    <div className="flex items-center mt-2">
                      <ChevronLeft size={12} className="text-blue-500 -mr-2 z-10" />
                      <div className="w-10 md:w-16 h-px bg-blue-500/40" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Status HUD */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl">
            <div className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[9px] md:text-[11px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
          </div>
        </div>

        {/* 3. CONTROL CENTER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-xl">
            <h3 className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-3">
              <Cpu size={16} className="text-fuchsia-500" /> DLL Terminal
            </h3>
            <div className="flex flex-col gap-4">
              <input 
                type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                placeholder="Integer Value" className="bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-white text-sm font-mono focus:border-fuchsia-500/50 outline-none transition-all shadow-inner"
              />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={insertHead} className="btn-action flex-1 bg-fuchsia-600 hover:bg-fuchsia-500">
                  <Plus size={16} /> PUSH HEAD
                </button>
                <button onClick={deleteHead} className="btn-action flex-1 bg-white/5 border border-white/10 hover:bg-white/10">
                  <Trash2 size={16} className="text-red-400" /> POP HEAD
                </button>
              </div>
              <button onClick={() => setNodes([])} className="text-[9px] text-gray-600 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-colors">
                <RotateCcw size={12} /> Purge List
              </button>
            </div>
          </div>

          {/* Sidecar */}
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
        .btn-action { @apply flex items-center justify-center gap-1 px-3 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all active:scale-95 text-white shadow-xl; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}