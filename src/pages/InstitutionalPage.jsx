import { useState } from 'react';
import { Shield, Download, MapPin, CheckCircle, ArrowRight, Zap, FileText } from 'lucide-react';
import ParticleField from '../components/ParticleField';
import { useScrollReveal } from '../hooks/useAnimations';
import { certifications, supplyHubs } from '../data/testimonials';
import { api } from '../lib/api';
import './InstitutionalPage.css';

function QuoteCalculator() {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    product: '',
    volume: '',
    pincode: '',
  });
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
  });
  const [quoteId, setQuoteId] = useState('');
  const [quotePreview, setQuotePreview] = useState(null);
  const [error, setError] = useState('');
  const [submitLabel, setSubmitLabel] = useState('Calculate All-Inclusive Quote');
  const [claimLabel, setClaimLabel] = useState('Unlock My Quotation');

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.volume || !formData.pincode) return;

    setError('');
    setSubmitLabel('Calculating...');
    setStep('loading');

    try {
      const result = await api.calculateQuote(formData);
      setQuoteId(`quote-${Date.now()}`);
      setQuotePreview(result.quote);
      setStep('capture');
    } catch (requestError) {
      setError(requestError.message);
      setStep('form');
    } finally {
      setSubmitLabel('Calculate All-Inclusive Quote');
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email || !leadData.whatsapp || !quoteId) return;

    setError('');
    setClaimLabel('Sending...');

    try {
      await api.claimQuote(quoteId, {
        ...leadData,
        ...formData,
        website: '',
      });
      setStep('success');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setClaimLabel('Unlock My Quotation');
    }
  };

  const resetForm = () => {
    setStep('form');
    setFormData({ product: '', volume: '', pincode: '' });
    setLeadData({ name: '', email: '', whatsapp: '', company: '' });
    setQuotePreview(null);
    setQuoteId('');
    setError('');
  };

  return (
    <div className="quote-calc" id="quote-calculator">
      {step === 'form' && (
        <form className="quote-calc__form" onSubmit={handleCalculate}>
          <div className="quote-calc__header">
            <span className="section-label"><Zap size={12} /> Instant Quote Engine</span>
            <h3 className="quote-calc__title">Calculate Your All-Inclusive Delivered Price</h3>
            <p className="quote-calc__desc">India-domestic bulk trading only. Select specifications to get a real-time delivered price to any Indian pincode.</p>
            <p className="quote-calc__min-order">Minimum order: 15 Metric Tons</p>
          </div>

          <div className="quote-calc__fields">
            <div className="form-group">
              <label className="form-label">Product Type</label>
              <select
                className="select-field"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                id="quote-product"
                required
              >
                <option value="">Select product...</option>
                <option value="solid-fom">Solid FOM (Granulated)</option>
                <option value="liquid-slurry">Liquid Slurry (LFOM)</option>
                <option value="prom">Enrichment PROM</option>
                <option value="co2">Food-Grade CO2</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Volume Required</label>
              <select
                className="select-field"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                id="quote-volume"
                required
              >
                <option value="">Select volume...</option>
                <option value="15">15 Metric Tons</option>
                <option value="25">25 Metric Tons</option>
                <option value="50">50 Metric Tons</option>
                <option value="100">100+ Metric Tons</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Pincode (India)</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter Indian Pincode (6-digit)"
                maxLength={6}
                pattern="[0-9]{6}"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                id="quote-pincode"
                required
              />
              <span className="form-hint">Delivery available across all Indian states via verified domestic freight partners.</span>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary btn-lg quote-calc__submit" id="quote-submit">
            {submitLabel} <ArrowRight size={16} />
          </button>
        </form>
      )}

      {step === 'loading' && (
        <div className="quote-calc__loading">
          <div className="quote-calc__loading-visual">
            <div className="spinner" />
            <div className="quote-calc__loading-rings">
              <div className="quote-calc__ring" />
              <div className="quote-calc__ring quote-calc__ring--2" />
              <div className="quote-calc__ring quote-calc__ring--3" />
            </div>
          </div>
          <p className="spinner-text">Calculating optimized domestic freight routes across India...</p>
        </div>
      )}

      {step === 'capture' && (
        <div className="quote-calc__capture">
          <div className="modal-overlay" onClick={() => setStep('form')}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setStep('form')}>x</button>
              <div className="quote-calc__capture-icon">
                <CheckCircle size={32} />
              </div>
              <h3 className="quote-calc__capture-title">Quote Ready!</h3>
              <p className="quote-calc__capture-desc">
                Your custom wholesale quotation for <strong>{formData.volume} MT</strong> has been calculated.
                Enter your details below to unlock the full pricing breakdown.
              </p>
              {quotePreview ? (
                <div className="quote-calc__summary glass-card">
                  <p>Delivered price per ton: <strong>Rs. {quotePreview.pricePerTon.toLocaleString('en-IN')}</strong></p>
                  <p>Total estimate: <strong>Rs. {quotePreview.total.toLocaleString('en-IN')}</strong></p>
                </div>
              ) : null}
              <form onSubmit={handleLeadSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Your name"
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                    id="lead-name"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Corporate Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="you@company.com"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    id="lead-email"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Company / farm / estate name"
                    value={leadData.company}
                    onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                    id="lead-company"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+91 XXXXX XXXXX"
                    value={leadData.whatsapp}
                    onChange={(e) => setLeadData({ ...leadData, whatsapp: e.target.value })}
                    id="lead-whatsapp"
                    required
                  />
                </div>
                {error ? <p className="form-error">{error}</p> : null}
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} id="lead-submit">
                  {claimLabel} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="quote-calc__success">
          <div className="quote-calc__success-icon">
            <CheckCircle size={48} />
          </div>
          <h3 className="quote-calc__success-title text-glow">Quotation Sent!</h3>
          <p className="quote-calc__success-desc">
            Your custom pricing breakdown for <strong>{formData.volume} MT</strong> has been sent
            to <strong>{leadData.email}</strong>. Our team will also reach out via WhatsApp within 2 hours.
          </p>
          <button className="btn btn-outline" onClick={resetForm}>
            Calculate Another Quote
          </button>
        </div>
      )}
    </div>
  );
}

export default function InstitutionalPage() {
  const revealRef = useScrollReveal();

  return (
    <main className="institutional" ref={revealRef}>
      <section className="inst-hero" id="inst-hero">
        <ParticleField count={50} color="#00d4ff" speed={0.2} />
        <div className="orb orb-cyan" style={{ width: 350, height: 350, top: '10%', right: '-10%' }} />
        <div className="orb orb-green" style={{ width: 250, height: 250, bottom: '5%', left: '-5%' }} />

        <div className="container inst-hero__content">
          <span className="badge badge-cyan">B2B Institutional Supply</span>
          <h1 className="inst-hero__title">
            Bulk Bio-Manure for <span className="text-glow-hero">Commercial Operations</span>
          </h1>
          <p className="inst-hero__subtitle">
            Direct factory-to-site dispatch of lab-certified Fermented Organic Manure across India.
            Minimum 15 Metric Tons per order. Transparent pricing. Domestic logistics only.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <QuoteCalculator />
        </div>
      </section>

      <section className="section inst-certs" id="certification-vault">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Compliance Vault</span>
            <h2 className="section-title text-glow">Certifications & Lab Reports</h2>
            <p className="section-subtitle">
              Full transparency. Download our latest compliance documents and lab-verified test reports.
            </p>
          </div>

          <div className="inst-certs__grid stagger-children">
            {certifications.map((cert) => (
              <div key={cert.name} className="inst-cert-card glass-card reveal">
                <Shield size={24} className="inst-cert-card__icon" />
                <h4 className="inst-cert-card__name">{cert.name}</h4>
                <p className="inst-cert-card__desc">{cert.description}</p>
                <button className="btn btn-ghost inst-cert-card__download">
                  <Download size={14} /> Download PDF
                </button>
              </div>
            ))}
            <div className="inst-cert-card glass-card reveal">
              <FileText size={24} className="inst-cert-card__icon" />
              <h4 className="inst-cert-card__name">NPK Lab Report</h4>
              <p className="inst-cert-card__desc">Latest batch analysis with N, P, K, and micronutrient values</p>
              <button className="btn btn-ghost inst-cert-card__download">
                <Download size={14} /> Download PDF
              </button>
            </div>
            <div className="inst-cert-card glass-card reveal">
              <FileText size={24} className="inst-cert-card__icon" />
              <h4 className="inst-cert-card__name">Heavy Metal Test</h4>
              <p className="inst-cert-card__desc">Cadmium, Lead, Arsenic levels verified below safe limits</p>
              <button className="btn btn-ghost inst-cert-card__download">
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section inst-network" id="supply-network">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Network Status</span>
            <h2 className="section-title text-glow">Pan-India Supply Hubs</h2>
          </div>

          <div className="inst-network__grid stagger-children">
            {supplyHubs.map((hub) => (
              <div key={hub.state} className="inst-hub-card glass-card reveal">
                <div className="inst-hub-card__header">
                  <MapPin size={16} />
                  <h4 className="inst-hub-card__state">{hub.state}</h4>
                  <span className={`inst-hub-card__status ${hub.status === 'active' ? 'inst-hub-card__status--active' : 'inst-hub-card__status--limited'}`}>
                    {hub.status}
                  </span>
                </div>
                <div className="inst-hub-card__tons">
                  <span className="inst-hub-card__tons-value">{hub.tons}</span>
                  <span className="inst-hub-card__tons-label">Tons Available</span>
                </div>
                <div className="inst-hub-card__coord">
                  <span>{hub.lat} / {hub.lng}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
