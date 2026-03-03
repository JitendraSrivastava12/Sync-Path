import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Info, ArrowLeft } from 'lucide-react'
import { DSA_CATEGORIES } from '../data/dsaData'
import AlgorithmCard from '../components/AlgorithmCard'

export default function AlgorithmBrowser() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const selectedCategory = searchParams.get('category')

  // Filter categories
  const filteredCategories = selectedCategory
    ? DSA_CATEGORIES.filter(cat => cat.id === selectedCategory)
    : DSA_CATEGORIES

  // Filter algorithms per category
  const getFilteredAlgorithms = (category) => {
    const items = category.items || []
    if (!searchQuery.trim()) return items
    const query = searchQuery.toLowerCase()
    return items.filter(algo =>
      algo.name.toLowerCase().includes(query) ||
      algo.id.toLowerCase().includes(query)
    )
  }

  const hasAnyResults = filteredCategories.some(cat => getFilteredAlgorithms(cat).length > 0)

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-24">
        
        {/* Navigation & Header */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="flex items-center gap-4">
             {/* GO BACK BUTTON */}
             <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#1f0c3a] hover:bg-[#2a1360] text-white font-bold text-xs md:text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 whitespace-nowrap"
            >
              <ArrowLeft size={16} className="text-fuchsia-500 animate-pulse" /> Back to Home
            </button>
            
            <div className="h-px flex-1 bg-white/5 hidden md:block" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">
              Algorithm Browser
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium tracking-tight">
              Explore {DSA_CATEGORIES.reduce((acc, cat) => acc + (cat.items?.length || 0), 0)}+ algorithms and data structures
            </p>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="mb-16">
          <div className="relative group max-w-2xl mx-auto md:mx-0">
            <Search 
              size={20} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-fuchsia-500 transition-colors" 
            />
            <input
              type="text"
              placeholder="Search by name or ID (e.g., 'KMP', 'Dijkstra')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Category Sections */}
        {filteredCategories.map((category) => {
          const filtered = getFilteredAlgorithms(category)
          if (filtered.length === 0) return null
          const CategoryIcon = category.icon || Info

          return (
            <div key={category.id} className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Category Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
                <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/40 border border-white/10`}>
                  <CategoryIcon size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-1 uppercase">{category.title}</h2>
                  <p className="text-gray-500 text-sm md:text-lg font-medium tracking-tight">{category.desc}</p>
                </div>
              </div>

              {/* Algorithms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((algorithm) => (
                  <AlgorithmCard
                    key={algorithm.id}
                    item={algorithm}
                    categoryId={category.id}
                    categoryColor={category.color}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {!hasAnyResults && (
          <div className="text-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] backdrop-blur-xl">
            <div className="inline-flex p-6 rounded-full bg-white/5 mb-6">
              <Search size={40} className="text-gray-600" />
            </div>
            <h3 className="text-white font-black text-3xl mb-2 tracking-tighter">No algorithms found</h3>
            <p className="text-gray-500 text-lg font-medium">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-8 px-8 py-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold transition-all shadow-xl shadow-fuchsia-900/20 active:scale-95"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </main>
  )
}