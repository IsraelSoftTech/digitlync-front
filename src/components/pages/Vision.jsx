import React from 'react';
import SharedFooter from '../SharedFooter';
import './Vision.css';

function Vision({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="vision-page">
        <div className="vision-inner">
          <h1 className="vision-title anim-page-enter">Building Africa's Agricultural Infrastructure Layer</h1>
          <p className="vision-intro anim-page-enter anim-delay-1">
            DigiLync is not just an app – it is infrastructure. We are building the coordination layer 
            that connects Africa's agricultural actors at scale.
          </p>
          <div className="vision-content">
            <p className="anim-page-enter anim-delay-2">Structured capacity coordination across farmers, providers, and buyers.</p>
            <p className="anim-page-enter anim-delay-3">Mechanization optimization for efficient resource use.</p>
            <p className="anim-page-enter anim-delay-4">Supply intelligence for traceability and market linkage.</p>
            <p className="anim-page-enter anim-delay-5">Continental scalability – infrastructure that grows with Africa.</p>
          </div>
          <p className="vision-outro anim-page-enter anim-delay-6">
            This is where our long-term positioning sits. We deliver value today while building 
            toward a continent-wide agricultural coordination system.
          </p>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Vision;
