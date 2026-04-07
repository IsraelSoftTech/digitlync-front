import React from 'react';
import LandingMap from '../LandingMap';
import SharedFooter from '../SharedFooter';
import './Geospatial.css';

function Geospatial() {
  return (
    <div className="page-wrap page-layout">
      <section className="geospatial-page">
        <div className="geospatial-inner">
          <h1 className="geospatial-title anim-page-enter">Geospatial Agricultural Intelligence</h1>
          <p className="geospatial-desc anim-page-enter anim-delay-1">
            Farmfleet geo-tags farms and mechanized service providers to build structured regional production maps.
          </p>
          <p className="geospatial-intro anim-page-enter anim-delay-2">
            Geographic intelligence enables better matching, coverage planning, and supply chain visibility. 
            Our mapping module supports district-level analysis and identification of farm locations.
          </p>
          <div className="geospatial-visual geospatial-map-wrap anim-page-enter anim-delay-3">
            <LandingMap />
          </div>
          <p className="geospatial-outro anim-page-enter anim-delay-4">
            Real farm locations from the Farmfleet platform. Add farmers with GPS coordinates in the admin dashboard to see them here.
          </p>
        </div>
      </section>
      <SharedFooter />
    </div>
  );
}

export default Geospatial;
