import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import './ProviderForm.css';

function ProviderForm({ provider, onSuccess, onCancel }) {
  const isEdit = !!provider;
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    services_offered: '',
    work_capacity_ha_per_hour: '',
    base_price_per_ha: '',
    equipment_type: '',
    service_radius_km: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (provider) {
      setForm({
        full_name: provider.full_name || '',
        phone: provider.phone || '',
        services_offered: provider.services_offered || '',
        work_capacity_ha_per_hour: provider.work_capacity_ha_per_hour ?? '',
        base_price_per_ha: provider.base_price_per_ha ?? '',
        equipment_type: provider.equipment_type || '',
        service_radius_km: provider.service_radius_km ?? '',
        notes: provider.notes || '',
      });
    }
  }, [provider]);

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
      work_capacity_ha_per_hour: form.work_capacity_ha_per_hour ? parseFloat(form.work_capacity_ha_per_hour) : null,
      base_price_per_ha: form.base_price_per_ha ? parseFloat(form.base_price_per_ha) : null,
      service_radius_km: form.service_radius_km ? parseFloat(form.service_radius_km) : null,
    };
    const { data, error: err } = isEdit
      ? await api.updateProvider(provider.id, payload)
      : await api.createProvider(payload);
    setSaving(false);
    if (err) setError(err);
    else onSuccess?.(data);
  };

  return (
    <div className="provider-form">
      <h2 className="provider-form-title">{isEdit ? 'Edit Provider' : 'Add Provider'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="provider-form-error">{error}</p>}
        <div className="provider-form-grid">
          <div className="provider-form-field">
            <label htmlFor="full_name">Full Name *</label>
            <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Provider's full name" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="phone">Phone (WhatsApp) *</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="WhatsApp number" />
          </div>
          <div className="provider-form-field provider-form-full">
            <label htmlFor="services_offered">Services Offered</label>
            <input id="services_offered" name="services_offered" value={form.services_offered} onChange={handleChange} placeholder="e.g. Plowing, Harvesting" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="work_capacity_ha_per_hour">Work Capacity (ha/hr)</label>
            <input id="work_capacity_ha_per_hour" name="work_capacity_ha_per_hour" type="number" step="0.1" min="0" value={form.work_capacity_ha_per_hour} onChange={handleChange} placeholder="e.g. 2.5" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="base_price_per_ha">Base Price per ha (FCFA)</label>
            <input id="base_price_per_ha" name="base_price_per_ha" type="number" min="0" value={form.base_price_per_ha} onChange={handleChange} placeholder="e.g. 25000" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="equipment_type">Equipment Type</label>
            <input id="equipment_type" name="equipment_type" value={form.equipment_type} onChange={handleChange} placeholder="e.g. Tractor, Combine" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="service_radius_km">Service Radius (km)</label>
            <input id="service_radius_km" name="service_radius_km" type="number" step="0.1" min="0" value={form.service_radius_km} onChange={handleChange} placeholder="e.g. 50" />
          </div>
        </div>
        <div className="provider-form-field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional notes" />
        </div>
        <div className="provider-form-actions">
          <button type="button" className="provider-form-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="provider-form-submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update' : 'Add Provider'}</button>
        </div>
      </form>
    </div>
  );
}

export default ProviderForm;
