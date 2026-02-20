import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import './AddBookingForm.css';

function AddBookingForm({ onSuccess, onCancel }) {
  const [farmers, setFarmers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    farmer_id: '',
    provider_id: '',
    service_type: '',
    scheduled_date: '',
    farm_size_ha: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const [fRes, pRes] = await Promise.all([api.getFarmers(), api.getProviders()]);
      setFarmers(fRes.data?.farmers ?? []);
      setProviders(pRes.data?.providers ?? []);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.farmer_id || !form.provider_id) {
      setError('Farmer and provider are required');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      farmer_id: parseInt(form.farmer_id, 10),
      provider_id: parseInt(form.provider_id, 10),
      service_type: form.service_type?.trim() || null,
      scheduled_date: form.scheduled_date || null,
      farm_size_ha: form.farm_size_ha ? parseFloat(form.farm_size_ha) : null,
      notes: form.notes?.trim() || null,
    };
    const { data, error: err } = await api.createBooking(payload);
    setSaving(false);
    if (err) setError(err);
    else onSuccess?.(data);
  };

  return (
    <div className="add-booking-form">
      <h2 className="add-booking-title">New Booking</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="add-booking-error">{error}</p>}
        <div className="add-booking-grid">
          <div className="add-booking-field">
            <label htmlFor="farmer_id">Farmer *</label>
            <select id="farmer_id" name="farmer_id" value={form.farmer_id} onChange={handleChange} required>
              <option value="">Select farmer</option>
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>{f.full_name} ({f.phone})</option>
              ))}
            </select>
          </div>
          <div className="add-booking-field">
            <label htmlFor="provider_id">Provider *</label>
            <select id="provider_id" name="provider_id" value={form.provider_id} onChange={handleChange} required>
              <option value="">Select provider</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name} ({p.services_offered || '—'})</option>
              ))}
            </select>
          </div>
          <div className="add-booking-field">
            <label htmlFor="service_type">Service Type</label>
            <input id="service_type" name="service_type" value={form.service_type} onChange={handleChange} placeholder="e.g. Plowing, Harvesting" />
          </div>
          <div className="add-booking-field">
            <label htmlFor="scheduled_date">Scheduled Date</label>
            <input id="scheduled_date" name="scheduled_date" type="date" value={form.scheduled_date} onChange={handleChange} />
          </div>
          <div className="add-booking-field">
            <label htmlFor="farm_size_ha">Farm Size (ha)</label>
            <input id="farm_size_ha" name="farm_size_ha" type="number" step="0.01" min="0" value={form.farm_size_ha} onChange={handleChange} placeholder="e.g. 2.5" />
          </div>
        </div>
        <div className="add-booking-field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional notes" />
        </div>
        <div className="add-booking-actions">
          <button type="button" className="add-booking-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="add-booking-submit" disabled={saving}>{saving ? 'Creating...' : 'Create Booking'}</button>
        </div>
      </form>
    </div>
  );
}

export default AddBookingForm;
