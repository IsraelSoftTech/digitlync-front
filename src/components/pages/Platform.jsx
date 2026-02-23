import React from 'react';
import SharedFooter from '../SharedFooter';
import './Platform.css';

function Platform({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="platform-page">
        <div className="platform-inner">
          <h1 className="platform-title anim-page-enter">The DigiLync Platform</h1>
          <p className="platform-subtitle anim-page-enter anim-delay-1">Layered infrastructure for agricultural coordination</p>
          <p className="platform-intro anim-page-enter anim-delay-2">
            DigiLync is built as a modular system. Each layer adds capability while the core coordination engine 
            remains live and operational. This approach ensures continuous value delivery as we expand.
          </p>
          <div className="platform-layers">
            <div className="platform-layer live anim-page-enter anim-delay-3">
              <span className="platform-badge">Live</span>
              <h3>Layer 1 – Coordination Engine</h3>
              <ul>
                <li>WhatsApp onboarding</li>
                <li>Service booking</li>
                <li>Provider confirmation</li>
                <li>Admin oversight</li>
              </ul>
            </div>
            <div className="platform-layer dev anim-page-enter anim-delay-4">
              <span className="platform-badge">In Development</span>
              <h3>Layer 2 – Geospatial Mapping</h3>
              <ul>
                <li>Geo-tagged farms</li>
                <li>Regional service mapping</li>
                <li>Mechanization density visualization</li>
              </ul>
            </div>
            <div className="platform-layer roadmap anim-page-enter anim-delay-5">
              <span className="platform-badge">Roadmap</span>
              <h3>Layer 3 – AI Matching & Capacity Intelligence</h3>
              <ul>
                <li>Intelligent service matching</li>
                <li>Availability optimization</li>
                <li>Demand forecasting</li>
                <li>Production clustering</li>
              </ul>
            </div>
            <div className="platform-layer planned anim-page-enter anim-delay-6">
              <span className="platform-badge">Planned</span>
              <h3>Layer 4 – Supply Aggregation & Industrial Integration</h3>
              <ul>
                <li>Aggregated crop supply</li>
                <li>Structured sourcing</li>
                <li>Industrial buyer linkage</li>
                <li>Institutional dashboards</li>
              </ul>
            </div>
          </div>
          <p className="platform-outro anim-page-enter anim-delay-7">
            All non-live features are clearly labeled. We maintain transparency about development stages 
            while delivering reliable coordination today.
          </p>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Platform;
