import React from 'react';
import { Link } from 'react-router-dom';
import SharedFooter from '../SharedFooter';
import './Terms.css';

function Terms() {
  return (
    <div className="page-wrap page-layout">
      <section className="legal-page terms-page">
        <div className="legal-inner">
          <h1 className="legal-title">Terms & Conditions</h1>
          <p className="legal-updated">Last updated: March 2025</p>

          <div className="legal-content">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Farmfleet. These Terms and Conditions govern your use of the Farmfleet platform, including
              our WhatsApp-based agricultural coordination services, public website, and admin tools. By accessing
              or using Farmfleet, you agree to be bound by these terms.
            </p>

            <h2>2. Definitions</h2>
            <p>
              <strong>Platform</strong> means the Farmfleet system, including the WhatsApp bot, admin web application,
              public website, and associated APIs. <strong>Farmers</strong> are users seeking farm services.
              <strong>Providers</strong> are users offering mechanized farm services. <strong>Admins</strong> are
              authorized personnel managing the platform.
            </p>

            <h2>3. Service Description</h2>
            <p>
              Farmfleet connects farmers with mechanized service providers through structured booking, scheduling,
              and coordination. Services include land preparation, planting, crop management, harvesting, and
              post-harvest support. The platform facilitates matching, booking confirmation, reminders, and ratings.
            </p>

            <h2>4. User Responsibilities</h2>
            <p>
              Users must provide accurate information during registration. Farmers and providers are responsible
              for fulfilling their commitments under confirmed bookings. Users must not misuse the platform,
              share false information, or engage in fraudulent activity.
            </p>

            <h2>5. Booking & Cancellation</h2>
            <p>
              Bookings are binding once confirmed by both parties. Cancellation policies may vary by provider.
              Farmfleet reserves the right to apply no-show penalties as agreed during provider onboarding.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              Farmfleet acts as a coordination platform. We do not guarantee the quality, timeliness, or outcome
              of services performed by providers. Disputes between farmers and providers should be resolved
              directly; Farmfleet may assist in mediation but is not liable for service delivery.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              The Farmfleet platform, including its design, branding, and software, is owned by Izzy Tech Team
              or its licensors. Unauthorized copying, modification, or distribution is prohibited.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the platform after changes
              constitutes acceptance. Material changes will be communicated via the platform or contact details.
            </p>

            <h2>9. Contact</h2>
            <p>
              For questions about these Terms & Conditions, contact us at{' '}
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

export default Terms;
