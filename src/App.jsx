import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Home from './components/Home';
import GpsCapture from './components/GpsCapture';
import AdminDash from './components/AdminDash';
import AdminLogin from './components/AdminLogin';
import Terms from './components/pages/Terms';
import Privacy from './components/pages/Privacy';
import './App.css';
import './components/PageAnimations.css';

const ADMIN_SESSION_KEY = 'digilync_admin_session';

function App() {
  const [loaderDone, setLoaderDone] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.pathname.startsWith('/gps');
    } catch {
      return false;
    }
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem(ADMIN_SESSION_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isAdminLoggedIn) {
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, '1');
      } catch (_) {}
    } else {
      try {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem('digilync_admin');
      } catch (_) {}
    }
  }, [isAdminLoggedIn]);

  const handleLoaderComplete = () => setLoaderDone(true);
  const handleAdminLoginSuccess = () => setIsAdminLoggedIn(true);
  const handleAdminLogout = () => setIsAdminLoggedIn(false);

  return (
    <div className="App">
      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}
      {loaderDone && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home onAdminLoginSuccess={handleAdminLoginSuccess} />} />
            <Route path="/gps" element={<GpsCapture />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="/admin"
              element={
                isAdminLoggedIn ? (
                  <AdminDash onLogout={handleAdminLogout} />
                ) : (
                  <AdminLogin onAdminLoginSuccess={handleAdminLoginSuccess} />
                )
              }
            />
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
