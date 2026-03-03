import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Activity, Box, Globe } from 'lucide-react'
import { DSA_CATEGORIES } from '../data/dsaData'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-fuchsia-600/10 blur-[140px] rounded-full" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-10 text-center">
        

        <div className="text-4xl md:text-[6rem] font-bold text-white leading-[1.1] mb-8">
          VISUALIZE <br />
          <span className="text-transparent bg-clip-text bg-linear-to-b from-fuchsia-400 to-violet-700">
            LOGIC.
          </span>
        </div>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          High-fidelity algorithm visualizations with <span className="text-white font-semibold">real-time collaboration</span>. 
          Explore polymorphic rendering across 50+ structures.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/algorithms"
            className="w-full sm:w-auto px-12 py-4 bg-white text-black font-bold rounded-2xl hover:bg-fuchsia-500 hover:text-white transition-all shadow-lg"
          >
            LAUNCH ENGINE
          </Link>
          <Link to="/algorithms/docs" className="w-full sm:w-auto px-12 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl">
            DOCUMENTATION
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mb-36">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 border border-white/10 rounded-4xl backdrop-blur-lg shadow-inner">
          <Stat val="50+" label="Algorithms" color="text-blue-400" />
          <Stat val="6" label="Categories" color="text-fuchsia-400" />
          <Stat val="60FPS" label="Animation" color="text-green-400" />
          <Stat val="<100ms" label="Latency" color="text-orange-400" />
        </div>
      </section>

      {/* Categories Preview */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-36">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Algorithm Techniques</h2>
            <p className="text-gray-400 font-medium">Advanced problem-solving patterns</p>
          </div>
          <Link to="/algorithms" className="hidden md:block text-fuchsia-500 font-bold hover:underline">View all 12 categories →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DSA_CATEGORIES.slice(0, 6).map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                to={`/algorithms?category=${category.id}`}
                className="group relative p-8 bg-white/3 border border-white/10 rounded-4xl overflow-hidden transition-all hover:bg-white/6 hover:border-white/20 hover:-translate-y-2 shadow-lg"
              >
                {/* Accent Glow */}
                <div className={`absolute -right-5 -top-5 w-28 h-28 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${category.color.replace('bg-', 'bg-')}`} />

                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:rotate-6 transition-all`}>
                  <Icon size={28} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{category.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">{category.desc}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{category.items.length} Modules</span>
                  <div className="p-2 rounded-full bg-white/5 text-fuchsia-500 group-hover:bg-fuchsia-500 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Architectural Features */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-40 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-16 tracking-tight">Architectural Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Feature 
            icon={<Box size={26}/>} 
            title="Polymorphic Rendering" 
            desc="Adapts to Linear, Hierarchical, and Network structures with hardware acceleration."
            color="from-pink-500 to-rose-600"
          />
          <Feature 
            icon={<Activity size={26}/>} 
            title="Command Queue Pipeline" 
            desc="60FPS animations using Redux-powered command patterns for step-by-step playback."
            color="from-blue-500 to-cyan-600"
          />
          <Feature 
            icon={<Globe size={26}/>} 
            title="Serialized State" 
            desc="Atomic action packets allow for instant undo/redo and synchronization across users."
            color="from-green-500 to-emerald-600"
          />
        </div>
      </section>
    </main>
  )
}

function Stat({ val, label, color }) {
  return (
    <div className="text-center py-4">
      <div className={`text-3xl md:text-4xl font-extrabold mb-1 ${color} tracking-tight`}>{val}</div>
      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em]">{label}</div>
    </div>
  )
}

function Feature({ icon, title, desc, color }) {
  return (
    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-white/20 transition-all backdrop-blur-lg">
      <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${color} flex items-center justify-center text-white mb-6 shadow-xl`}>
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
  )
}