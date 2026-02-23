import React, { useState } from 'react';
import { FiStar, FiAlertCircle } from 'react-icons/fi';
import './RatingsDisputes.css';

function RatingsDisputes() {
  const [activeTab, setActiveTab] = useState('ratings');

  const topProviders = [];
  const lowRatedProviders = [];
  const openDisputes = [];
  const resolvedDisputes = [];

  return (
    <div className="ratings-disputes">
      <header className="ratings-disputes-header">
        <h1 className="ratings-disputes-title">Ratings & Disputes</h1>
      </header>

      <div className="ratings-disputes-tabs">
        <button type="button" className={`ratings-disputes-tab ${activeTab === 'ratings' ? 'active' : ''}`} onClick={() => setActiveTab('ratings')}>
          <FiStar /> Ratings
        </button>
        <button type="button" className={`ratings-disputes-tab ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => setActiveTab('disputes')}>
          <FiAlertCircle /> Disputes
        </button>
      </div>

      {activeTab === 'ratings' && (
        <div className="ratings-disputes-content">
          <section className="rd-section">
            <h3>Rating Overview</h3>
            <div className="rd-cards">
              <div className="rd-card">
                <span className="rd-card-value">4.2</span>
                <span className="rd-card-label">System-wide average</span>
              </div>
              <div className="rd-card">
                <span className="rd-card-value">—</span>
                <span className="rd-card-label">By district (future)</span>
              </div>
            </div>
          </section>
          <section className="rd-section">
            <h3>Top Providers</h3>
            <p className="rd-empty">{topProviders.length ? 'List of top providers' : 'No ratings yet.'}</p>
          </section>
          <section className="rd-section">
            <h3>Low-rated Providers</h3>
            <p className="rd-empty">{lowRatedProviders.length ? 'Providers below threshold' : 'None.'}</p>
          </section>
          <section className="rd-section">
            <h3>Rating Trends</h3>
            <p className="rd-empty">Trend chart placeholder (future)</p>
          </section>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="ratings-disputes-content">
          <section className="rd-section">
            <h3>Open Disputes</h3>
            <p className="rd-empty">{openDisputes.length ? 'Dispute list' : 'No open disputes.'}</p>
          </section>
          <section className="rd-section">
            <h3>Escalated Disputes</h3>
            <p className="rd-empty">Escalated list (future)</p>
          </section>
          <section className="rd-section">
            <h3>Resolved Disputes</h3>
            <p className="rd-empty">{resolvedDisputes.length ? 'Resolution history' : 'No resolved disputes yet.'}</p>
          </section>
          <p className="rd-hint">Evidence upload, resolution notes, penalty applied — future ready</p>
        </div>
      )}
    </div>
  );
}

export default RatingsDisputes;
