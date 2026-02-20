import React from 'react';
import './AdminDash.css';

function AdminDash({ onLogout }) {
  return (
    <div className="admin-dash">
      <header className="admin-dash-header">
        <h1>DigiLync Admin</h1>
        {onLogout && (
          <button type="button" className="admin-dash-logout" onClick={onLogout}>
            Logout
          </button>
        )}
      </header>
      <main className="admin-dash-main">
        <p className="admin-dash-coming-soon">Coming soon</p>
      </main>
    </div>
  );
}

export default AdminDash;
