import React, { useEffect, useState } from 'react';
import './Loader.css';

function Loader({ onComplete }) {
  const [phase, setPhase] = useState('drawing'); // drawing | animated | fading | done

  useEffect(() => {
    // Drawing: 3s. Then cool animated state: 0.6s. Then fade: 0.4s.
    const drawEnd = setTimeout(() => setPhase('animated'), 3000);
    const animEnd = setTimeout(() => setPhase('fading'), 3600);
    const done = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 4000);

    return () => {
      clearTimeout(drawEnd);
      clearTimeout(animEnd);
      clearTimeout(done);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`loader-overlay ${phase === 'fading' ? 'loader-fade-out' : ''}`}>
      <div className="loader-content">
        <svg
          className={`loader-leaf-svg ${phase === 'animated' ? 'loader-leaf-animated' : ''}`}
          viewBox="0 0 100 120"
          fill="none"
          stroke="#1B5E20"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path id="stem" pathLength="1" strokeWidth="3" d="M50 110 C48 75 52 50 54 35 C55 25 52 18 50 12" />
          <path id="leaf-left" pathLength="1" strokeWidth="2.8" d="M54 35 C30 28 18 45 28 58 C38 68 50 55 54 35" />
          <path id="leaf-mid" pathLength="1" strokeWidth="2.8" d="M54 35 C55 20 52 8 50 12 C48 18 50 28 54 35" />
          <path id="leaf-right" pathLength="1" strokeWidth="2.8" d="M54 35 C78 42 88 55 75 65 C65 72 55 60 54 35" />
        </svg>
      </div>
    </div>
  );
}

export default Loader;
