import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Factory, Clock, Shield, Star, ChevronRight, Leaf, Droplets, Beaker, Package, Zap, Globe, ExternalLink, Handshake, Award, Sparkles, CheckCircle2, ChevronDown, Mountain, Sun, Layers, Droplet } from 'lucide-react';
import ParticleField from '../components/ParticleField';
import SeaBuckthornModal from '../components/SeaBuckthornModal';
import { useScrollReveal, useCountUp } from '../hooks/useAnimations';
import { testimonials, stats, certifications, supplyHubs } from '../data/testimonials';
import { products } from '../data/products';
import './HomePage.css';

const iconMap = { Truck, Factory, Clock, Shield };

function StatCard({ stat, index }) {
  const { containerRef, countRef } = useCountUp(stat.value, 2000);
  const Icon = iconMap[stat.icon];

  return (
    <div className="stat-card reveal" ref={containerRef} style={{ transitionDelay: `${index * 120}ms` }}>
      <div className="stat-card__icon">
        <Icon size={22} />
      </div>
      <div className="stat-card__value">
        {stat.prefix && <span>{stat.prefix}</span>}
        <span ref={countRef}>0</span>
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <p className="stat-card__label">{stat.label}</p>
    </div>
  );
}

export default function HomePage() {
  const revealRef = useScrollReveal();
  const tickerRef = useRef(null);
  const [isSampleDropdownOpen, setIsSampleDropdownOpen] = useState(false);
  const [isSbtModalOpen, setIsSbtModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSampleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="home" ref={revealRef}>
      {/* ═══ SEA BUCKTHORN ADVANCE SAMPLE MODAL ═══ */}
      <SeaBuckthornModal isOpen={isSbtModalOpen} onClose={() => setIsSbtModalOpen(false)} />

      {/* ═══ HERO ═══ */}
      <section className="hero" id="hero-section">
        <ParticleField count={80} />
        
        {/* Floating Orbs */}
        <div className="orb orb-green" style={{ width: 400, height: 400, top: '-10%', right: '-5%' }} />
        <div className="orb orb-cyan" style={{ width: 300, height: 300, bottom: '10%', left: '-8%' }} />
        <div className="orb orb-purple" style={{ width: 250, height: 250, top: '40%', right: '20%' }} />

        {/* HUD Corner Brackets */}
        <div className="hero__hud-corner hero__hud-corner--tl" />
        <div className="hero__hud-corner hero__hud-corner--tr" />
        <div className="hero__hud-corner hero__hud-corner--bl" />
        <div className="hero__hud-corner hero__hud-corner--br" />

        <div className="hero__content container">
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <div className="hero__badge badge" id="satat-badge" style={{ borderColor: 'var(--neon-cyan)', background: 'rgba(5, 150, 105, 0.08)' }}>
              <Globe size={12} style={{ color: 'var(--neon-pink)', marginRight: '4px' }} /> Verified SATAT Plant Partner (Govt of India Initiative)
            </div>
            <button
              onClick={() => setIsSbtModalOpen(true)}
              className="hero__badge badge"
              id="sbt-badge-hero"
              style={{ borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', cursor: 'pointer', border: '1px solid #f59e0b' }}
            >
              <Sparkles size={12} style={{ marginRight: '4px' }} /> NEW VERTICAL: Himalayan Sea Buckthorn B2B Sourcing →
            </button>
          </div>
          
          <h1 className="hero__title">
            <span className="hero__title-line">India’s Premier</span>
            <span className="hero__title-line text-glow-hero">B2B Network</span>
            <span className="hero__title-line">for High-Yield Bio-Inputs</span>
            <span className="hero__title-line text-glow-hero">&amp; Botanical Extracts</span>
          </h1>

          <p className="hero__subtitle">
            Lab-certified Fermented Organic Manure (FOM) and premium Himalayan Sea Buckthorn extracts dispatched directly from India’s largest processing hubs to your commercial facility. Zero logistics hassle. 100% traceable supply chains.
          </p>

          <div className="hero__actions">
            {/* Split / Interactive Dropdown Sample Button */}
            <div className="sample-dropdown-container" ref={dropdownRef}>
              <button
                className="btn btn-primary btn-lg"
                id="hero-cta-sample-dropdown"
                onClick={() => setIsSampleDropdownOpen(!isSampleDropdownOpen)}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)', gap: '0.5rem' }}
              >
                <Package size={18} />
                <span>Order Sample</span>
                <ChevronDown size={16} style={{ transform: isSampleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
              </button>

              {isSampleDropdownOpen && (
                <div className="sample-dropdown-menu">
                  <Link to="/sample" className="sample-dropdown-item" onClick={() => setIsSampleDropdownOpen(false)}>
                    <div className="sample-dropdown-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                      <Package size={18} />
                    </div>
                    <div>
                      <span className="sample-dropdown-title">Order FOM Manure Sample</span>
                      <span className="sample-dropdown-sub">20kg / 30kg / 50kg Lab Tested Bags</span>
                    </div>
                  </Link>

                  <button
                    className="sample-dropdown-item sample-dropdown-item--sbt"
                    onClick={() => {
                      setIsSampleDropdownOpen(false);
                      setIsSbtModalOpen(true);
                    }}
                  >
                    <div className="sample-dropdown-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <span className="sample-dropdown-title" style={{ color: '#ea580c' }}>Order Sea Buckthorn Test Pack</span>
                      <span className="sample-dropdown-sub">Seed Oil, Pulp Oil &amp; Soluble Powder</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <Link to="/institutional" className="btn btn-outline btn-lg" id="hero-cta-quote">
              Get Bulk Quote <ArrowRight size={16} />
            </Link>
          </div>

          {/* Holographic data strip */}
          <div className="hero__data-strip">
            <div className="hero__data-item">
              <span className="hero__data-value">1,200+</span>
              <span className="hero__data-label">Tons Capacity</span>
            </div>
            <div className="hero__data-divider" />
            <div className="hero__data-item">
              <span className="hero__data-value">6</span>
              <span className="hero__data-label">State Network</span>
            </div>
            <div className="hero__data-divider" />
            <div className="hero__data-item">
              <span className="hero__data-value">24/7</span>
              <span className="hero__data-label">Dispatch Ready</span>
            </div>
          </div>
        </div>

        {/* Animated scan line */}
        <div className="hero__scanline" />
      </section>

      {/* ═══ LIVE SUPPLY TICKER ═══ */}
      <section className="ticker-section" id="supply-ticker">
        <div className="ticker-section__glow" />
        <div className="ticker-track" ref={tickerRef}>
          <div className="ticker-content">
            {[...supplyHubs, ...supplyHubs].map((hub, i) => (
              <div key={i} className="ticker-item">
                <span className={`ticker-dot ${hub.status === 'active' ? 'ticker-dot--active' : 'ticker-dot--limited'}`} />
                <span className="ticker-state">{hub.state} Hub</span>
                <span className="ticker-tons">{hub.tons} Tons Available</span>
                <span className="ticker-coord">{hub.lat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEA BUCKTHORN NEW VERTICAL SECTION (BELOW MAIN FOLD) ═══ */}
      <section className="sb-section" id="sea-buckthorn-section">
        <div className="sb-section__bg-glow" />
        <div className="container">
          <div className="sb-pill-tag">
            <Sparkles size={14} /> NEW VERTICAL LAUNCHING SOON — OCTOBER 2026
          </div>
          
          <h2 className="sb-heading">
            Pure Himalayan Sea Buckthorn for <span style={{ color: '#fbbf24' }}>Premium Cosmetics &amp; Wellness</span> Formulation
          </h2>
          <p className="sb-subtitle">
            Himalayan B2B sourcing directly from high-altitude Leh-Ladakh &amp; Lahaul-Spiti clusters under rigorous quality checks for cosmetic, nutraceutical, and wellness brands.
          </p>

          <div className="sb-grid">
            {/* Left Column: Feature Highlights */}
            <div className="sb-feature-list">
              <div className="sb-feature-item">
                <div className="sb-feature-icon-wrap">
                  <Droplet size={22} />
                </div>
                <div>
                  <h3 className="sb-feature-title">Supercritical CO₂ Seed Oil</h3>
                  <p className="sb-feature-desc">
                    Rich in rare Omega-3, 6, and 9. Perfect for high-end anti-aging skincare formulations and dermal restoration serums.
                  </p>
                </div>
              </div>

              <div className="sb-feature-item">
                <div className="sb-feature-icon-wrap">
                  <Sun size={22} />
                </div>
                <div>
                  <h3 className="sb-feature-title">Premium Pulp &amp; Berry Oil</h3>
                  <p className="sb-feature-desc">
                    Deep amber-red oil packed with intense natural antioxidants and high Omega-7 (Palmitoleic acid) content for barrier repair.
                  </p>
                </div>
              </div>

              <div className="sb-feature-item">
                <div className="sb-feature-icon-wrap">
                  <Layers size={22} />
                </div>
                <div>
                  <h3 className="sb-feature-title">Freeze-Dried Extract Powder</h3>
                  <p className="sb-feature-desc">
                    Fully soluble, moisture-locked powder optimized for nutraceutical capsules, immunity juices, and premium herbal blends.
                  </p>
                </div>
              </div>

              <div className="sb-feature-item">
                <div className="sb-feature-icon-wrap">
                  <Mountain size={22} />
                </div>
                <div>
                  <h3 className="sb-feature-title">Verified Himalayan Origin</h3>
                  <p className="sb-feature-desc">
                    Direct-from-source procurement from Leh-Ladakh and Lahaul-Spiti clusters under rigorous lab purity and heavy-metal testing.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-md)' }}>
                <button
                  onClick={() => setIsSbtModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a', fontWeight: 800, border: 'none', boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)' }}
                >
                  <Sparkles size={18} /> Request Advance Lab Sample <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Column: Premium Visual Card */}
            <div className="sb-visual-card">
              <span className="sb-visual-badge">COMING SOON OCTOBER 2026</span>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.5))', border: '2px solid #f59e0b', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)' }}>
                <Droplet size={38} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                Himalayan Sea Buckthorn Extract
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
                CO₂ Supercritical Seed Oil &bull; Berry Pulp Oil &bull; Soluble Powder
              </p>

              <div className="sb-omega-pills">
                <span className="sb-omega-pill">Omega-3</span>
                <span className="sb-omega-pill">Omega-6</span>
                <span className="sb-omega-pill" style={{ background: 'rgba(245, 158, 11, 0.25)', borderColor: '#f59e0b', color: '#ffffff' }}>Omega-7 (Palmitoleic)</span>
                <span className="sb-omega-pill">Omega-9</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '1.5rem', textAlign: 'left', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span>Origin:</span>
                  <strong style={{ color: '#ffffff' }}>Leh-Ladakh / Lahaul-Spiti</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span>Purity Standard:</span>
                  <strong style={{ color: '#fbbf24' }}>100% Pure Supercritical</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pilot Availability:</span>
                  <strong style={{ color: '#34d399' }}>20L / 20kg Sample Batches</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED SAMPLE PROMO SECTION ═══ */}
      <section className="section sample-promo-section" style={{ padding: 'var(--space-2xl) 0', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(5, 150, 105, 0.08) 50%, rgba(15, 23, 42, 0.4) 100%)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-xl)', alignItems: 'center' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: 'var(--space-sm)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> Test Before Commercial Bulk Booking
                </span>
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, margin: '0.4rem 0 1rem 0' }} className="text-glow">
                  Request BioLink <span className="text-highlight">Sample Testing Packs</span>
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>
                  Test our lab-certified Fermented Organic Manure (FOM) directly on your crops or soil trial plots before committing to full 15-Ton FTL consignments. Available in three custom sizes with doorstep delivery across India.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} /> <strong>20 kg</strong> Trial Bag
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} /> <strong>30 kg</strong> Soil Test Pack
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} /> <strong>50 kg</strong> Commercial Demo Bag
                  </div>
                </div>

                <Link to="/sample" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, var(--neon-cyan), #0284c7)', color: '#0f172a', fontWeight: 800, border: 'none' }}>
                  <Package size={18} /> Place Sample Order Now <ArrowRight size={16} />
                </Link>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--neon-gold)', lineHeight: 1 }}>
                  20 / 30 / 50
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Kilogram Sample Bags
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.8rem 0 var(--space-md) 0' }}>
                  Complete with Batch Lab Certificate & NPK Analysis Report attached.
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-sm)', fontSize: '0.8rem', color: 'var(--neon-green)', fontWeight: 600 }}>
                  ✓ Direct Plant Dispatch in 24-48 Hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Operations Protocol</span>
            <h2 className="section-title text-glow">How It Works</h2>
            <p className="section-subtitle">
              Three precision-engineered steps from source to site. No middleman confusion. No hidden costs.
            </p>
          </div>

          <div className="hiw-grid stagger-children">
            <div className="hiw-card glass-card reveal">
              <div className="hiw-card__number">01</div>
              <div className="hiw-card__icon-wrap">
                <Beaker size={28} />
              </div>
              <h3 className="hiw-card__title">Select Specifications</h3>
              <p className="hiw-card__desc">
                Define your exact NPK ratios, moisture level, granule size, and tonnage requirements
                through our precision quote system.
              </p>
              <div className="hiw-card__connector" />
            </div>

            <div className="hiw-card glass-card reveal">
              <div className="hiw-card__number">02</div>
              <div className="hiw-card__icon-wrap">
                <Globe size={28} />
              </div>
              <h3 className="hiw-card__title">Instant Freight Integration</h3>
              <p className="hiw-card__desc">
                Our automated logistics engine calculates the lowest interstate shipping rates
                across our network of verified freight partners in real-time.
              </p>
              <div className="hiw-card__connector" />
            </div>

            <div className="hiw-card glass-card reveal">
              <div className="hiw-card__number">03</div>
              <div className="hiw-card__icon-wrap">
                <Truck size={28} />
              </div>
              <h3 className="hiw-card__title">Direct Factory Dispatch</h3>
              <p className="hiw-card__desc">
                Sealed, quality-checked truckloads dispatched directly from the CBG manufacturing
                facility to your cultivation site. Track every kilometer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NPK VIDEO HOOKS ═══ */}
      <section className="section npk-hooks" id="npk-hooks">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Real-Time Quality Check</span>
            <h2 className="section-title text-glow">NPK & Moisture Lab Testing Hooks</h2>
            <p className="section-subtitle">
              Watch our GOBARdhan plant facility managers run real-time moisture testing and organic matter calibration.
            </p>
          </div>

          <div className="npk-grid">
            <div className="npk-video glass-card reveal-left">
              <div className="video-player-mock">
                <div className="video-overlay">
                  <div className="play-button-glow">
                    <div className="play-button-inner">▶</div>
                  </div>
                  <span className="video-length">02:15 Min</span>
                  <span className="video-title">CBG Plant Batch Analysis - Moisture Check (Target &lt; 30%)</span>
                </div>
                <div className="video-placeholder-bg" />
              </div>
            </div>
            
            <div className="npk-details reveal-right">
              <h3 className="npk-details__title">Radical Lab Integrity</h3>
              <p className="npk-details__text">
                Every batch of Fermented Organic Manure is analyzed for primary nutrients (Nitrogen, Phosphorus, Potassium), organic carbon content, and heavy metal limits.
              </p>
              
              <ul className="npk-specs">
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Nitrogen (N)</span>
                  <span className="npk-spec-value">&gt; 1.5%</span>
                </li>
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Phosphorus (P2O5)</span>
                  <span className="npk-spec-value">&gt; 1.0%</span>
                </li>
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Potassium (K2O)</span>
                  <span className="npk-spec-value">&gt; 1.0%</span>
                </li>
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Moisture Content</span>
                  <span className="npk-spec-value" style={{ color: 'var(--neon-gold)', fontWeight: 'bold' }}>&lt; 30.0% (Hard Target)</span>
                </li>
              </ul>
              
              <Link to="/institutional" className="btn btn-outline" style={{ marginTop: 'var(--space-md)' }}>
                View Full Lab Certification Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="section stats-section" id="stats-section">
        <div className="container">
          <div className="stats-grid stagger-children">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT SHOWCASE ═══ */}
      <section className="section products-preview" id="products-preview">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Product Catalog</span>
            <h2 className="section-title text-glow">Upcoming Retail Products</h2>
            <p className="section-subtitle">
              Premium, lab-certified organic inputs coming soon in retail packaging. Bulk institutional orders available now (minimum 15 MT).
            </p>
          </div>

          <div className="preview-grid stagger-children">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="preview-card glass-card reveal">
                <div className="preview-card__visual">
                  <div className="preview-card__icon-wrap">
                    {product.category === 'solid' && <Leaf size={40} />}
                    {product.category === 'liquid' && <Droplets size={40} />}
                    {product.category === 'specialty' && <Beaker size={40} />}
                  </div>
                </div>
                <span className={`badge badge-${product.badgeType === 'green' ? '' : product.badgeType}`}>
                  {product.badge}
                </span>
                <h3 className="preview-card__name">{product.shortName}</h3>
                <p className="preview-card__desc">{product.description}</p>
                <div className="preview-card__footer">
                  <span className="preview-card__price">
                    From ₹{product.variants[0].price}
                  </span>
                  <Link to="/shop" className="preview-card__link">
                    View <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="products-preview__cta reveal">
            <Link to="/shop" className="btn btn-outline btn-lg">
              View All Coming Soon Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TRUST & CERTIFICATIONS ═══ */}
      <section className="section trust-section" id="trust-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Verified Standards</span>
            <h2 className="section-title text-glow">Certifications & Compliance</h2>
          </div>

          <div className="cert-grid stagger-children">
            {certifications.map((cert) => (
              <div key={cert.name} className="cert-card glass-card reveal">
                <Shield size={24} className="cert-card__icon" />
                <h4 className="cert-card__name">{cert.name}</h4>
                <p className="cert-card__desc">{cert.description}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="testimonials reveal">
            <div className="section-header" style={{ marginBottom: 'var(--space-xl)' }}>
              <span className="section-label">Client Feedback</span>
              <h2 className="section-title text-glow">Trusted Nationwide</h2>
            </div>
            <div className="testimonial-grid stagger-children">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="testimonial-card glass-card reveal">
                  <div className="testimonial-card__stars">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p className="testimonial-card__text">"{t.text}"</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="testimonial-card__name">{t.name}</h4>
                      <p className="testimonial-card__role">{t.role}</p>
                    </div>
                  </div>
                  <span className="badge badge-cyan">{t.tons}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CIRCULAR STRATEGIC PARTNERS MARQUEE ═══ */}
      <section className="partners-circle-section" id="partners-section">
        <div className="partners-circle-header">
          <span className="partners-circle-label">
            <Handshake size={14} /> Strategic Ecosystem
          </span>
          <h2 className="partners-circle-title">Join the BioLink Network</h2>
          <p className="partners-circle-subtitle">
            Collaborating with India's premier agri-tech platforms and sustainable farming networks.
          </p>
        </div>

        <div className="partners-circle-container">
          <div className="partners-circle-track">
            {[1, 2, 3].flatMap(() => [
              {
                id: 'krishakjan',
                name: 'KrishakJan',
                subtitle: 'Strategic Agri & Input Partner',
                logoImg: '/krishakjan-logo.png',
                url: 'https://krishakjan.com/',
              },
              {
                id: 'satat',
                name: 'SATAT CBG Network',
                subtitle: 'Govt. of India Clean Energy',
                emblemClass: 'circle-logo-emblem--indigo',
                logoText: 'SATAT\nCBG',
                url: 'https://satat.co.in/',
              },
              {
                id: 'biolink',
                name: 'BioLink Agritech',
                subtitle: 'Supply Chain & Lab Backbone',
                emblemClass: 'circle-logo-emblem--green',
                logoText: 'BioLink\nAgri',
                url: 'https://biolinkagri.in/',
              },
              {
                id: 'gobardhan',
                name: 'GOBARdhan Initiative',
                subtitle: 'Organic Inputs & Clean Energy',
                emblemClass: 'circle-logo-emblem--gold',
                logoText: 'GOBAR\ndhan',
                url: 'https://gobardhan.co.in/',
              },
              {
                id: 'nabard',
                name: 'NABARD Farmers Club',
                subtitle: 'Agri Development Network',
                emblemClass: 'circle-logo-emblem--indigo',
                logoText: 'NABARD\nClub',
                url: 'https://www.nabard.org/',
              },
            ]).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="circle-partner-item">
                <div className="circle-logo-badge">
                  {item.logoImg ? (
                    <img src={item.logoImg} alt={item.name} className="circle-logo-img" />
                  ) : (
                    <div className={`circle-logo-emblem ${item.emblemClass}`}>
                      {item.logoText.split('\n').map((line, i) => (
                        <span key={i}>{line}</span>
                      ))}
                    </div>
                  )}
                </div>
                <h4 className="circle-partner-name">{item.name}</h4>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="circle-partner-link"
                  >
                    <span>Visit Website</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="circle-partner-sub">{item.subtitle}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="section cta-banner" id="cta-banner">
        <div className="cta-banner__bg">
          <ParticleField count={40} color="#00d4ff" speed={0.15} />
        </div>
        <div className="container cta-banner__content reveal-scale">
          <h2 className="cta-banner__title">
            Ready to <span className="text-glow">Transform Your Soil</span>?
          </h2>
          <p className="cta-banner__subtitle">
            Get your custom institutional quote in under 60 seconds.
            Direct factory pricing. Zero hidden costs.
          </p>
          <div className="cta-banner__actions">
            <Link to="/institutional" className="btn btn-primary btn-lg">
              Get Institutional Quote <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
