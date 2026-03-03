import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Zap } from 'lucide-react'

// Destructuring 'item' to match the prop name used in AlgorithmBrowser
export default function AlgorithmCard({ item, categoryId, categoryColor }) {
  // Fallback to prevent crash if complexity data is missing
  const timeComplexity = item?.complexity?.time || "N/A";
  const spaceComplexity = item?.complexity?.space || "N/A";

  return (
    <Link
      // Matching the route defined in your AlgorithmVisualizer setup
      to={`/visualize/${categoryId}/${item.id}`}
      className="group p-6 bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl hover:border-fuchsia-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-900/20 relative overflow-hidden"
    >
      {/* Sublte category color accent line at the top */}
      <div className={`absolute top-0 left-0 w-full h-1 ${categoryColor} opacity-50`} />

      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white group-hover:text-fuchsia-400 transition-colors leading-tight">
            {item.name}
          </h4>
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{item.id}</p>
        </div>
        <div className="p-2 bg-fuchsia-500/10 rounded-lg group-hover:bg-fuchsia-500/20 transition-colors">
          <Zap size={16} className="text-fuchsia-400" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-500 font-medium">Time Complexity</span>
          <code className="bg-black/40 px-2 py-1 rounded-md font-mono text-fuchsia-300 border border-white/5">
            {timeComplexity}
          </code>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-500 font-medium">Space Complexity</span>
          <code className="bg-black/40 px-2 py-1 rounded-md font-mono text-violet-300 border border-white/5">
            {spaceComplexity}
          </code>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-1 text-fuchsia-400 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
          <span>Visualize</span>
          <ChevronRight size={14} />
        </div>
        
        {/* Visual cue for interactive nature */}
        <div className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-white/10"></span>
          <span className="w-1 h-1 rounded-full bg-white/10"></span>
          <span className="w-1 h-1 rounded-full bg-white/10"></span>
        </div>
      </div>
    </Link>
  )
}