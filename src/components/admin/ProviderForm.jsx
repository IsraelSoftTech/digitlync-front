import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api';
import { FARMER_SERVICE_NEEDS, COUNTRIES, REGIONS_CAMEROON, REGIONS_GENERIC, DIVISIONS_SAMPLE, DISTRICTS_SAMPLE } from '../../constants/lookups';
import './ProviderForm.css';

const emptyService = () => ({
  service_name: '',
  work_capacity_ha_per_hour: '',
  base_price_per_ha: '',
  country: '',
  region: '',
  division: '',
  subdivision: '',
  district: '',
  equipment: [''],
});

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
    services: [emptyService()],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const mapProviderToForm = useCallback((p) => {
    const services = p.services?.length
        ? p.services.map((s) => ({
            service_name: s.service_name || '',
            work_capacity_ha_per_hour: s.work_capacity_ha_per_hour ?? '',
            base_price_per_ha: s.base_price_per_ha ?? '',
            country: s.country || '',
            region: s.region || '',
            division: s.division || '',
            subdivision: s.subdivision || '',
            district: s.district || '',
            equipment: s.equipment?.length ? s.equipment.map((e) => (typeof e === 'object' ? e.equipment_name : e) || '') : [''],
          }))
        : [emptyService()];
    return {
      full_name: p.full_name || '',
      phone: p.phone || '',
      services_offered: p.services_offered || '',
      work_capacity_ha_per_hour: p.work_capacity_ha_per_hour ?? '',
      base_price_per_ha: p.base_price_per_ha ?? '',
      equipment_type: p.equipment_type || '',
      service_radius_km: p.service_radius_km ?? '',
      notes: p.notes || '',
      services,
    };
  }, []);

  useEffect(() => {
    if (provider) {
      const loadProvider = async () => {
        if (!provider.services && provider.id) {
          const { data } = await api.getProvider(provider.id);
          if (data) setForm(mapProviderToForm(data));
          return;
        }
        setForm(mapProviderToForm(provider));
      };
      loadProvider();
    }
  }, [provider, mapProviderToForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const updateService = (idx, field, value) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));
    setError('');
  };

  const updateServiceEquipment = (svcIdx, eqIdx, value) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => {
        if (i !== svcIdx) return s;
        const eq = [...(s.equipment || [''])];
        eq[eqIdx] = value;
        return { ...s, equipment: eq };
      }),
    }));
    setError('');
  };

  const addEquipment = (svcIdx) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => (i === svcIdx ? { ...s, equipment: [...(s.equipment || ['']), ''] } : s)),
    }));
  };

  const removeEquipment = (svcIdx, eqIdx) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => {
        if (i !== svcIdx) return s;
        const eq = (s.equipment || ['']).filter((_, j) => j !== eqIdx);
        return { ...s, equipment: eq.length ? eq : [''] };
      }),
    }));
  };

  const addService = () => {
    setForm((f) => ({ ...f, services: [...f.services, emptyService()] }));
  };

  const removeService = (idx) => {
    if (form.services.length <= 1) return;
    setForm((f) => ({ ...f, services: f.services.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      setError('Full name and phone are required');
      return;
    }
    setSaving(true);
    setError('');
    const servicesPayload = form.services
      .filter((s) => s.service_name?.trim())
      .map((s) => ({
        service_name: s.service_name.trim(),
        work_capacity_ha_per_hour: s.work_capacity_ha_per_hour ? parseFloat(s.work_capacity_ha_per_hour) : null,
        base_price_per_ha: s.base_price_per_ha ? parseFloat(s.base_price_per_ha) : null,
        country: s.country?.trim() || null,
        region: s.region?.trim() || null,
        division: s.division?.trim() || null,
        subdivision: s.subdivision?.trim() || null,
        district: s.district?.trim() || null,
        equipment: (s.equipment || ['']).filter((eq) => eq?.trim()).map((eq) => eq.trim()),
      }));
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      services_offered: form.services_offered?.trim() || null,
      work_capacity_ha_per_hour: form.work_capacity_ha_per_hour ? parseFloat(form.work_capacity_ha_per_hour) : null,
      base_price_per_ha: form.base_price_per_ha ? parseFloat(form.base_price_per_ha) : null,
      equipment_type: form.equipment_type?.trim() || null,
      service_radius_km: form.service_radius_km ? parseFloat(form.service_radius_km) : null,
      notes: form.notes?.trim() || null,
      services: servicesPayload,
    };
    const { data, error: err } = isEdit
      ? await api.updateProvider(provider.id, payload)
      : await api.createProvider(payload);
    setSaving(false);
    if (err) setError(err);
    else onSuccess?.(data);
  };

  const regions = (s) => (s?.country === 'Cameroon' ? REGIONS_CAMEROON : s?.country ? REGIONS_GENERIC : []);

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
          <div className="provider-form-field">
            <label htmlFor="service_radius_km">Service Radius (km)</label>
            <input id="service_radius_km" name="service_radius_km" type="number" step="0.1" min="0" value={form.service_radius_km} onChange={handleChange} placeholder="e.g. 50" />
          </div>
        </div>

        <div className="provider-form-section-label">Services (add multiple)</div>
        {form.services.map((svc, idx) => (
          <div key={idx} className="provider-form-service-block">
            <div className="provider-form-service-header">
              <span>Service {idx + 1}</span>
              <button type="button" className="provider-form-remove-svc" onClick={() => removeService(idx)} disabled={form.services.length <= 1}>
                Remove
              </button>
            </div>
            <div className="provider-form-grid">
              <div className="provider-form-field">
                <label>Service Name</label>
                <select value={svc.service_name} onChange={(e) => updateService(idx, 'service_name', e.target.value)}>
                  <option value="">Select service</option>
                  {FARMER_SERVICE_NEEDS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Work Capacity (ha/hr)</label>
                <input type="number" step="0.1" min="0" value={svc.work_capacity_ha_per_hour} onChange={(e) => updateService(idx, 'work_capacity_ha_per_hour', e.target.value)} placeholder="e.g. 2.5" />
              </div>
              <div className="provider-form-field">
                <label>Base Price/ha (FCFA)</label>
                <input type="number" min="0" value={svc.base_price_per_ha} onChange={(e) => updateService(idx, 'base_price_per_ha', e.target.value)} placeholder="e.g. 25000" />
              </div>
            </div>
            <div className="provider-form-section-label-sm">Service Zone</div>
            <div className="provider-form-grid">
              <div className="provider-form-field">
                <label>Country</label>
                <select value={svc.country} onChange={(e) => updateService(idx, 'country', e.target.value)}>
                  <option value="">Select</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Region</label>
                <select value={svc.region} onChange={(e) => updateService(idx, 'region', e.target.value)}>
                  <option value="">Select</option>
                  {regions(svc).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Division</label>
                <select value={svc.division} onChange={(e) => updateService(idx, 'division', e.target.value)}>
                  <option value="">Select</option>
                  {DIVISIONS_SAMPLE.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Subdivision</label>
                <input value={svc.subdivision} onChange={(e) => updateService(idx, 'subdivision', e.target.value)} placeholder="Subdivision" />
              </div>
              <div className="provider-form-field">
                <label>District</label>
                <select value={svc.district} onChange={(e) => updateService(idx, 'district', e.target.value)}>
                  <option value="">Select</option>
                  {DISTRICTS_SAMPLE.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="provider-form-section-label-sm">Equipment (per service)</div>
            <div className="provider-form-equipment-list">
              {(svc.equipment || ['']).map((eq, eqIdx) => (
                <div key={eqIdx} className="provider-form-equipment-row">
                  <input value={eq} onChange={(e) => updateServiceEquipment(idx, eqIdx, e.target.value)} placeholder="e.g. Tractor, Harrow" />
                  <button type="button" className="provider-form-remove-eq" onClick={() => removeEquipment(idx, eqIdx)} title="Remove">×</button>
                </div>
              ))}
              <button type="button" className="provider-form-add-eq" onClick={() => addEquipment(idx)}>+ Add equipment</button>
            </div>
          </div>
        ))}
        <button type="button" className="provider-form-add-svc" onClick={addService}>+ Add Service</button>

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
