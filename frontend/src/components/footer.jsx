import React from 'react';
import { Link } from 'react-router-dom'; // 1. Imported Link for internal routing

const Footer = () => {
  return (
    <footer className="relative bg-[#020202] pt-24 pb-8 overflow-hidden border-t border-blue-900/30">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Navigation</h3>
            {['Home', 'About', 'Login', 'Register'].map((item) => {
              // Map 'Home' to '/', and others to '/about', '/login', etc.
              const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
              
              return (
                // 2. Swapped <a> for <Link> and href for to
                <Link 
                  key={item} 
                  to={path} 
                  className="group relative inline-flex items-center w-max text-gray-300 font-bold uppercase tracking-widest text-sm hover:text-white transition-colors duration-300"
                >
                  <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500 transition-all duration-300 mr-2">[</span>
                  {item}
                  <span className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500 transition-all duration-300 ml-2">]</span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Connect</h3>
            {['LinkedIn', 'GitHub'].map((item) => (
              // Kept external socials as standard <a> tags
              <a 
                key={item} 
                href={item === "GitHub" ? "https://github.com" : "https://linkedin.com"} 
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 text-sm font-medium hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-blue-900 rounded-full transition-all duration-300 hover:scale-150"></div>
                {item}
              </a>
            ))}
          </div>

          <div className="flex flex-col">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Stay Connected</h3>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-gray-800 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors uppercase tracking-widest"
              />
              <button className="absolute right-0 bottom-3 text-blue-600 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-3 bg-[#0a0a0a] border border-gray-900 px-4 py-2 w-max">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono tracking-wider">
                SYS.STAT: ONLINE // ROOM NETWORK READY
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center border-t border-white/5 pt-8 overflow-hidden">
          <h1 className="text-[11vw] font-black leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 via-white/5 to-transparent select-none pointer-events-none">
            MYSTERYCHAT
          </h1>
        </div>
        
        <div className="w-full flex justify-between items-center mt-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} MysteryChat. All rights reserved.
          </p>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            Designed for the Unknown
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;