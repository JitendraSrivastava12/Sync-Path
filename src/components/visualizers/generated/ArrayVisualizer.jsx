import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, ArrowRight, ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ArrayVisualizer() {
  const navigate = useNavigate();
  const [data, setData] = useState([15, 42, 78, 23, 56]);
  const [highlights, setHighlights] = useState([]);
  const [status, setStatus] = useState('System Ready');
  const [activePointer, setActivePointer] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [language, setLanguage] = useState('python');
  const [showInsert, setShowInsert] = useState(true);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  const PSEUDO_CODE = {
    python: { insert: "arr.insert(index, val)", delete: "arr.pop(index)", complexity: "O(n) - Linear Shift", note: "Dynamic resizing in Python handles memory, but shifting still occurs." },
    java: { insert: "list.add(index, val);", delete: "list.remove(index);", complexity: "O(n) - Array Copy", note: "Uses System.arraycopy() internally for efficient but O(n) shifts." },
    cpp: { insert: "vec.insert(vec.begin() + i, val);", delete: "vec.erase(vec.begin() + i);", complexity: "O(n) - Iterator Move", note: "Iterators beyond the point of insertion are invalidated." },
    c: { insert: "for(int i=n; i>pos; i--) arr[i]=arr[i-1];", delete: "for(int i=pos; i<n-1; i++) arr[i]=arr[i+1];", complexity: "O(n) - Manual Shift", note: "Requires manual memory management and bounds checking." }
  };

  const insertAt = async () => {
    const idx = parseInt(inputIndex);
    const val = parseInt(inputValue);
    if (isNaN(idx) || isNaN(val) || idx < 0 || idx > data.length) {
      setStatus("Error: Invalid Bounds");
      return;
    }
    let temp = [...data, null];
    setData(temp);
    setStatus(`Executing O(n) Insertion at index ${idx}...`);
    for (let i = temp.length - 1; i > idx; i--) {
      setActivePointer(i);
      setHighlights([i - 1, i]);
      await delay(300);
      temp[i] = temp[i - 1];
      temp[i - 1] = null;
      setData([...temp]);
    }
    temp[idx] = val;
    setData([...temp]);
    setHighlights([idx]);
    await delay(500);
    setActivePointer(null);
    setHighlights([]);
    setStatus(`Success: Value ${val} assigned to index ${idx}`);
    setInputValue('');
    setInputIndex('');
  };

  const deleteAt = async () => {
    const idx = parseInt(inputIndex);
    if (isNaN(idx) || idx < 0 || idx >= data.length) {
      setStatus("Error: Index Out of Bounds");
      return;
    }
    let temp = [...data];
    setStatus(`Executing O(n) Deletion at index ${idx}...`);
    for (let i = idx; i < temp.length - 1; i++) {
      setActivePointer(i);
      setHighlights([i, i + 1]);
      await delay(300);
      temp[i] = temp[i + 1];
      setData([...temp]);
    }
    temp.pop();
    setData(temp);
    setActivePointer(null);
    setHighlights([]);
    setStatus(`Success: Index ${idx} purged`);
    setInputIndex('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* GO BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold text-xs sm:text-sm md:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Go Back
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">Linear Array Memory</h1>
            <p className="text-gray-400 font-medium tracking-tight text-xs sm:text-sm">Visualize contiguous memory allocation & shift operations.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="px-2 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[8px] sm:text-xs font-mono text-gray-400 uppercase tracking-widest">
            Contiguous: <span className="text-fuchsia-500">True</span>
          </div>
          <div className="px-2 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[8px] sm:text-xs font-mono text-gray-400 uppercase tracking-widest">
            Complexity: <span className="text-blue-400">O(n)</span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* VISUALIZER */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0f011a] rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/5 min-h-[300px] flex flex-wrap items-center justify-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {data.map((val, i) => (
              <div key={i} className="relative z-10">
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${activePointer === i ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                  <ArrowRight size={16} className="rotate-90 text-fuchsia-500 animate-bounce" />
                </div>

                <div className={`
                  w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-lg sm:text-xl md:text-2xl transition-all duration-300 border-2
                  ${val === null ? 'border-dashed border-white/10 bg-transparent' : 'border-white/10 bg-white/5 shadow-inner'}
                  ${highlights.includes(i) ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-105 z-20' : 'text-gray-400'}
                `}>
                  {val}
                </div>

                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] sm:text-[9px] font-bold text-gray-500 tracking-[0.15em]">
                  0x0{i}A
                </div>
              </div>
            ))}

            {/* STATUS HUD */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2 sm:px-3 py-1 bg-black/60 backdrop-blur-2xl rounded-xl border border-white/10 shadow-lg">
              <div className="relative flex h-2 w-2">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]"></div>
              </div>
              <span className="text-[8px] sm:text-[10px] font-mono text-gray-200 uppercase tracking-[0.1em]">{status}</span>
            </div>
          </div>

          {/* COMMAND CENTER */}
          <div className="p-3 sm:p-4 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between backdrop-blur-xl">
            <div className="flex flex-1 gap-2 w-full flex-wrap">
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Value" className="input-field px-3 py-2 text-sm" />
              <input type="number" value={inputIndex} onChange={(e) => setInputIndex(e.target.value)} placeholder="Index" className="input-field px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2 w-full md:w-auto flex-wrap">
              <button onClick={insertAt} className="btn-action px-3 py-2 text-xs sm:text-sm bg-fuchsia-600 hover:bg-fuchsia-500"><Plus size={16} /> INSERT</button>
              <button onClick={deleteAt} className="btn-action px-3 py-2 text-xs sm:text-sm bg-red-700 hover:bg-red-600"><Trash2 size={16} /> DELETE</button>
              <button onClick={() => {setData([15,42,78,23,56]); setStatus('Buffer Reset'); setHighlights([])}} className="btn-action px-3 py-2 text-xs sm:text-sm bg-white/5 border border-white/10 hover:bg-white/10"><RotateCcw size={16} /> RESET</button>
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}
        <aside className="space-y-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 sm:p-4 flex flex-col space-y-4 text-[8px] sm:text-[10px]">

            {/* Top: Environment Selector */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-500 uppercase flex items-center gap-1">
                <Globe size={12} className="text-fuchsia-500" /> Environment
              </h3>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[8px] sm:text-[10px] font-black text-fuchsia-500 outline-none cursor-pointer uppercase tracking-widest">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>

            {/* Insert/Delete Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setShowInsert(true)} className={`flex-1 px-2 py-1 rounded-xl text-[8px] sm:text-[10px] font-bold ${showInsert ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-gray-400'}`}>Insert</button>
              <button onClick={() => setShowInsert(false)} className={`flex-1 px-2 py-1 rounded-xl text-[8px] sm:text-[10px] font-bold ${!showInsert ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-gray-400'}`}>Delete</button>
            </div>

            {/* Logic Snippet */}
            <div>
              <p className="font-bold text-gray-600 mb-1 uppercase text-[8px] sm:text-[10px]">Logic Snippet</p>
              <div className="p-2 bg-black/40 rounded-xl text-[7px] sm:text-[10px] font-mono text-blue-300 border border-white/5 break-words">
                {showInsert ? PSEUDO_CODE[language].insert : PSEUDO_CODE[language].delete}
              </div>
            </div>

            {/* Execution Metric */}
            <div>
              <p className="font-bold text-gray-600 mb-1 uppercase text-[8px] sm:text-[10px]">Execution Metric</p>
              <div className="p-2 bg-black/40 rounded-xl text-[7px] sm:text-[10px] font-mono text-fuchsia-400 border border-white/5 break-words">{PSEUDO_CODE[language].complexity}</div>
            </div>

            {/* Note */}
            <div>
              <p className="text-gray-500 italic leading-snug text-[7px] sm:text-[9px]">{PSEUDO_CODE[language].note}</p>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .input-field {
          @apply flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono focus:border-fuchsia-500/50 outline-none transition-all placeholder:text-gray-500;
        }
        .btn-action {
          @apply flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] sm:text-sm font-black tracking-widest transition-all active:scale-95 shadow;
        }
      `}</style>
    </div>
  );
}