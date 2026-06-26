import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiCheckCircle, FiZap } from 'react-icons/fi';
import { api } from '../../api';
import './MatchingEngine.css';

function MatchingEngine({ onViewBookings }) {
  const [stats, setStats] = useState({ unassigned: 0, providers: 0, pending: 0 });
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);
  const [matching, setMatching] = useState(null);
  const [error, setError] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setError('');
    const [dRes, bRes, awaitingRes] = await Promise.all([
      api.getDashboardStats(),
      api.getBookings({ unassigned: '1' }),
      api.getBookings({ status: 'awaiting_provider_accept' }),
    ]);
    const d = dRes.data;
    const list = bRes.data?.bookings ?? [];
    const awaitingList = awaitingRes.data?.bookings ?? [];
    setStats({
      unassigned: d?.pendingRequests ?? list.length,
      providers: d?.providers ?? 0,
      pending: awaitingList.length || d?.awaitingProviderAccept || 0,
    });
    setBookings(list);
    setLoading(false);
  };

  useEffect(() => { loadOverview(); }, []);

  const loadRecommendations = async (booking) => {
    setSelectedBooking(booking);
    setRecLoading(true);
    setRecommendations([]);
    setError('');
    const { data, error: err } = await api.getRecommendations({
      farmer_id: booking.farmer_id,
      service_type: booking.service_type,
      requested_date: booking.scheduled_date || new Date().toISOString().slice(0, 10),
      farm_size_ha: booking.farm_size_ha || 1,
      budget_min: booking.budget_min_fcfa || '',
      budget_max: booking.budget_max_fcfa || '',
    });
    setRecLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setRecommendations(data?.recommendedProviders || []);
  };

  const handleMatch = async (providerId) => {
    if (!selectedBooking) return;
    if (!window.confirm(`Match booking #${selectedBooking.id} with provider #${providerId}?`)) return;
    setMatching(providerId);
    setError('');
    const { error: err } = await api.matchBooking(selectedBooking.id, providerId);
    setMatching(null);
    if (err) {
      setError(err);
      return;
    }
    setSelectedBooking(null);
    setRecommendations([]);
    loadOverview();
    alert('Provider matched. Farmer and provider have been notified on WhatsApp.');
  };

  return (
    <div className="matching-engine">
      <header className="matching-engine-header">
        <h1 className="matching-engine-title">Matching</h1>
        <p className="matching-engine-subtitle">
          Auto-matching runs when farmers request services. Manually assign providers to unmatched requests below.
        </p>
      </header>

      <section className="me-section">
        <h2>Overview</h2>
        {loading ? (
          <p className="me-empty">Loading...</p>
        ) : (
          <div className="me-overview-cards">
            <div className="me-overview-card me-overview-card-action">
              <FiCalendar className="me-overview-icon" />
              <span className="me-overview-value">{stats.unassigned}</span>
              <span className="me-overview-label">Need matching</span>
              {stats.unassigned > 0 && onViewBookings && (
                <button type="button" className="me-overview-btn" onClick={() => onViewBookings({ unassigned: true })}>
                  Go to Bookings
                </button>
              )}
            </div>
            <div className="me-overview-card">
              <FiUsers className="me-overview-icon" />
              <span className="me-overview-value">{stats.providers}</span>
              <span className="me-overview-label">Providers</span>
            </div>
            <div className="me-overview-card">
              <FiCheckCircle className="me-overview-icon" />
              <span className="me-overview-value">{stats.pending}</span>
              <span className="me-overview-label">Awaiting provider accept</span>
            </div>
          </div>
        )}
      </section>

      <section className="me-section">
        <h2>Manual matching</h2>
        {error && <p className="me-error">{error}</p>}
        {bookings.length === 0 && !loading ? (
          <p className="me-empty">No unmatched requests right now.</p>
        ) : (
          <div className="me-manual-grid">
            <div className="me-booking-list">
              <h3>Unmatched requests</h3>
              {bookings.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`me-booking-item ${selectedBooking?.id === b.id ? 'active' : ''}`}
                  onClick={() => loadRecommendations(b)}
                >
                  <strong>#{b.id}</strong> {b.service_type} — {b.farmer_name}
                  <span>{b.farm_size_ha || '—'} ha · {b.scheduled_date || 'TBD'}</span>
                </button>
              ))}
            </div>
            <div className="me-rec-panel">
              <h3>
                <FiZap /> Recommended providers
              </h3>
              {!selectedBooking && <p className="me-empty">Select a request to see recommendations.</p>}
              {selectedBooking && recLoading && <p className="me-empty">Loading recommendations...</p>}
              {selectedBooking && !recLoading && recommendations.length === 0 && (
                <p className="me-empty">No providers matched this request. Assign from Bookings instead.</p>
              )}
              {recommendations.map((p) => (
                <div key={p.providerId} className="me-rec-card">
                  <div>
                    <strong>{p.name}</strong>
                    <p>{p.distanceDisplay} · {p.farmerPayable?.toLocaleString()} FCFA · Rating {p.avgRating || '—'}</p>
                  </div>
                  <button
                    type="button"
                    className="me-match-btn"
                    disabled={matching === p.providerId}
                    onClick={() => handleMatch(p.providerId)}
                  >
                    {matching === p.providerId ? 'Matching...' : 'Match'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="me-section">
        <h2>How matching works</h2>
        <ol className="me-steps">
          <li>Farmer requests a service via WhatsApp</li>
          <li>System auto-matches by service, budget, distance, and availability</li>
          <li>Farmer pays to escrow; provider selects payout method</li>
          <li>If no match, the request appears here for manual assignment</li>
          <li>Farmer confirms completed work; payment is released automatically</li>
        </ol>
      </section>
    </div>
  );
}

export default MatchingEngine;
