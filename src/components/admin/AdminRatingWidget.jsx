import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { FiStar } from 'react-icons/fi';
import './AdminRatingWidget.css';

function AdminRatingWidget({ rateeType, rateeId }) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!rateeId) return;
    (async () => {
      const { data } = await api.getAdminRatings(rateeType, rateeId);
      const ratings = data?.ratings ?? [];
      const latest = ratings[0];
      if (latest) {
        setExisting(latest);
        setRating(latest.rating);
        setNotes(latest.notes || '');
      }
      setLoading(false);
    })();
  }, [rateeType, rateeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setMessage('Please select a rating between 1 and 5');
      return;
    }
    setSaving(true);
    setMessage('');
    const { data, error } = await api.submitAdminRating({
      ratee_type: rateeType,
      ratee_id: rateeId,
      rating: parseFloat(rating),
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (error) setMessage(error);
    else {
      setExisting(data);
      setMessage('Rating saved.');
    }
  };

  if (loading) return <div className="admin-rating-loading">Loading...</div>;

  return (
    <div className="admin-rating-widget">
      <h3 className="admin-rating-title">
        <FiStar /> Admin Rating
      </h3>
      {existing && (
        <p className="admin-rating-existing">
          Current: {existing.rating}/5 {existing.notes && `— ${existing.notes}`}
        </p>
      )}
      <form onSubmit={handleSubmit} className="admin-rating-form">
        <div className="admin-rating-stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={`admin-rating-star ${rating >= s ? 'active' : ''}`}
              onClick={() => setRating(s)}
              aria-label={`Rate ${s} stars`}
            >
              <FiStar />
            </button>
          ))}
        </div>
        <div className="admin-rating-field">
          <label htmlFor="admin-rating-notes">Notes (optional)</label>
          <textarea
            id="admin-rating-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Reliable, good communication"
          />
        </div>
        {message && <p className={`admin-rating-msg ${message.includes('saved') ? 'success' : 'error'}`}>{message}</p>}
        <button type="submit" className="admin-rating-submit" disabled={saving}>
          {saving ? 'Saving...' : existing ? 'Update Rating' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
}

export default AdminRatingWidget;
