import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiTrendingDown, FiCalendar, FiInfo } from 'react-icons/fi';
import { api } from '../../api';
import './NotificationCenter.css';

const ALERT_CONFIG = {
  matching: { icon: FiCalendar, label: 'Matching', color: 'warning' },
  performance: { icon: FiTrendingDown, label: 'Performance', color: 'warning' },
  info: { icon: FiInfo, label: 'Info', color: 'info' },
};

function NotificationCenter({ onNavigate }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await api.getNotifications();
      setAlerts(data?.alerts ?? []);
      setLoading(false);
    })();
  }, []);

  const handleClick = (alert) => {
    if (alert.link && onNavigate) {
      if (alert.link.includes('bookings')) {
        onNavigate('bookings', alert.link.includes('unassigned') ? { unassigned: true } : { status: 'pending' });
      }
    }
  };

  return (
    <div className="notification-center">
      <header className="notification-center-header">
        <h1 className="notification-center-title">Notifications</h1>
        <p className="notification-center-subtitle">Alerts from your platform</p>
      </header>

      <div className="notification-center-list">
        {loading ? (
          <p className="notification-center-empty">Loading...</p>
        ) : alerts.length === 0 ? (
          <p className="notification-center-empty">All clear. No alerts at the moment.</p>
        ) : (
          alerts.map((alert) => {
            const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG.info;
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={`notification-center-item notification-center-${config.color}`}
                onClick={() => handleClick(alert)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleClick(alert)}
              >
                <Icon className="notification-center-icon" />
                <div className="notification-center-content">
                  <strong>{alert.title}</strong>
                  <p>{alert.message}</p>
                </div>
                {(alert.link || alert.providerId) && (
                  <span className="notification-center-action">View →</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default NotificationCenter;
