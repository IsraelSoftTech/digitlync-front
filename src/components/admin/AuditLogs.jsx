import React, { useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import './AuditLogs.css';

const MOCK_LOGS = [
  { id: 1, admin: 'Admin User', action: 'Farmer profile updated', type: 'data_edit', date: '2026-02-22 10:30' },
  { id: 2, admin: 'Admin User', action: 'Booking status changed', type: 'booking', date: '2026-02-22 09:15' },
  { id: 3, admin: 'Admin User', action: 'Provider suspended', type: 'suspension', date: '2026-02-21 16:45' },
  { id: 4, admin: 'Admin User', action: 'Matching override applied', type: 'matching', date: '2026-02-21 14:20' },
  { id: 5, admin: 'Admin User', action: 'WhatsApp message sent', type: 'whatsapp', date: '2026-02-21 11:00' },
];

function AuditLogs() {
  const [filter, setFilter] = useState({ admin: '', type: '', dateFrom: '', dateTo: '' });

  return (
    <div className="audit-logs">
      <header className="audit-logs-header">
        <h1 className="audit-logs-title">Audit Logs</h1>
      </header>

      <div className="audit-logs-filters">
        <h3><FiFilter /> Filters</h3>
        <div className="audit-logs-filter-row">
          <input type="text" placeholder="Admin name" value={filter.admin} onChange={(e) => setFilter((s) => ({ ...s, admin: e.target.value }))} />
          <select value={filter.type} onChange={(e) => setFilter((s) => ({ ...s, type: e.target.value }))}>
            <option value="">All action types</option>
            <option value="data_edit">Data edit</option>
            <option value="booking">Booking</option>
            <option value="suspension">Suspension</option>
            <option value="matching">Matching</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <input type="date" placeholder="From" value={filter.dateFrom} onChange={(e) => setFilter((s) => ({ ...s, dateFrom: e.target.value }))} />
          <input type="date" placeholder="To" value={filter.dateTo} onChange={(e) => setFilter((s) => ({ ...s, dateTo: e.target.value }))} />
        </div>
      </div>

      <div className="audit-logs-table-wrap">
        <table className="audit-logs-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Admin</th>
              <th>Action Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log) => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>{log.admin}</td>
                <td><span className={`audit-logs-badge audit-logs-badge-${log.type}`}>{log.type}</span></td>
                <td>{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="audit-logs-hint">Admin action logs, booking change logs, matching override logs, account suspension logs, data edits, WhatsApp delivery logs — backend integration required for live data</p>
    </div>
  );
}

export default AuditLogs;
