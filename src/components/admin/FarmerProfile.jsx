import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import AdminRatingWidget from './AdminRatingWidget';
import './FarmerProfile.css';

function FarmerProfile({ farmerId, onBack, onEdit }) {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!farmerId) return;
    (async () => {
      const { data, error: err } = await api.getFarmer(farmerId);
      if (err) setError(err);
      else setFarmer(data);
      setLoading(false);
    })();
  }, [farmerId]);

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
          <h3>GPS</h3>
          <dl>
            <dt>Latitude</dt>
            <dd>{formatCoord(farmer.gps_lat)}</dd>
            <dt>Longitude</dt>
            <dd>{formatCoord(farmer.gps_lng)}</dd>
          </dl>
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
