import React from 'react';
import SharedFooter from '../SharedFooter';
import './Impact.css';

function Impact({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="impact-page">
        <div className="impact-inner">
          <h1 className="impact-title anim-page-enter">Impact & Pilot Goals</h1>
          <p className="impact-intro anim-page-enter anim-delay-1">
            DigiLync is designed to scale structured agricultural service delivery across fragile and underserved rural regions.
          </p>
          <div className="impact-grid anim-page-enter anim-delay-2">
            <div className="impact-card">
              <h3>3-Year Target</h3>
              <ul>
                <li><strong>20,000</strong> farmers</li>
                <li><strong>3,000</strong> service providers</li>
              </ul>
            </div>
            <div className="impact-card">
              <h3>Current & Upcoming Pilot Regions</h3>
              <ul>
                <li>Meme Division – Kumba, Mabonji, Malende</li>
                <li>Fako Division – Muyuka, Ombe, Tiko</li>
                <li>Ndian Division</li>
              </ul>
            </div>
            <div className="impact-card">
              <h3>Expected Outcomes</h3>
              <ul>
                <li>Faster and more reliable service scheduling</li>
                <li>Reduced seasonal delays in land preparation and harvesting</li>
                <li>Improved service quality accountability</li>
                <li>Increased visibility of regional production capacity</li>
              </ul>
            </div>
            <div className="impact-card">
              <h3>Key Performance Indicators</h3>
              <ul>
                <li>% reduction in service delays</li>
                <li>% increase in successful service completion</li>
                <li>Farmer satisfaction ratings</li>
                <li>Geographic coverage growth</li>
                <li>Service response time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Impact;
