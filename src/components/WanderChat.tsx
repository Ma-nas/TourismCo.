import React, { useState, useRef, useEffect, useCallback } from 'react';
import TopNav from './TopNav';
import {
  Send, Bot, User, Loader2, MapPin, ChevronDown, ChevronUp,
  ExternalLink, Sparkles, Database, Globe, Brain, Zap, Check,
  Clock, DollarSign, Star, Trash2, Calendar
} from 'lucide-react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';
const USER_ID = `user_${Math.random().toString(36).slice(2, 9)}`;

// ── Place images — all city aliases covered ───────────────────────────────────
const PLACE_IMAGES: Record<string, string> = {
  varanasi:  '/images/varanasi.jpg',
  banaras:   '/images/varanasi.jpg',
  kashi:     '/images/varanasi.jpg',
  varansi:   '/images/varanasi.jpg',
  agra:      '/images/agra.jpg',
  taj:       '/images/agra.jpg',
  lucknow:   '/images/lucknow.jpg',
  mathura:   '/images/mathura.jpg',
  vrindavan: '/images/mathura.jpg',
  prayagraj: '/images/prayagraj.jpg',
  allahabad: '/images/prayagraj.jpg',
  sangam:    '/images/prayagraj.jpg',
  ayodhya:   '/images/ayodhya_idol.jpg',
  sarnath:   'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=700&q=80',
  mirzapur:  '/images/waterfall.jpg',
};
// UP Ganga fallback — never shows random beach image
const UP_DEFAULT = '/images/varanasi.jpg';
const getPlaceImage = (search: string | string[]) => {
  const terms = (Array.isArray(search) ? search : [search]).map(s => (s || '').toLowerCase());
  for (const term of terms) {
    for (const [key, url] of Object.entries(PLACE_IMAGES)) {
      // Use regex to ensure word boundary match, avoiding 'agra' matching inside 'prayagraj'
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(term)) return url;
    }
  }
  return UP_DEFAULT;
};


const SUGGESTIONS = [
  'Plan 5 days in Varanasi under ₹15,000',
  'Agra Taj Mahal 2-day trip for 2 people',
  'Lucknow food & heritage weekend',
  'Mathura Vrindavan spiritual 3 days ₹8,000',
  'Prayagraj Sangam pilgrimage budget trip',
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface PipelineStep { step: string; status: 'running' | 'done' | 'pending'; }
interface DayPlan { day: number; title: string; schedule: { time: string; label: string; places: string[] }[]; estimatedCost: number; }
interface ItineraryPlan {
  type: string; label: string; icon: string; color: string;
  totalCost: number; perDay: number; perPerson: number;
  stay: string; transport: string; highlights: string[];
  days: DayPlan[];
  costBreakdown: Record<string, number>;
  bookingLinks: { hotels: string; flights: string; trains: string };
}
interface Itineraries { budgetPlan: ItineraryPlan; balancedPlan: ItineraryPlan; premiumPlan: ItineraryPlan; }
interface HiddenGem  { name: string; why: string; timing: string; tip: string; }
interface LocalFood  { name: string; dish: string; where: string; price: string; tip: string; localSecret: boolean; }
interface ChatMessage {
  id: string; role: 'user' | 'assistant'; content: string;
  itineraries?: Itineraries; image?: string;
  pipeline?: PipelineStep[]; aiSource?: string;
  thinking?: string;
  hiddenGems?: { hiddenPlaces: HiddenGem[]; localFood: LocalFood[] };
  timestamp: Date;
}

// (Pipeline visualization removed — backend concern, not consumer UI)

// ── Itinerary Card ────────────────────────────────────────────────────────────
const fmt = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;

const ItineraryCard = ({ plan }: { plan: ItineraryPlan }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="rounded-2xl overflow-hidden border transition-all duration-300"
      style={{ borderColor: plan.color + '50', background: 'rgba(15,22,36,0.95)' }}>

      {/* Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: plan.color + '20', border: `1px solid ${plan.color}40` }}>
            {plan.icon}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{plan.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{plan.stay}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-base" style={{ color: plan.color }}>{fmt(plan.totalCost)}</p>
            <p className="text-xs text-gray-500">{fmt(plan.perDay)}/day</p>
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            {expanded
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t space-y-4 p-4" style={{ borderColor: plan.color + '20' }}>
          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {plan.highlights?.map((h, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: plan.color + '18', color: plan.color, border: `1px solid ${plan.color}35` }}>
                {h}
              </span>
            ))}
          </div>

          {/* Transport */}
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: plan.color }} />
            <span>{plan.transport}</span>
          </div>

          {/* Cost breakdown */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(plan.costBreakdown || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs px-2 py-1.5 rounded-lg bg-white/5">
                <span className="text-gray-400 capitalize">{k}</span>
                <span className="text-white font-medium">{fmt(v as number)}</span>
              </div>
            ))}
          </div>

          {/* Day tabs */}
          {plan.days && plan.days.length > 0 && (
            <>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {plan.days.map((d, i) => (
                  <button key={d.day} onClick={() => setActiveDay(i)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeDay === i ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                    style={activeDay === i ? { background: plan.color + '30', border: `1px solid ${plan.color}60` } : { background: 'rgba(255,255,255,0.05)' }}>
                    Day {d.day}
                  </button>
                ))}
              </div>

              {/* Active day schedule */}
              {plan.days[activeDay] && (
                <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-xs font-semibold text-white">{plan.days[activeDay].title}</p>
                  {plan.days[activeDay].schedule?.map((slot, si) => (
                    <div key={si} className="flex gap-3">
                      <span className="text-xs font-mono shrink-0 mt-0.5" style={{ color: plan.color, minWidth: '64px' }}>{slot.time}</span>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{slot.label}</p>
                        {slot.places?.filter(Boolean).map((p, pi) => (
                          <p key={pi} className="text-xs text-gray-300 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: plan.color }} />
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 border-t border-white/5 text-xs">
                    <span className="text-gray-500">Est. cost</span>
                    <span className="font-medium" style={{ color: plan.color }}>{fmt(plan.days[activeDay].estimatedCost)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Booking buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '🏨 Hotels', href: plan.bookingLinks?.hotels },
              { label: '✈️ Flights', href: plan.bookingLinks?.flights },
              { label: '🚂 Trains', href: plan.bookingLinks?.trains },
            ].filter(l => l.href).map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-1 text-xs py-2.5 rounded-xl font-medium transition-all hover:opacity-80 hover:scale-105"
                style={{ background: plan.color + '20', color: plan.color, border: `1px solid ${plan.color}40` }}>
                {label} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Hidden Gems Panel ────────────────────────────────────────────────────────
const HiddenGemsPanel = ({ gems }: { gems: { hiddenPlaces: HiddenGem[]; localFood: LocalFood[] } }) => {
  const [tab, setTab] = useState<'places' | 'food'>('places');
  return (
    <div className="rounded-2xl overflow-hidden border border-violet-500/20 mt-1"
      style={{ background: 'rgba(109,40,217,0.08)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-500/10">
        <span className="text-base">🔮</span>
        <p className="text-sm font-semibold text-violet-300">Hidden Gems & Local Secrets</p>
        <span className="ml-auto text-xs text-violet-400/60">Known by locals</span>
      </div>
      {/* Tab switcher */}
      <div className="flex gap-1 px-4 pt-3">
        {(['places', 'food'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tab === t ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {t === 'places' ? '🏛️ Hidden Places' : '🍽️ Local Food'}
          </button>
        ))}
      </div>
      <div className="p-4 space-y-3">
        {tab === 'places' && gems.hiddenPlaces?.map((g, i) => (
          <div key={i} className="rounded-xl p-3 border border-violet-500/15" style={{ background: 'rgba(109,40,217,0.06)' }}>
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">🗺️</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-violet-200">{g.name}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{g.why}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">⏰ {g.timing}</span>
                </div>
                <p className="text-xs text-violet-300/70 mt-2 italic">💡 {g.tip}</p>
              </div>
            </div>
          </div>
        ))}
        {tab === 'food' && gems.localFood?.map((f, i) => (
          <div key={i} className="rounded-xl p-3 border border-violet-500/15" style={{ background: 'rgba(109,40,217,0.06)' }}>
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{f.localSecret ? '🤫' : '🍽️'}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-violet-200">{f.name}</p>
                  {f.localSecret && <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">Local Secret</span>}
                </div>
                <p className="text-xs text-primary mt-0.5 font-medium">{f.dish}</p>
                <p className="text-xs text-gray-400 mt-1">{f.where}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-green-400 font-medium">{f.price}</span>
                  <span className="text-xs text-gray-500 italic">{f.tip}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Thinking Bubble ────────────────────────────────────────────────────────────
const ThinkingBubble = ({ thinking, isTyping }: { thinking?: string; isTyping?: boolean }) => {
  const [expanded, setExpanded] = useState(false);

  if (isTyping) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl w-fit" style={{ background: 'rgba(109,40,217,0.1)', border: '1px solid rgba(109,40,217,0.2)' }}>
        <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
        <span className="text-sm font-medium text-violet-300">Thinking...</span>
        <div className="flex gap-1 ml-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!thinking) return null;

  return (
    <div className="rounded-2xl overflow-hidden border transition-all duration-300 w-full mb-3" style={{ borderColor: 'rgba(109,40,217,0.3)', background: 'rgba(109,40,217,0.05)' }}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-300">Thought Process</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-violet-400/70" /> : <ChevronDown className="w-4 h-4 text-violet-400/70" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 text-xs text-violet-200/80 leading-relaxed border-t border-violet-500/10 whitespace-pre-wrap font-mono">
          {thinking}
        </div>
      )}
    </div>
  );
};

// ── Message Bubble ─────────────────────────────────────────────────────────────
const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const isUser = msg.role === 'user';
  const itinArray = msg.itineraries
    ? [msg.itineraries.budgetPlan, msg.itineraries.balancedPlan, msg.itineraries.premiumPlan].filter(Boolean)
    : [];

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
        isUser ? 'bg-primary' : 'bg-gradient-to-br from-violet-600 to-primary'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      <div className={`flex-1 max-w-2xl space-y-3 ${isUser ? 'flex flex-col items-end' : ''}`}>

        {/* Thought Process */}
        {!isUser && msg.thinking && (
          <ThinkingBubble thinking={msg.thinking} />
        )}

        {/* Destination image */}
        {msg.image && !isUser && (
          <div className="rounded-2xl overflow-hidden h-64 w-full">
            <img src={msg.image} alt="destination"
              className="w-full h-full object-cover object-center"
              onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        )}

        {/* Message text */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'bg-primary text-white w-fit max-w-sm' : 'text-gray-200 w-full'
        }`} style={!isUser ? { background: 'rgba(26,34,48,0.95)', border: '1px solid rgba(255,255,255,0.07)' } : {}}>
          {msg.content}
        </div>

        {/* 3 itinerary cards */}
        {itinArray.length > 0 && (
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>3 Optimized Itinerary Options — tap to expand</span>
            </div>
            {itinArray.map((plan) => <ItineraryCard key={plan.type} plan={plan} />)}
          </div>
        )}

        {/* Hidden Gems & Local Food */}
        {msg.hiddenGems && !isUser && (
          <HiddenGemsPanel gems={msg.hiddenGems} />
        )}

        {/* AI source badge */}
        {msg.aiSource && !isUser && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            {msg.aiSource === 'gemini'
              ? <><Brain className="w-3 h-3 text-violet-400" /> Gemini 1.5 Flash</>
              : <><Database className="w-3 h-3 text-primary" /> TourismCo. Knowledge Base</>}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-600 px-1">
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// (Pipeline sidebar removed — backend concept, not consumer-facing)

// ── Main WanderChat Component ─────────────────────────────────────────────────
const WanderChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '0',
    role: 'assistant',
    content: "👋 Hi! I'm TourismCo. AI — your intelligent travel planner for Uttar Pradesh.\n\nTell me where you want to go, your budget, number of days, and any preferences (vegetarian, heritage, hidden gems) — I'll craft 3 personalized itinerary plans just for you! 🗺️",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, thinkingPhase]);

  const sendMessage = useCallback(async (text?: string) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() }]);
    setLoading(true);

    // Thinking phases
    const phases = ['Reading your query...', 'Searching knowledge base...', 'Fetching live travel data...', 'Reasoning with AI...', 'Generating your plan...'];
    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      if (phaseIdx < phases.length) { setThinkingPhase(phases[phaseIdx]); phaseIdx++; }
    }, 800);

    try {
      const res = await fetch(`${API}/ai/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: USER_ID, message: q }),
      });

      clearInterval(phaseInterval);

      const data = await res.json();
      // Image: try all matched destinations, then the raw user query text
      const allDests: string[] = data?.constraints?.allDestinations || [];
      const primaryDest: string = data?.constraints?.destination || data?.plan?.destination || '';
      const imageSearch = allDests.length > 0 ? allDests : [primaryDest, q];

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data?.reply || data?.message || "Here's what I planned for your trip!",
        thinking: data?.thinking,
        itineraries: data?.itineraries || null,
        image: getPlaceImage(imageSearch),
        aiSource: data?.aiSource,
        pipeline: data?.pipeline,
        hiddenGems: data?.hiddenGems || null,
        timestamp: new Date(),
      }]);
    } catch (err) {
      clearInterval(phaseInterval);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "⚠️ Couldn't reach the server. Make sure the backend is running:\n\ncd server\nnpm run dev",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      setThinkingPhase(null);
    }
  }, [input, loading]);

  const clearChat = async () => {
    await fetch(`${API}/ai/history/${USER_ID}`, { method: 'DELETE' });
    setMessages([{
      id: Date.now().toString(), role: 'assistant',
      content: "Chat cleared! 🔄 Ready to plan your next Uttar Pradesh adventure. Where would you like to go?",
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0B0F14' }}>
      <TopNav />

      <div className="flex-1 flex max-w-4xl mx-auto w-full px-4 py-6" style={{ paddingTop: '88px' }}>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-primary/30 mb-2"
                style={{ background: 'rgba(79,156,249,0.1)', color: '#4F9CF9' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                TourismCo. AI — Smart Travel Planner
              </div>
              <h1 className="text-2xl font-bold text-white font-display">Plan Your Perfect UP Trip</h1>
              <p className="text-gray-400 text-xs mt-1">Budget · Balanced · Premium — all powered by AI</p>
            </div>
            <button onClick={clearChat} title="Clear chat"
              className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 mb-4" style={{ minHeight: 0, maxHeight: 'calc(100vh - 280px)' }}>
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

            {/* Thinking loading */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl w-fit" style={{ background: 'rgba(109,40,217,0.1)', border: '1px solid rgba(109,40,217,0.2)' }}>
                    <Brain className="w-4 h-4 text-violet-400 animate-pulse" />
                    <span className="text-sm font-medium text-violet-300">Thinking</span>
                    <div className="flex gap-1 ml-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                  {thinkingPhase && (
                    <p className="text-xs text-gray-500 px-4 animate-pulse">{thinkingPhase}</p>
                  )}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:border-primary/50 hover:text-white transition-all"
                  style={{ background: 'rgba(18,24,33,0.9)' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-end gap-2 rounded-2xl p-3 border border-white/10 focus-within:border-primary/50 transition-all"
            style={{ background: 'rgba(26,34,48,0.95)', backdropFilter: 'blur(20px)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="e.g. Plan 5 days in Varanasi under ₹20,000 for 2 people, vegetarian..."
              rows={2}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 resize-none py-1 px-2 leading-relaxed"
              style={{ maxHeight: '120px' }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105 shrink-0"
              style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
              {loading
                ? <Loader2 className="w-4 h-4 text-black animate-spin" />
                : <Send className="w-4 h-4 text-black" />}
            </button>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default WanderChat;
