import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, CheckCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [role, setRole] = useState('buyer'); // 'buyer' or 'plant_partner'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  if (user) {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLoginTab) {
        await login(formData.email, formData.password);
        setSuccess('Authentication successful! Redirecting...');
        setTimeout(() => {
          navigate(location.state?.from?.pathname || '/');
        }, 1500);
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          role,
          formData.phone
        );
        setSuccess('Registration secured! Please sign in using your credentials.');
        setIsLoginTab(true);
        setFormData({ ...formData, password: '' });
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="orb orb-green" style={{ width: 350, height: 350, top: '15%', left: '5%' }} />
      <div className="orb orb-cyan" style={{ width: 250, height: 250, bottom: '15%', right: '5%' }} />

      <div className="container login-container">
        <div className="login-card glass-card">
          {/* Header */}
          <div className="login-card__header">
            <div className="login-card__logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%', background: 'none', border: 'none', width: '56px', height: '56px', margin: '0 auto var(--space-md)' }}>
              <img src="/logo.png" alt="BioLink Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 className="login-card__title">
              BioLink Agri <span className="text-glow">Security Portal</span>
            </h2>
            <p className="login-card__subtitle">
              Verify credentials to access live logistics & B2B procurement pipelines.
            </p>
          </div>

          {/* Form Tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${isLoginTab ? 'login-tab--active' : ''}`}
              onClick={() => {
                setIsLoginTab(true);
                setError('');
                setSuccess('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`login-tab ${!isLoginTab ? 'login-tab--active' : ''}`}
              onClick={() => {
                setIsLoginTab(false);
                setError('');
                setSuccess('');
              }}
            >
              Register Network Account
            </button>
          </div>

          {/* Role selector for registration */}
          {!isLoginTab && (
            <div className="role-selector">
              <span className="role-selector__label">Select Network Node Role:</span>
              <div className="role-options">
                <button
                  type="button"
                  className={`role-option ${role === 'buyer' ? 'role-option--active' : ''}`}
                  onClick={() => setRole('buyer')}
                >
                  <span className="role-option__title">Buyer</span>
                  <span className="role-option__desc">Farms, Estates, Cooperatives</span>
                </button>
                <button
                  type="button"
                  className={`role-option ${role === 'plant_partner' ? 'role-option--active' : ''}`}
                  onClick={() => setRole('plant_partner')}
                >
                  <span className="role-option__title">GOBARdhan Facility</span>
                  <span className="role-option__desc">Production & Dispatch Managers</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Name - Register only */}
            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label">Full Representative Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Official Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Phone - Register only */}
            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label">WhatsApp Sourcing Phone (+91)</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password Descriptor</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* T&C + Privacy Policy Checkbox (Registration only) */}
            {!isLoginTab && (
              <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '8px', marginTop: 'var(--space-md)' }}>
                <input
                  type="checkbox"
                  id="register-terms"
                  required
                  style={{ marginTop: '4px', cursor: 'pointer' }}
                />
                <label htmlFor="register-terms" className="form-label" style={{ fontSize: '0.78rem', textTransform: 'none', letterSpacing: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  I agree to the <a href="/terms" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Privacy Policy</a>
                </label>
              </div>
            )}

            {/* Message prompts */}
            {error && (
              <div className="auth-alert auth-alert--error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="auth-alert auth-alert--success">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg login-submit" disabled={isLoading}>
              {isLoading ? 'Verifying Node Connection...' : isLoginTab ? 'Authorize Connection' : 'Register Secure Profile'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Subtext info */}
          <div className="login-footer">
            <p>
              By accessing this network portal, you acknowledge that all bulk trade routing coordinates,
              Dharma Kanta weighbridge data, and quality testing audits are protected.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
