import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import './BookingDetail.css';

const STATUS_OPTIONS = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];

function BookingDetail({ bookingId, onBack, onUpdate }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    (async () => {
      const { data, error: err } = await api.getBooking(bookingId);
      if (err) setError(err);
      else {
        setBooking(data);
        setStatus(data.status || 'pending');
      }
      setLoading(false);
    })();
  }, [bookingId]);

  const handleStatusUpdate = async () => {
    if (!bookingId) return;
    setSaving(true);
    const { data, error: err } = await api.updateBooking(bookingId, { status });
    setSaving(false);
    if (!err) {
      setBooking((b) => (b ? { ...b, status: data.status } : null));
      setEditing(false);
      onUpdate?.();
    } else alert(err);
  };

  if (loading) return <div className="booking-detail-loading">Loading...</div>;
  if (error) return <div className="booking-detail-error">{error}</div>;
  if (!booking) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');
  const statusClass = (s) => `booking-status booking-status-${(s || 'pending').replace('_', '-')}`;

  return (
    <div className="booking-detail">
      <div className="booking-detail-header">
        <button type="button" className="booking-detail-back" onClick={onBack}>← Back</button>
      </div>
      <h2 className="booking-detail-title">Booking #{booking.id}</h2>
      <div className="booking-detail-grid">
        <div className="booking-detail-section">
          <h3>Details</h3>
          <dl>
            <dt>Service</dt>
            <dd>{booking.service_type || '—'}</dd>
            <dt>Status</dt>
            <dd>
              {editing ? (
                <div className="booking-detail-status-edit">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>{STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}</select>
                  <button type="button" onClick={handleStatusUpdate} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={() => { setEditing(false); setStatus(booking.status); }}>Cancel</button>
                </div>
              ) : (
                <span><span className={statusClass(booking.status)}>{booking.status || 'pending'}</span> <button type="button" className="booking-detail-edit-btn" onClick={() => setEditing(true)}>Edit</button></span>
              )}
            </dd>
            <dt>Scheduled Date</dt>
            <dd>{formatDate(booking.scheduled_date)}</dd>
            <dt>Farm Size (ha)</dt>
            <dd>{booking.farm_size_ha != null ? booking.farm_size_ha : '—'}</dd>
          </dl>
        </div>
        <div className="booking-detail-section">
          <h3>Farmer</h3>
          <dl>
            <dt>Name</dt>
            <dd>{booking.farmer_name || '—'}</dd>
            <dt>Phone</dt>
            <dd>{booking.farmer_phone || '—'}</dd>
            <dt>Village</dt>
            <dd>{booking.farmer_village || '—'}</dd>
          </dl>
        </div>
        <div className="booking-detail-section">
          <h3>Provider</h3>
          <dl>
            <dt>Name</dt>
            <dd>{booking.provider_name || '—'}</dd>
            <dt>Phone</dt>
            <dd>{booking.provider_phone || '—'}</dd>
            <dt>Services</dt>
            <dd>{booking.services_offered || '—'}</dd>
          </dl>
        </div>
        {booking.notes && (
          <div className="booking-detail-section">
            <h3>Notes</h3>
            <p>{booking.notes}</p>
          </div>
        )}
      </div>
      <p className="booking-detail-meta">Created {formatDate(booking.created_at)}</p>
    </div>
  );
}

export default BookingDetail;
