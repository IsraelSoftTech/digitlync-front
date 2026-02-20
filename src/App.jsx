import React, { useState } from 'react';
import Loader from './components/Loader';
import Home from './components/Home';
import AdminDash from './components/AdminDash';
import './App.css';

function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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
