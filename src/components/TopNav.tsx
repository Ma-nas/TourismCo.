import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, MapPin, Map, Home, Calendar, LogIn } from 'lucide-react';

const TopNav = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/plan', label: 'Plan Trip', icon: Calendar },
    { to: '/explore', label: 'Explore', icon: Map },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/5 px-6 py-3" style={{ background: 'rgba(11,15,20,0.85)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
          <img
            src="/logo.png"
            alt="TourismCo."
            className="h-8 w-auto object-contain"
            onError={(e) => {
              // Fallback inline SVG logo if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.removeAttribute('style');
            }}
          />
          {/* Fallback logo */}
          <div className="hidden items-center gap-2" style={{ display: 'none' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F9CF9, #7CFFCB)' }}>
              <MapPin className="text-background w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white font-display">TourismCo.</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white font-display ml-1">TourismCo.</span>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-background" style={{ background: '#7CFFCB' }}></span>
          </button>

          <Link
            to="/plan"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ background: 'linear-gradient(90deg, #4F9CF9, #7CFFCB)', color: '#0B0F14' }}
          >
            <Calendar className="w-4 h-4" />
            Plan Now
          </Link>

          <button className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border border-white/10 hover:border-primary/50 transition-all" style={{ background: '#121821' }}>
            <User className="w-4 h-4 text-gray-400" />
          </button>
        </div>

      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-hide">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                active ? 'bg-primary/10 text-primary' : 'text-gray-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TopNav;
