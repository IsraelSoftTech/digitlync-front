import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ConfirmWork() {
  const q = useQuery();
  const token = q.get('t') || q.get('token') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
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

  async function handleSubmit(decision) {
    setSubmitting(true);
    const res = await api.submitFarmerConfirmation(token, decision);
    setSubmitting(false);
    if (res.error) setError(res.error);
    else setSubmitted(true);
  }

  if (loading) return <div style={{padding:20}}>Loading…</div>;
  if (error) return <div style={{padding:20}}>Error: {String(error)}</div>;
  if (submitted)
    return (
      <div style={{ padding: 20 }}>
        <h2>Thanks — your decision was submitted</h2>
        <p>Admin will review and process payment accordingly.</p>
        <p>
          <button onClick={() => navigate('/')}>Return to homepage</button>
        </p>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Confirm Work</h2>
      <p>
        Booking #{booking.id} — Provider: <strong>{booking.provider_name || 'Unassigned'}</strong>
      </p>
      <p>Service: {booking.service_type}</p>
      <div style={{ marginTop: 12 }}>
        <button disabled={submitting} onClick={() => handleSubmit('confirm')} style={{ marginRight: 8 }}>
          Confirm
        </button>
        <button disabled={submitting} onClick={() => handleSubmit('reject')}>
          Reject
        </button>
      </div>
    </div>
  );
}
