import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import './FarmerForm.css';

function FarmerForm({ farmer, onSuccess, onCancel }) {
  const isEdit = !!farmer;
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    village: '',
    location: '',
    gps_lat: '',
    gps_lng: '',
    farm_size_ha: '',
    crop_type: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (farmer) {
      setForm({
        full_name: farmer.full_name || '',
        phone: farmer.phone || '',
        village: farmer.village || '',
        location: farmer.location || '',
        gps_lat: farmer.gps_lat ?? '',
        gps_lng: farmer.gps_lng ?? '',
        farm_size_ha: farmer.farm_size_ha ?? '',
        crop_type: farmer.crop_type || '',
        notes: farmer.notes || '',
      });
    }
  }, [farmer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      setError('Full name and phone are required');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      gps_lat: form.gps_lat ? parseFloat(form.gps_lat) : null,
      gps_lng: form.gps_lng ? parseFloat(form.gps_lng) : null,
      farm_size_ha: form.farm_size_ha ? parseFloat(form.farm_size_ha) : null,
    };
    const { data, error: err } = isEdit
      ? await api.updateFarmer(farmer.id, payload)
      : await api.createFarmer(payload);
    setSaving(false);
    if (err) setError(err);
    else onSuccess?.(data);
  };

  return (
    <div className="farmer-form">
      <h2 className="farmer-form-title">{isEdit ? 'Edit Farmer' : 'Add Farmer'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="farmer-form-error">{error}</p>}
        <div className="farmer-form-grid">
          <div className="farmer-form-field">
            <label htmlFor="full_name">Full Name *</label>
            <input
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Farmer's full name"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="phone">Phone *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="WhatsApp number"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="village">Village</label>
            <input
              id="village"
              name="village"
              value={form.village}
              onChange={handleChange}
              placeholder="Village / location"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="location">Location (address)</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Detailed location"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="farm_size_ha">Farm Size (ha)</label>
            <input
              id="farm_size_ha"
              name="farm_size_ha"
              type="number"
              step="0.01"
              min="0"
              value={form.farm_size_ha}
              onChange={handleChange}
              placeholder="e.g. 2.5"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="crop_type">Crop Type</label>
            <input
              id="crop_type"
              name="crop_type"
              value={form.crop_type}
              onChange={handleChange}
              placeholder="e.g. Maize, Cassava"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="gps_lat">GPS Latitude</label>
            <input
              id="gps_lat"
              name="gps_lat"
              type="number"
              step="any"
              value={form.gps_lat}
              onChange={handleChange}
              placeholder="e.g. 6.3703"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="gps_lng">GPS Longitude</label>
            <input
              id="gps_lng"
              name="gps_lng"
              type="number"
              step="any"
              value={form.gps_lng}
              onChange={handleChange}
              placeholder="e.g. 2.3912"
            />
          </div>
        </div>
        <div className="farmer-form-field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes"
          />
        </div>
        <div className="farmer-form-actions">
          <button type="button" className="farmer-form-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="farmer-form-submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Add Farmer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FarmerForm;
