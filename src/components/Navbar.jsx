import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
          <Link to="/institutional" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Get Bulk Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
