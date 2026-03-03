import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ArrowLeft, Cpu, Gauge, Code2, Zap, Grid3X3, Layers, Database, Calculator } from 'lucide-react';

export default function McmVisualizer() {
  const navigate = useNavigate();
  
  // Dimensions for matrices: A(10x30), B(30x5), C(5x60), D(60x10)
  const dims = [10, 30, 5, 60, 10];
  const N = dims.length - 1; // Number of matrices

  // State Management
  const [dp, setDp] = useState(Array(N + 1).fill(0).map(() => Array(N + 1).fill(0)));
  const [current, setCurrent] = useState({ i: -1, j: -1, k: -1 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('MCM Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(400);
  const [speed, setSpeed] = useState(400);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { logic: "for L in range(2, n + 1):\n  for i in range(1, n - L + 2):\n    j = i + L - 1\n    dp[i][j] = float('inf')\n    for k in range(i, j):\n      cost = dp[i][k] + dp[k+1][j] + d[i-1]*d[k]*d[j]\n      dp[i][j] = min(dp[i][j], cost)", comp: "O(n³) Complexity" },
    java: { logic: "for (int L = 2; L <= n; L++) {\n  for (int i = 1; i <= n - L + 1; i++) {\n    int j = i + L - 1;\n    m[i][j] = Integer.MAX_VALUE;\n    for (int k = i; k < j; k++) {\n      int q = m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j];\n      if (q < m[i][j]) m[i][j] = q;\n    }\n  }\n}", comp: "Interval-based DP" }
  };

  const startDP = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let table = Array(N + 1).fill(0).map(() => Array(N + 1).fill(0));
    setDp(table.map(row => [...row]));

    setStatus("Phase 1: Chain lengths of 1 have cost 0.");
    await delay();

    for (let L = 2; L <= N; L++) {
      setStatus(`Phase 2: Analyzing chains of length ${L}`);
      for (let i = 1; i <= N - L + 1; i++) {
        let j = i + L - 1;
        table[i][j] = Infinity;
        
        for (let k = i; k < j; k++) {
          setCurrent({ i, j, k });
          const cost = table[i][k] + table[k + 1][j] + (dims[i - 1] * dims[k] * dims[j]);
          
          if (cost < table[i][j]) {
            table[i][j] = cost;
            setDp(table.map(row => [...row]));
            setStatus(`Split at k=${k}: New Min Cost for [${i},${j}] = ${cost}`);
          } else {
            setStatus(`Split at k=${k}: Cost ${cost} is not better than ${table[i][j]}`);
          }
          await delay();
        }
      }
    }

    setCurrent({ i: -1, j: -1, k: -1 });
    setIsRunning(false);
    setStatus(`Optimization Complete. Min Scalar Multiplications: ${table[1][N]}`);
  };

  const reset = () => {
    setDp(Array(N + 1).fill(0).map(() => Array(N + 1).fill(0)));
    setCurrent({ i: -1, j: -1, k: -1 });
    setIsRunning(false);
    setStatus('Engine Reset');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 text-white">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:row sm:items-end justify-between gap-4 border-b border-white/5 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Matrix Chain DP</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">Visualize the optimal partitioning of matrix multiplications via interval dynamic programming.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* 2. THE DP TABLE STAGE */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3.5rem] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 w-full overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-white/10 text-[10px] text-gray-600 uppercase">M_i \ M_j</th>
                  {[...Array(N)].map((_, idx) => (
                    <th key={idx} className="p-2 border border-white/10 text-[10px] text-blue-400 font-mono">M{idx + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.slice(1).map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-white/10 text-[10px] font-bold text-blue-400">M{i + 1}</td>
                    {row.slice(1).map((val, j) => {
                      const actualI = i + 1;
                      const actualJ = j + 1;
                      const isActive = current.i === actualI && current.j === actualJ;
                      const isK = current.k !== -1 && actualI <= current.k && actualJ > current.k;
                      
                      return (
                        <td key={j} className={`p-2 border border-white/10 text-center font-mono text-xs transition-all duration-300 ${
                          actualI > actualJ ? 'bg-black/20 text-transparent' :
                          isActive ? 'bg-fuchsia-600 text-white scale-110 z-20 shadow-[0_0_15px_#d946ef88]' :
                          'text-gray-300'
                        }`}>
                          {actualI > actualJ ? '' : val === Infinity ? '∞' : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
              <Calculator size={16} className="text-fuchsia-500" /> Computation Terminal
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
                <button onClick={startDP} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Play size={18} fill="currentColor" /> RESOLVE OPTIMAL PATH
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