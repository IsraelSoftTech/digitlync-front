import React, { useCallback, useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { api } from '../../api';
import ConfirmModal from './ConfirmModal';
import './BookingsList.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

function BookingsList({ onSelectBooking, onAddBooking, onBookingDeleted }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (unassignedOnly) params.unassigned = '1';
    const { data, error: err } = await api.getBookings(params);
    if (err) setError(err);
    else setBookings(data?.bookings ?? []);
    setLoading(false);
  }, [statusFilter, unassignedOnly]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');
  const statusClass = (s) => `booking-status booking-status-${(s || 'pending').replace('_', '-')}`;

  const handleDeleteClick = (b, e) => {
    e.stopPropagation();
    setDeleteTarget(b);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: err } = await api.deleteBooking(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (!err) {
      fetchBookings();
      onBookingDeleted?.();
    }
  };

  const handleCancelDelete = () => {
    if (!deleting) setDeleteTarget(null);
  };

  return (
    <div className="bookings-list">
      <div className="bookings-list-header">
        <div>
          <h2 className="bookings-list-title">Bookings</h2>
          <p className="bookings-list-hint">Bookings are created via the WhatsApp bot. Click a booking to assign a provider or update status.</p>
        </div>
        {onAddBooking && (
          <button type="button" className="bookings-add-btn" onClick={onAddBooking}>+ Add Booking</button>
        )}
      </div>
      <div className="bookings-filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bookings-filter-select">
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || 'all'} value={o.value}>{o.label}</option>
          ))}
        </select>
        <label className="bookings-filter-check">
          <input type="checkbox" checked={unassignedOnly} onChange={(e) => setUnassignedOnly(e.target.checked)} />
          Needs matching
        </label>
        <select className="bookings-filter-select" disabled title="By crop (future)">
          <option>All crops</option>
        </select>
        <select className="bookings-filter-select" disabled title="By service (future)">
          <option>All services</option>
        </select>
      </div>
      {loading && <div className="bookings-loading">Loading...</div>}
      {error && <div className="bookings-error">{error}</div>}
      {!loading && !error && (
        <>
          {bookings.length === 0 ? (
            <p className="bookings-empty">No bookings yet.</p>
          ) : (
            <>
              <div className="bookings-cards">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bookings-card"
                    onClick={() => onSelectBooking(b)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectBooking(b)}
                  >
                    <div className="bookings-card-top">
                      <span className="bookings-card-service">{b.service_type || 'Service'}</span>
                      <div className="bookings-card-actions">
                        <span className={statusClass(b.status)}>{b.status || 'pending'}</span>
                        <button
                          type="button"
                          className="bookings-trash-btn"
                          onClick={(e) => handleDeleteClick(b, e)}
                          title="Delete booking"
                          aria-label="Delete booking"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className="bookings-card-meta">
                      <span>{b.farmer_name || '—'} → {b.provider_name || (!b.provider_id ? 'Needs matching' : '—')}</span>
                      <span>{formatDate(b.scheduled_date)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bookings-table-wrap">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Farmer</th>
                      <th>Provider</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="bookings-table-actions-col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} onClick={() => onSelectBooking(b)} className="bookings-row">
                        <td>{b.service_type || '—'}</td>
                        <td>{b.farmer_name || '—'}</td>
                        <td>{b.provider_name || '—'}</td>
                        <td>{formatDate(b.scheduled_date)}</td>
                        <td><span className={statusClass(b.status)}>{b.status || 'pending'}</span></td>
                        <td className="bookings-table-actions-col" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="bookings-trash-btn"
                            onClick={(e) => handleDeleteClick(b, e)}
                            title="Delete booking"
                            aria-label="Delete booking"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Booking"
        message={deleteTarget
          ? `Are you sure you want to delete this booking? ${deleteTarget.service_type || 'Service'} — ${deleteTarget.farmer_name || 'Farmer'} → ${deleteTarget.provider_name || 'Provider'}. This cannot be undone.`
          : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleting}
        loadingLabel="Deleting..."
      />
    </div>
  );
}

export default BookingsList;
