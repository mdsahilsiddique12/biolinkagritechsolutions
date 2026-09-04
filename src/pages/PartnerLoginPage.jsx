import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerAuth } from '../context/PartnerAuthContext';
import { Lock, Mail, ShieldCheck, AlertCircle, CheckCircle, Handshake, User, Building2, Phone, Tag } from 'lucide-react';
import './PartnerLoginPage.css';

export default function PartnerLoginPage() {
  const { partner, partnerLogin, partnerRegister } = usePartnerAuth();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    phone: '',
    requestedCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  if (partner) {
    navigate('/partner/dashboard', { replace: true });
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        await partnerRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          company: formData.company,
          phone: formData.phone,
          requestedCode: formData.requestedCode,
        });
        setSuccess('Partner account created successfully! Redirecting to dashboard...');
      } else {
        await partnerLogin(formData.email, formData.password);
        setSuccess('Authentication successful! Redirecting to dashboard...');
      }
      setTimeout(() => navigate('/partner/dashboard'), 1200);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="partner-login-page">
      <div className="partner-login-card">
        <div className="partner-login-header">
          <div className="partner-login-icon">
            <Handshake size={32} />
          </div>
          <h1>Partner Portal</h1>
          <p>{isRegistering ? 'Register as an official BioLink partner and start earning commissions.' : 'Access your referral dashboard, commission ledger, and performance analytics.'}</p>
        </div>

        <div className="partner-auth-tabs">
          <button
            type="button"
            className={`partner-tab-btn ${!isRegistering ? 'active' : ''}`}
            onClick={() => {
              setIsRegistering(false);
              setError('');
              setSuccess('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`partner-tab-btn ${isRegistering ? 'active' : ''}`}
            onClick={() => {
              setIsRegistering(true);
              setError('');
              setSuccess('');
            }}
          >
            Register Partner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="partner-login-form">
          {error && (
            <div className="partner-alert partner-alert--error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="partner-alert partner-alert--success">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {isRegistering && (
            <>
              <div className="partner-field">
                <label htmlFor="partner-name">
                  <User size={14} />
                  <span>Full Name *</span>
                </label>
                <input
                  id="partner-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div className="partner-field">
                <label htmlFor="partner-company">
                  <Building2 size={14} />
                  <span>Company / Organization</span>
                </label>
                <input
                  id="partner-company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. KrishakJan Solutions"
                />
              </div>

              <div className="partner-field">
                <label htmlFor="partner-phone">
                  <Phone size={14} />
                  <span>Phone / WhatsApp</span>
                </label>
                <input
                  id="partner-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91-9876543210"
                />
              </div>

              <div className="partner-field">
                <label htmlFor="partner-code">
                  <Tag size={14} />
                  <span>Requested Referral Code (Optional)</span>
                </label>
                <input
                  id="partner-code"
                  type="text"
                  name="requestedCode"
                  value={formData.requestedCode}
                  onChange={handleInputChange}
                  placeholder="e.g. KJ02 or AGRI10"
                />
              </div>
            </>
          )}

          <div className="partner-field">
            <label htmlFor="partner-email">
              <Mail size={14} />
              <span>Partner Email *</span>
            </label>
            <input
              id="partner-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="partner@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="partner-field">
            <label htmlFor="partner-password">
              <Lock size={14} />
              <span>Password *</span>
            </label>
            <input
              id="partner-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="partner-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="partner-spinner" />
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>{isRegistering ? 'Create Partner Account & Login' : 'Sign In to Dashboard'}</span>
              </>
            )}
          </button>
        </form>

        <div className="partner-login-footer">
          <p>
            Need help? Contact <a href="mailto:info@biolinkagri.in">info@biolinkagri.in</a> or call <a href="tel:+919000000000">+91-9000000000</a>
          </p>
          <p className="partner-login-note">
            Registered partners receive ₹300/MT referral commission & exclusive farmer discounts.
          </p>
        </div>
      </div>
    </main>
  );
}
