import React, { useEffect, useState } from 'react';
import { FiTool } from 'react-icons/fi';
import { api } from '../../api';
import './MaintenanceSettings.css';

function MaintenanceSettings() {
  const [signalEnabled, setSignalEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await api.getMaintenanceSettings();
      if (cancelled) return;
      if (!error && data) {
        setSignalEnabled(Boolean(data.maintenanceSignalEnabled));
      } else {
        setMessageType('error');
        setMessage('Could not load maintenance settings.');
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleToggle = async (e) => {
    const next = e.target.checked;
    setSaving(true);
    setMessage('');
    const { data, error } = await api.updateMaintenanceSettings(next);
    setSaving(false);
    if (!error && data?.success) {
      setSignalEnabled(Boolean(data.maintenanceSignalEnabled));
      setMessageType('success');
      setMessage(
        data.maintenanceSignalEnabled
          ? 'Maintenance banner is now visible on the website.'
          : 'Maintenance banner is hidden from the website.'
      );
      setTimeout(() => setMessage(''), 4000);
      return;
    }
    setMessageType('error');
    setMessage(error || 'Could not save. Please try again.');
  };

  return (
    <div className="maintenance-settings">
      <header className="maintenance-settings-header">
        <h1 className="maintenance-settings-title">Maintenance</h1>
        <p className="maintenance-settings-subtitle">
          Control the site-wide maintenance notice shown to all visitors.
        </p>
      </header>

      {message && (
        <p className={`maintenance-settings-message ${messageType === 'error' ? 'maintenance-settings-message--error' : ''}`}>
          {message}
        </p>
      )}

      <section className="maintenance-settings-card">
        <div className="maintenance-settings-card-icon" aria-hidden="true">
          <FiTool />
        </div>
        <div className="maintenance-settings-card-body">
          <label className="maintenance-settings-toggle">
            <input
              type="checkbox"
              checked={signalEnabled}
              onChange={handleToggle}
              disabled={loading || saving}
            />
            <span className="maintenance-settings-toggle-label">Signal Maintenance</span>
          </label>
          <p className="maintenance-settings-help">
            When checked, visitors see the scheduled maintenance banner across the site.
            When unchecked, the banner is hidden.
          </p>
        </div>
      </section>
    </div>
  );
}

export default MaintenanceSettings;
