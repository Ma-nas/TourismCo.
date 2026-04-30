import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

const DEST_IMAGES = [
  { src: '/images/varanasi.jpg', label: 'Varanasi Ghats' },
  { src: '/images/agra.jpg', label: 'Taj Mahal, Agra' },
  { src: '/images/prayagraj.jpg', label: 'Prayagraj Sangam' },
  { src: '/images/mathura.jpg', label: 'Mathura & Vrindavan' },
  { src: '/images/up_bg.jpg', label: 'Uttar Pradesh Tourism' }
];

const FEATURES = [
  '3 AI-optimized itinerary plans per trip',
  'Budget, Balanced & Premium options',
  'Real-time Gemini AI reasoning',
  'Day-wise schedules with booking links',
  'Travel Circles — plan with friends',
];

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bgIdx] = useState(Math.floor(Math.random() * DEST_IMAGES.length));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = mode === 'login'
      ? await login(email, password)
      : await register(name, email, password);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.message || 'Something went wrong.');
  };

  const bg = DEST_IMAGES[bgIdx];

  return (
    <div className="min-h-screen flex" style={{ background: '#0B0F14' }}>

      {/* ── Left: Hero Image Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={bg.src} alt={bg.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,15,20,0.75) 0%, rgba(11,15,20,0.4) 50%, rgba(11,15,20,0.8) 100%)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">TourismCo.</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border border-primary/40" style={{ background: 'rgba(79,156,249,0.15)', color: '#4F9CF9' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered Travel for Uttar Pradesh
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Plan your perfect<br />UP adventure with AI
          </h2>
          <p className="text-gray-300 text-base mb-8 max-w-sm">
            From the sacred ghats of Varanasi to the Taj Mahal's timeless beauty — TourismCo. AI plans it all.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#7CFFCB' }} />
                <span className="text-gray-200 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: destination label */}
        <div className="relative z-10">
          <p className="text-xs text-gray-400">📸 {bg.label}</p>
        </div>
      </div>

      {/* ── Right: Auth Form ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">TourismCo.</span>
        </div>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex rounded-2xl p-1 mb-8" style={{ background: 'rgba(26,34,48,0.8)' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${mode === m ? 'text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
                style={mode === m ? { background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)', color: '#0B0F14' } : {}}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome back!' : 'Join TourismCo.'}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === 'login'
                ? 'Sign in to access your saved trips and Travel Circles.'
                : 'Create a free account and start planning your UP adventure.'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.1)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 border border-white/10 focus:border-primary/60 focus:outline-none transition-all"
                  style={{ background: '#121821', color: '#E6EDF3' }}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 border border-white/10 focus:border-primary/60 focus:outline-none transition-all"
                style={{ background: '#121821', color: '#E6EDF3' }}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 border border-white/10 focus:border-primary/60 focus:outline-none transition-all"
                style={{ background: '#121821', color: '#E6EDF3' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14', boxShadow: '0 0 30px rgba(79,156,249,0.25)' }}>
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
                : <>{mode === 'login' ? 'Sign In' : 'Create Free Account'} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or continue as guest</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Guest button */}
          <Link to="/"
            className="block w-full py-3.5 rounded-xl text-sm font-medium text-gray-300 text-center border border-white/10 hover:border-white/25 hover:text-white transition-all"
            style={{ background: 'rgba(26,34,48,0.5)' }}>
            Continue without account →
          </Link>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-400 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#4F9CF9' }}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Terms */}
          {mode === 'register' && (
            <p className="text-center text-xs text-gray-600 mt-4">
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
