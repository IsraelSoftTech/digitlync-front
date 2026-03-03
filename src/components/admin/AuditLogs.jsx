import React, { useState, useEffect, useCallback } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import { api } from '../../api';
import './AuditLogs.css';

function AuditLogs() {
  const [filter, setFilter] = useState({ admin: '', type: '', dateFrom: '', dateTo: '' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    const params = {};
    if (filter.admin) params.admin = filter.admin;
    if (filter.type) params.type = filter.type;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter.dateTo) params.dateTo = filter.dateTo;
    const { data, error: err } = await api.getAuditLogs(params);
    if (err) {
      setError(err);
      setLogs([]);
    } else {
      setLogs(data?.logs || []);
    }
    setLoading(false);
  }, [filter.admin, filter.type, filter.dateFrom, filter.dateTo]);

  useEffect(() => {
    const t = setTimeout(fetchLogs, 300);
    return () => clearTimeout(t);
  }, [fetchLogs]);

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
            <option value="login">Login</option>
          </select>
          <input type="date" placeholder="From" value={filter.dateFrom} onChange={(e) => setFilter((s) => ({ ...s, dateFrom: e.target.value }))} />
          <input type="date" placeholder="To" value={filter.dateTo} onChange={(e) => setFilter((s) => ({ ...s, dateTo: e.target.value }))} />
          <button type="button" className="audit-logs-refresh" onClick={fetchLogs} disabled={loading}>
            <FiRefreshCw className={loading ? 'spin' : ''} /> {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <p className="audit-logs-error">{error}</p>}

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
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="audit-logs-empty">No audit logs yet. Actions will appear here as you use the admin dashboard.</td>
              </tr>
            )}
            {logs.map((log) => (
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

      <p className="audit-logs-hint">Admin action logs, booking changes, data edits, and logins. Filters apply on load.</p>
    </div>
  );
}

export default AuditLogs;
