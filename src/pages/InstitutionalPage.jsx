import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Download, MapPin, CheckCircle, ArrowRight, Zap, FileText, Gift, Handshake, LogIn } from 'lucide-react';
import ParticleField from '../components/ParticleField';
import { useScrollReveal } from '../hooks/useAnimations';
import { certifications, supplyHubs } from '../data/testimonials';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import './InstitutionalPage.css';

function QuoteCalculator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    product: '',
    volume: '',
    pincode: '',
  });

  // Referral states
  const DEFAULT_PARTNERS = [
    {
      code: 'KJ01',
      partnerName: 'KrishakJan',
      company: 'KrishakJan Solutions',
      partnerType: 'strategic_partner',
      discountType: 'fixed_per_mt',
      discountValue: 100,
    },
  ];

  const [hasReferral, setHasReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralPartnerName, setReferralPartnerName] = useState('');
  const [referralDiscountInfo, setReferralDiscountInfo] = useState(null);
  const [partnerOptions, setPartnerOptions] = useState(DEFAULT_PARTNERS);
  const [validatingCode, setValidatingCode] = useState(false);

  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
  });
  const [quoteId, setQuoteId] = useState('');
  const [quotePreview, setQuotePreview] = useState(null);
  const [quoteReferral, setQuoteReferral] = useState(null);
  const [error, setError] = useState('');
  const [submitLabel, setSubmitLabel] = useState('Calculate All-Inclusive Quote');
  const [claimLabel, setClaimLabel] = useState('Unlock My Quotation');

  const [moqWarning, setMoqWarning] = useState(false);
  const [truckConfig, setTruckConfig] = useState('');

  const [quoteTerms, setQuoteTerms] = useState(false);
  const [leadTerms, setLeadTerms] = useState(false);

  // Auto-fill user details when logged in
  useEffect(() => {
    if (user) {
      setLeadData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        whatsapp: user.phone || prev.whatsapp,
      }));
    }
  }, [user]);

  useEffect(() => {
    // Fetch active referral partners for dropdown
    api.getPublicPartnerCodes()
      .then((codes) => {
        if (Array.isArray(codes) && codes.length > 0) {
          setPartnerOptions(codes);
        }
      })
      .catch(() => {});

    // Restore pending quote if returning from login
    const pending = sessionStorage.getItem('pending_institutional_quote');
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.referralCode) {
          setReferralCode(parsed.referralCode);
          validateCode(parsed.referralCode);
        }
        if (parsed.quotePreview && parsed.quoteId) {
          setQuoteId(parsed.quoteId);
          setQuotePreview(parsed.quotePreview);
          setQuoteReferral(parsed.quoteReferral);
          setStep('capture');
        }
        sessionStorage.removeItem('pending_institutional_quote');
      } catch {}
    }

    // Auto-detect ?ref= query parameter
    const refParam = searchParams.get('ref');
    if (refParam) {
      const code = refParam.trim().toUpperCase().replace(/\s+/g, '');
      setHasReferral(true);
      setReferralCode(code);
      validateCode(code);
    }
  }, [searchParams]);

  const validateCode = async (codeToValidate) => {
    if (!codeToValidate) return;
    const clean = codeToValidate.trim().toUpperCase().replace(/\s+/g, '');
    setValidatingCode(true);

    if (clean === 'KJ01' || clean === 'KRISHAKJAN' || clean === 'GROWIN01' || clean === 'GROWINAGRI') {
      setReferralPartnerName('KrishakJan');
      setReferralDiscountInfo({
        valid: true,
        code: 'KJ01',
        partnerName: 'KrishakJan',
        company: 'KrishakJan Solutions',
        discountType: 'fixed_per_mt',
        discountValue: 100,
      });
      setValidatingCode(false);
      return;
    }

    try {
      const info = await api.validateReferralCode(clean);
      if (info.valid) {
        setReferralPartnerName(info.partnerName);
        setReferralDiscountInfo(info);
      }
    } catch {
      setReferralPartnerName('');
      setReferralDiscountInfo(null);
    } finally {
      setValidatingCode(false);
    }
  };

  const handlePartnerSelect = (e) => {
    const code = e.target.value;
    setReferralCode(code);
    if (code) {
      validateCode(code);
    } else {
      setReferralPartnerName('');
      setReferralDiscountInfo(null);
    }
  };

  const handleVolumeChange = (val) => {
    const num = Number(val);
    setFormData((prev) => ({ ...prev, volume: val }));
    
    if (val === '') {
      setMoqWarning(false);
      setTruckConfig('');
      return;
    }

    if (num < 15) {
      setMoqWarning(true);
      setTruckConfig('');
    } else {
      setMoqWarning(false);
      if (num >= 15 && num < 25) {
        setTruckConfig('6-Wheel FTL Truck (15-Ton Capacity)');
      } else if (num >= 25 && num < 35) {
        setTruckConfig('10-Wheel Multi-Axle Trailer (25-Ton Capacity)');
      } else {
        setTruckConfig('12-Wheel Heavy Multi-Axle Carrier (35+ Ton Capacity)');
      }
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.volume || !formData.pincode || Number(formData.volume) < 15) return;
    if (!quoteTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setError('');
    setSubmitLabel('Calculating...');
    setStep('loading');

    try {
      const result = await api.calculateQuote({
        ...formData,
        referralCode: referralCode || '',
      });
      const qId = `quote-${Date.now()}`;
      setQuoteId(qId);
      setQuotePreview(result.quote);
      setQuoteReferral(result.referral);
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
    if (!quoteId) return;

    // Authentication Gate: Require user login before finalizing quote booking
    if (!user) {
      sessionStorage.setItem(
        'pending_institutional_quote',
        JSON.stringify({ formData, referralCode, quotePreview, quoteReferral, quoteId })
      );
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in or register your account to complete your bulk quote booking.',
        },
      });
      return;
    }

    const nameToSubmit = leadData.name || user.name || '';
    const emailToSubmit = leadData.email || user.email || '';
    const whatsappToSubmit = leadData.whatsapp || user.phone || '';

    if (!nameToSubmit || !emailToSubmit || !whatsappToSubmit) {
      setError('Please provide your name, email, and WhatsApp number.');
      return;
    }

    if (!leadTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setError('');
    setClaimLabel('Sending...');

    try {
      await api.claimQuote(quoteId, {
        ...leadData,
        name: nameToSubmit,
        email: emailToSubmit,
        whatsapp: whatsappToSubmit,
        ...formData,
        referralCode: referralCode || 'KJ01',
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
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Volume Required (Metric Tons)</label>
              <input
                type="number"
                className="input-field"
                placeholder="Enter required tonnage (min 15 MT)"
                value={formData.volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                id="quote-volume"
                required
              />
              {moqWarning && (
                <p className="form-error" style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: '#b91c1c', fontWeight: 600 }}>
                  ⚠️ MOQ Gate: Minimum transaction threshold is 15 Tons due to multi-axle carrier logistics.
                </p>
              )}
              {truckConfig && (
                <p className="form-hint" style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--neon-cyan)', fontWeight: 600 }}>
                  🚛 Logistics Carrier: Optimized for {truckConfig}.
                </p>
              )}
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

            {/* ── Referral Selection Section (Directly Visible) ── */}
            <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Handshake size={14} style={{ color: 'var(--neon-green, #34d399)' }} />
                <span>Referred by a BioLink Partner? (Optional)</span>
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  className="select-field"
                  style={{ flex: 1, minWidth: '200px' }}
                  value={referralCode}
                  onChange={handlePartnerSelect}
                >
                  <option value="">-- Select Partner Code (e.g. KJ01) --</option>
                  {partnerOptions.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.partnerName} {p.company ? `(${p.company})` : ''}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="input-field"
                  style={{ flex: 1, minWidth: '150px', textTransform: 'uppercase' }}
                  placeholder="Or enter Code (KJ01)"
                  value={referralCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setReferralCode(val);
                    if (val.length >= 2) validateCode(val);
                  }}
                />
              </div>

              {referralPartnerName ? (
                <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neon-green, #34d399)', fontSize: '0.82rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.08)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <Gift size={14} />
                  <span>Referral Benefit Applied — Partner: {referralPartnerName} ({referralCode || 'KJ01'})</span>
                </div>
              ) : referralCode ? (
                <span style={{ marginTop: '0.4rem', display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  {validatingCode ? 'Verifying partner code...' : 'Partner code entered. Discount will be applied at calculation.'}
                </span>
              ) : null}
            </div>
          </div>

          {/* T&C + Privacy Policy Checkbox */}
          <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '8px', marginBottom: 'var(--space-md)' }}>
            <input
              type="checkbox"
              id="quote-terms"
              required
              checked={quoteTerms}
              onChange={(e) => setQuoteTerms(e.target.checked)}
              style={{ marginTop: '4px', cursor: 'pointer' }}
            />
            <label htmlFor="quote-terms" className="form-label" style={{ fontSize: '0.78rem', textTransform: 'none', letterSpacing: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              I agree to the <a href="/terms" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Privacy Policy</a>
            </label>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary btn-lg quote-calc__submit" id="quote-submit" disabled={moqWarning || !formData.volume}>
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
        <div className="quote-calc__capture" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="quote-calc__capture-icon" style={{ margin: 0 }}>
                <CheckCircle size={28} />
              </div>
              <div>
                <h3 className="quote-calc__capture-title" style={{ textAlign: 'left', margin: 0, fontSize: '1.4rem' }}>Quote Calculated!</h3>
                <p className="quote-calc__capture-desc" style={{ textAlign: 'left', margin: 0, fontSize: '0.88rem' }}>
                  Custom wholesale quotation for <strong>{formData.volume} MT</strong> delivered to pincode <strong>{formData.pincode}</strong>.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setStep('form')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              &larr; Recalculate
            </button>
          </div>

          {quotePreview ? (
            <div className="quote-calc__summary glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', padding: '1.5rem', borderRadius: '14px', background: 'rgba(5, 150, 105, 0.06)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.5rem', textAlign: 'left', overflow: 'visible' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Price of Manure (Base)</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Rs. {quotePreview.manureCost.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Delivery Charges (Freight)</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Rs. {quotePreview.freightCost.toLocaleString('en-IN')}</strong>
              </div>
              {quoteReferral && quoteReferral.discountAmount > 0 ? (
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--neon-green, #34d399)', display: 'block', marginBottom: '0.2rem' }}>🎁 Partner Referral Discount ({quoteReferral.partnerName})</span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--neon-green, #34d399)' }}>− Rs. {quoteReferral.discountAmount.toLocaleString('en-IN')}</strong>
                </div>
              ) : null}
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Delivered Price Per Ton</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--neon-green)' }}>Rs. {quotePreview.pricePerTon.toLocaleString('en-IN')} / MT</strong>
              </div>
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '600' }}>Total All-Inclusive Delivered Amount:</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--neon-green)', fontWeight: 'bold' }}>
                  Rs. {(quoteReferral?.finalTotal ?? quotePreview.total).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleLeadSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your full name"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                id="lead-name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Corporate / Personal Email *</label>
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
            <div className="form-group">
              <label className="form-label">Company / Estate Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Company or farm name"
                value={leadData.company}
                onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                id="lead-company"
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number (+91) *</label>
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

            {/* T&C + Privacy Policy Checkbox */}
            <div className="form-group checkbox-group" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'flex-start', gap: '8px', margin: '0.25rem 0' }}>
              <input
                type="checkbox"
                id="lead-terms"
                required
                checked={leadTerms}
                onChange={(e) => setLeadTerms(e.target.checked)}
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              <label htmlFor="lead-terms" className="form-label" style={{ fontSize: '0.78rem', textTransform: 'none', letterSpacing: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                I agree to the <a href="/terms" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Privacy Policy</a>
              </label>
            </div>

            {error ? <p className="form-error" style={{ gridColumn: '1 / -1' }}>{error}</p> : null}
            <button type="submit" className="btn btn-primary btn-lg" style={{ gridColumn: '1 / -1', width: '100%' }} id="lead-submit">
              {claimLabel} <ArrowRight size={16} />
            </button>
          </form>
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

      <section className="section inst-calc-section" id="quote-calculator-section" style={{ overflow: 'visible', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ overflow: 'visible' }}>
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
            <Link to="/lab-reports" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
              View Full Lab Reports <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </Link>
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
