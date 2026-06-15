import React, { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { api } from '../../api';
import './ConfirmationsPayments.css';

function ConfirmationsPayments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [releasing, setReleasing] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const { data, error: err } = await api.getConfirmations();
    if (err) setError(err);
    else setItems(data?.bookings || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleRelease = async (id) => {
    if (!window.confirm('Release payment for booking #' + id + '?')) return;
    setReleasing(id);
    const { error: err } = await api.releasePayment(id);
    setReleasing(null);
    if (err) return setError(err);
    fetch();
    alert('Payment release queued/processed.');
  };

  return (
    <div className="confirm-payments">
      <div className="confirm-payments-header">
        <h2>Confirmations and Payment</h2>
        <div>
          <button type="button" className="confirm-refresh" onClick={fetch} title="Refresh">
            <FiRefreshCw />
          </button>
        </div>
      </div>
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
              <th>Status</th>
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
                <td>{b.status} / {b.payment_status}</td>
                <td>
                  <button type="button" disabled={releasing === b.id} onClick={() => handleRelease(b.id)}>
                    {releasing === b.id ? 'Releasing...' : 'Release Payment'}
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7}>No confirmations or payments pending.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConfirmationsPayments;
