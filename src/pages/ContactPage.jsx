import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';
import { api } from '../lib/api';
import './ContactPage.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  enquiryType: '',
  message: '',
};

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const revealRef = useScrollReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.submitContact({
        ...formData,
        website: '',
      });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contact@biolinkagri.com', link: 'mailto:contact@biolinkagri.com' },
    { icon: Phone, label: 'Phone', value: '+91 98XXX XXXXX', link: 'tel:+9198XXXXXXXX' },
    { icon: MessageSquare, label: 'WhatsApp', value: 'Chat with us', link: 'https://wa.me/919800000000' },
    { icon: MapPin, label: 'Operations', value: 'Pan-India Network (Remote First)', link: null },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Sat, 9:00 AM - 7:00 PM IST', link: null },
  ];

  return (
    <main className="contact" ref={revealRef}>
      <section className="contact-hero" id="contact-hero">
        <div className="orb orb-green" style={{ width: 250, height: 250, top: '10%', right: '5%' }} />
        <div className="container contact-hero__content">
          <span className="badge">Contact Us</span>
          <h1 className="contact-hero__title">
            Let's <span className="text-glow-hero">Connect</span>
          </h1>
          <p className="contact-hero__subtitle">
            Whether you're a biogas plant looking for a distribution partner, or a commercial buyer
            seeking certified organic manure, we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section contact-main" id="contact-main">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-wrapper glass-card reveal-left">
              {!submitted ? (
                <>
                  <h3 className="contact-form__title">
                    <Send size={18} /> Send Us a Message
                  </h3>
                  <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
                    <input
                      type="text"
                      name="website"
                      autoComplete="off"
                      tabIndex="-1"
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                    <div className="contact-form__row">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          id="contact-name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="input-field"
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          id="contact-email"
                        />
                      </div>
                    </div>

                    <div className="contact-form__row">
                      <div className="form-group">
                        <label className="form-label">Phone / WhatsApp</label>
                        <input
                          type="tel"
                          className="input-field"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          id="contact-phone"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Enquiry Type</label>
                        <select
                          className="select-field"
                          value={formData.enquiryType}
                          onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                          required
                          id="contact-enquiry-type"
                        >
                          <option value="">Select type...</option>
                          <option value="bulk-buyer">I want to buy in bulk</option>
                          <option value="bgp-partner">I am a Biogas Plant</option>
                          <option value="retail">Retail purchase enquiry</option>
                          <option value="partnership">Partnership / Distribution</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        className="input-field contact-form__textarea"
                        placeholder="Tell us about your requirements, volumes, or how we can help..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        id="contact-message"
                      />
                    </div>

                    {error ? <p className="form-error">{error}</p> : null}

                    <button type="submit" className="btn btn-primary btn-lg contact-form__submit" id="contact-submit">
                      {isSubmitting ? 'Sending...' : 'Send Message'} <ArrowRight size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="contact-form__success">
                  <CheckCircle size={48} className="contact-form__success-icon" />
                  <h3 className="contact-form__success-title text-glow">Message Sent!</h3>
                  <p className="contact-form__success-desc">
                    Thank you, {formData.name}! Our team will get back to you within 24 hours
                    via email at <strong>{formData.email}</strong>.
                  </p>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData(initialForm);
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>

            <div className="contact-info reveal-right">
              <h3 className="contact-info__title">Direct Channels</h3>
              <div className="contact-info__list">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="contact-info__item glass-card">
                      <div className="contact-info__icon"><Icon size={18} /></div>
                      <div>
                        <span className="contact-info__label">{item.label}</span>
                        {item.link ? (
                          <a href={item.link} className="contact-info__value">{item.value}</a>
                        ) : (
                          <span className="contact-info__value">{item.value}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <a href="https://wa.me/919800000000" className="btn btn-primary contact-whatsapp" id="whatsapp-cta">
                <MessageSquare size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
