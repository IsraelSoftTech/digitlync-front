import React from 'react';
import SharedFooter from '../SharedFooter';
import LiveMetrics from '../LiveMetrics';
import './Metrics.css';

function Metrics({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="metrics-page">
        <div className="metrics-inner">
          <h1 className="metrics-title anim-page-enter">Live Platform Metrics</h1>
          <p className="metrics-intro anim-page-enter anim-delay-1">
            Real-time coordination data from the DigiLync platform.
          </p>
          <div className="metrics-live-wrap anim-page-enter anim-delay-2">
            <LiveMetrics />
          </div>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Metrics;
