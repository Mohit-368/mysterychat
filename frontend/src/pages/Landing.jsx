import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link from React Router

const Landing = () => {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 relative overflow-hidden">
      
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-40 md:pt-52 pb-24 flex flex-col items-center text-center">
        
        {/* Subtle Badge */}
        <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span className="text-xs font-medium text-blue-300 tracking-wide">Secure Anonymous Rooms</span>
        </div>

        {/* Hero Typography */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight max-w-4xl">
          Speak freely in the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
            shadows.
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mb-12 font-light leading-relaxed">
          MysteryChat is a minimal, identity-free space. Join a room, share your thoughts, and leave no trace behind. Simple, fast, and entirely anonymous.
        </p>

        {/* Simple CTA Buttons - Swapped <button> for <Link> */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/chat" 
            className="px-8 py-3.5 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] inline-flex justify-center"
          >
            Start Chatting
          </Link>
          <Link 
            to="/chat" 
            className="px-8 py-3.5 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-colors duration-300 inline-flex justify-center"
          >
            Browse Rooms
          </Link>
        </div>
      </div>

      {/* Minimalist Feature Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {[
            { title: "Pseudonymous Rooms", desc: "Use a pseudonymous handle in rooms without exposing your real-world identity to other participants." },
            { title: "Fast Room Access", desc: "Create an account once, then join rooms and start conversations in seconds." },
            { title: "Private by Default", desc: "Authentication uses HTTP-only cookies, and room access is enforced on every message." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:bg-[#111] hover:border-white/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-100">{feature.title}</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
};

export default Landing;