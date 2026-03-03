import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import AlgorithmBrowser from './pages/AlgorithmBrowser'
import AlgorithmVisualizer from './pages/AlgorithmVisualizer'
import FooterPart from './components/FooterSection'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      {/* ScrollToTop must be a sibling to Routes, not a child */}
      <ScrollToTop /> 
      
      <div className="min-h-screen bg-background font-sans selection:bg-fuchsia-500/30">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithms" element={<AlgorithmBrowser />} />
          <Route path="/visualize/:categoryId/:algorithmId" element={<AlgorithmVisualizer />} />
        </Routes>
        
        <FooterPart/>
      </div>
    </Router>
  )
}

export default App