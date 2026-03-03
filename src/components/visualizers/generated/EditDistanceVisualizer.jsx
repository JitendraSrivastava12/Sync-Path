import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Scissors, Type, Database } from 'lucide-react';

export default function EditDistanceVisualizer() {
  const navigate = useNavigate();
  
  // State Management
  const [str1, setStr1] = useState("HORSE");
  const [str2, setStr2] = useState("ROS");
  const [dp, setDp] = useState([]);
  const [current, setCurrent] = useState({ i: -1, j: -1 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Levenshtein Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(300);
  const [speed, setSpeed] = useState(300);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "for i in range(m + 1):\n  for j in range(n + 1):\n    if i == 0: dp[i][j] = j\n    elif j == 0: dp[i][j] = i\n    elif S1[i-1] == S2[j-1]:\n      dp[i][j] = dp[i-1][j-1]\n    else:\n      dp[i][j] = 1 + min(dp[i-1][j],    # Delete\n                         dp[i][j-1],    # Insert\n                         dp[i-1][j-1])  # Replace", comp: "O(M * N) Complexity" },
    java: { logic: "if (S1.charAt(i-1) == S2.charAt(j-1))\n    dp[i][j] = dp[i-1][j-1];\nelse\n    dp[i][j] = 1 + Math.min(dp[i-1][j-1], \n        Math.min(dp[i-1][j], dp[i][j-1]));", comp: "String Edit Logic" }
  };

  const startDP = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const m = str1.length;
    const n = str2.length;
    let table = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    setDp(table.map(row => [...row]));

    setStatus("Phase 1: Initializing Base Costs (0, 1, 2...)");
    for (let i = 0; i <= m; i++) table[i][0] = i;
    for (let j = 0; j <= n; j++) table[0][j] = j;
    setDp(table.map(row => [...row]));
    await delay();

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        setCurrent({ i, j });
        
        if (str1[i - 1] === str2[j - 1]) {
          table[i][j] = table[i - 1][j - 1];
          setStatus(`Characters '${str1[i-1]}' match! Carrying over diagonal cost.`);
        } else {
          const insert = table[i][j - 1];
          const remove = table[i - 1][j];
          const replace = table[i - 1][j - 1];
          table[i][j] = 1 + Math.min(insert, remove, replace);
          setStatus(`Mismatch. 1 + Min(Top, Left, Diagonal)`);
        }
        
        setDp(table.map(row => [...row]));
        await delay();
      }
    }

    setCurrent({ i: -1, j: -1 });
    setIsRunning(false);
    setStatus(`Transformation Complete. Minimum Edits: ${table[m][n]}`);
  };

  const reset = () => {
    setDp([]);
    setCurrent({ i: -1, j: -1 });
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Edit Distance</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the minimum operations required for string transformation.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE DP TABLE STAGE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 w-full overflow-x-auto no-scrollbar">
            {dp.length > 0 && (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-white/10 text-[10px] text-gray-600">S1 \ S2</th>
                    <th className="p-2 border border-white/10 text-[10px] text-gray-400 font-mono">∅</th>
                    {str2.split('').map((char, idx) => (
                      <th key={idx} className="p-2 border border-white/10 text-[10px] text-blue-400 font-mono">{char}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dp.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-white/10 text-[10px] font-bold text-blue-400">
                        {i === 0 ? '∅' : str1[i - 1]}
                      </td>
                      {row.map((val, j) => {
                        const isActive = current.i === i && current.j === j;
                        const isProcessed = i < current.i || (i === current.i && j <= current.j);
                        return (
                          <td key={j} className={`p-2 border border-white/10 text-center font-mono text-xs transition-all duration-300 ${
                            isActive ? 'bg-fuchsia-600 text-white scale-110 z-20 shadow-[0_0_15px_#d946ef88]' :
                            isProcessed ? 'text-white' : 'text-gray-700'
                          }`}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

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
              <Database size={16} className="text-fuchsia-500" /> Input Terminal
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source String</label>
                  <input 
                    type="text" value={str1} onChange={(e) => setStr1(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target String</label>
                  <input 
                    type="text" value={str2} onChange={(e) => setStr2(e.target.value.toUpperCase())}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono focus:border-fuchsia-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Gauge size={14} /> Processing Speed
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
                <button onClick={startDP} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> COMPUTE DISTANCE
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> CLEAR TABLE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}