import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Code2, Clock, 
  Terminal, ShieldCheck, ChevronRight, Zap
} from 'lucide-react';
import { DSA_CATEGORIES } from '../data/dsaData'; // Assuming your data is here

export default function AlgorithmDocs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = DSA_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#0c0214] text-white selection:bg-fuchsia-500/30">
      
      {/* ─── NAVIGATION ─── */}
      <div className="sticky top-0 z-50 bg-[#0c0214]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-white/5 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">
              Sync-Path <span className="text-fuchsia-500">Manual</span>
            </h1>
          </div>
          
          <div className="relative w-64 md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search logic or complexity..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm outline-none focus:border-fuchsia-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* ─── HERO SECTION ─── */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] font-black text-fuchsia-500 uppercase tracking-widest mb-6">
            <ShieldCheck size={12} /> Verified Logic Engine
          </div>
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
            Technical <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-emerald-500">Benchmarks</span>
          </h2>
          <p className="text-gray-500 max-w-2xl font-medium leading-relaxed">
            The comprehensive technical reference for Sync-Path. Explore the underlying pseudo-code, 
            time complexity constraints, and spatial overhead for every integrated algorithm.
          </p>
        </div>

        {/* ─── DOCUMENTATION GRID ─── */}
        <div className="space-y-24">
          {filteredCategories.map((category) => (
            <section key={category.id} className="space-y-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${category.color} bg-opacity-20 border border-white/10 shadow-2xl`}>
                  <category.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">{category.title}</h3>
                  <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">{category.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((algo) => (
                  <div 
                    key={algo.id}
                    className="group bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-fuchsia-500/30 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="font-bold text-lg group-hover:text-fuchsia-400 transition-colors">
                        {algo.name}
                      </h4>
                      <Zap size={16} className="text-gray-800 group-hover:text-fuchsia-500 transition-colors" />
                    </div>

                    {/* Complexity Badges */}
                    <div className="flex gap-2 mb-8">
                      <div className="px-3 py-1 bg-black rounded-lg border border-white/5 flex items-center gap-2">
                        <Clock size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-mono font-black text-emerald-500">{algo.complexity.time}</span>
                      </div>
                      <div className="px-3 py-1 bg-black rounded-lg border border-white/5 flex items-center gap-2">
                        <Terminal size={12} className="text-blue-500" />
                        <span className="text-[10px] font-mono font-black text-blue-500">{algo.complexity.space}</span>
                      </div>
                    </div>

                    {/* Pseudo Code Terminal */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Code2 size={12} /> Logic Pattern
                      </span>
                      <div className="bg-black/50 rounded-xl p-4 border border-white/5 font-mono text-[11px] leading-relaxed text-blue-300/80">
                        {algo.pseudo.map((line, lIdx) => (
                          <div key={lIdx} className="whitespace-pre-wrap">{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ─── QUICK FOOTER MATRIX ─── */}
        <div className="mt-32 pt-20 border-t border-white/5">
          <div className="p-10 bg-gradient-to-br from-fuchsia-500/5 to-transparent border border-white/10 rounded-[3rem]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h4 className="text-xl font-black italic uppercase mb-2 text-white">Missing an Algorithm?</h4>
                <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                  Sync-Path is open source. Contribute new logic patterns or UI visualizers 
                  directly through the GitHub repository documentation.
                </p>
              </div>
              <button 
                onClick={() => window.open('https://github.com/your-repo', '_blank')}
                className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-fuchsia-500 hover:text-white transition-all active:scale-95"
              >
                Open Repository <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}