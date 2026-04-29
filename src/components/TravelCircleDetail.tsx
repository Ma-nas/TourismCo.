import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopNav from './TopNav';
import { mockTravelCircles } from '../data/mockData';
import { Users, Map, MessageSquare, ShieldCheck, Send, ArrowLeft, Calendar, CheckCircle } from 'lucide-react';

const TravelCircleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const circle = mockTravelCircles.find(c => c.id === id) || mockTravelCircles[0];
  const [message, setMessage] = React.useState('');
  const [joined, setJoined] = React.useState(false);

  const messages = [
    { id: 1, user: 'AI Guide', isAI: true, text: `Welcome to the ${circle.name} circle! I'm here to help coordinate your itinerary. What are we planning today?` },
    { id: 2, user: 'Priya S.', isAI: false, text: 'Can we look at some heritage walks for tomorrow morning?' },
    { id: 3, user: 'AI Guide', isAI: true, text: 'Great idea! I suggest starting at 6 AM to beat the crowds. I\'ll add a morning heritage walk to Day 2 of your itinerary.' },
  ];

  const handleJoin = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/circles/${circle.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo' }
      });
      // Join regardless (demo mode — no auth required in UI)
    } catch {}
    setJoined(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0B0F14' }}>
      <TopNav />

      {/* Hero Cover */}
      <div className="relative w-full h-64 lg:h-80">
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, #0B0F14 0%, rgba(0,0,0,0.5) 60%, transparent 100%)' }} />
        <img src={circle.image} alt={circle.name} className="w-full h-full object-cover" />
        {/* Back button */}
        <div className="absolute top-5 left-5 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white border border-white/20 hover:border-white/40 transition-all"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        {/* Hero content */}
        <div className="absolute bottom-0 left-0 w-full px-8 py-6 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ background: 'rgba(79,156,249,0.15)', color: '#4F9CF9', borderColor: 'rgba(79,156,249,0.3)' }}>
                  {circle.tags[0]}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-300 px-3 py-1 rounded-full border border-white/10" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <Users className="w-3.5 h-3.5" /> {circle.members} Members
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">{circle.name}</h1>
            </div>
            <button
              onClick={handleJoin}
              disabled={joined}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shrink-0 disabled:opacity-80"
              style={{
                background: joined ? 'rgba(124,255,203,0.2)' : 'linear-gradient(90deg, #4F9CF9, #7CFFCB)',
                color: joined ? '#7CFFCB' : '#0B0F14',
                border: joined ? '1px solid rgba(124,255,203,0.4)' : 'none'
              }}
            >
              {joined ? <><CheckCircle className="w-4 h-4" /> Joined!</> : <>Join Circle</>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Chat */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/5 flex flex-col" style={{ background: 'rgba(26,34,48,0.8)', backdropFilter: 'blur(20px)', height: '560px' }}>
            <div className="flex items-center gap-2 p-5 border-b border-white/5">
              <MessageSquare className="w-5 h-5" style={{ color: '#4F9CF9' }} />
              <h2 className="text-lg font-bold text-white font-display">Group Chat</h2>
              <span className="ml-auto flex items-center gap-1.5 text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(124,255,203,0.1)', color: '#7CFFCB' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> Live
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${!msg.isAI ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${msg.isAI ? 'text-background' : 'bg-blue-500 text-white'}`}
                    style={msg.isAI ? { background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' } : {}}>
                    {msg.isAI ? '✦' : msg.user[0]}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl p-3.5 ${msg.isAI ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
                    style={{ background: msg.isAI ? '#1A2230' : 'rgba(79,156,249,0.15)', border: msg.isAI ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(79,156,249,0.25)' }}>
                    {msg.isAI && <p className="text-xs mb-1 font-semibold" style={{ color: '#7CFFCB' }}>AI Guide ✦</p>}
                    <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 p-1.5 focus-within:border-primary/40 transition-colors" style={{ background: '#121821' }}>
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setMessage('')}
                  placeholder="Message the group..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm px-3 py-2 placeholder-gray-500"
                />
                <button
                  onClick={() => setMessage('')}
                  className="p-2.5 rounded-lg text-white transition-colors"
                  style={{ background: '#4F9CF9' }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map + Members */}
        <div className="space-y-5">
          {/* Live Map */}
          <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(26,34,48,0.8)' }}>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4" style={{ color: '#7CFFCB' }} />
                <h3 className="font-bold text-white font-display">Live Map</h3>
              </div>
              <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(124,255,203,0.1)', color: '#7CFFCB' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> Live
              </span>
            </div>
            <div className="h-44 relative" style={{ background: '#0B0F14' }}>
              {/* Map placeholder with UP geography feel */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #4F9CF9 1px, transparent 1px), radial-gradient(circle at 70% 60%, #7CFFCB 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-xs">📍 Consent-based live tracking</p>
              </div>
              {/* Member dots */}
              <div className="absolute top-1/3 left-1/4 w-5 h-5 rounded-full border-2 border-primary" style={{ background: '#4F9CF9', boxShadow: '0 0 10px rgba(79,156,249,0.5)' }} />
              <div className="absolute top-1/2 right-1/3 w-5 h-5 rounded-full border-2 border-secondary" style={{ background: '#7CFFCB', boxShadow: '0 0 10px rgba(124,255,203,0.5)' }} />
            </div>
          </div>

          {/* Members */}
          <div className="rounded-2xl border border-white/5 p-5" style={{ background: 'rgba(26,34,48,0.8)' }}>
            <h3 className="font-bold text-white font-display mb-4">Verified Members</h3>
            <div className="space-y-3">
              {['Priya Sharma', 'Arjun Verma', 'Kavita Rao'].map((name, i) => (
                <div key={name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white border border-white/10" style={{ background: ['#4F9CF9', '#7CFFCB', '#FFB95E'][i % 3], color: '#0B0F14' }}>
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-primary transition-colors">{name}</p>
                      <p className="text-gray-500 text-xs">Member · {i + 1} day{i !== 0 ? 's' : ''} ago</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4" style={{ color: '#7CFFCB' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Plan with circle CTA */}
          <Link
            to="/plan"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all border border-primary/30 hover:border-primary/50"
            style={{ background: 'rgba(79,156,249,0.1)', color: '#4F9CF9' }}
          >
            <Calendar className="w-4 h-4" />
            Plan Group Itinerary
          </Link>
        </div>

      </main>
    </div>
  );
};

export default TravelCircleDetail;
