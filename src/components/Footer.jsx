import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, ArrowUpRight, Globe, Send } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      {/* Top glow line */}
      <div className="footer__glow-line" />

      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%', background: 'none', border: 'none', width: '32px', height: '32px' }}>
                <img src="/logo.png" alt="BioLink Logo" className="footer__logo-img" style={{ height: '32px', width: '32px', objectFit: 'cover' }} />
              </div>
              <div>
                <span className="footer__logo-brand">BioLink</span>
                <span className="footer__logo-sub">Agritech Solutions</span>
              </div>
            </Link>
            <p className="footer__desc">
              India's premier institutional network for lab-certified, high-yield bio-manure.
              Bridging Biogas Plants and commercial buyers through technology.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" aria-label="LinkedIn"><Globe size={16} /></a>
              <a href="#" className="footer__social" aria-label="Twitter"><Send size={16} /></a>
              <a href="mailto:info@biolinkagri.in" className="footer__social" aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/institutional" className="footer__link">Institutional Supply</Link>
            <Link to="/shop" className="footer__link">Retail (Coming Soon)</Link>
            <Link to="/logistics" className="footer__link">Track Shipment</Link>
            <Link to="/about" className="footer__link">About Us</Link>
          </div>

          {/* Products */}
          <div className="footer__col">
            <h4 className="footer__col-title">Products (Coming Soon)</h4>
            <Link to="/shop" className="footer__link">Solid FOM Granules</Link>
            <Link to="/shop" className="footer__link">Liquid Booster Slurry</Link>
            <Link to="/shop" className="footer__link">VermiGold Blend</Link>
            <Link to="/shop" className="footer__link">Soil Revive Kit</Link>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Get In Touch</h4>
            <div className="footer__contact-item">
              <Mail size={14} />
              <span>info@biolinkagri.in</span>
            </div>
            <div className="footer__contact-item">
              <Phone size={14} />
              <span>Calls: +91 8581868466</span>
            </div>
            <div className="footer__contact-item">
              <Phone size={14} style={{ opacity: 0.7 }} />
              <span>WhatsApp: +91 9006847527</span>
            </div>
            <div className="footer__contact-item">
              <MapPin size={14} />
              <span>India (Pan-National Network)</span>
            </div>
            <Link to="/institutional" className="btn btn-outline footer__cta">
              Request Quote <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © 2026 BioLink Agritech Solutions Pvt. Ltd. All rights reserved.
          </p>
          <div className="footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <a href="#">FCO Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
