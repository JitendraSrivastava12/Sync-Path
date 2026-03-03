import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Command, 
  Heart, 
  ExternalLink ,ChevronRight
} from 'lucide-react';

export default function FooterPart () {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-fuchsia-600 rounded-lg group-hover:rotate-6 transition-transform">
                <Command size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                Sync-Path
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Empowering engineers to master complex data structures through high-fidelity, real-time visual logic.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Github size={18} />} href="https://github.com/JitendraSrivastava12" />
              <SocialIcon icon={<Mail size={18} />} href="mailto:jsking981@gmail.com" />
              <SocialIcon icon={<Linkedin size={18} />} href="https://www.linkedin.com/in/jitendra-srivastava-099b0b289" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><FooterLink to="/algorithms">Launch Engine</FooterLink></li>
              <li><FooterLink to="/documentation">Documentation</FooterLink></li>
              <li><FooterLink to="/collaboration">Live Session</FooterLink></li>
              <li><FooterLink to="/benchmarks">Performance</FooterLink></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Categories</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><FooterLink to="/algorithms?category=dp">Dynamic Programming</FooterLink></li>
              <li><FooterLink to="/algorithms?category=graphs">Graph Theory</FooterLink></li>
              <li><FooterLink to="/algorithms?category=sorting">Sorting Patterns</FooterLink></li>
              <li><FooterLink to="/algorithms?category=bit">Bit Manipulation</FooterLink></li>
            </ul>
          </div>

          {/* Creator Credit Section */}
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md">
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
              <Heart size={14} className="text-fuchsia-500 fill-fuchsia-500" /> Creator
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-white font-black text-lg tracking-tight">Jitendra Srivastava</p>
                <p className="text-gray-500 text-xs font-medium">Full Stack Architect & Designer</p>
              </div>
              <a 
                href="mailto:jsking981@gmail.com" 
                className="flex items-center gap-2 text-fuchsia-500 text-xs font-bold hover:text-fuchsia-400 transition-colors"
              >
                <Mail size={14} /> Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            © {currentYear} Sync-Path Visualization Labs. All Rights Reserved.
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="hover:text-white transition-colors flex items-center group"
    >
      {children}
      <ChevronRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all text-fuchsia-500" />
    </Link>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 transition-all"
    >
      {icon}
    </a>
  );
}