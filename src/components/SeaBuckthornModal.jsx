import { useState } from 'react';
import { X, Sparkles, CheckCircle, ArrowRight, AlertCircle, MessageSquare, ShieldCheck, Droplets, Leaf } from 'lucide-react';
import './SeaBuckthornModal.css';

export default function SeaBuckthornModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    whatsapp: '',
    requiredFormat: 'Supercritical CO₂ Seed Oil (Cosmetic Grade)',
    monthlyVolume: '20L / 20kg Pilot Trial',
    pincode: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.companyName.trim() || !formData.name.trim() || !formData.email.trim() || !formData.whatsapp.trim()) {
      setError('Please fill in all required fields (Company Name, Contact Name, Email, and WhatsApp Number).');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/sample/sea-buckthorn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit request. Please check details.');
      }

      setSubmittedData(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedData(null);
    setError(null);
    onClose();
  };

  return (
    <div className="sbt-modal-backdrop" onClick={handleResetAndClose}>
      <div className="sbt-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="sbt-modal-close" onClick={handleResetAndClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submittedData ? (
          /* SUCCESS VIEW */
          <div className="sbt-modal-success text-center">
            <div className="sbt-modal-success-icon">
              <CheckCircle size={52} className="text-neon-gold" />
            </div>
            <span className="sbt-modal-tag">ADVANCE PILOT RESERVED</span>
            <h2 className="sbt-modal-title">Sample Lead Registered!</h2>
            <p className="sbt-modal-subtitle">
              Your advance lab sample request has been registered under Reference ID:
              <br />
              <strong className="sbt-modal-ref-id">{submittedData.sampleRefId}</strong>
            </p>

            <div className="sbt-modal-summary-box">
              <div className="sbt-modal-summary-row">
                <span>Brand / Company:</span>
                <strong>{submittedData.details.companyName}</strong>
              </div>
              <div className="sbt-modal-summary-row">
                <span>Requested Extract Format:</span>
                <strong style={{ color: '#d97706' }}>{submittedData.details.requiredFormat}</strong>
              </div>
              <div className="sbt-modal-summary-row">
                <span>Pilot Tonnage / Volume:</span>
                <strong>{submittedData.details.monthlyVolume}</strong>
              </div>
              <div className="sbt-modal-summary-row">
                <span>Launch Window:</span>
                <strong style={{ color: '#059669' }}>October 2026 Batch Procurement</strong>
              </div>
            </div>

            <div className="sbt-modal-alert">
              <ShieldCheck size={20} style={{ color: '#d97706', flexShrink: 0 }} />
              <div>
                <strong>Technical Verification:</strong> Our formulation team will send the COA batch parameters and reach out via WhatsApp at <strong>{formData.whatsapp}</strong>.
              </div>
            </div>

            <div className="sbt-modal-actions">
              <a
                href={`https://wa.me/919006847527?text=${encodeURIComponent(`Hello BioLink Agri Team, I just requested an Advance Sea Buckthorn Sample (Ref: ${submittedData.sampleRefId}) for ${submittedData.details.companyName}. Please share preliminary COA.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary sbt-modal-submit-btn"
                style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', borderColor: '#d97706' }}
              >
                <MessageSquare size={16} /> Direct B2B WhatsApp Connect
              </a>
              <button onClick={handleResetAndClose} className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }}>
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <div className="sbt-modal-body">
            <div className="sbt-modal-header text-center">
              <span className="sbt-modal-tag">
                <Sparkles size={12} style={{ marginRight: '4px' }} /> ADVANCE B2B PILOT SAMPLING
              </span>
              <h2 className="sbt-modal-title">Request Advance Sea Buckthorn Sample</h2>
              <p className="sbt-modal-subtitle">
                Reserve pilot test batches of pure Leh-Ladakh &amp; Himachal extracts before official commercial launch.
              </p>
            </div>

            {error && (
              <div className="sbt-modal-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="sbt-modal-form">
              <div className="sbt-form-grid">
                {/* Company Name */}
                <div className="sbt-form-group">
                  <label htmlFor="sbt-company">
                    Company / Brand Name <span className="sbt-req">*</span>
                  </label>
                  <input
                    type="text"
                    id="sbt-company"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Lumina Botanicals Pvt Ltd"
                    required
                    className="sbt-input"
                  />
                </div>

                {/* Contact Name */}
                <div className="sbt-form-group">
                  <label htmlFor="sbt-name">
                    Contact Person <span className="sbt-req">*</span>
                  </label>
                  <input
                    type="text"
                    id="sbt-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Ananya Sharma"
                    required
                    className="sbt-input"
                  />
                </div>

                {/* Email */}
                <div className="sbt-form-group">
                  <label htmlFor="sbt-email">
                    Corporate Email <span className="sbt-req">*</span>
                  </label>
                  <input
                    type="email"
                    id="sbt-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. procurement@brand.com"
                    required
                    className="sbt-input"
                  />
                </div>

                {/* WhatsApp */}
                <div className="sbt-form-group">
                  <label htmlFor="sbt-whatsapp">
                    WhatsApp Number <span className="sbt-req">* (For COA &amp; Dispatch)</span>
                  </label>
                  <input
                    type="tel"
                    id="sbt-whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    required
                    className="sbt-input"
                  />
                </div>

                {/* Format Required */}
                <div className="sbt-form-group">
                  <label htmlFor="sbt-format">
                    Required Extract Format <span className="sbt-req">*</span>
                  </label>
                  <select
                    id="sbt-format"
                    name="requiredFormat"
                    value={formData.requiredFormat}
                    onChange={handleChange}
                    className="sbt-input sbt-select"
                  >
                    <option value="Supercritical CO₂ Seed Oil (Cosmetic Grade)">
                      Supercritical CO₂ Seed Oil (Anti-Aging &amp; Skincare)
                    </option>
                    <option value="Premium Pulp & Berry Oil (High Omega-7)">
                      Premium Pulp &amp; Berry Oil (Deep Amber-Red, High Omega-7)
                    </option>
                    <option value="Freeze-Dried Extract Powder (Soluble)">
                      Freeze-Dried Extract Powder (Nutraceutical Soluble)
                    </option>
                    <option value="Pure Cold-Pressed Juice Concentrate">
                      Pure Cold-Pressed Juice Concentrate (Herbal &amp; Beverage)
                    </option>
                    <option value="Assorted Pilot Trial Kit (All Formats)">
                      Assorted Pilot Sample Kit (Includes All Formats)
                    </option>
                  </select>
                </div>

                {/* Monthly Volume */}
                <div className="sbt-form-group">
                  <label htmlFor="sbt-volume">
                    Estimated Monthly Requirement <span className="sbt-req">*</span>
                  </label>
                  <select
                    id="sbt-volume"
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={handleChange}
                    className="sbt-input sbt-select"
                  >
                    <option value="20L / 20kg Pilot Trial">20L / 20kg Initial Pilot Batch</option>
                    <option value="50L - 100L Semi-Commercial">50L - 100L Semi-Commercial Supply</option>
                    <option value="100L - 500L Commercial Bulk">100L - 500L Bulk Commercial Contract</option>
                    <option value="500L+ Enterprise Export">500L+ Enterprise &amp; Export Scale</option>
                  </select>
                </div>
              </div>

              {/* Delivery PIN Code */}
              <div className="sbt-form-group">
                <label htmlFor="sbt-pincode">Destination PIN Code (Optional)</label>
                <input
                  type="text"
                  id="sbt-pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 110001"
                  maxLength={6}
                  className="sbt-input"
                />
              </div>

              {/* Formulation Notes */}
              <div className="sbt-form-group">
                <label htmlFor="sbt-notes">Specific Formulation Parameters / Requests (Optional)</label>
                <textarea
                  id="sbt-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Target Omega-7 concentration, carrier oil requirements, or testing parameters..."
                  rows={2}
                  className="sbt-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary sbt-modal-submit-btn"
              >
                {loading ? (
                  <span>Registering Advance Request...</span>
                ) : (
                  <>
                    <span>Submit Advance Sample Request</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
