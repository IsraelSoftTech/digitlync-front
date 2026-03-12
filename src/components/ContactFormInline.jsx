import React, { useState, useEffect } from 'react';
import './ContactFormInline.css';

const FORMSUBMIT_URL = 'https://formsubmit.co/greenwavetech17@gmail.com';

function ContactFormInline() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === '1') {
      setSubmitted(true);
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }
  }, []);

  return (
    <form
      className="contact-inline-form"
      action={FORMSUBMIT_URL}
      method="POST"
    >
      <input type="hidden" name="_subject" value="DigiLync Contact Form" />
      <input type="hidden" name="_replyto" value={form.email} />
      <input type="hidden" name="_next" value={`${window.location.origin}${window.location.pathname || '/'}?submitted=1#footer`} />
      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
      <h3>Send a Message</h3>
      {submitted && (
        <p className="contact-inline-success">Thank you. Your message has been sent. We will get back to you soon.</p>
      )}
      <div className="contact-inline-field">
        <label htmlFor="contact-inline-name">Name</label>
        <input
          id="contact-inline-name"
          name="name"
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
          name="email"
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
          name="message"
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
