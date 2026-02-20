import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Home from './components/Home';
import AdminDash from './components/AdminDash';
import './App.css';

const ADMIN_SESSION_KEY = 'digilync_admin_session';

function App() {
  const [loaderDone, setLoaderDone] = useState(false);
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
      } catch (_) {}
    }
  }, [isAdminLoggedIn]);

  const handleLoaderComplete = () => setLoaderDone(true);
  const handleAdminLoginSuccess = () => setIsAdminLoggedIn(true);
  const handleAdminLogout = () => setIsAdminLoggedIn(false);

  return (
    <div className="App">
      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}
      {loaderDone && isAdminLoggedIn && (
        <AdminDash onLogout={handleAdminLogout} />
      )}
      {loaderDone && !isAdminLoggedIn && (
        <Home onAdminLoginSuccess={handleAdminLoginSuccess} />
      )}
    </div>
  );
}

export default App;
