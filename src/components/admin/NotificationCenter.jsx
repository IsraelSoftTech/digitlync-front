import React, { useState } from 'react';
import { FiAlertCircle, FiTrendingDown, FiMapPin, FiX } from 'react-icons/fi';
import './NotificationCenter.css';

const ALERT_TYPES = {
  dispute: { icon: FiAlertCircle, label: 'New dispute', color: 'danger' },
  performance: { icon: FiTrendingDown, label: 'Provider performance drop', color: 'warning' },
  shortage: { icon: FiMapPin, label: 'District service shortage', color: 'info' },
  error: { icon: FiX, label: 'System error', color: 'danger' },
};

const MOCK_ALERTS = [
  { id: 1, type: 'dispute', text: 'New dispute opened for booking #B012', time: '5 min ago', read: false },
  { id: 2, type: 'performance', text: 'Provider John K. rating dropped below 3.5', time: '2 hrs ago', read: true },
  { id: 3, type: 'shortage', text: 'Low provider coverage in North District', time: '1 day ago', read: true },
];

function NotificationCenter() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const markRead = (id) => {
    setAlerts((s) => s.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  return (
    <div className="notification-center">
      <header className="notification-center-header">
        <h1 className="notification-center-title">Notifications</h1>
      </header>

      <div className="notification-center-list">
        {alerts.length === 0 ? (
          <p className="notification-center-empty">No alerts.</p>
        ) : (
          alerts.map((alert) => {
            const config = ALERT_TYPES[alert.type] || ALERT_TYPES.error;
            const Icon = config.icon;
            return (
              <div key={alert.id} className={`notification-center-item ${alert.read ? 'read' : ''} notification-center-${config.color}`} onClick={() => markRead(alert.id)}>
                <Icon className="notification-center-icon" />
                <div className="notification-center-content">
                  <strong>{config.label}</strong>
                  <p>{alert.text}</p>
                  <span className="notification-center-time">{alert.time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="notification-center-types">
        <h3>Alert Types</h3>
        <ul>
          <li>New dispute alert</li>
          <li>Provider performance drop alert</li>
          <li>District service shortage alert</li>
          <li>System error alert</li>
        </ul>
      </div>
    </div>
  );
}

export default NotificationCenter;
