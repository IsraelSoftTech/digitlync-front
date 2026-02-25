import React from 'react';
import SharedFooter from '../SharedFooter';
import './Credibility.css';

function Credibility({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="credibility-page">
        <div className="credibility-inner">
          <h1 className="credibility-title anim-page-enter">Institutional Credibility</h1>
          <div className="credibility-content">
            <p className="credibility-lead anim-page-enter anim-delay-1">
              DigiLync is developed by a women-founded and women-led agritech company headquartered in Buea, Cameroon.
            </p>
            <p className="anim-page-enter anim-delay-2">
              We have deployed three field pilots in Meme Division (Kumba, Mabonji, and Malende), testing structured agricultural service coordination in real rural environments.
            </p>
            <p className="anim-page-enter anim-delay-3">
              Our team combines expertise in agricultural engineering, geospatial systems, AI-enabled platform development, and development-sector financial management — with a combined 3 decades of experience working directly with smallholder farmers and public agricultural institutions.
            </p>
            <p className="credibility-tagline anim-page-enter anim-delay-4">
              We build digital coordination infrastructure grounded in field realities — not theory.
            </p>
          </div>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Credibility;
