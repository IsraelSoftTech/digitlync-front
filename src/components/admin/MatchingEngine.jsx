import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { api } from '../../api';
import './MatchingEngine.css';

function MatchingEngine({ onViewBookings }) {
  const [stats, setStats] = useState({ unassigned: 0, providers: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [dRes, bRes] = await Promise.all([
        api.getDashboardStats(),
        api.getBookings({ unassigned: '1' }),
      ]);
      const d = dRes.data;
      const bookings = bRes.data?.bookings ?? [];
      setStats({
        unassigned: d?.pendingRequests ?? bookings.length,
        providers: d?.providers ?? 0,
        pending: bookings.filter((b) => b.status === 'pending').length,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <div className="matching-engine">
      <header className="matching-engine-header">
        <h1 className="matching-engine-title">Matching</h1>
        <p className="matching-engine-subtitle">
          Assign providers to farmer requests. Phase 1 uses service-based matching; AI ranking is on the roadmap.
        </p>
      </header>

      <section className="me-section">
        <h2>Overview</h2>
        <p className="me-desc">Requests needing your attention</p>
        {loading ? (
          <p className="me-empty">Loading...</p>
        ) : (
          <div className="me-overview-cards">
            <div className="me-overview-card me-overview-card-action">
              <FiCalendar className="me-overview-icon" />
              <span className="me-overview-value">{stats.unassigned}</span>
              <span className="me-overview-label">Need matching</span>
              <p className="me-overview-hint">No provider assigned yet</p>
              {stats.unassigned > 0 && onViewBookings && (
                <button type="button" className="me-overview-btn" onClick={() => onViewBookings({ unassigned: true })}>
                  Go to Bookings →
                </button>
              )}
            </div>
            <div className="me-overview-card">
              <FiUsers className="me-overview-icon" />
              <span className="me-overview-value">{stats.providers}</span>
              <span className="me-overview-label">Providers</span>
              <p className="me-overview-hint">Available for matching</p>
            </div>
            <div className="me-overview-card">
              <FiCheckCircle className="me-overview-icon" />
              <span className="me-overview-value">{stats.pending}</span>
              <span className="me-overview-label">Awaiting confirmation</span>
              <p className="me-overview-hint">Provider notified, pending accept</p>
            </div>
          </div>
        )}
      </section>

      <section className="me-section">
        <h2>How matching works</h2>
        <ol className="me-steps">
          <li>Farmer requests a service via WhatsApp</li>
          <li>System tries to auto-match by service type (e.g. Plowing, Spraying)</li>
          <li>If no match, the request appears in Bookings as &quot;Needs matching&quot;</li>
          <li>You assign a provider → they receive a WhatsApp notification</li>
          <li>Provider accepts or rejects via WhatsApp</li>
        </ol>
      </section>

      <section className="me-section">
        <h2>Roadmap</h2>
        <p className="me-desc">AI matching (distance, rating, availability) is planned for future phases.</p>
      </section>
    </div>
  );
}

export default MatchingEngine;
