import React from 'react';
import SharedFooter from '../SharedFooter';
import './Services.css';

function Services({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="services-page">
        <div className="services-inner">
          <h1 className="services-title anim-page-enter">Services Offered</h1>
          <div className="services-grid">
            <div className="services-category anim-page-enter anim-delay-1">
              <h3>Pre-Production</h3>
              <ul><li>Land clearing</li><li>Plowing</li><li>Harrowing</li><li>Ridging</li></ul>
            </div>
            <div className="services-category anim-page-enter anim-delay-2">
              <h3>Planting & Inputs</h3>
              <ul><li>Mechanical planting</li><li>Fertilizer spreading</li><li>Seed drilling</li></ul>
            </div>
            <div className="services-category anim-page-enter anim-delay-3">
              <h3>Crop Management</h3>
              <ul><li>Spraying</li><li>Drone application</li><li>Irrigation installation</li></ul>
            </div>
            <div className="services-category">
              <h3>Harvesting</h3>
              <ul><li>Combine harvesting</li><li>Shelling</li><li>Threshing</li></ul>
            </div>
            <div className="services-category anim-page-enter anim-delay-5">
              <h3>Post-Harvest</h3>
              <ul><li>Drying</li><li>Storage</li><li>Processing</li><li>Cold room access</li></ul>
            </div>
            <div className="services-category anim-page-enter anim-delay-6">
              <h3>Logistics</h3>
              <ul><li>Farm-to-market transport</li><li>Produce aggregation</li></ul>
            </div>
          </div>
          <p className="services-outro anim-page-enter anim-delay-7">
            All services are bookable via WhatsApp. Farmers register once and can request any service 
            from our verified provider network.
          </p>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Services;
