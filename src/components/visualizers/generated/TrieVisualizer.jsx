import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, GitBranch, Type, Search, PlusCircle, CheckCircle2
} from 'lucide-react';

export default function TrieVisualizer() {
  const navigate = useNavigate();
  
  // State: Hardcoded Trie structure for 'CAT', 'CAP', 'CAR', 'BAT'
  const [nodes, setNodes] = useState([
    { id: 'root', char: 'Root', x: 250, y: 50, children: ['C', 'B'], isEndOfWord: false },
    { id: 'C', char: 'C', x: 150, y: 130, children: ['CA'], parent: 'root' },
    { id: 'B', char: 'B', x: 350, y: 130, children: ['BA'], parent: 'root' },
    { id: 'CA', char: 'A', x: 150, y: 210, children: ['CAT', 'CAP', 'CAR'], parent: 'C' },
    { id: 'BA', char: 'A', x: 350, y: 210, children: ['BAT'], parent: 'B' },
    { id: 'CAT', char: 'T', x: 80, y: 290, isEndOfWord: true, parent: 'CA' },
    { id: 'CAP', char: 'P', x: 150, y: 290, isEndOfWord: true, parent: 'CA' },
    { id: 'CAR', char: 'R', x: 220, y: 290, isEndOfWord: true, parent: 'CA' },
    { id: 'BAT', char: 'T', x: 350, y: 290, isEndOfWord: true, parent: 'BA' },
  ]);

  const [activeIndex, setActiveIndex] = useState(null);
  const [searchWord, setSearchWord] = useState("CAT");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Prefix Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(700);
  const [speed, setSpeed] = useState(700);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "def search(word):\n    node = root\n    for char in word:\n        if char not in node.children:\n            return False\n        node = node.children[char]\n    return node.is_end_of_word", 
      comp: "O(L) Complexity" 
    },
    java: { 
      logic: "boolean search(String word) {\n    TrieNode curr = root;\n    for(char c : word.toCharArray()) {\n        if(curr.children[c-'a'] == null) return false;\n        curr = curr.children[c-'a'];\n    }\n    return curr.isEndOfWord;\n}", 
      comp: "Prefix Mapping" 
    }
  };

  const startSearch = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let path = "";
    setStatus(`Initiating search for "${searchWord}"...`);
    setActiveIndex('root');
    await delay();

    for (let char of searchWord) {
      path += char;
      setActiveIndex(path);
      setStatus(`Scanning path for character: '${char}'`);
      
      const exists = nodes.find(n => n.id === path);
      if (!exists) {
        setStatus(`Failure: Prefix "${path}" does not exist.`);
        setIsRunning(false);
        return;
      }
      await delay();
    }

    const finalNode = nodes.find(n => n.id === searchWord);
    if (finalNode && finalNode.isEndOfWord) {
      setStatus(`SUCCESS: Word "${searchWord}" identified.`);
    } else {
      setStatus(`Partial Match: Prefix found but not a terminal word.`);
    }

    setIsRunning(false);
  };

  const reset = () => {
    setActiveIndex(null);
    setIsRunning(false);
    setStatus('Registers Cleared');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Trie Architecture</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the character-node hierarchy used in modern autocomplete engines.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── VISUAL STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg width="500" height="350" className="relative z-10 overflow-visible">
            {/* Branches */}
            {nodes.map(node => {
              if (!node.children) return null;
              return node.children.map(childId => {
                const child = nodes.find(n => n.id === childId);
                if (!child) return null;
                return (
                  <line 
                    key={`${node.id}-${child.id}`}
                    x1={node.x} y1={node.y} x2={child.x} y2={child.y} 
                    stroke="rgba(255,255,255,0.08)" strokeWidth="2" 
                  />
                );
              });
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id} className="transition-all duration-500">
                <circle 
                  cx={node.x} cy={node.y} r="20" 
                  className={`transition-all duration-300 ${
                    activeIndex === node.id ? 'fill-fuchsia-600 stroke-fuchsia-400 shadow-[0_0_20px_#d946ef88]' : 
                    node.isEndOfWord ? 'fill-emerald-500/20 stroke-emerald-500' : 'fill-white/5 stroke-white/10'
                  }`}
                  strokeWidth="2"
                />
                <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">
                  {node.char}
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

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Search size={16} className="text-fuchsia-500" /> Search Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Query String</label>
                  <input 
                    type="text" value={searchWord} onChange={(e) => setSearchWord(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Gauge size={14} /> Walk Speed
                    </label>
                    <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                  </div>
                  <input 
                    type="range" min="100" max="1500" step="100"
                    value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startSearch} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> INITIATE SEARCH
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