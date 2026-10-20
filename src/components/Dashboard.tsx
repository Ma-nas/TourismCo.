import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNav from './TopNav';
import { mockMatches, mockTravelCircles, featuredDestinations } from '../data/mockData';
import { Users, Star, ArrowRight, MessageSquare, Calendar, Map, Compass, ChevronRight, Sparkles, Clock, TrendingUp, Info, Zap, CheckCircle, Brain } from 'lucide-react';

// ── Destination Hero Card ─────────────────────────────────────────────────────
const DestCard = ({ dest }: { dest: typeof featuredDestinations[0] }) => (
  <Link
    to="/chat"
    className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 block focus-visible:border-primary/60"
    style={{ background: '#1A2230' }}
    aria-label={`Explore ${dest.name} – ${dest.tagline}`}
  >
    <div className="h-64 relative overflow-hidden">
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
      <img
        src={dest.images[0]}
        alt={`${dest.name} – ${dest.tagline}`}
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
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
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
        <p className="text-white font-semibold text-sm">
          From ₹{dest.priceFrom.toLocaleString('en-IN')}
          <span className="estimate-badge ml-2" aria-label="Estimated price">est.</span>
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" aria-hidden="true" /> Best: {dest.bestTime}
        </p>
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
        Plan Trip <ArrowRight className="w-3 h-3" aria-hidden="true" />
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
        <Star className="w-3.5 h-3.5 fill-current" style={{ color: '#7CFFCB' }} aria-hidden="true" />
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
        <div>
          <span className="text-white font-semibold">{match.priceEstimate}</span>
          <span className="estimate-badge ml-2">est.</span>
        </div>
        <Link to="/chat" className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> Plan with AI
        </Link>
      </div>
    </div>
  </div>
);

// ── How It Works Section ──────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    icon: MessageSquare,
    color: '#4F9CF9',
    step: '01',
    title: 'Tell AI your trip idea',
    desc: 'Share your destination, duration, budget, and interests in plain language — no forms required.',
  },
  {
    icon: Brain,
    color: '#7CFFCB',
    step: '02',
    title: 'AI plans 3 itineraries',
    desc: 'Our Gemini-powered planner creates Budget, Balanced, and Premium trip options tailored to you.',
  },
  {
    icon: CheckCircle,
    color: '#F59E0B',
    step: '03',
    title: 'Review and refine',
    desc: 'Browse day-by-day schedules, estimated costs, and activity suggestions. Ask follow-up questions.',
  },
  {
    icon: Zap,
    color: '#A855F7',
    step: '04',
    title: 'Book through the Itinerary Builder',
    desc: 'Use the structured builder for fine-grained control — pick accommodation, transport, and add-ons.',
  },
];

// ── Dashboard Component ───────────────────────────────────────────────────────
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
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <TopNav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-14 px-6 flex flex-col items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #4F9CF9 0%, transparent 70%)', filter: 'blur(60px)' }} aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #7CFFCB 0%, transparent 70%)', filter: 'blur(60px)' }} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border border-primary/30"
            style={{ background: 'rgba(79,156,249,0.1)', color: '#4F9CF9' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            AI-Powered Travel for Uttar Pradesh
          </span>

          <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-5 tracking-tight leading-tight">
            Where would you like<br />to go next?
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Plan your Uttar Pradesh trip with AI — get 3 personalised itinerary options with estimated costs and day-by-day schedules.
          </p>

          {/* Search bar */}
          <div className="w-full relative group">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, rgba(79,156,249,0.15), rgba(124,255,203,0.15))' }} aria-hidden="true" />
            <div className="relative flex items-center w-full rounded-2xl p-2 shadow-2xl transition-all duration-300 border border-white/10 focus-within:border-primary/50"
              style={{ background: 'rgba(26,34,48,0.9)', backdropFilter: 'blur(20px)' }}>
              <div className="p-3" aria-hidden="true">
                <Sparkles className="w-5 h-5" style={{ color: '#4F9CF9' }} />
              </div>
              <input
                type="text"
                readOnly
                onClick={() => navigate('/chat')}
                placeholder="Ask AI: 'Plan 5 days in Varanasi under ₹20,000'..."
                className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder-gray-500 py-3 px-2 cursor-pointer"
                aria-label="Open AI travel planner chat"
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
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5" role="list" aria-label="Suggested searches">
            {['Varanasi ghats 5 days', 'Taj Mahal heritage', 'Lucknow food trail', 'Mathura weekend', 'Prayagraj Sangam'].map((chip) => (
              <button
                key={chip}
                onClick={() => navigate('/chat')}
                className="px-4 py-1.5 rounded-full text-sm text-gray-300 border border-white/10 hover:border-primary/40 hover:text-white transition-all"
                style={{ background: 'rgba(18,24,33,0.8)' }}
                role="listitem"
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
              style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }} aria-hidden="true">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">TourismCo. AI Chat</h2>
              <p className="text-gray-400 text-sm">Get 3 optimised itineraries (Budget · Balanced · Premium) with estimated cost breakdown &amp; booking links</p>
            </div>
          </div>
          <Link to="/chat"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all shrink-0 hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14' }}>
            <MessageSquare className="w-4 h-4" aria-hidden="true" /> Start Planning Free
          </Link>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Destinations */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tab switcher */}
          <div className="flex items-center gap-3" role="tablist" aria-label="Destination views">
            <button
              onClick={() => setActiveTab('smart')}
              role="tab"
              aria-selected={activeTab === 'smart'}
              aria-controls="tab-smart"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'smart' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white'}`}>
              <TrendingUp className="w-4 h-4 inline mr-2" aria-hidden="true" />Smart Matches
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              role="tab"
              aria-selected={activeTab === 'featured'}
              aria-controls="tab-featured"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'featured' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white'}`}>
              <Map className="w-4 h-4 inline mr-2" aria-hidden="true" />Featured Destinations
            </button>
          </div>

          {activeTab === 'smart' && (
            <div id="tab-smart" role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mockMatches.map(match => <MatchCard key={match.id} match={match} />)}
            </div>
          )}

          {activeTab === 'featured' && (
            <div id="tab-featured" role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredDestinations.map(dest => <DestCard key={dest.id} dest={dest} />)}
            </div>
          )}

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mt-2" aria-label="TourismCo statistics">
            {[
              { label: 'UP Destinations', value: '43+', icon: Map },
              { label: 'Annual Visitors', value: '1.78 Cr', icon: Users },
              { label: 'Travel Circles', value: '4 Active', icon: Compass },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-white/5 p-4 flex items-center gap-3" style={{ background: '#1A2230' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(79,156,249,0.1)' }} aria-hidden="true">
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

        {/* Right: Travel Circles + Plan CTA */}
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
                      <Users className="w-3 h-3" aria-hidden="true" /> {circle.members} members
                    </span>
                    <span className="text-xs" style={{ color: '#4F9CF9' }}>{circle.tags[0]}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" aria-hidden="true" />
              </Link>
            ))}

            <Link to="/circle/circle-001"
              className="w-full mt-1 py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors text-sm flex items-center justify-center gap-2">
              <Users className="w-4 h-4" aria-hidden="true" /> Discover More Circles
            </Link>
          </div>

          {/* Plan CTA */}
          <div className="rounded-2xl p-5 border border-primary/20"
            style={{ background: 'linear-gradient(135deg, rgba(79,156,249,0.12), rgba(124,255,203,0.08))' }}>
            <h3 className="text-white font-bold font-display mb-1">Ready to explore UP?</h3>
            <p className="text-gray-400 text-sm mb-4">Build a custom day-by-day itinerary with AI — choose from Budget, Balanced or Premium plans.</p>
            <Link
              to="/chat"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14' }}
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" /> Chat with AI Planner
            </Link>
          </div>
        </div>

      </main>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="w-full px-6 pb-16" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="how-it-works-heading" className="text-3xl font-bold font-display text-white mb-3">How TourismCo. Works</h2>
            <p className="text-gray-400 max-w-lg mx-auto">From your idea to a day-by-day itinerary in minutes — powered by Gemini AI and our UP travel knowledge base.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all" style={{ background: '#1A2230' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: s.color + '20', border: `1px solid ${s.color}40` }} aria-hidden="true">
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <span className="text-2xl font-bold" style={{ color: s.color + '40' }}>{s.step}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">{s.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI Disclaimer / Trust Section ─────────────────────────────────── */}
      <section className="w-full px-6 pb-16" aria-labelledby="disclaimer-heading">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl p-6 border border-yellow-500/20" style={{ background: 'rgba(245,158,11,0.05)' }}>
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 id="disclaimer-heading" className="text-white font-semibold mb-2">About AI-generated itineraries</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  All costs shown are <strong className="text-yellow-400">estimates based on typical rates</strong> and are not guaranteed prices.
                  Accommodation, transport, and activity prices can vary based on season, availability, and booking platform.
                  Booking links direct you to third-party services — TourismCo. does not handle payments or confirm availability.
                  Always verify pricing and availability directly with service providers before committing to a booking.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="estimate-badge">Prices are estimates</span>
                  <span className="estimate-badge">Not a booking service</span>
                  <span className="estimate-badge">Verify with providers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }} aria-hidden="true">
              <Map className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold text-white font-display">TourismCo.</span>
            <span className="text-gray-500 text-sm">— Uttar Pradesh Travel AI</span>
          </div>
          <nav className="flex flex-wrap items-center gap-5" aria-label="Footer navigation">
            <Link to="/chat" className="text-sm text-gray-400 hover:text-white transition-colors">AI Chat</Link>
            <Link to="/plan" className="text-sm text-gray-400 hover:text-white transition-colors">Trip Builder</Link>
            <Link to="/circle/circle-001" className="text-sm text-gray-400 hover:text-white transition-colors">Travel Circles</Link>
          </nav>
          <p className="text-gray-500 text-xs text-center md:text-right">
            Data source: Ministry of Tourism, Govt. of India<br />
            © 2026 TourismCo. · Prices are estimates only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
