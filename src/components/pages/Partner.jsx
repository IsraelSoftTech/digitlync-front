import React from 'react';
import SharedFooter from '../SharedFooter';
import ContactFormInline from '../ContactFormInline';
import './Partner.css';

function Partner({ onAdminLogin }) {
  const scrollToContact = () => {
    const el = document.querySelector('.partner-contact-section');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page-wrap page-layout">
      <section className="partner-page">
        <div className="partner-inner">
          <h1 className="partner-title anim-page-enter">Partner With DigiLync</h1>
          <div className="partner-content">
            <p className="anim-page-enter anim-delay-1">
              We collaborate with governments, development partners, agricultural institutions, cooperatives, and private sector actors to pilot and scale resilient agricultural coordination systems.
            </p>
            <p className="anim-page-enter anim-delay-2">
              If you are working to strengthen food systems, improve rural service delivery, or build digital public infrastructure for agriculture, DigiLync is ready to partner.
            </p>
            <p className="partner-cta-text anim-page-enter anim-delay-3">
              Let's build accountable and scalable agricultural systems together.
            </p>
            <button
              type="button"
              className="partner-explore-btn anim-page-enter anim-delay-4"
              onClick={scrollToContact}
            >
              Explore Partnership
            </button>
          </div>
        </div>
      </section>
      <section className="partner-contact-section">
        <div className="partner-contact-inner">
          <h2 className="partner-contact-title">Get In Touch</h2>
          <div className="partner-contact-grid">
            <div className="partner-contact-info anim-page-enter anim-delay-1">
              <h3>Reach Us</h3>
              <p><strong>Email:</strong> contact@digilync.com</p>
              <p><strong>WhatsApp:</strong> +237 697 799 186</p>
              <p className="partner-contact-note">
                For fastest response, start a conversation on WhatsApp. Farmers and providers can register directly via our WhatsApp bot.
              </p>
            </div>
            <div className="anim-page-enter anim-swipe-right anim-delay-2">
              <ContactFormInline />
            </div>
          </div>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Partner;
