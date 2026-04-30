import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

interface User { id: string; name: string; email: string; interests: string[]; }
interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('tc_token');
    const savedUser = localStorage.getItem('tc_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('tc_token', data.token);
      localStorage.setItem('tc_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, message: 'Server error. Is the backend running?' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('tc_token', data.token);
      localStorage.setItem('tc_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, message: 'Server error. Is the backend running?' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tc_token');
    localStorage.removeItem('tc_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
