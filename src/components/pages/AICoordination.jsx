import React from 'react';
import SharedFooter from '../SharedFooter';
import './AICoordination.css';

function AICoordination({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="ai-page">
        <div className="ai-inner">
          <h1 className="ai-title anim-page-enter">AI-Driven Agricultural Coordination</h1>
          <p className="ai-badge anim-page-enter anim-delay-1">AI modules under progressive development</p>
          <p className="ai-intro anim-page-enter anim-delay-2">
            Future capabilities will include intelligent service matching based on distance, availability, 
            and capacity. Demand forecasting and production clustering will support better planning 
            across the agricultural value chain.
          </p>
          <div className="ai-features">
            <div className="ai-feature anim-page-enter anim-delay-3">Matching optimization</div>
            <div className="ai-feature anim-page-enter anim-delay-4">Capacity analysis</div>
            <div className="ai-feature anim-page-enter anim-delay-5">Production clustering</div>
            <div className="ai-feature anim-page-enter anim-delay-6">Supply forecasting</div>
          </div>
          <p className="ai-outro anim-page-enter anim-delay-7">
            We are building AI capabilities responsibly, with clear labeling of development stages 
            and no overpromising of current functionality.
          </p>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default AICoordination;
