import React, { useState } from 'react';
import SharedFooter from '../SharedFooter';
import './Contact.css';

function Contact({ onAdminLogin }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="page-wrap page-layout">
      <section className="contact-page">
        <div className="contact-inner">
          <h1 className="contact-title anim-page-enter">Contact Us</h1>
          <p className="contact-intro anim-page-enter anim-delay-1">
            Get in touch with the DigiLync team. Whether you are a farmer, service provider, 
            industrial buyer, or partner, we would like to hear from you.
          </p>

          <div className="contact-extra anim-page-enter anim-delay-2">
            <p>
              DigiLync connects smallholder farmers with mechanization providers and industrial buyers 
              across Cameroon. Our platform uses geospatial intelligence and AI to match supply with 
              demand, reduce post-harvest loss, and improve livelihoods. We support farmers through 
              WhatsApp-based registration and booking, and help providers reach new customers.
            </p>
            <p>
              Use the form below to ask questions, request a demo, or discuss partnerships. 
              For urgent support, reach us on WhatsApp.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info anim-page-enter anim-delay-3">
              <h3>Reach Us</h3>
              <p><strong>Email:</strong> contact@digilync.com</p>
              <p><strong>WhatsApp:</strong> +237 697 799 186</p>
              <p className="contact-info-note">
                For fastest response, start a conversation on WhatsApp. 
                Farmers and providers can register directly via our WhatsApp bot.
              </p>
            </div>

            <form className="contact-form anim-page-enter anim-delay-4" onSubmit={handleSubmit}>
              <h3>Send a Message</h3>
              {submitted && (
                <p className="contact-form-success">Thank you. Your message has been sent. We will get back to you soon.</p>
              )}
              <div className="contact-form-field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="contact-form-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="contact-form-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  placeholder="Your message..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>
              <button type="submit" className="contact-form-submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>
      <SharedFooter onAdminLogin={onAdminLogin} />
    </div>
  );
}

export default Contact;
