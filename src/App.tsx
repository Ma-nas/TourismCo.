import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TravelCircleDetail from './components/TravelCircleDetail';
import ItineraryBuilder from './components/ItineraryBuilder';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/circle/:id" element={<TravelCircleDetail />} />
          <Route path="/plan" element={<ItineraryBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
