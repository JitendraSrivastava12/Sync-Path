import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, RotateCcw, ArrowLeft, Cpu, Gauge, 
  Code2, Zap, Share2, Activity, Grid3X3,
  RefreshCcw, Layers, Hash
} from 'lucide-react';

export default function FloydWarshallVisualizer() {
  const navigate = useNavigate();
  
  // State: Graph Adjacency Matrix
  // Nodes: A(0), B(1), C(2), D(3)
  const initialMatrix = [
    [0, 3, '∞', 7],
    [8, 0, 2, '∞'],
    [5, '∞', 0, 1],
    [2, '∞', '∞', 0]
  ];

  const [matrix, setMatrix] = useState(initialMatrix);
  const [currentK, setCurrentK] = useState(-1);
  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Floyd-Warshall Engine Ready');
  const [language, setLanguage] = useState('python');
  
  const speedRef = useRef(400);
  const [speed, setSpeed] = useState(400);

  const delay = () => new Promise(r => setTimeout(r, speedRef.current));

  const PSEUDO_CODE = {
    python: { 
      logic: "for k in range(n):\n    for i in range(n):\n        for j in range(n):\n            dist[i][j] = min(\n                dist[i][j], \n                dist[i][k] + dist[k][j]\n            )", 
      comp: "O(V³) Time Complexity" 
    },
    java: { 
      logic: "for (int k = 0; k < n; k++) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if (dist[i][k] + dist[k][j] < dist[i][j])\n                dist[i][j] = dist[i][k] + dist[k][j];\n        }\n    }\n}", 
      comp: "All-Pairs Shortest Path" 
    }
  };

  const startAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    let n = initialMatrix.length;
    let dist = matrix.map(row => row.map(val => val === '∞' ? Infinity : val));

    for (let k = 0; k < n; k++) {
      setCurrentK(k);
      setStatus(`Phase ${k + 1}: Using Node ${String.fromCharCode(65 + k)} as an intermediate vertex.`);
      await delay();

      for (let i = 0; i < n; i++) {
        setCurrentI(i);
        for (let j = 0; j < n; j++) {
          setCurrentJ(j);
          
          if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
            const newDist = dist[i][k] + dist[k][j];
            if (newDist < dist[i][j]) {
              dist[i][j] = newDist;
              setMatrix(dist.map(row => row.map(v => v === Infinity ? '∞' : v)));
              setStatus(`Optimized: Path ${String.fromCharCode(65+i)}→${String.fromCharCode(65+j)} improved via ${String.fromCharCode(65+k)}`);
            }
          }
          await delay();
        }
      }
    }

    setCurrentK(-1);
    setCurrentI(-1);
    setCurrentJ(-1);
    setStatus("Optimization Complete. Global Shortest Path Matrix resolved.");
    setIsRunning(false);
  };

  const reset = () => {
    setMatrix(initialMatrix);
    setCurrentK(-1);
    setCurrentI(-1);
    setCurrentJ(-1);
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
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">Floyd-Warshall</h1>
            <p className="text-gray-500 font-medium text-xs md:text-lg tracking-tight italic">All-pairs shortest path engine via global matrix relaxation.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* ─── MATRIX STAGE ─── */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[600px] bg-[#0c0214] rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="relative z-10 w-full overflow-x-auto">
             <table className="w-full border-separate border-spacing-2">
                <thead>
                   <tr>
                      <th className="w-16 h-16 text-gray-600 font-black italic">i \ j</th>
                      {['A', 'B', 'C', 'D'].map((h, idx) => (
                        <th key={idx} className={`w-16 h-16 text-sm font-black transition-colors ${currentJ === idx ? 'text-fuchsia-500' : 'text-gray-400'}`}>{h}</th>
                      ))}
                   </tr>
                </thead>
                <tbody>
                   {matrix.map((row, i) => (
                     <tr key={i}>
                        <td className={`w-16 h-16 text-center text-sm font-black transition-colors ${currentI === i ? 'text-fuchsia-500' : 'text-gray-400'}`}>
                           {String.fromCharCode(65 + i)}
                        </td>
                        {row.map((val, j) => {
                          const isK = currentK === i || currentK === j;
                          const isActive = currentI === i && currentJ === j;
                          const isIntermediate = currentK === i || currentK === j;
                          
                          return (
                            <td 
                              key={j} 
                              className={`w-16 h-16 text-center font-mono text-sm border transition-all duration-300 rounded-xl ${
                                isActive ? 'bg-fuchsia-600 border-fuchsia-400 scale-110 z-20 shadow-[0_0_20px_#d946ef88]' :
                                (i === currentK || j === currentK) ? 'bg-white/5 border-fuchsia-500/30 text-fuchsia-300' :
                                'bg-white/5 border-white/5 text-gray-400'
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Logic HUD */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
               <Grid3X3 size={14} className="text-fuchsia-500" />
               <span className="text-[10px] font-mono text-gray-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Layers size={16} className="text-fuchsia-500" /> DP Terminal
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                      <span className="text-[8px] text-gray-500 uppercase block mb-1">Pivot (k)</span>
                      <span className="text-lg font-black text-fuchsia-500">{currentK === -1 ? '-' : String.fromCharCode(65 + currentK)}</span>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                      <span className="text-[8px] text-gray-500 uppercase block mb-1">Source (i)</span>
                      <span className="text-lg font-black">{currentI === -1 ? '-' : String.fromCharCode(65 + currentI)}</span>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                      <span className="text-[8px] text-gray-500 uppercase block mb-1">Target (j)</span>
                      <span className="text-lg font-black">{currentJ === -1 ? '-' : String.fromCharCode(65 + currentJ)}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Gauge size={14} /> Matrix Scan Speed
                    </label>
                    <span className="text-xs font-mono text-fuchsia-500">{speed}ms</span>
                  </div>
                  <input 
                    type="range" min="50" max="1000" step="50"
                    value={speed} onChange={(e) => {setSpeed(parseInt(e.target.value)); speedRef.current = parseInt(e.target.value);}}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={startAlgorithm} disabled={isRunning} className="flex items-center justify-center gap-3 py-5 bg-fuchsia-600 rounded-2xl text-xs font-black tracking-widest text-white disabled:opacity-30 active:scale-95 transition-all shadow-xl shadow-fuchsia-900/20">
                  <Zap size={18} fill="currentColor" /> INITIATE GLOBAL SCAN
                </button>
                <button onClick={reset} className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <RotateCcw size={18} /> RESET MATRIX
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