import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { mockQuickReplies } from '../data/mockData';

const HeroSection = () => {
  const [query, setQuery] = useState('');

  return (
    <section className="relative w-full pt-24 pb-16 px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-['Plus_Jakarta_Sans'] text-white mb-8 tracking-tight">
          Where would you like to go next?
        </h1>

        {/* Chat/Search Input */}
        <div className="w-full relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <div className="relative flex items-center w-full bg-card/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl transition-all duration-300 focus-within:border-primary/50">
            <div className="p-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... e.g., 'Plan a 5-day trip to Varanasi under ₹20,000'"
              className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-gray-500 py-3 px-2"
            />
            <Link to="/plan" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(79,156,249,0.3)] whitespace-nowrap">
              Plan Trip ✨
            </Link>
          </div>
        </div>

        {/* Quick Replies */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {mockQuickReplies.map((reply, idx) => (
            <button 
              key={idx}
              onClick={() => setQuery(reply)}
              className="px-4 py-2 rounded-full bg-surface border border-white/5 text-sm text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
