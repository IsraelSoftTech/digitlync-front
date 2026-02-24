import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { CROPS, FARMER_SERVICE_NEEDS, COUNTRIES, REGIONS_CAMEROON, REGIONS_GENERIC, DIVISIONS_SAMPLE, DISTRICTS_SAMPLE } from '../../constants/lookups';
import './FarmerForm.css';

function FarmerForm({ farmer, onSuccess, onCancel }) {
  const isEdit = !!farmer;
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    country: '',
    region: '',
    division: '',
    subdivision: '',
    district: '',
    division_other: '',
    district_other: '',
    village: '',
    location: '',
    gps_lat: '',
    gps_lng: '',
    farm_size_ha: '',
    crop_type: '',
    crop_type_other: '',
    service_needs: [],
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const regions = form.country === 'Cameroon' ? REGIONS_CAMEROON : (form.country ? REGIONS_GENERIC : []);
  const divisions = DIVISIONS_SAMPLE;
  const districts = DISTRICTS_SAMPLE;

  useEffect(() => {
    if (farmer) {
      setForm({
        full_name: farmer.full_name || '',
        phone: farmer.phone || '',
        country: farmer.country || '',
        region: farmer.region || '',
        division: DIVISIONS_SAMPLE.includes(farmer.division) ? farmer.division : (farmer.division ? '_other' : ''),
        division_other: farmer.division && !DIVISIONS_SAMPLE.includes(farmer.division) ? farmer.division : '',
        subdivision: farmer.subdivision || '',
        district: DISTRICTS_SAMPLE.includes(farmer.district) ? farmer.district : (farmer.district ? '_other' : ''),
        district_other: farmer.district && !DISTRICTS_SAMPLE.includes(farmer.district) ? farmer.district : '',
        village: farmer.village || '',
        location: farmer.location || '',
        gps_lat: farmer.gps_lat ?? '',
        gps_lng: farmer.gps_lng ?? '',
        farm_size_ha: farmer.farm_size_ha ?? '',
        crop_type: farmer.crop_type || '',
        crop_type_other: CROPS.includes(farmer.crop_type) ? '' : (farmer.crop_type || ''),
        service_needs: Array.isArray(farmer.service_needs) ? farmer.service_needs : (farmer.service_needs ? [farmer.service_needs] : []),
        notes: farmer.notes || '',
      });
    }
  }, [farmer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const handleServiceNeedToggle = (need) => {
    setForm((f) => ({
      ...f,
      service_needs: f.service_needs.includes(need)
        ? f.service_needs.filter((n) => n !== need)
        : [...f.service_needs, need],
    }));
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
    const cropValue = form.crop_type === 'Other' ? (form.crop_type_other?.trim() || null) : (form.crop_type || null);
    const divisionVal = form.division === '_other' || form.division_other ? (form.division_other?.trim() || null) : (form.division?.trim() || null);
    const districtVal = form.district === '_other' || form.district_other ? (form.district_other?.trim() || null) : (form.district?.trim() || null);
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      country: form.country?.trim() || null,
      region: form.region?.trim() || null,
      division: divisionVal,
      subdivision: form.subdivision?.trim() || null,
      district: districtVal,
      village: form.village?.trim() || null,
      location: form.location?.trim() || null,
      gps_lat: form.gps_lat ? parseFloat(form.gps_lat) : null,
      gps_lng: form.gps_lng ? parseFloat(form.gps_lng) : null,
      farm_size_ha: form.farm_size_ha ? parseFloat(form.farm_size_ha) : null,
      crop_type: cropValue,
      service_needs: form.service_needs.length ? form.service_needs : null,
      notes: form.notes?.trim() || null,
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
        </div>

        <div className="farmer-form-section-label">Location (Structured)</div>
        <div className="farmer-form-grid">
          <div className="farmer-form-field">
            <label htmlFor="country">Country</label>
            <select id="country" name="country" value={form.country} onChange={handleChange}>
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="farmer-form-field">
            <label htmlFor="region">Region</label>
            <select id="region" name="region" value={form.region} onChange={handleChange}>
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              {regions.length === 0 && form.country && <option value="">—</option>}
            </select>
          </div>
          <div className="farmer-form-field">
            <label htmlFor="division">Division</label>
            <select id="division" name="division" value={divisions.includes(form.division) ? form.division : (form.division === '_other' || form.division_other ? '_other' : form.division || '')} onChange={(e) => {
              const v = e.target.value;
              if (v === '_other') setForm((f) => ({ ...f, division: '_other', division_other: f.division_other || '' }));
              else setForm((f) => ({ ...f, division: v, division_other: '' }));
            }}>
              <option value="">Select division</option>
              {divisions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="_other">Other</option>
            </select>
            {(form.division === '_other' || (form.division && !divisions.includes(form.division))) && (
              <input
                name="division_other"
                value={form.division_other}
                onChange={(e) => setForm((f) => ({ ...f, division_other: e.target.value }))}
                placeholder="Enter division"
                className="farmer-form-other-input"
              />
            )}
          </div>
          <div className="farmer-form-field">
            <label htmlFor="subdivision">Subdivision</label>
            <input
              id="subdivision"
              name="subdivision"
              value={form.subdivision}
              onChange={handleChange}
              placeholder="Subdivision"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="district">District</label>
            <select id="district" name="district" value={districts.includes(form.district) ? form.district : (form.district === '_other' || form.district_other ? '_other' : form.district || '')} onChange={(e) => {
              const v = e.target.value;
              if (v === '_other') setForm((f) => ({ ...f, district: '_other', district_other: f.district_other || '' }));
              else setForm((f) => ({ ...f, district: v, district_other: '' }));
            }}>
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="_other">Other</option>
            </select>
            {(form.district === '_other' || form.district_other !== undefined) && (
              <input
                name="district_other"
                value={form.district_other}
                onChange={(e) => setForm((f) => ({ ...f, district_other: e.target.value }))}
                placeholder="Enter district"
                className="farmer-form-other-input"
              />
            )}
          </div>
        </div>

        <div className="farmer-form-grid">
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
          <div className="farmer-form-field farmer-form-field-full">
            <label htmlFor="crop_type">Crop Type</label>
            <select id="crop_type" name="crop_type" value={form.crop_type} onChange={handleChange}>
              <option value="">Select crop</option>
              {CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {form.crop_type === 'Other' && (
              <input
                name="crop_type_other"
                value={form.crop_type_other}
                onChange={handleChange}
                placeholder="Specify crop name"
                className="farmer-form-other-input"
              />
            )}
          </div>
        </div>

        <div className="farmer-form-field farmer-form-field-full">
          <label>Service Needs (select all that apply)</label>
          <div className="farmer-form-checkbox-group">
            {FARMER_SERVICE_NEEDS.map((need) => (
              <label key={need} className="farmer-form-checkbox">
                <input
                  type="checkbox"
                  checked={form.service_needs.includes(need)}
                  onChange={() => handleServiceNeedToggle(need)}
                />
                <span>{need}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="farmer-form-grid">
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
