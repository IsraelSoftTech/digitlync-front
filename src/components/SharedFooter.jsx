import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import AnimateOnScroll from './AnimateOnScroll';
import './SharedFooter.css';

function SharedFooter() {
  return (
    <footer className="shared-footer">
      <AnimateOnScroll className="shared-footer-inner">
        <div className="shared-footer-brand">
          <img src={logo} alt="DigiLync" className="shared-footer-logo" />
          <span>DigiLync</span>
        </div>
        <div className="shared-footer-links">
          <a href="mailto:contact@digilync.com">Email</a>
          <a href="https://wa.me/237678699886" target="_blank" rel="noopener noreferrer">WhatsApp: +237 678 699 886</a>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/admin" className="shared-footer-admin-btn">Admin Login</Link>
        </div>
        <p className="shared-footer-copy">© DigiLync. Powered by Izzy Tech Team.</p>
      </AnimateOnScroll>
    </footer>
  );
}

export default SharedFooter;
