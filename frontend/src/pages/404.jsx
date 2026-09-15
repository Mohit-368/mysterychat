import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 flex items-center justify-center relative overflow-hidden px-6">
      
      {/* Centered Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 text-center flex flex-col items-center">
        
        {/* Massive 404 Typography */}
        <h1 className="text-8xl md:text-[150px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 mb-2 md:mb-4 leading-none select-none">
          404
        </h1>
        
        {/* Themed Copy */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-100">
          Node Not Found
        </h2>
        
        <p className="text-gray-400 font-light max-w-md mb-10 leading-relaxed text-sm md:text-base">
          The encrypted room or page you are looking for does not exist, has been permanently destroyed, or vanished into the void.
        </p>
        
        {/* Back to Home Button */}
        <Link 
          to="/"
          className="px-8 py-3.5 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Return Home
        </Link>
        
      </div>
    </main>
  );
};

export default NotFound;