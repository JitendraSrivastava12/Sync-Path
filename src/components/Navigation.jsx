import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, Menu, Github } from 'lucide-react'

export default function Navigation() {
  const location = useLocation();

  

  // Helper to check if a link is active for styling
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-100">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
        <div className="w-9 h-9 bg-linear-to-br from-fuchsia-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/20 group-hover:shadow-fuchsia-500/40 transition-all">
          <Zap size={20} className="text-white fill-current animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter text-white leading-none">SYNC-PATH</span>
          <span className="text-[10px] text-fuchsia-500 font-bold tracking-[0.2em] uppercase mt-1">Visualizer</span>
        </div>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10">
        <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link 
            to="/algorithms" 
            className={`transition-colors ${isActive('/algorithms') ? 'text-fuchsia-400' : 'text-gray-400 hover:text-white'}`}
          >
            Algorithms
          </Link>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a>
        </div>

        <div className="h-4 w-px bg-white/10 mx-2" />

        <a 
          href="https://github.com/JitendraSrivastava12" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all group"
        >
          <Github size={14} className="group-hover:text-fuchsia-400" />
          Github
        </a>
      </div>

      {/* Mobile Menu Trigger (Logic to be added in next step) */}
      <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
        <Menu size={24} />
      </button>
    </nav>
  )
}