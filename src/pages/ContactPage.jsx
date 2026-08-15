import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle, ArrowRight, Building, Scale, ShieldAlert } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';
import { api } from '../lib/api';
import './ContactPage.css';

const initialForm = {
  clientName: '',
  companyTitle: '',
  clientEmail: '',
  subject: '',
  targetTonnage: '',
  description: '',
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
      await api.submitContactForm({
        ...formData,
        targetTonnage: formData.targetTonnage ? Number(formData.targetTonnage) : undefined,
      });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message || 'Submission interrupted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact" ref={revealRef}>
      <section className="contact-hero" id="contact-hero">
        <div className="orb orb-green" style={{ width: 250, height: 250, top: '10%', right: '5%' }} />
        <div className="container contact-hero__content">
          <span className="badge">Get in Touch</span>
          <h1 className="contact-hero__title">
            Secure Sourcing & <span className="text-glow-hero">Inquiry Desk</span>
          </h1>
          <p className="contact-hero__subtitle">
            Direct routing to our regional dispatch centers. Fill out the specification sheet to request FTL quotes.
          </p>
        </div>
      </section>

      <section className="section contact-main" id="contact-main">
        <div className="container">
          <div className="contact-grid">
            
            {/* LEFT-HAND COLUMN: Corporate Trust Markers */}
            <div className="contact-info reveal-left">
              <h3 className="contact-info__title">Corporate Trust Indicators</h3>
              <div className="contact-info__list">
                
                {/* Operating Hub */}
                <div className="contact-info__item glass-card">
                  <div className="contact-info__icon">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">Operating Hub</span>
                    <span className="contact-info__value">Patna, Bihar, India</span>
                  </div>
                </div>

                {/* Email Node */}
                <div className="contact-info__item glass-card">
                  <div className="contact-info__icon">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">Official Inbound Email</span>
                    <a href="mailto:info@biolinkagri.in" className="contact-info__value text-glow-hover">
                      info@biolinkagri.in
                    </a>
                  </div>
                </div>

                {/* Regulatory Notice */}
                <div className="contact-info__item glass-card" style={{ alignItems: 'flex-start' }}>
                  <div className="contact-info__icon" style={{ marginTop: '3px' }}>
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">Regulatory Subtext Framework</span>
                    <p className="contact-info__value" style={{ fontSize: '0.78rem', lineHeight: '1.5', marginTop: '4px', color: 'var(--text-secondary)' }}>
                      BioLink Agri operates as an asset-light digital logistics matching coordinator under small-business tax-exempt frameworks. All bulk allocations are processed ex-factory gate from nearest registered GOBARdhan facilities.
                    </p>
                  </div>
                </div>

              </div>

              <div className="contact-trust-badge">
                <CheckCircle size={14} style={{ color: 'var(--neon-cyan)' }} />
                <span>100% Verified GOBARdhan Co-Products</span>
              </div>
            </div>

            {/* RIGHT-HAND COLUMN: Lead-Capture Form */}
            <div className="contact-form-wrapper glass-card reveal-right">
              {!submitted ? (
                <>
                  <h3 className="contact-form__title">
                    <Send size={18} /> Lead-Capture Intake Form
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
                    
                    {/* Full Name & Company */}
                    <div className="contact-form__row">
                      <div className="form-group">
                        <label className="form-label">Full Representative Name</label>
                        <div className="input-with-icon">
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Your full name"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            required
                            id="contact-client-name"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Company / Estate Title</label>
                        <div className="input-with-icon">
                          <Building size={16} className="input-icon" style={{ left: '12px' }} />
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Company/Estate name"
                            value={formData.companyTitle}
                            onChange={(e) => setFormData({ ...formData, companyTitle: e.target.value })}
                            style={{ paddingLeft: '2.2rem' }}
                            id="contact-company-title"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Inquiry Type */}
                    <div className="contact-form__row">
                      <div className="form-group">
                        <label className="form-label">Business Email Address</label>
                        <input
                          type="email"
                          className="input-field"
                          placeholder="procurement@company.com"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                          required
                          id="contact-client-email"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Inquiry Sourcing Node</label>
                        <select
                          className="select-field"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          id="contact-subject"
                        >
                          <option value="">Select context category...</option>
                          <option value="Makhana Plantation Basin Sourcing">Makhana Plantation Basin Sourcing</option>
                          <option value="Tea Garden Annual Tonnage Procurement">Tea Garden Annual Tonnage Procurement</option>
                          <option value="General Logistics/Freight Support">General Logistics/Freight Support</option>
                        </select>
                      </div>
                    </div>

                    {/* Target Tonnage */}
                    <div className="form-group">
                      <label className="form-label">Target Tonnage (Metric Tonnes)</label>
                      <div className="input-with-icon">
                        <Scale size={16} className="input-icon" style={{ left: '12px' }} />
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Minimum 15 MT (e.g. 15, 30, 45)"
                          min="15"
                          value={formData.targetTonnage}
                          onChange={(e) => setFormData({ ...formData, targetTonnage: e.target.value })}
                          style={{ paddingLeft: '2.2rem' }}
                          required
                          id="contact-target-tonnage"
                        />
                      </div>
                      <span className="form-hint" style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        All bulk dispatches are optimized for multi-axle freight carriers.
                      </span>
                    </div>

                    {/* Payload Specifications */}
                    <div className="form-group">
                      <label className="form-label">Payload Specifications (Quality/Schedule/NPK)</label>
                      <textarea
                        className="input-field contact-form__textarea"
                        placeholder="Detail your requested moisture levels, nitrogen percentages, delivery timetables, and local Dharma Kanta weighbridge checking requests..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        id="contact-description"
                      />
                    </div>

                    {error ? <p className="form-error">{error}</p> : null}

                    <button type="submit" className="btn btn-primary btn-lg contact-form__submit" id="contact-submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Routing Inquiry...' : 'Submit Sourcing Request'} <ArrowRight size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="contact-form__success">
                  <CheckCircle size={48} className="contact-form__success-icon" />
                  <h3 className="contact-form__success-title text-glow">Inquiry Transmitted</h3>
                  <p className="contact-form__success-desc">
                    Thank you, <strong>{formData.clientName}</strong>. Your inquiry for <strong>{formData.targetTonnage} MT</strong> has been securely logged.
                  </p>
                  <p className="contact-form__success-desc" style={{ fontSize: '0.8rem', marginTop: '-10px' }}>
                    An auto-confirmation has been dispatched to <strong>{formData.clientEmail}</strong>. Our logistics coordinators will follow up via WhatsApp within 24 hours.
                  </p>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData(initialForm);
                    }}
                  >
                    Send Another Sourcing Request
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
