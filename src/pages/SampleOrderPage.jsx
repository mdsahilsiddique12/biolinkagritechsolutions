import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Truck,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Beaker,
  AlertCircle,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import './SampleOrderPage.css';

const SAMPLE_OPTIONS = [
  {
    id: '20kg',
    title: '20 kg Trial Pack',
    badge: 'Popular for Testing',
    popular: false,
    weight: '20 KG',
    idealFor: 'Nursery, Garden & Small Plot Trials',
    specs: ['Moisture < 30%', 'FCO 1985 Certified', 'Compact Seal Bag'],
    dispatchTime: '24-48 Hours',
  },
  {
    id: '30kg',
    title: '30 kg Soil Test Pack',
    badge: 'Recommended for Farmers',
    popular: true,
    weight: '30 KG',
    idealFor: 'Field Calibration & Soil Yield Comparisons',
    specs: ['Moisture < 30%', 'Organic Carbon > 16%', 'Full Batch Lab Report'],
    dispatchTime: '24-48 Hours',
  },
  {
    id: '50kg',
    title: '50 kg Commercial Demo Bag',
    badge: 'Best for Dealers & Estates',
    popular: false,
    weight: '50 KG',
    idealFor: 'Commercial Farm Demo & Dealership Display',
    specs: ['Heavy-Duty HDPE Bag', 'Bulk Grade FOM', 'Lab Certificate Attached'],
    dispatchTime: '24-48 Hours',
  },
];

export default function SampleOrderPage() {
  const [sampleSize, setSampleSize] = useState('30kg');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    pincode: '',
    intendedUse: 'farming',
    intendedUseOther: '',
    cropType: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic frontend validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.whatsapp.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      setError('Please fill in all required fields (Name, Email, WhatsApp Number, Address, and PIN Code).');
      setLoading(false);
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/sample/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sampleSize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to place sample order. Please try again.');
      }

      setSubmittedData(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please check your details and retry.');
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = SAMPLE_OPTIONS.find((opt) => opt.id === sampleSize) || SAMPLE_OPTIONS[1];

  return (
    <main className="sample-page">
      {/* Background glow effects */}
      <div className="sample-page__bg-orb sample-page__bg-orb--1" />
      <div className="sample-page__bg-orb sample-page__bg-orb--2" />

      <div className="container sample-page__container">
        {/* Header Hero Banner */}
        <div className="sample-page__header text-center">
          <div className="badge badge-cyan sample-page__badge">
            <Sparkles size={14} style={{ color: 'var(--neon-gold)', marginRight: '6px' }} />
            Lab-Tested Bio-Manure Sample Dispatch Desk
          </div>
          <h1 className="sample-page__title text-glow-hero">
            Request Your <span className="text-highlight">Test Sample Bag</span>
          </h1>
          <p className="sample-page__subtitle">
            Experience the radical soil-enhancing quality of BioLink Fermented Organic Manure (FOM) firsthand.
            Choose your sample size below, enter your delivery address, and get it dispatched directly from our nearest partner plant.
          </p>
        </div>

        {submittedData ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="sample-success glass-card text-center fade-in">
            <div className="sample-success__icon-wrap">
              <CheckCircle size={56} className="text-neon-green" />
            </div>
            <h2 className="sample-success__title">Sample Order Confirmed!</h2>
            <p className="sample-success__subtitle">
              Your sample request has been registered under Tracking Ref:
              <strong className="sample-success__ref"> {submittedData.sampleRefId}</strong>
            </p>

            <div className="sample-success__summary-box">
              <div className="sample-success__row">
                <span>Selected Sample Size:</span>
                <strong>{selectedOption.title} ({selectedOption.weight})</strong>
              </div>
              <div className="sample-success__row">
                <span>Recipient Name:</span>
                <strong>{submittedData.details.name}</strong>
              </div>
              <div className="sample-success__row">
                <span>WhatsApp Contact:</span>
                <strong>{submittedData.details.whatsapp}</strong>
              </div>
              <div className="sample-success__row">
                <span>Destination Pincode:</span>
                <strong>{submittedData.details.pincode}</strong>
              </div>
              <div className="sample-success__row">
                <span>Expected Confirmation:</span>
                <strong style={{ color: 'var(--neon-gold)' }}>Within 24 Business Hours</strong>
              </div>
            </div>

            <div className="sample-success__info-alert">
              <Truck size={20} style={{ color: 'var(--neon-cyan)', flexShrink: 0 }} />
              <div>
                <strong>Next Step:</strong> Our dispatch team will contact you on WhatsApp (<strong>{submittedData.details.whatsapp}</strong>) to provide courier tracking updates and verify local delivery details.
              </div>
            </div>

            <div className="sample-success__actions">
              <a
                href={`https://wa.me/919006847527?text=${encodeURIComponent(`Hello BioLink Agri Team, I just placed a sample order (Ref: ${submittedData.sampleRefId}) for ${selectedOption.weight}. Please share dispatch status.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <MessageSquare size={18} /> Connect on WhatsApp
              </a>
              <Link to="/institutional" className="btn btn-outline btn-lg">
                Explore Bulk 15-Ton Supply <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          /* MAIN FORM & SELECTION INTERFACE */
          <div className="sample-grid">
            {/* Left Column: Form & Selection */}
            <div className="sample-main">
              {/* Size Selection Cards */}
              <div className="sample-size-section">
                <h2 className="sample-section-title">
                  <Package size={20} className="text-neon-cyan" /> 1. Select Sample Size
                </h2>
                <div className="sample-options-grid">
                  {SAMPLE_OPTIONS.map((option) => {
                    const isSelected = sampleSize === option.id;
                    return (
                      <div
                        key={option.id}
                        className={`sample-option-card glass-card ${isSelected ? 'sample-option-card--active' : ''}`}
                        onClick={() => setSampleSize(option.id)}
                      >
                        {option.popular && (
                          <div className="sample-option-card__badge-top">{option.badge}</div>
                        )}
                        <div className="sample-option-card__header">
                          <div className="sample-option-card__weight">{option.weight}</div>
                          <h3 className="sample-option-card__title">{option.title}</h3>
                        </div>
                        <p className="sample-option-card__ideal">{option.idealFor}</p>

                        <ul className="sample-option-card__specs">
                          {option.specs.map((spec, i) => (
                            <li key={i}>
                              <CheckCircle size={14} className="text-neon-green" /> {spec}
                            </li>
                          ))}
                        </ul>

                        <div className="sample-option-card__select-btn">
                          {isSelected ? (
                            <span className="sample-selected-lbl">✓ Selected Package</span>
                          ) : (
                            <span>Select {option.weight}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="sample-form-section glass-card">
                <h2 className="sample-section-title">
                  <Truck size={20} className="text-neon-green" /> 2. Delivery & Contact Information
                </h2>
                <p className="sample-form-subtitle">
                  Please provide your exact address details for shipping and courier verification.
                </p>

                {error && (
                  <div className="sample-error-alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="sample-form">
                  <div className="form-grid">
                    {/* Full Name */}
                    <div className="form-group">
                      <label htmlFor="sample-name">
                        Full Name <span className="text-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="sample-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Kumar"
                        required
                        className="form-input"
                      />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label htmlFor="sample-email">
                        Email Address <span className="text-required">*</span>
                      </label>
                      <input
                        type="email"
                        id="sample-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rajesh@example.com"
                        required
                        className="form-input"
                      />
                    </div>

                    {/* WhatsApp Mobile */}
                    <div className="form-group">
                      <label htmlFor="sample-whatsapp">
                        WhatsApp Number <span className="text-required">* (For Dispatch Tracking)</span>
                      </label>
                      <input
                        type="tel"
                        id="sample-whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        required
                        className="form-input"
                      />
                    </div>

                    {/* Pincode */}
                    <div className="form-group">
                      <label htmlFor="sample-pincode">
                        PIN Code <span className="text-required">* (6 Digits)</span>
                      </label>
                      <input
                        type="text"
                        id="sample-pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 800001"
                        maxLength={6}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Complete Address */}
                  <div className="form-group">
                    <label htmlFor="sample-address">
                      Complete Delivery Address <span className="text-required">*</span>
                    </label>
                    <textarea
                      id="sample-address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Village / Street Name, Landmark, City, District, State"
                      rows={3}
                      required
                      className="form-input"
                    />
                  </div>

                  {/* Purpose / Intended Use */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="sample-intendedUse">
                        Intended Use / Category <span className="text-required">*</span>
                      </label>
                      <select
                        id="sample-intendedUse"
                        name="intendedUse"
                        value={formData.intendedUse}
                        onChange={handleChange}
                        className="form-input form-select"
                      >
                        <option value="farming">Farming / Personal Crop Cultivation</option>
                        <option value="dealership">Dealership / Retail Store Opportunity</option>
                        <option value="farmer">Farmer Bulk Field Trial</option>
                        <option value="partnership">Partnership / Institutional Supply</option>
                        <option value="other">Other Purpose</option>
                      </select>
                    </div>

                    {/* Crop Type */}
                    <div className="form-group">
                      <label htmlFor="sample-cropType">Target Crops / Cultivation Focus</label>
                      <input
                        type="text"
                        id="sample-cropType"
                        name="cropType"
                        value={formData.cropType}
                        onChange={handleChange}
                        placeholder="e.g. Wheat, Paddy, Apple Orchard, Vegetables"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Other details if 'other' is selected */}
                  {formData.intendedUse === 'other' && (
                    <div className="form-group">
                      <label htmlFor="sample-intendedUseOther">Please specify intended use</label>
                      <input
                        type="text"
                        id="sample-intendedUseOther"
                        name="intendedUseOther"
                        value={formData.intendedUseOther}
                        onChange={handleChange}
                        placeholder="Specify details..."
                        className="form-input"
                      />
                    </div>
                  )}

                  {/* Special Instructions */}
                  <div className="form-group">
                    <label htmlFor="sample-notes">Special Delivery Instructions / Questions (Optional)</label>
                    <textarea
                      id="sample-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any specific delivery instructions or questions for our agronomists..."
                      rows={2}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg sample-submit-btn"
                  >
                    {loading ? (
                      <span>Processing Request...</span>
                    ) : (
                      <>
                        <span>Submit Sample Order Request ({selectedOption.weight})</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary & Quality Badges */}
            <div className="sample-sidebar">
              <div className="sample-summary-card glass-card">
                <h3 className="sample-summary-title">
                  <ShieldCheck size={20} className="text-neon-cyan" /> Order Specification
                </h3>

                <div className="sample-summary-badge-wrap">
                  <div className="sample-summary-weight-hero">{selectedOption.weight}</div>
                  <div className="sample-summary-title-hero">{selectedOption.title}</div>
                </div>

                <div className="sample-summary-divider" />

                <div className="sample-summary-list">
                  <div className="sample-summary-item">
                    <span>Product Type:</span>
                    <strong>Fermented Organic Manure (FOM)</strong>
                  </div>
                  <div className="sample-summary-item">
                    <span>Form Factor:</span>
                    <strong>Granular / Powder Blend</strong>
                  </div>
                  <div className="sample-summary-item">
                    <span>Nitrogen (N):</span>
                    <strong>&gt; 1.5%</strong>
                  </div>
                  <div className="sample-summary-item">
                    <span>Phosphorus (P2O5):</span>
                    <strong>&gt; 1.0%</strong>
                  </div>
                  <div className="sample-summary-item">
                    <span>Potassium (K2O):</span>
                    <strong>&gt; 1.0%</strong>
                  </div>
                  <div className="sample-summary-item">
                    <span>Moisture Standard:</span>
                    <strong style={{ color: 'var(--neon-gold)' }}>&lt; 30.0% Max</strong>
                  </div>
                  <div className="sample-summary-item">
                    <span>Source Facility:</span>
                    <strong>Verified SATAT Plant</strong>
                  </div>
                </div>

                <div className="sample-summary-divider" />

                <div className="sample-guarantee-box">
                  <Award size={20} className="text-neon-gold" />
                  <div>
                    <strong>FCO 1985 Compliant</strong>
                    <p>Every sample originates directly from government-certified Compressed Biogas (CBG) facilities.</p>
                  </div>
                </div>
              </div>

              {/* Help & Support Callout */}
              <div className="sample-help-card glass-card">
                <HelpCircle size={24} className="text-neon-pink" />
                <h4>Need Custom Tonnage?</h4>
                <p>For commercial farms requiring 15+ Metric Tons FTL delivery, use our instant bulk calculator.</p>
                <Link to="/institutional" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '8px' }}>
                  Get Bulk 15-Ton Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
