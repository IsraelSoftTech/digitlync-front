import React from 'react';
import { IoMapOutline } from 'react-icons/io5';
import SharedFooter from '../SharedFooter';
import './Geospatial.css';

function Geospatial({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="geospatial-page">
        <div className="geospatial-inner">
          <h1 className="geospatial-title anim-page-enter">Geospatial Agricultural Intelligence</h1>
          <p className="geospatial-desc anim-page-enter anim-delay-1">
            DigiLync geo-tags farms and mechanized service providers to build structured regional production maps.
          </p>
          <p className="geospatial-intro anim-page-enter anim-delay-2">
            Geographic intelligence enables better matching, coverage planning, and supply chain visibility. 
            Our mapping module is in development and will support district-level analysis, service heatmaps, 
            and identification of underserved zones.
          </p>
          <div className="geospatial-visual anim-page-enter anim-delay-3">
            <IoMapOutline className="geospatial-icon" />
            <p>Map-style visualization • Regional production mapping • Clean, minimal preview</p>
          </div>
          <p className="geospatial-outro anim-page-enter anim-delay-4">
            No fake analytics. We present real capability with honest development staging.
          </p>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Geospatial;
