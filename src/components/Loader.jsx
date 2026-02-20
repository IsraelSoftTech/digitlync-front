import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import './Loader.css';

function Loader({ onComplete }) {
  const [phase, setPhase] = useState('dots'); // dots | logo | fading | done

  useEffect(() => {
    let logoTimer;
    let fadeTimer;

    // Dots: 0-2s appear, 2-3.5s interchange, then logo 2s
    const dotsTimer = setTimeout(() => {
      setPhase('logo');
      logoTimer = setTimeout(() => {
        setPhase('fading');
        fadeTimer = setTimeout(() => {
          setPhase('done');
          onComplete?.();
        }, 400);
      }, 2000);
    }, 3500);

    return () => {
      clearTimeout(dotsTimer);
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`loader-overlay ${phase === 'fading' ? 'loader-fade-out' : ''}`}>
      <div className="loader-content">
        {phase === 'dots' && (
          <div className="loader-dots-wrapper">
            <div className="loader-dots">
              <span className="loader-dot loader-dot-1" />
              <span className="loader-dot loader-dot-2" />
              <span className="loader-dot loader-dot-3" />
            </div>
            <p className="loader-powered">Powered by Izzy Tech Team</p>
          </div>
        )}
        {phase === 'logo' && (
          <img src={logo} alt="DigiLync" className="loader-logo" />
        )}
      </div>
    </div>
  );
}

export default Loader;
