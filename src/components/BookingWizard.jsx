import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function BookingWizard() {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ farmer_id: '', provider_id: '', service_type: '', scheduled_date: '', scheduled_time: '', farm_size_ha: '', budget_min_fcfa: '', budget_max_fcfa: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      const r = await api.getProviders({});
      if (!r.error) setProviders(r.data?.providers || r.data || []);
    };
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const payload = { ...form };
    const res = await api.createBooking(payload);
    setLoading(false);
    if (!res.error) {
      setMessage({ type: 'success', text: `Booking created (ID ${res.data.id})` });
      setForm({ farmer_id: '', provider_id: '', service_type: '', scheduled_date: '', scheduled_time: '', farm_size_ha: '', budget_min_fcfa: '', budget_max_fcfa: '' });
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  };

  return (
    <div className="booking-wizard">
      <h3>Quick Booking</h3>
      {message && <div className={message.type === 'error' ? 'alert-error' : 'alert-success'}>{message.text}</div>}
      <form onSubmit={submit}>
        <label>Farmer ID: <input value={form.farmer_id} onChange={(e) => setForm({ ...form, farmer_id: e.target.value })} required /></label>
        <label>Service Type: <input value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} required /></label>
        <label>Provider: <select value={form.provider_id} onChange={(e) => setForm({ ...form, provider_id: e.target.value })}>
          <option value="">(Any)</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>{p.full_name} — {p.services_offered}</option>
          ))}
        </select></label>
        <label>Scheduled date: <input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} required /></label>
        <label>Scheduled time: <input type="time" value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} /></label>
        <label>Farm size (ha): <input type="number" step="0.01" value={form.farm_size_ha} onChange={(e) => setForm({ ...form, farm_size_ha: e.target.value })} /></label>
        <label>Budget min (FCFA): <input type="number" value={form.budget_min_fcfa} onChange={(e) => setForm({ ...form, budget_min_fcfa: e.target.value })} /></label>
        <label>Budget max (FCFA): <input type="number" value={form.budget_max_fcfa} onChange={(e) => setForm({ ...form, budget_max_fcfa: e.target.value })} /></label>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Booking'}</button>
        </div>
      </form>
    </div>
  );
}
