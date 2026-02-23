import React from 'react';
import logo from '../assets/logo.png';
import AnimateOnScroll from './AnimateOnScroll';
import './SharedFooter.css';

function SharedFooter({ onAdminLogin }) {
  return (
    <footer className="shared-footer">
      <AnimateOnScroll className="shared-footer-inner">
        <div className="shared-footer-brand">
          <img src={logo} alt="DigiLync" className="shared-footer-logo" />
          <span>DigiLync</span>
        </div>
        <div className="shared-footer-links">
          <a href="mailto:contact@digilync.com">Email</a>
          <a href="https://wa.me/237697799186" target="_blank" rel="noopener noreferrer">WhatsApp: +237 697 799 186</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          {onAdminLogin && (
            <button type="button" className="shared-footer-admin-btn" onClick={onAdminLogin}>Admin Login</button>
          )}
        </div>
        <p className="shared-footer-copy">© DigiLync. Powered by Izzy Tech Team.</p>
      </AnimateOnScroll>
    </footer>
  );
}

export default SharedFooter;
