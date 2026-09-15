import React from 'react';
import { Link } from "react-router-dom";

const About = () => {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 relative overflow-hidden pb-32">
      
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-800/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-48 flex flex-col items-center text-center">
        
        {/* Subtle Badge */}
        <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span className="text-xs font-medium text-blue-300 tracking-wide uppercase">Our Mission</span>
        </div>

        {/* Hero Typography */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
          Bringing back the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
            anonymous internet.
          </span>
        </h1>

        {/* Main Story Paragraphs */}
        <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed max-w-2xl text-left md:text-center mb-20">
          <p>
            Somewhere along the way, the internet became a place of permanent records. Every click tracked, every conversation tied to a username, an email, or a profile. We believe it doesn't have to be that way.
          </p>
          <p>
            MysteryChat was built on a single premise: <strong className="text-gray-200 font-medium">privacy should be the default, not an option.</strong> We created a space where you can share ideas, ask questions, or just talk without the weight of an identity attached to your words.
          </p>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <h2 className="text-2xl font-semibold mb-10 text-center text-white/90">Our Core Principles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Principle 1 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:bg-[#111] hover:border-white/10 transition-all duration-300">
            <h3 className="text-xl font-medium mb-4 text-gray-100 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Zero Tracking
            </h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              MysteryChat keeps the public experience minimal and separates your pseudonymous room identity from the conversation itself. The current MVP stores account and message records in MongoDB so that rooms and authentication work reliably.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:bg-[#111] hover:border-white/10 transition-all duration-300">
            <h3 className="text-xl font-medium mb-4 text-gray-100 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Ephemeral by Design
            </h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              The room experience is designed to feel temporary and lightweight. For the current MVP, messages are persisted so users can reload recent conversation history. An ephemeral-only storage mode can be added later.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:bg-[#111] hover:border-white/10 transition-all duration-300">
            <h3 className="text-xl font-medium mb-4 text-gray-100 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Frictionless Access
            </h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              Registration is deliberately small: a pseudonymous username, email and password. Once authenticated, room discovery and joining are immediate.
            </p>
          </div>

          {/* Principle 4 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:bg-[#111] hover:border-white/10 transition-all duration-300">
            <h3 className="text-xl font-medium mb-4 text-gray-100 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Aesthetic Simplicity
            </h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">
              A UI that stays out of your way. We stripped away the clutter, the ads, and the noise so you can focus entirely on the conversation.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 mt-32 flex justify-center px-6">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl p-10 md:p-16 text-center max-w-4xl w-full">
          <h2 className="text-3xl font-semibold mb-6">Ready to drop in?</h2>
          <p className="text-gray-400 font-light mb-10 max-w-md mx-auto">
            Join an active node right now. No setup required.
          </p>
          <Link to="/chat" className="inline-block px-10 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Explore Rooms
          </Link>
        </div>
      </div>

    </main>
  );
};

export default About;