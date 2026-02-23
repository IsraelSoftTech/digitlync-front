import React, { useState } from 'react';
import './MatchingEngine.css';

function MatchingEngine() {
  const [weights, setWeights] = useState({
    distance: 30,
    rating: 35,
    availability: 20,
    capacity: 15,
  });
  const [config, setConfig] = useState({
    maxRadius: 50,
    minRating: 3.0,
    minPerformance: 70,
  });

  return (
    <div className="matching-engine">
      <header className="matching-engine-header">
        <h1 className="matching-engine-title">Matching Engine</h1>
      </header>

      <section className="me-section">
        <h2>Weight Configuration</h2>
        <p className="me-desc">Control how each factor influences provider ranking. Total should be 100%.</p>
        <div className="me-weights">
          {Object.entries(weights).map(([key, val]) => (
            <div key={key} className="me-weight-row">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input type="range" min="0" max="100" value={val} onChange={(e) => setWeights((s) => ({ ...s, [key]: +e.target.value }))} />
              <span>{val}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="me-section">
        <h2>Thresholds</h2>
        <div className="me-thresholds">
          <div className="me-threshold">
            <label>Max matching radius (km)</label>
            <input type="number" value={config.maxRadius} onChange={(e) => setConfig((s) => ({ ...s, maxRadius: +e.target.value }))} min="5" max="200" />
          </div>
          <div className="me-threshold">
            <label>Minimum rating threshold</label>
            <input type="number" step="0.1" value={config.minRating} onChange={(e) => setConfig((s) => ({ ...s, minRating: +e.target.value }))} min="0" max="5" />
          </div>
          <div className="me-threshold">
            <label>Auto-reject below performance %</label>
            <input type="number" value={config.minPerformance} onChange={(e) => setConfig((s) => ({ ...s, minPerformance: +e.target.value }))} min="0" max="100" />
          </div>
        </div>
      </section>

      <section className="me-section">
        <h2>Logs</h2>
        <p className="me-empty">Matching decision logs, ranking breakdown per booking, override history — backend integration required</p>
      </section>

      <button type="button" className="me-save-btn">Save Configuration</button>
    </div>
  );
}

export default MatchingEngine;
