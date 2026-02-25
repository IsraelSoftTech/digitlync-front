import React, { useState } from 'react';
import './ContactFormInline.css';

function ContactFormInline() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <form className="contact-inline-form" onSubmit={handleSubmit}>
      <h3>Send a Message</h3>
      {submitted && (
        <p className="contact-inline-success">Thank you. Your message has been sent. We will get back to you soon.</p>
      )}
      <div className="contact-inline-field">
        <label htmlFor="contact-inline-name">Name</label>
        <input
          id="contact-inline-name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div className="contact-inline-field">
        <label htmlFor="contact-inline-email">Email</label>
        <input
          id="contact-inline-email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </div>
      <div className="contact-inline-field">
        <label htmlFor="contact-inline-message">Message</label>
        <textarea
          id="contact-inline-message"
          placeholder="Your message..."
          rows={4}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
        />
      </div>
      <button type="submit" className="contact-inline-submit">Send Message</button>
    </form>
  );
}

export default ContactFormInline;
