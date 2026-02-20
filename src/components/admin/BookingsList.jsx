import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';
import './BookingsList.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function BookingsList({ onSelectBooking, onAddBooking }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    const { data, error: err } = await api.getBookings(params);
    if (err) setError(err);
    else setBookings(data?.bookings ?? []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');
  const statusClass = (s) => `booking-status booking-status-${(s || 'pending').replace('_', '-')}`;

  return (
    <div className="bookings-list">
      <div className="bookings-list-header">
        <h2 className="bookings-list-title">Bookings</h2>
        <button type="button" className="bookings-add-btn" onClick={onAddBooking}>
          New Booking
        </button>
      </div>
      <div className="bookings-filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bookings-filter-select"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || 'all'} value={o.value}>{o.label}</option>
          ))}
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
                      <span className={statusClass(b.status)}>{b.status || 'pending'}</span>
                    </div>
                    <div className="bookings-card-meta">
                      <span>{b.farmer_name || '—'} → {b.provider_name || '—'}</span>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BookingsList;
