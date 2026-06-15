import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { useParams } from 'react-router-dom';
import { showToast } from './Toaster';
import askConfirm from '../utils/askConfirm';

export default function ProviderCalendar({ providerId }) {
  const params = useParams();
  providerId = providerId || params.id;
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ available_date: '', start_time: '', end_time: '' });

  const load = useCallback(async () => {
    if (!providerId) return;
    setLoading(true);
    const res = await api.getProviderAvailability(providerId || 'me');
    if (!res.error) setSlots(res.data?.slots || []);
    setLoading(false);
  }, [providerId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    const res = await api.createProviderAvailability(providerId, payload);
    if (!res.error) {
      setForm({ available_date: '', start_time: '', end_time: '' });
      showToast('Availability slot created', { type: 'success' });
      load();
    } else {
      showToast(res.error || 'Failed to create slot', { type: 'error' });
    }
  };

  const remove = async (id) => {
    if (!askConfirm('Delete this slot?')) return;
    const res = await api.deleteProviderAvailability(id);
    if (!res.error) {
      showToast('Availability slot deleted', { type: 'success' });
      load();
    } else showToast(res.error || 'Failed to delete', { type: 'error' });
  };

  if (!providerId) return <div>Please provide a `providerId` prop to manage availability.</div>;

  return (
    <div className="provider-calendar">
      <h3>Availability slots</h3>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div>
          <ul>
            {slots.map((s) => (
              <li key={s.id}>
                <strong>{s.available_date}</strong> {s.start_time}–{s.end_time}{' '}
                <button onClick={() => remove(s.id)}>Delete</button>
              </li>
            ))}
            {slots.length === 0 && <li>No slots defined.</li>}
          </ul>

          <form onSubmit={submit} style={{ marginTop: 12 }}>
            <label>
              Date: <input type="date" value={form.available_date} onChange={(e) => setForm({ ...form, available_date: e.target.value })} required />
            </label>
            <label style={{ marginLeft: 8 }}>
              Start: <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
            </label>
            <label style={{ marginLeft: 8 }}>
              End: <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
            </label>
            <button style={{ marginLeft: 8 }} type="submit">Add slot</button>
          </form>
        </div>
      )}
    </div>
  );
}
