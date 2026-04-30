import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, MapPin, Map, Home, Calendar, MessageSquare, Users, LogOut, ChevronDown, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { to: '/',                    label: 'Home',    icon: Home },
    { to: '/chat',                label: 'AI Chat', icon: MessageSquare },
    { to: '/plan',                label: 'Plan',    icon: Calendar },
    { to: '/circle/circle-001',   label: 'Circles', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/5 px-6 py-3" style={{ background: 'rgba(11,15,20,0.92)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
            <MapPin className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">TourismCo.</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-background" style={{ background: '#7CFFCB' }} />
          </button>

          <Link to="/chat"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14' }}>
            <MessageSquare className="w-4 h-4" /> Ask AI
          </Link>

          {/* User profile dropdown */}
          {user ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:border-primary/40 transition-all"
                style={{ background: '#121821' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-white max-w-24 truncate">{user.name}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 overflow-hidden z-50 shadow-2xl"
                  style={{ background: 'rgba(18,24,33,0.98)', backdropFilter: 'blur(20px)' }}>
                  <div className="p-4 border-b border-white/5">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-gray-400 text-xs truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link to="/plan" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all">
                      <Calendar className="w-4 h-4 text-primary" /> My Trips
                    </Link>
                    <Link to="/chat" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all">
                      <MessageSquare className="w-4 h-4 text-primary" /> AI Chat
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all">
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center gap-1 mt-2 overflow-x-auto pb-1">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                active ? 'bg-primary/10 text-primary' : 'text-gray-400'
              }`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </Link>
          );
        })}
      </div>

      {/* Close dropdown on outside click */}
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </nav>
  );
};

export default TopNav;
