import React, { useState } from 'react';
import './Settings.css';

function Settings() {
  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setMessage('Settings saved. (Change password requires backend implementation.)');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="settings-section">
      <h2 className="settings-title">Settings</h2>
      {message && <p className="settings-message">{message}</p>}
      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-section-block">
          <h3>Admin Profile</h3>
          <p className="settings-desc">Update your admin account settings.</p>
          <div className="settings-field">
            <label htmlFor="new_password">New Password</label>
            <input id="new_password" type="password" placeholder="Enter new password" disabled />
            <span className="settings-field-hint">Change password API to be implemented.</span>
          </div>
        </div>
        <div className="settings-section-block">
          <h3>Platform Settings</h3>
          <p className="settings-desc">Configure platform-wide options.</p>
          <div className="settings-field">
            <label>Booking lead time, reminder templates, and other options will be configurable here.</label>
          </div>
        </div>
        <button type="submit" className="settings-save-btn">Save</button>
      </form>
    </div>
  );
}

export default Settings;
