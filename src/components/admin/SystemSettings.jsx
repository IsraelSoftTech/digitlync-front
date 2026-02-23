import React, { useState } from 'react';
import { FiSettings, FiMessageCircle, FiMapPin, FiShield } from 'react-icons/fi';
import './SystemSettings.css';

function SystemSettings() {
  const [message, setMessage] = useState('');
  const [general, setGeneral] = useState({
    bookingLeadTime: 3,
    reminderTiming: 24,
    maxServiceRadius: 50,
    minRating: 3.0,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setMessage('Settings saved. (Backend integration required for persistence.)');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="system-settings">
      <header className="system-settings-header">
        <h1 className="system-settings-title">Settings</h1>
      </header>

      {message && <p className="system-settings-message">{message}</p>}

      <form onSubmit={handleSave}>
        <section className="ss-section">
          <h2><FiSettings /> General</h2>
          <div className="ss-fields">
            <div className="ss-field">
              <label>Default booking lead time (days)</label>
              <input type="number" value={general.bookingLeadTime} onChange={(e) => setGeneral((s) => ({ ...s, bookingLeadTime: +e.target.value }))} min="1" max="30" />
            </div>
            <div className="ss-field">
              <label>Reminder timing (hours before)</label>
              <input type="number" value={general.reminderTiming} onChange={(e) => setGeneral((s) => ({ ...s, reminderTiming: +e.target.value }))} min="1" max="72" />
            </div>
            <div className="ss-field">
              <label>Maximum service radius (km)</label>
              <input type="number" value={general.maxServiceRadius} onChange={(e) => setGeneral((s) => ({ ...s, maxServiceRadius: +e.target.value }))} min="5" max="200" />
            </div>
            <div className="ss-field">
              <label>Default minimum rating</label>
              <input type="number" step="0.1" value={general.minRating} onChange={(e) => setGeneral((s) => ({ ...s, minRating: +e.target.value }))} min="0" max="5" />
            </div>
          </div>
        </section>

        <section className="ss-section">
          <h2><FiMessageCircle /> WhatsApp</h2>
          <p className="ss-placeholder">Message templates, auto-reply settings, fallback responses, escalation triggers — backend integration required</p>
        </section>

        <section className="ss-section">
          <h2><FiMapPin /> Geography</h2>
          <p className="ss-placeholder">Add districts, set service zones, travel surcharge logic — backend integration required</p>
        </section>

        <section className="ss-section">
          <h2><FiShield /> Privacy & Consent</h2>
          <p className="ss-placeholder">Consent templates, user data export, data deletion request logs — backend integration required</p>
        </section>

        <button type="submit" className="ss-save-btn">Save Settings</button>
      </form>
    </div>
  );
}

export default SystemSettings;
