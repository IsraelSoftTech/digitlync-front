import React, { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { api } from '../../api';
import './ConfirmationsPayments.css';

function WorkConfirmation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await api.getWorkConfirmations();
    if (err) setError(err);
    else setItems(data?.bookings || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleConfirmWork = async (id) => {
    if (!window.confirm(`Confirm that work is complete for booking #${id}? Payment will be released to the provider.`)) return;
    setConfirming(id);
    const { error: err } = await api.confirmWork(id);
    setConfirming(null);
    if (err) return setError(err);
    fetchItems();
    alert('Work confirmed and payment released to provider.');
  };

  return (
    <div className="confirm-payments">
      <div className="confirm-payments-header">
        <h2>Work Confirmation</h2>
        <button type="button" className="confirm-refresh" onClick={fetchItems} title="Refresh">
          <FiRefreshCw />
        </button>
      </div>
      <p className="confirm-subtitle">Bookings where escrow is paid and the farmer has not yet confirmed completion.</p>
      {loading && <div>Loading...</div>}
      {error && <div className="confirm-error">{error}</div>}
      {!loading && !error && (
        <table className="confirm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Farmer</th>
              <th>Provider</th>
              <th>Amount (FCFA)</th>
              <th>Scheduled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.service_type}</td>
                <td>{b.farmer_name}</td>
                <td>{b.provider_name || '—'}</td>
                <td>{b.farmer_payable_amount_fcfa?.toLocaleString() || '—'}</td>
                <td>{b.scheduled_date || '—'}</td>
                <td>
                  <button type="button" disabled={confirming === b.id} onClick={() => handleConfirmWork(b.id)}>
                    {confirming === b.id ? 'Confirming...' : 'Confirm Work'}
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7}>No jobs awaiting work confirmation.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkConfirmation;
