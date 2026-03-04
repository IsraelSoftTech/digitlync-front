import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import AdminRatingWidget from './AdminRatingWidget';
import './FarmerProfile.css';

function FarmerProfile({ farmerId, onBack, onEdit }) {
  const [farmer, setFarmer] = useState(null);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [newPlot, setNewPlot] = useState({ gps_lat: '', gps_lng: '', plot_name: '', plot_size_ha: '', crop_type: '' });

  useEffect(() => {
    if (!farmerId) return;
    (async () => {
      const [farmerRes, plotsRes] = await Promise.all([
        api.getFarmer(farmerId),
        api.getFarmPlots(farmerId),
      ]);
      if (farmerRes.error) setError(farmerRes.error);
      else setFarmer(farmerRes.data);
      setPlots(plotsRes.data?.plots ?? []);
      setLoading(false);
    })();
  }, [farmerId]);

  const handleAddPlot = async (e) => {
    e.preventDefault();
    const { error: err } = await api.createFarmPlot({
      farmer_id: farmerId,
      gps_lat: parseFloat(newPlot.gps_lat),
      gps_lng: parseFloat(newPlot.gps_lng),
      plot_name: newPlot.plot_name || null,
      plot_size_ha: newPlot.plot_size_ha ? parseFloat(newPlot.plot_size_ha) : null,
      crop_type: newPlot.crop_type || null,
    });
    if (!err) {
      const { data } = await api.getFarmPlots(farmerId);
      setPlots(data?.plots ?? []);
      setShowAddPlot(false);
      setNewPlot({ gps_lat: '', gps_lng: '', plot_name: '', plot_size_ha: '', crop_type: '' });
    }
  };

  const handleDeletePlot = async (plotId) => {
    if (!window.confirm('Delete this plot?')) return;
    const { error: err } = await api.deleteFarmPlot(plotId);
    if (!err) {
      setPlots((p) => p.filter((x) => x.id !== plotId));
    }
  };

  if (loading) return <div className="farmer-profile-loading">Loading...</div>;
  if (error) return <div className="farmer-profile-error">{error}</div>;
  if (!farmer) return null;

  const formatCoord = (v) => (v != null ? Number(v).toFixed(6) : '—');

  return (
    <div className="farmer-profile">
      <div className="farmer-profile-header">
        <button type="button" className="farmer-profile-back" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="farmer-profile-edit" onClick={() => onEdit?.(farmer)}>
          Edit
        </button>
      </div>
      <h2 className="farmer-profile-name">{farmer.full_name}</h2>
      <div className="farmer-profile-grid">
        <div className="farmer-profile-section">
          <h3>Basic Identity</h3>
          <dl>
            <dt>Phone</dt>
            <dd>{farmer.phone}</dd>
            <dt>Country</dt>
            <dd>{farmer.country || '—'}</dd>
            <dt>Region</dt>
            <dd>{farmer.region || '—'}</dd>
            <dt>Division</dt>
            <dd>{farmer.division || '—'}</dd>
            <dt>District</dt>
            <dd>{farmer.district || '—'}</dd>
            <dt>Village</dt>
            <dd>{farmer.village || '—'}</dd>
            <dt>Location</dt>
            <dd>{farmer.location || '—'}</dd>
            <dt>Service Needs</dt>
            <dd>{Array.isArray(farmer.service_needs) && farmer.service_needs.length ? farmer.service_needs.join(', ') : '—'}</dd>
            <dt>Farm Size (ha)</dt>
            <dd>{farmer.farm_size_ha != null ? farmer.farm_size_ha : '—'}</dd>
            <dt>Crop Type</dt>
            <dd>{farmer.crop_type || '—'}</dd>
          </dl>
        </div>
        <div className="farmer-profile-section">
          <h3>GPS (main location)</h3>
          <dl>
            <dt>Latitude</dt>
            <dd>{formatCoord(farmer.gps_lat)}</dd>
            <dt>Longitude</dt>
            <dd>{formatCoord(farmer.gps_lng)}</dd>
          </dl>
          <p className="farmer-profile-hint">Edit farmer to change main GPS. Add plots below for multiple locations.</p>
        </div>
        <div className="farmer-profile-section">
          <h3>Farm Plots ({plots.length})</h3>
          <p className="farmer-profile-hint">Multiple plots supported per farmer (SRS).</p>
          {plots.length > 0 && (
            <ul className="farmer-profile-plots">
              {plots.map((p) => (
                <li key={p.id}>
                  {p.plot_name || 'Plot'} — {formatCoord(p.gps_lat)}, {formatCoord(p.gps_lng)}
                  {p.plot_size_ha != null && ` • ${p.plot_size_ha} ha`}
                  {p.crop_type && ` • ${p.crop_type}`}
                  <button type="button" className="farmer-profile-plot-del" onClick={() => handleDeletePlot(p.id)} title="Delete plot">×</button>
                </li>
              ))}
            </ul>
          )}
          {!showAddPlot ? (
            <button type="button" className="farmer-profile-add-plot" onClick={() => setShowAddPlot(true)}>+ Add plot</button>
          ) : (
            <form className="farmer-profile-plot-form" onSubmit={handleAddPlot}>
              <input type="number" step="any" placeholder="Lat" value={newPlot.gps_lat} onChange={(e) => setNewPlot((p) => ({ ...p, gps_lat: e.target.value }))} required />
              <input type="number" step="any" placeholder="Lng" value={newPlot.gps_lng} onChange={(e) => setNewPlot((p) => ({ ...p, gps_lng: e.target.value }))} required />
              <input type="text" placeholder="Plot name" value={newPlot.plot_name} onChange={(e) => setNewPlot((p) => ({ ...p, plot_name: e.target.value }))} />
              <input type="number" step="0.01" placeholder="Size (ha)" value={newPlot.plot_size_ha} onChange={(e) => setNewPlot((p) => ({ ...p, plot_size_ha: e.target.value }))} />
              <input type="text" placeholder="Crop" value={newPlot.crop_type} onChange={(e) => setNewPlot((p) => ({ ...p, crop_type: e.target.value }))} />
              <div className="farmer-profile-plot-form-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => { setShowAddPlot(false); setNewPlot({ gps_lat: '', gps_lng: '', plot_name: '', plot_size_ha: '', crop_type: '' }); }}>Cancel</button>
              </div>
            </form>
          )}
        </div>
        {farmer.notes && (
          <div className="farmer-profile-section farmer-profile-notes">
            <h3>Notes</h3>
            <p>{farmer.notes}</p>
          </div>
        )}
        <div className="farmer-profile-section">
          <AdminRatingWidget rateeType="farmer" rateeId={farmer.id} />
        </div>
      </div>
      <p className="farmer-profile-meta">
        Created {farmer.created_at ? new Date(farmer.created_at).toLocaleDateString() : '—'}
      </p>
    </div>
  );
}

export default FarmerProfile;
