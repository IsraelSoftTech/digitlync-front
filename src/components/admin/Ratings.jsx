import React from 'react';
import './Ratings.css';

function Ratings() {
  return (
    <div className="ratings-section">
      <h2 className="ratings-title">Ratings & Feedback</h2>
      <div className="ratings-placeholder">
        <p>Farmer ratings and provider performance metrics will appear here once the booking workflow is active.</p>
        <p className="ratings-hint">Tracked automatically: on-time completion, job success rate, dispute frequency, repeat clients.</p>
      </div>
    </div>
  );
}

export default Ratings;
