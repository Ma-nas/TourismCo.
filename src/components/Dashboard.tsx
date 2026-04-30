import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNav from './TopNav';
import { mockMatches, mockTravelCircles, featuredDestinations } from '../data/mockData';
import { Users, Star, ArrowRight, MessageSquare, Calendar, Map, Compass, ChevronRight, Sparkles, Clock, TrendingUp } from 'lucide-react';

// ── Destination Hero Card ─────────────────────────────────────────────────────
const DestCard = ({ dest }: { dest: typeof featuredDestinations[0] }) => (
  <Link to="/chat" className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 block"
    style={{ background: '#1A2230' }}>
    <div className="h-64 relative overflow-hidden">
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
      <img
        src={dest.images[0]}
        alt={dest.name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${dest.id}/600/400`; }}
      />
      {/* Category badge */}
      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: dest.color + '30', color: dest.color, border: `1px solid ${dest.color}50`, backdropFilter: 'blur(8px)' }}>
        {dest.category}
      </div>
      {/* Rating */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/10"
        style={{ background: 'rgba(11,15,20,0.7)', backdropFilter: 'blur(8px)' }}>
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-semibold text-white">{dest.rating}</span>
      </div>
      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <h3 className="text-xl font-bold text-white">{dest.name}</h3>
        <p className="text-xs text-gray-300 mt-0.5 italic">{dest.tagline}</p>
      </div>
    </div>
    <div className="p-4 flex items-center justify-between">
      <div>
        <p className="text-white font-semibold text-sm">From ₹{dest.priceFrom.toLocaleString('en-IN')}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" /> Best: {dest.bestTime}
        </p>
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
        Plan Trip <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  </Link>
);

// ── Smart Match Card ──────────────────────────────────────────────────────────
const MatchCard = ({ match }: { match: typeof mockMatches[0] }) => (
  <div className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
    style={{ background: '#1A2230' }}>
    <div className="h-60 relative overflow-hidden">
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }} />
      <img
        src={match.image}
        alt={match.destination}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${match.id}/800/480`; }}
      />
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10"
        style={{ background: 'rgba(11,15,20,0.8)', backdropFilter: 'blur(8px)' }}>
        <Star className="w-3.5 h-3.5 fill-current" style={{ color: '#7CFFCB' }} />
        <span className="text-xs font-semibold text-white">{match.matchScore}% Match</span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-white mb-1">{match.destination}</h3>
      <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">{match.description}</p>
      {'highlights' in match && Array.isArray((match as any).highlights) && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(match as any).highlights.map((h: string) => (
            <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{h}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-white font-semibold">{match.priceEstimate}</span>
        <Link to="/chat" className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> Plan with AI
        </Link>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'smart' | 'featured'>('smart');

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      backgroundImage: `linear-gradient(rgba(11, 15, 20, 0.85), rgba(11, 15, 20, 0.95)), url('/images/up_bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <TopNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-14 px-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #4F9CF9 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #7CFFCB 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border border-primary/30"
            style={{ background: 'rgba(79,156,249,0.1)', color: '#4F9CF9' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered Travel for Uttar Pradesh
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-5 tracking-tight leading-tight">
            Where would you like<br />to go next?
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Plan your perfect Uttar Pradesh trip with AI — get 3 personalized itineraries, real prices, and instant booking links.
          </p>

          {/* Search bar */}
          <div className="w-full relative group">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, rgba(79,156,249,0.15), rgba(124,255,203,0.15))' }} />
            <div className="relative flex items-center w-full rounded-2xl p-2 shadow-2xl transition-all duration-300 border border-white/10 focus-within:border-primary/50"
              style={{ background: 'rgba(26,34,48,0.9)', backdropFilter: 'blur(20px)' }}>
              <div className="p-3">
                <Sparkles className="w-5 h-5" style={{ color: '#4F9CF9' }} />
              </div>
              <input
                type="text"
                readOnly
                onClick={() => navigate('/chat')}
                placeholder="Ask AI: 'Plan 5 days in Varanasi under ₹20,000'..."
                className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder-gray-500 py-3 px-2 cursor-pointer"
              />
              <Link
                to="/chat"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
                style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14', boxShadow: '0 0 20px rgba(79,156,249,0.3)' }}
              >
                Ask AI ✨
              </Link>
            </div>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {['Varanasi ghats 5 days', 'Taj Mahal heritage', 'Lucknow food trail', 'Mathura weekend', 'Prayagraj Sangam'].map((chip) => (
              <button
                key={chip}
                onClick={() => navigate('/chat')}
                className="px-4 py-1.5 rounded-full text-sm text-gray-300 border border-white/10 hover:border-primary/40 hover:text-white transition-all"
                style={{ background: 'rgba(18,24,33,0.8)' }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Feature Banner ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-8">
        <div className="rounded-2xl p-5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(79,156,249,0.12), rgba(124,255,203,0.06))' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">TourismCo. AI Chat</h2>
              <p className="text-gray-400 text-sm">Get 3 optimized itineraries (Budget · Balanced · Premium) with cost breakdown & booking links</p>
            </div>
          </div>
          <Link to="/chat"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all shrink-0"
            style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14' }}>
            <MessageSquare className="w-4 h-4" /> Start Planning Free
          </Link>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Destinations */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tab switcher */}
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('smart')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'smart' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white'}`}>
              <TrendingUp className="w-4 h-4 inline mr-2" />Smart Matches
            </button>
            <button onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'featured' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white'}`}>
              <Map className="w-4 h-4 inline mr-2" />Featured Destinations
            </button>
          </div>

          {activeTab === 'smart' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mockMatches.map(match => <MatchCard key={match.id} match={match} />)}
            </div>
          )}

          {activeTab === 'featured' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredDestinations.map(dest => <DestCard key={dest.id} dest={dest} />)}
            </div>
          )}

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mt-2">
            {[
              { label: 'UP Destinations', value: '43+', icon: Map },
              { label: 'Annual Visitors', value: '1.78 Cr', icon: Users },
              { label: 'Travel Circles', value: '4 Active', icon: Compass },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-white/5 p-4 flex items-center gap-3" style={{ background: '#1A2230' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(79,156,249,0.1)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#4F9CF9' }} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{value}</p>
                  <p className="text-gray-400 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Travel Circles */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-white">Travel Circles</h2>
            <Link to="/circle/circle-001" className="text-sm hover:opacity-80" style={{ color: '#4F9CF9' }}>
              View all
            </Link>
          </div>

          <div className="rounded-2xl border border-white/5 p-4 flex flex-col gap-3" style={{ background: 'rgba(26,34,48,0.5)' }}>
            {mockTravelCircles.map(circle => (
              <Link
                to={`/circle/${circle.id}`}
                key={circle.id}
                className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
              >
                <img
                  src={circle.image}
                  alt={circle.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${circle.id}/100/100`; }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate text-sm">{circle.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" /> {circle.members} members
                    </span>
                    <span className="text-xs" style={{ color: '#4F9CF9' }}>{circle.tags[0]}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
              </Link>
            ))}

            <Link to="/circle/circle-001"
              className="w-full mt-1 py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors text-sm flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> Discover More Circles
            </Link>
          </div>

          {/* Plan CTA */}
          <div className="rounded-2xl p-5 border border-primary/20"
            style={{ background: 'linear-gradient(135deg, rgba(79,156,249,0.12), rgba(124,255,203,0.08))' }}>
            <h3 className="text-white font-bold font-display mb-1">Ready to explore UP?</h3>
            <p className="text-gray-400 text-sm mb-4">Build a custom day-by-day itinerary with AI — choose from Budget, Balanced or Premium plans.</p>
            <Link
              to="/chat"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14' }}
            >
              <Sparkles className="w-4 h-4" /> Chat with AI Planner
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
              <Map className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold text-white font-display">TourismCo.</span>
            <span className="text-gray-500 text-sm">— Uttar Pradesh Travel AI</span>
          </div>
          <p className="text-gray-500 text-xs">Data source: Ministry of Tourism, Govt. of India · © 2026 TourismCo.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
