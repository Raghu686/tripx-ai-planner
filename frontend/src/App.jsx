import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CinematicIntro from './components/CinematicIntro';
import LandingPage from './components/LandingPage';
import BookingSystem from './components/BookingSystem';
import Dashboard from './components/Dashboard';
import TicketGeneration from './components/TicketGeneration';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeScreen from './components/WelcomeScreen';

function AppContent({ userName, setUserName }) {
  const [introFinished, setIntroFinished] = useState(false);
  const [welcomeFinished, setWelcomeFinished] = useState(false);

  useEffect(() => {
    if (userName) {
      setWelcomeFinished(true);
    }
  }, [userName]);

  if (!introFinished) {
    return <CinematicIntro onComplete={() => setIntroFinished(true)} />;
  }

  if (!welcomeFinished) {
    return <WelcomeScreen onComplete={(name) => {
      setUserName(name);
      setWelcomeFinished(true);
    }} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative bg-darkBg text-white w-full overflow-hidden font-sans">
        <Routes>
          <Route path="/" element={<LandingPage userName={userName} />} />
          <Route path="/book" element={<BookingSystem userName={userName} />} />
          <Route path="/dashboard" element={<Dashboard userName={userName} />} />
          <Route path="/select-seat" element={<SeatSelection userName={userName} />} />
          <Route path="/payment" element={<Payment userName={userName} />} />
          <Route path="/ticket/:id" element={<TicketGeneration userName={userName} />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  const [userName, setUserName] = useState('');

  // Initial load
  useEffect(() => {
    const cachedName = localStorage.getItem('tripX_userName');
    if (cachedName) {
      setUserName(cachedName);
    }
  }, []);

  const handleSetUser = (name) => {
    localStorage.setItem('tripX_userName', name);
    setUserName(name);
  };

  return (
    <Router>
      <AppContent userName={userName} setUserName={handleSetUser} />
    </Router>
  );
}
