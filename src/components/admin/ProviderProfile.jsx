import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import './ProviderProfile.css';

function ProviderProfile({ providerId, onBack, onEdit }) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!providerId) return;
    (async () => {
      const { data, error: err } = await api.getProvider(providerId);
      if (err) setError(err);
      else setProvider(data);
      setLoading(false);
    })();
  }, [providerId]);

  if (loading) return <div className="provider-profile-loading">Loading...</div>;
  if (error) return <div className="provider-profile-error">{error}</div>;
  if (!provider) return null;

  return (
    <div className="provider-profile">
      <div className="provider-profile-header">
        <button type="button" className="provider-profile-back" onClick={onBack}>← Back</button>
        <button type="button" className="provider-profile-edit" onClick={() => onEdit?.(provider)}>Edit</button>
      </div>
      <h2 className="provider-profile-name">{provider.full_name}</h2>
      <div className="provider-profile-grid">
        <div className="provider-profile-section">
          <h3>Basic Identity</h3>
          <dl>
            <dt>Phone</dt>
            <dd>{provider.phone}</dd>
            <dt>Services Offered</dt>
            <dd>{provider.services_offered || '—'}</dd>
            <dt>Work Capacity</dt>
            <dd>{provider.work_capacity_ha_per_hour != null ? `${provider.work_capacity_ha_per_hour} ha/hr` : '—'}</dd>
            <dt>Base Price/ha</dt>
            <dd>{provider.base_price_per_ha != null ? `${provider.base_price_per_ha} FCFA` : '—'}</dd>
          </dl>
        </div>
        <div className="provider-profile-section">
          <h3>Equipment & Coverage</h3>
          <dl>
            <dt>Equipment Type</dt>
            <dd>{provider.equipment_type || '—'}</dd>
            <dt>Service Radius</dt>
            <dd>{provider.service_radius_km != null ? `${provider.service_radius_km} km` : '—'}</dd>
          </dl>
        </div>
        {provider.notes && (
          <div className="provider-profile-section provider-profile-notes">
            <h3>Notes</h3>
            <p>{provider.notes}</p>
          </div>
        )}
      </div>
      <p className="provider-profile-meta">Created {provider.created_at ? new Date(provider.created_at).toLocaleDateString() : '—'}</p>
    </div>
  );
}

export default ProviderProfile;
