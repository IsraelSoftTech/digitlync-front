import React, { useState } from 'react';
import Loader from './components/Loader';
import Home from './components/Home';
import './App.css';

function App() {
  const [showHome, setShowHome] = useState(false);

  return (
    <div className="App">
      {!showHome && <Loader onComplete={() => setShowHome(true)} />}
      {showHome && <Home />}
    </div>
  );
}

export default App;
