import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/institutional', label: 'Institutional' },
    { to: '/shop', label: 'Coming Soon' },
    { to: '/logistics', label: 'Track' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo">
          <div className="navbar__logo-icon">
            <Zap size={20} />
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-brand">BioLink</span>
            <span className="navbar__logo-sub">Agritech</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
              id={`nav-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <span className="navbar__link-text">{link.label}</span>
              {location.pathname === link.to && <span className="navbar__link-indicator" />}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="navbar__actions">
          {user ? (
            <div className="navbar__user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '0.5rem' }}>
              <div className="navbar__user-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(5, 150, 105, 0.08)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glow)' }}>
                <User size={13} style={{ color: 'var(--neon-cyan)' }} />
                <span className="navbar__user-name" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                <span className="navbar__user-role-label" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>({user.role === 'buyer' ? 'Buyer' : 'Manager'})</span>
              </div>
              <button onClick={logout} className="btn btn-outline navbar__logout-btn" id="nav-logout-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline navbar__login-btn" id="nav-login-btn" style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Portal Login
            </Link>
          )}
          <Link to="/institutional" className="btn btn-primary navbar__cta" id="nav-quote-btn">
            Get Bulk Quote
          </Link>
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${mobileOpen ? 'navbar__mobile--open' : ''}`}>
        <div className="navbar__mobile-inner">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__mobile-link ${location.pathname === link.to ? 'navbar__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="navbar__mobile-user" style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1rem', paddingTop: '1rem' }}>
              <div className="navbar__mobile-user-info" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <User size={16} />
                <span>{user.name} ({user.role === 'buyer' ? 'Buyer' : 'GOBARdhan Manager'})</span>
              </div>
              <button onClick={logout} className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ marginTop: '1rem', width: '100%', display: 'block', textAlign: 'center' }}>
              Portal Login
            </Link>
          )}
          <Link to="/institutional" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
            Get Bulk Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
