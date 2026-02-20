import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import './DashboardHome.css';

function DashboardHome() {
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

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-home">
      <h2 className="dashboard-title">Overview</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-value">{stats?.farmers ?? 0}</span>
          <span className="dashboard-card-label">Farmers</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-value">{stats?.providers ?? 0}</span>
          <span className="dashboard-card-label">Providers</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-value">{stats?.bookings ?? 0}</span>
          <span className="dashboard-card-label">Bookings</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-value">{stats?.pendingRequests ?? 0}</span>
          <span className="dashboard-card-label">Pending Requests</span>
        </div>
      </div>
      <div className="dashboard-recent">
        <h3>Recent Activity</h3>
        <p className="dashboard-recent-empty">No recent activity yet.</p>
      </div>
    </div>
  );
}

export default DashboardHome;
