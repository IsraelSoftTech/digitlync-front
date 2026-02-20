import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';
import './FarmersList.css';

function FarmersList({ onSelectFarmer, onAddFarmer }) {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

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
        <h2 className="farmers-list-title">All Farmers</h2>
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
                      <th>Village</th>
                      <th>Crop</th>
                      <th>Farm (ha)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map((f) => (
                      <tr key={f.id} onClick={() => onSelectFarmer(f)} className="farmers-row">
                        <td>{f.full_name}</td>
                        <td>{f.phone}</td>
                        <td>{f.village || '—'}</td>
                        <td>{f.crop_type || '—'}</td>
                        <td>{f.farm_size_ha != null ? f.farm_size_ha : '—'}</td>
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
