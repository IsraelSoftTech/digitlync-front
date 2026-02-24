import React, { useEffect } from 'react';
import './Loader.css';

function Loader({ onComplete }) {
  useEffect(() => {
    // 2 cycles × 1.5s = 3s, then brief fade-out
    const done = setTimeout(() => {
      onComplete?.();
    }, 3200);
    return () => clearTimeout(done);
  }, [onComplete]);

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-squares">
          <div className="loader-square loader-square-1" />
          <div className="loader-square loader-square-2" />
          <div className="loader-square loader-square-3" />
        </div>
        <h1 className="loader-title">DigiLync</h1>
      </div>
    </div>
  );
}

export default Loader;
