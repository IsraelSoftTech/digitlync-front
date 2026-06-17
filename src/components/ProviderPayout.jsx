import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProviderPayout() {
  const q = useQuery();
  const token = q.get('t') || q.get('token') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState('mtn_momo');
  const [number, setNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Missing token');
      setLoading(false);
      return;
    }
    let mounted = true;
    api.getPortalInfo(token).then((res) => {
      if (!mounted) return;
      if (res.error) setError(res.error);
      else setBooking(res.data.booking);
      setLoading(false);
    });
    return () => (mounted = false);
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await api.submitProviderPayout(token, method, number);
    setSubmitting(false);
    if (res.error) setError(res.error);
    else setSubmitted(true);
  }

  if (loading) return <div style={{padding:20}}>Loading…</div>;
  if (error) return <div style={{padding:20}}>Error: {String(error)}</div>;
  if (submitted)
    return (
      <div style={{ padding: 20 }}>
        <h2>Thanks — payout details submitted</h2>
        <p>Admin will review and release payment to the provided method.</p>
        <p>
          <button onClick={() => navigate('/')}>Return to homepage</button>
        </p>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Provide Payout Details</h2>
      <p>Booking #{booking.id} — Farmer: <strong>{booking.farmer_name || '—'}</strong></p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: 8 }}>
          <label>Payment method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="mtn_momo">MTN Momo</option>
            <option value="orange_money">Orange Money</option>
          </select>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Phone number (include country code)</label>
          <br />
          <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+2376xxxxxxx" />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={submitting}>Submit</button>
        </div>
      </form>
    </div>
  );
}
