import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerAuth } from '../context/PartnerAuthContext';
import { Lock, Mail, ShieldCheck, AlertCircle, CheckCircle, Handshake } from 'lucide-react';
import './PartnerLoginPage.css';

export default function PartnerLoginPage() {
  const { partner, partnerLogin } = usePartnerAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
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
      await partnerLogin(formData.email, formData.password);
      setSuccess('Authentication successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/partner/dashboard'), 1200);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
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
          <p>Access your referral dashboard, commission ledger, and performance analytics.</p>
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

          <div className="partner-field">
            <label htmlFor="partner-email">
              <Mail size={14} />
              <span>Partner Email</span>
            </label>
            <input
              id="partner-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your-partner-email@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="partner-field">
            <label htmlFor="partner-password">
              <Lock size={14} />
              <span>Password</span>
            </label>
            <input
              id="partner-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              minLength={8}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="partner-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="partner-spinner" />
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="partner-login-footer">
          <p>
            Forgot your password? Contact <a href="mailto:info@biolinkagri.in">info@biolinkagri.in</a>
          </p>
          <p className="partner-login-note">
            This portal is exclusively for approved BioLink referral partners.
          </p>
        </div>
      </div>
    </main>
  );
}
