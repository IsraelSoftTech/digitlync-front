import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import './ProvidersList.css';

function ProvidersList({ onSelectProvider, onAddProvider }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    const params = search ? { search } : {};
    const { data, error: err } = await api.getProviders(params);
    if (err) setError(err);
    else setProviders(data?.providers ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(fetchProviders, 300);
    return () => clearTimeout(t);
  }, [search]);

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
        <h2 className="providers-list-title">All Providers</h2>
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
                      <th>Capacity</th>
                      <th>Price/ha</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p) => (
                      <tr key={p.id} onClick={() => onSelectProvider(p)} className="providers-row">
                        <td>{p.full_name}</td>
                        <td>{p.phone}</td>
                        <td>{p.services_offered || '—'}</td>
                        <td>{p.work_capacity_ha_per_hour != null ? `${p.work_capacity_ha_per_hour} ha/hr` : '—'}</td>
                        <td>{p.base_price_per_ha != null ? `${p.base_price_per_ha}` : '—'}</td>
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
