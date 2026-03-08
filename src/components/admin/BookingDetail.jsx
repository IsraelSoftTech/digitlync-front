import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { api } from '../../api';
import ConfirmModal from './ConfirmModal';
import './BookingDetail.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled'];

function BookingDetail({ bookingId, onBack, onUpdate }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [providers, setProviders] = useState([]);
  const [assignProviderId, setAssignProviderId] = useState('');
  const [assigning, setAssigning] = useState(false);

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

  useEffect(() => {
    (async () => {
      const { data } = await api.getProviders();
      setProviders(data?.providers ?? []);
    })();
  }, []);

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

  const handleAssignProvider = async () => {
    if (!bookingId || !assignProviderId) return;
    setAssigning(true);
    const { error: err } = await api.updateBooking(bookingId, { provider_id: parseInt(assignProviderId, 10) });
    setAssigning(false);
    if (!err) {
      const { data } = await api.getBooking(bookingId);
      if (data) setBooking(data);
      setAssignProviderId('');
      onUpdate?.();
    } else alert(err);
  };

  const handleDelete = async () => {
    if (!bookingId) return;
    setDeleting(true);
    const { error: err } = await api.deleteBooking(bookingId);
    setDeleting(false);
    setShowDeleteModal(false);
    if (!err) {
      onBack?.();
      onUpdate?.();
    } else alert(err);
  };

  if (loading) return <div className="booking-detail-loading">Loading...</div>;
  if (error) return <div className="booking-detail-error">{error}</div>;
  if (!booking) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');
  const formatTime = (t) => (t ? (typeof t === 'string' && t.includes(':') ? t.substring(0, 5) : t) : '—');
  const statusClass = (s) => `booking-status booking-status-${(s || 'pending').replace('_', '-')}`;

  return (
    <div className="booking-detail">
      <div className="booking-detail-header">
        <button type="button" className="booking-detail-back" onClick={onBack}>← Back</button>
        <button
          type="button"
          className="booking-detail-trash-btn"
          onClick={() => setShowDeleteModal(true)}
          title="Delete booking"
          aria-label="Delete booking"
        >
          <FiTrash2 /> Delete
        </button>
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
            <dt>Scheduled Time</dt>
            <dd>{formatTime(booking.scheduled_time)}</dd>
            <dt>Farm Produce Type</dt>
            <dd>{booking.farm_produce_type || '—'}</dd>
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
          {!booking.provider_id && booking.status === 'pending' ? (
            <div className="booking-detail-assign">
              <p className="booking-detail-assign-hint">No provider assigned. Select one to notify via WhatsApp:</p>
              <div className="booking-detail-assign-row">
                <select
                  value={assignProviderId}
                  onChange={(e) => setAssignProviderId(e.target.value)}
                  className="booking-detail-assign-select"
                >
                  <option value="">Select provider</option>
                  {(() => {
                    const filtered = providers.filter((p) =>
                      !booking.service_type || (p.services_offered || '').toLowerCase().includes((booking.service_type || '').toLowerCase())
                    );
                    const list = filtered.length > 0 ? filtered : providers;
                    return list.map((p) => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.services_offered || '—'})</option>
                    ));
                  })()}
                </select>
                <button
                  type="button"
                  className="booking-detail-assign-btn"
                  onClick={handleAssignProvider}
                  disabled={!assignProviderId || assigning}
                >
                  {assigning ? 'Assigning...' : 'Assign & Notify'}
                </button>
              </div>
              {providers.length === 0 && <p className="booking-detail-assign-empty">No providers registered yet.</p>}
            </div>
          ) : (
            <dl>
              <dt>Name</dt>
              <dd>{booking.provider_name || '—'}</dd>
              <dt>Phone</dt>
              <dd>{booking.provider_phone || '—'}</dd>
              <dt>Services</dt>
              <dd>{booking.services_offered || '—'}</dd>
            </dl>
          )}
        </div>
        {booking.notes && (
          <div className="booking-detail-section">
            <h3>Notes</h3>
            <p>{booking.notes}</p>
          </div>
        )}
      </div>
      <p className="booking-detail-meta">Created {formatDate(booking.created_at)}</p>
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Booking"
        message={`Are you sure you want to delete Booking #${booking.id}? ${booking.service_type || 'Service'} — ${booking.farmer_name || 'Farmer'} → ${booking.provider_name || 'Provider'}. This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => !deleting && setShowDeleteModal(false)}
        loading={deleting}
        loadingLabel="Deleting..."
      />
    </div>
  );
}

export default BookingDetail;
