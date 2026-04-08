import React from 'react';
import { Link } from 'react-router-dom';
import SharedFooter from '../SharedFooter';
import './Terms.css';

function Privacy() {
  return (
    <div className="page-wrap page-layout">
      <section className="legal-page privacy-page">
        <div className="legal-inner">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: March 2025</p>

          <div className="legal-content">
            <h2>1. Introduction</h2>
            <p>
              Digilync ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, store, and protect your personal data when you use our agricultural coordination
              platform, including the WhatsApp bot, admin application, and public website.
            </p>

            <h2>2. Data We Collect</h2>
            <p>
              We collect information necessary to operate the platform: names, phone numbers (including WhatsApp),
              location data (village, region, GPS coordinates), farm details (size, crop type, plots), service
              preferences, and booking history. For providers, we also collect service offerings, equipment
              details, pricing, and availability information.
            </p>

            <h2>3. How We Use Your Data</h2>
            <p>
              Your data is used to: match farmers with providers, manage bookings and reminders, display
              farm locations on maps, generate analytics for platform improvement, and communicate with you
              via WhatsApp. We do not sell your personal data to third parties.
            </p>

            <h2>4. Data Storage & Security</h2>
            <p>
              Data is stored on secure servers. We implement appropriate technical and organizational measures
              to protect against unauthorized access, alteration, or disclosure. Access to admin systems is
              restricted and audited.
            </p>

            <h2>5. Data Sharing</h2>
            <p>
              We may share minimal necessary data (e.g., name, phone) between farmers and providers to
              facilitate service delivery. We may share aggregated, anonymized data for research or reporting.
              We do not share personal data with advertisers.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your personal data. Contact us
              at the details below. You may withdraw consent for data use, though this may limit platform
              functionality.
            </p>

            <h2>7. Cookies & Tracking</h2>
            <p>
              Our public website may use essential cookies for functionality. We do not use third-party
              advertising or tracking cookies. The admin application uses session storage for authentication.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. The "Last updated" date at the top reflects
              the most recent version. Continued use after changes constitutes acceptance.
            </p>

            <h2>9. Contact</h2>
            <p>
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:contact@digilync.com">contact@digilync.com</a> or via WhatsApp: +237 678 699 886.
            </p>
          </div>

          <div className="legal-back">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </section>
      <SharedFooter />
    </div>
  );
}

export default Privacy;
