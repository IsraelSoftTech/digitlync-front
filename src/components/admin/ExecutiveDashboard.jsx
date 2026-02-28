import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiTrendingDown, FiUsers, FiUserPlus, FiCalendar, FiStar, FiMapPin } from 'react-icons/fi';
import { api } from '../../api';
import './ExecutiveDashboard.css';

function ExecutiveDashboard({ onViewFarmMap }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await api.getDashboardStats();
      if (cancelled) return;
      if (err) setError(err);
      else setStats(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="exec-dash-loading">Loading executive dashboard...</div>;
  if (error) return <div className="exec-dash-error">{error}</div>;

  const farmers = stats?.farmers ?? 0;
  const providers = stats?.providers ?? 0;
  const bookings = stats?.bookings ?? 0;
  const pending = stats?.pendingRequests ?? 0;

  // Mock data for enterprise widgets (frontend placeholder)
  const completedJobs = Math.floor(bookings * 0.6);
  const cancelledJobs = Math.floor(bookings * 0.05);
  const disputeCount = 0;
  const avgRating = 4.2;
  const lowRatingProviders = [];
  const highCancelProviders = [];
  const activityIcons = {
    registration: FiUserPlus,
    booking: FiCalendar,
    rating: FiStar,
    gps: FiMapPin,
  };
  const activityFeed = [
    { id: 1, type: 'registration', text: 'New farmer registered: Jean Mbarga', time: '2 min ago' },
    { id: 2, type: 'booking', text: 'Booking #B001 confirmed by provider', time: '15 min ago' },
    { id: 3, type: 'rating', text: 'Rating submitted for booking #B002', time: '1 hr ago' },
    { id: 4, type: 'gps', text: 'GPS coordinates updated for farm F003', time: '2 hrs ago' },
  ];

  return (
    <div className="exec-dash">
      <header className="exec-dash-header">
        <h1 className="exec-dash-title">Dashboard</h1>
      </header>

      <section className="exec-section">
        <h2 className="exec-section-title">Overview</h2>
        <div className="exec-cards-grid">
          <div className="exec-card">
            <span className="exec-card-value">{farmers}</span>
            <span className="exec-card-label">Total Farmers</span>
          </div>
          <div className="exec-card">
            <span className="exec-card-value">{providers}</span>
            <span className="exec-card-label">Total Providers</span>
          </div>
          <div className="exec-card">
            <span className="exec-card-value">{bookings}</span>
            <span className="exec-card-label">Active Bookings</span>
          </div>
          <div className="exec-card">
            <span className="exec-card-value">{pending}</span>
            <span className="exec-card-label">Pending Requests</span>
          </div>
          <div className="exec-card">
            <span className="exec-card-value">{completedJobs}</span>
            <span className="exec-card-label">Completed Jobs</span>
          </div>
          <div className="exec-card">
            <span className="exec-card-value">{cancelledJobs}</span>
            <span className="exec-card-label">Cancelled Jobs</span>
          </div>
          <div className="exec-card">
            <span className="exec-card-value">{disputeCount}</span>
            <span className="exec-card-label">Disputes</span>
          </div>
          <div className="exec-card">
            <span className="exec-card-value">{avgRating}</span>
            <span className="exec-card-label">Avg Rating</span>
          </div>
          <div className="exec-card exec-card-placeholder">
            <span className="exec-card-value">—</span>
            <span className="exec-card-label">Revenue Potential (Future)</span>
          </div>
        </div>
      </section>

      <section className="exec-section">
        <h2 className="exec-section-title">Geography</h2>
        <button
          type="button"
          className="exec-geo-card exec-geo-card-clickable"
          onClick={onViewFarmMap}
        >
          <div className="exec-geo-placeholder">
            <FiMapPin className="exec-geo-icon" />
            <p>View farm map with real locations — farms per district, active providers, GPS markers</p>
            <span className="exec-geo-badge">View Map</span>
          </div>
        </button>
      </section>

      <section className="exec-section">
        <h2 className="exec-section-title">Alerts</h2>
        <div className="exec-alerts-grid">
          <div className="exec-alert-card">
            <FiTrendingDown className="exec-alert-icon" />
            <div>
              <strong>Low-rated providers</strong>
              <p>{lowRatingProviders.length} provider(s) below 3.5 stars</p>
            </div>
          </div>
          <div className="exec-alert-card">
            <FiAlertCircle className="exec-alert-icon" />
            <div>
              <strong>High cancellation</strong>
              <p>{highCancelProviders.length} provider(s) with &gt;20% cancel rate</p>
            </div>
          </div>
          <div className="exec-alert-card">
            <FiAlertCircle className="exec-alert-icon" />
            <div>
              <strong>Dispute spikes</strong>
              <p>{disputeCount} open dispute(s)</p>
            </div>
          </div>
          <div className="exec-alert-card">
            <FiAlertCircle className="exec-alert-icon" />
            <div>
              <strong>Booking congestion</strong>
              <p>No congestion alerts</p>
            </div>
          </div>
        </div>
      </section>

      <section className="exec-section">
        <h2 className="exec-section-title">Activity</h2>
        <div className="exec-activity-feed">
          {activityFeed.length === 0 ? (
            <p className="exec-activity-empty">No recent activity yet.</p>
          ) : (
            <ul className="exec-activity-list">
              {activityFeed.map((item) => {
                const Icon = activityIcons[item.type];
                return (
                  <li key={item.id} className="exec-activity-item">
                    <Icon className="exec-activity-icon" />
                    <span className="exec-activity-text">{item.text}</span>
                    <span className="exec-activity-time">{item.time}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default ExecutiveDashboard;
