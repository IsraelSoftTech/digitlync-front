import React, { useEffect, useState } from 'react';
import { FiSettings, FiMessageCircle, FiMapPin, FiShield } from 'react-icons/fi';
import { api } from '../../api';
import './SystemSettings.css';

const DEFAULT_GENERAL = {
  bookingLeadTime: 3,
  reminderTiming: 24,
  maxServiceRadius: 50,
  minRating: 3.0,
};

function SystemSettings() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [general, setGeneral] = useState(DEFAULT_GENERAL);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await api.getSettings();
      if (cancelled) return;
      if (!error && data?.settings) {
        setGeneral({ ...DEFAULT_GENERAL, ...data.settings });
      } else {
        setMessageType('error');
        setMessage('Could not load settings. Save is disabled until settings load successfully.');
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { data, error } = await api.updateSettings(general);
    setSaving(false);
    if (!error && data?.success) {
      setGeneral({ ...DEFAULT_GENERAL, ...data.settings });
      setMessageType('success');
      setMessage('Settings saved successfully.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setMessageType('error');
    setMessage(error || 'Could not save settings. Please try again.');
  };

  return (
    <div className="system-settings">
      <header className="system-settings-header">
        <h1 className="system-settings-title">Settings</h1>
        <p className="system-settings-subtitle">Platform-wide configuration stored in the database.</p>
      </header>

      {message && (
        <p className={`system-settings-message ${messageType === 'error' ? 'system-settings-message--error' : ''}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSave}>
        <section className="ss-section">
          <h2><FiSettings /> General</h2>
          <div className="ss-fields">
            <div className="ss-field">
              <label htmlFor="bookingLeadTime">Default booking lead time (days)</label>
              <input
                id="bookingLeadTime"
                type="number"
                value={general.bookingLeadTime}
                onChange={(e) => setGeneral((s) => ({ ...s, bookingLeadTime: +e.target.value }))}
                min="1"
                max="30"
                disabled={loading || saving}
              />
            </div>
            <div className="ss-field">
              <label htmlFor="reminderTiming">Reminder timing (hours before)</label>
              <input
                id="reminderTiming"
                type="number"
                value={general.reminderTiming}
                onChange={(e) => setGeneral((s) => ({ ...s, reminderTiming: +e.target.value }))}
                min="1"
                max="72"
                disabled={loading || saving}
              />
            </div>
            <div className="ss-field">
              <label htmlFor="maxServiceRadius">Maximum service radius (km)</label>
              <input
                id="maxServiceRadius"
                type="number"
                value={general.maxServiceRadius}
                onChange={(e) => setGeneral((s) => ({ ...s, maxServiceRadius: +e.target.value }))}
                min="5"
                max="200"
                disabled={loading || saving}
              />
            </div>
            <div className="ss-field">
              <label htmlFor="minRating">Default minimum rating</label>
              <input
                id="minRating"
                type="number"
                step="0.1"
                value={general.minRating}
                onChange={(e) => setGeneral((s) => ({ ...s, minRating: +e.target.value }))}
                min="0"
                max="5"
                disabled={loading || saving}
              />
            </div>
          </div>
        </section>

        <section className="ss-section">
          <h2><FiMessageCircle /> WhatsApp</h2>
          <p className="ss-placeholder">Message templates, auto-reply settings, fallback responses, and escalation triggers — coming soon.</p>
        </section>

        <section className="ss-section">
          <h2><FiMapPin /> Geography</h2>
          <p className="ss-placeholder">District management, service zones, and travel surcharge logic — coming soon.</p>
        </section>

        <section className="ss-section">
          <h2><FiShield /> Privacy & Consent</h2>
          <p className="ss-placeholder">Consent templates, user data export, and deletion request logs — coming soon.</p>
        </section>

        <button type="submit" className="ss-save-btn" disabled={loading || saving}>
          {saving ? 'Saving…' : loading ? 'Loading…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default SystemSettings;
