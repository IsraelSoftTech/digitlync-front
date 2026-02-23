import React from 'react';
import SharedFooter from '../SharedFooter';
import './HowItWorks.css';

function HowItWorks({ onAdminLogin }) {
  return (
    <div className="page-wrap page-layout">
      <section className="how-page">
        <div className="how-inner">
          <h1 className="how-title anim-page-enter">How It Works</h1>
          <p className="how-subtitle anim-page-enter anim-delay-1">Current version – grounded and real</p>
          <p className="how-intro anim-page-enter anim-delay-2">
            Getting started with DigiLync is simple. Farmers and providers register via WhatsApp, 
            and the coordination engine handles matching and confirmation. No app download required.
          </p>
          <div className="how-steps">
            <div className="how-step anim-page-enter anim-delay-3"><span className="how-num">1</span><p>Register via WhatsApp</p></div>
            <div className="how-step anim-page-enter anim-delay-4"><span className="how-num">2</span><p>Request service</p></div>
            <div className="how-step anim-page-enter anim-delay-5"><span className="how-num">3</span><p>Provider confirms</p></div>
            <div className="how-step anim-page-enter anim-delay-6"><span className="how-num">4</span><p>Service completed</p></div>
          </div>
          <p className="how-outro anim-page-enter anim-delay-7">
            Reminders are sent automatically. Ratings are collected after completion. 
            Admin oversight ensures quality and resolves any issues.
          </p>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default HowItWorks;
