import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';
import './FarmersList.css';

function FarmersList({ onSelectFarmer, onAddFarmer }) {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ crop: '', region: '', farmSizeMin: '', farmSizeMax: '', irrigation: '', status: '' });

  const fetchFarmers = useCallback(async () => {
    setLoading(true);
    const params = search ? { search } : {};
    const { data, error: err } = await api.getFarmers(params);
    if (err) setError(err);
    else setFarmers(data?.farmers ?? []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchFarmers, 300);
    return () => clearTimeout(t);
  }, [fetchFarmers]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this farmer?')) return;
    const { error: err } = await api.deleteFarmer(id);
    if (!err) fetchFarmers();
    else alert(err);
  };

  return (
    <div className="farmers-list">
      <div className="farmers-list-header">
        <h2 className="farmers-list-title">Farmers</h2>
        <button type="button" className="farmers-add-btn" onClick={onAddFarmer}>
          Add Farmer
        </button>
      </div>
      <div className="farmers-search">
        <input
          type="text"
          placeholder="Search by name, phone, or village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="farmers-search-input"
        />
      </div>
      <div className="farmers-filters">
        <select value={filters.crop} onChange={(e) => setFilters((s) => ({ ...s, crop: e.target.value }))} title="Crop">
          <option value="">All crops</option>
          <option value="maize">Maize</option>
          <option value="rice">Rice</option>
          <option value="cassava">Cassava</option>
        </select>
        <select value={filters.region} onChange={(e) => setFilters((s) => ({ ...s, region: e.target.value }))} title="Region">
          <option value="">All regions</option>
        </select>
        <input type="number" placeholder="Min ha" value={filters.farmSizeMin} onChange={(e) => setFilters((s) => ({ ...s, farmSizeMin: e.target.value }))} className="farmers-filter-num" />
        <input type="number" placeholder="Max ha" value={filters.farmSizeMax} onChange={(e) => setFilters((s) => ({ ...s, farmSizeMax: e.target.value }))} className="farmers-filter-num" />
        <select value={filters.irrigation} onChange={(e) => setFilters((s) => ({ ...s, irrigation: e.target.value }))} title="Irrigation">
          <option value="">All irrigation</option>
          <option value="rainfed">Rainfed</option>
          <option value="irrigated">Irrigated</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))} title="Status">
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      {loading && <div className="farmers-loading">Loading...</div>}
      {error && <div className="farmers-error">{error}</div>}
      {!loading && !error && (
        <>
          {farmers.length === 0 ? (
            <p className="farmers-empty">No farmers yet. Add one to get started.</p>
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="farmers-cards">
                {farmers.map((f) => (
                  <div
                    key={f.id}
                    className="farmers-card"
                    onClick={() => onSelectFarmer(f)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectFarmer(f)}
                  >
                    <div className="farmers-card-header">
                      <span className="farmers-card-name">{f.full_name}</span>
                      <button
                        type="button"
                        className="farmers-card-delete"
                        onClick={(e) => handleDelete(f.id, e)}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                    <div className="farmers-card-meta">
                      <span>{f.phone}</span>
                      {f.village && <span>{f.village}</span>}
                      {(f.crop_type || f.farm_size_ha != null) && (
                        <span>
                          {f.crop_type || '—'} {f.farm_size_ha != null ? `• ${f.farm_size_ha} ha` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="farmers-table-wrap">
                <table className="farmers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>District</th>
                      <th>Farm (ha)</th>
                      <th>Crop</th>
                      <th>Mechanization</th>
                      <th>Status</th>
                      <th>Verification</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map((f) => (
                      <tr key={f.id} onClick={() => onSelectFarmer(f)} className="farmers-row">
                        <td>{f.full_name}</td>
                        <td>{f.phone}</td>
                        <td>{f.village || f.district || '—'}</td>
                        <td>{f.farm_size_ha != null ? f.farm_size_ha : '—'}</td>
                        <td>{f.crop_type || '—'}</td>
                        <td>{f.mechanization_level || '—'}</td>
                        <td><span className="farmers-status-badge farmers-status-active">Active</span></td>
                        <td>{f.verification_level || '—'}</td>
                        <td>
                          <button
                            type="button"
                            className="farmers-delete-btn"
                            onClick={(e) => handleDelete(f.id, e)}
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

export default FarmersList;
