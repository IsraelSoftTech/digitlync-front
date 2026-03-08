import React, { useState, useEffect } from 'react';
import { FiStar, FiAlertCircle, FiUser } from 'react-icons/fi';
import { api } from '../../api';
import './RatingsDisputes.css';

function RatingsDisputes({ onViewProvider }) {
  const [activeTab, setActiveTab] = useState('ratings');
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [sRes, rRes] = await Promise.all([
        api.getRatingsSummary(),
        api.getRatingsRecent(),
      ]);
      setSummary(sRes.data ?? null);
      setRecent(rRes.data?.ratings ?? []);
      setLoading(false);
    })();
  }, []);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—');

  return (
    <div className="ratings-disputes">
      <header className="ratings-disputes-header">
        <h1 className="ratings-disputes-title">Ratings & Disputes</h1>
        <p className="ratings-disputes-subtitle">Farmer ratings of providers after completed bookings</p>
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
            <h3>Overview</h3>
            {loading ? (
              <p className="rd-empty">Loading...</p>
            ) : (
              <div className="rd-cards">
                <div className="rd-card">
                  <span className="rd-card-value">{summary?.systemAvg ?? '—'}</span>
                  <span className="rd-card-label">System-wide average (1–5)</span>
                </div>
                <div className="rd-card">
                  <span className="rd-card-value">{summary?.totalRatings ?? 0}</span>
                  <span className="rd-card-label">Total ratings</span>
                </div>
              </div>
            )}
          </section>

          <section className="rd-section">
            <h3>Top providers (4+ stars)</h3>
            {loading ? (
              <p className="rd-empty">Loading...</p>
            ) : !summary?.topProviders?.length ? (
              <p className="rd-empty">No top-rated providers yet. Ratings appear after farmers complete bookings and rate.</p>
            ) : (
              <ul className="rd-provider-list">
                {summary.topProviders.map((p) => (
                  <li key={p.id} className="rd-provider-item">
                    <div className="rd-provider-main">
                      <FiUser className="rd-provider-icon" />
                      <div>
                        <strong>{p.full_name}</strong>
                        <span className="rd-provider-services">{p.services_offered || '—'}</span>
                      </div>
                      <span className="rd-provider-rating">{parseFloat(p.avg_rating).toFixed(1)} ★</span>
                    </div>
                    <span className="rd-provider-count">{p.rating_count} rating(s)</span>
                    {onViewProvider && (
                      <button type="button" className="rd-provider-btn" onClick={() => onViewProvider({ id: p.id, full_name: p.full_name })}>View</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rd-section">
            <h3>Low-rated providers (&lt; 3.5)</h3>
            {loading ? (
              <p className="rd-empty">Loading...</p>
            ) : !summary?.lowRatedProviders?.length ? (
              <p className="rd-empty">None. All rated providers meet the threshold.</p>
            ) : (
              <ul className="rd-provider-list rd-provider-list-low">
                {summary.lowRatedProviders.map((p) => (
                  <li key={p.id} className="rd-provider-item">
                    <div className="rd-provider-main">
                      <strong>{p.full_name}</strong>
                      <span className="rd-provider-rating rd-provider-rating-low">{parseFloat(p.avg_rating).toFixed(1)} ★</span>
                    </div>
                    {onViewProvider && (
                      <button type="button" className="rd-provider-btn" onClick={() => onViewProvider({ id: p.id, full_name: p.full_name })}>View</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rd-section">
            <h3>Recent ratings</h3>
            {!recent.length ? (
              <p className="rd-empty">No ratings yet.</p>
            ) : (
              <ul className="rd-recent-list">
                {recent.map((r) => (
                  <li key={r.id} className="rd-recent-item">
                    <span className="rd-recent-rating">{r.rating} ★</span>
                    <span className="rd-recent-text">{r.farmer_name} rated {r.provider_name} for {r.service_type || 'service'}</span>
                    <span className="rd-recent-date">{formatDate(r.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="ratings-disputes-content">
          <section className="rd-section">
            <h3>Open disputes</h3>
            <p className="rd-empty">No open disputes. Dispute handling (evidence upload, resolution notes) is planned for future phases.</p>
          </section>
          <section className="rd-section">
            <h3>Resolved disputes</h3>
            <p className="rd-empty">No resolved disputes yet.</p>
          </section>
        </div>
      )}
    </div>
  );
}

export default RatingsDisputes;
