import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import TravelCircleDetail from './components/TravelCircleDetail';
import ItineraryBuilder from './components/ItineraryBuilder';
import WanderChat from './components/WanderChat';
import AuthPage from './components/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/auth"    element={<AuthPage />} />
            <Route path="/chat"    element={<WanderChat />} />
            <Route path="/plan"    element={<ItineraryBuilder />} />
            <Route path="/explore" element={<Dashboard />} />
            <Route path="/circle/:id" element={<TravelCircleDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
