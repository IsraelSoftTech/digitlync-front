import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';
import './ProvidersList.css';

function ProvidersList({ onSelectProvider, onAddProvider }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ service: '', rating: '', district: '', status: '' });

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const params = search ? { search } : {};
    const { data, error: err } = await api.getProviders(params);
    if (err) setError(err);
    else setProviders(data?.providers ?? []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchProviders, 300);
    return () => clearTimeout(t);
  }, [fetchProviders]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this provider?')) return;
    const { error: err } = await api.deleteProvider(id);
    if (!err) fetchProviders();
    else alert(err);
  };

  return (
    <div className="providers-list">
      <div className="providers-list-header">
        <h2 className="providers-list-title">Providers</h2>
        <button type="button" className="providers-add-btn" onClick={onAddProvider}>
          Add Provider
        </button>
      </div>
      <div className="providers-search">
        <input
          type="text"
          placeholder="Search by name, phone, or services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="providers-search-input"
        />
      </div>
      <div className="providers-filters">
        <select value={filters.service} onChange={(e) => setFilters((s) => ({ ...s, service: e.target.value }))}>
          <option value="">All services</option>
          <option value="plowing">Plowing</option>
          <option value="harvesting">Harvesting</option>
        </select>
        <select value={filters.rating} onChange={(e) => setFilters((s) => ({ ...s, rating: e.target.value }))}>
          <option value="">All ratings</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
        <select value={filters.district} onChange={(e) => setFilters((s) => ({ ...s, district: e.target.value }))}>
          <option value="">All districts</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}>
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      {loading && <div className="providers-loading">Loading...</div>}
      {error && <div className="providers-error">{error}</div>}
      {!loading && !error && (
        <>
          {providers.length === 0 ? (
            <p className="providers-empty">No providers yet. Add one to get started.</p>
          ) : (
            <>
              <div className="providers-cards">
                {providers.map((p) => (
                  <div
                    key={p.id}
                    className="providers-card"
                    onClick={() => onSelectProvider(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectProvider(p)}
                  >
                    <div className="providers-card-header">
                      <span className="providers-card-name">{p.full_name}</span>
                      <button
                        type="button"
                        className="providers-card-delete"
                        onClick={(e) => handleDelete(p.id, e)}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                    <div className="providers-card-meta">
                      <span>{p.phone}</span>
                      {p.services_offered && <span>{p.services_offered}</span>}
                      {(p.base_price_per_ha != null || p.work_capacity_ha_per_hour != null) && (
                        <span>
                          {p.base_price_per_ha != null ? `${p.base_price_per_ha} FCFA/ha` : ''}
                          {p.base_price_per_ha != null && p.work_capacity_ha_per_hour != null ? ' • ' : ''}
                          {p.work_capacity_ha_per_hour != null ? `${p.work_capacity_ha_per_hour} ha/hr` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="providers-table-wrap">
                <table className="providers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Services</th>
                      <th>Equipment</th>
                      <th>Base Location</th>
                      <th>Rating</th>
                      <th>On-time %</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p) => (
                      <tr key={p.id} onClick={() => onSelectProvider(p)} className="providers-row">
                        <td>{p.full_name}</td>
                        <td>{p.phone}</td>
                        <td>{p.services_offered || '—'}</td>
                        <td>{p.equipment_count ?? '—'}</td>
                        <td>{p.base_location || p.village || '—'}</td>
                        <td>{p.rating ?? '—'}</td>
                        <td>{p.on_time_pct != null ? `${p.on_time_pct}%` : '—'}</td>
                        <td><span className="providers-status-badge providers-status-active">Active</span></td>
                        <td>
                          <button
                            type="button"
                            className="providers-delete-btn"
                            onClick={(e) => handleDelete(p.id, e)}
                            title="Delete"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProvidersList;
