import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Factory, Clock, Shield, Star, ChevronRight, Leaf, Droplets, Beaker, Package, Zap, Globe, ExternalLink, Handshake, Award } from 'lucide-react';
import ParticleField from '../components/ParticleField';
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

  return (
    <main className="home" ref={revealRef}>
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
          <div className="hero__badge badge" id="satat-badge" style={{ borderColor: 'var(--neon-cyan)', background: 'rgba(5, 150, 105, 0.08)' }}>
            <Globe size={12} style={{ color: 'var(--neon-pink)', marginRight: '4px' }} /> Verified SATAT Plant Partner (Govt of India Initiative)
          </div>
          
          <h1 className="hero__title">
            <span className="hero__title-line">India's Premier</span>
            <span className="hero__title-line text-glow-hero">Institutional Network</span>
            <span className="hero__title-line">for High-Yield</span>
            <span className="hero__title-line text-glow-hero">Bio-Manure</span>
          </h1>

          <p className="hero__subtitle">
            Lab-certified Fermented Organic Manure (FOM) dispatched directly from India's largest
            Compressed Biogas plants to your commercial cultivation site. Zero logistics hassle.
            100% transparent supply chains.
          </p>

          <div className="hero__actions">
            <Link to="/institutional" className="btn btn-primary btn-lg" id="hero-cta-quote">
              Request Bulk Quote <ArrowRight size={16} />
            </Link>
            <Link to="/shop" className="btn btn-outline btn-lg" id="hero-cta-shop">
              Retail Coming Soon <Clock size={16} />
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

      {/* ═══ STRATEGIC PARTNERS MARQUEE ═══ */}
      <section className="section partners-section" id="partners-section">
        <div className="partners-section__glow" />
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-xl)' }}>
            <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Handshake size={14} style={{ color: 'var(--neon-green)' }} /> Strategic Ecosystem
            </span>
            <h2 className="section-title text-glow">Our Strategic Partners</h2>
            <p className="section-subtitle">
              Collaborating with India's leading agri-tech platforms and sustainable farming networks.
            </p>
          </div>
        </div>

        <div className="partners-marquee-container">
          <div className="partners-marquee-track">
            {[1, 2, 3].flatMap(() => [
              {
                id: 'krishakjan',
                logo: 'KJ',
                name: 'KrishakJan',
                sub: 'Strategic Agri & Input Partner',
                desc: "Pioneering agri-solutions and farm advisory network connecting 10,000+ Indian farmers with certified organic inputs & high-yield bio-manure.",
                code: 'Code: KJ01',
                badge: '10k+ Farmers',
                url: 'https://krishakjan.com/',
                highlight: true,
              },
              {
                id: 'satat',
                logo: 'GOI',
                name: 'SATAT CBG Network',
                sub: 'Govt. of India Clean Energy',
                desc: 'Sustainable Alternative Towards Affordable Transportation (SATAT) partnership delivering lab-tested Fermented Organic Manure across India.',
                code: 'SATAT Verified',
                badge: 'SATAT Partner',
                url: '',
                highlight: false,
              },
              {
                id: 'biolink',
                logo: 'BL',
                name: 'BioLink Agritech',
                sub: 'Supply Chain & Lab Backbone',
                desc: 'Integrated logistics engine ensuring direct factory dispatch, zero middleman markups, and end-to-end NPK lab report verification.',
                code: 'Network Hub',
                badge: 'Primary Hub',
                url: '',
                highlight: false,
              },
            ]).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="partner-marquee-card">
                <div className="partner-card__header">
                  <div className="partner-logo-box">
                    {item.logo}
                  </div>
                  <div>
                    <h3 className="partner-card__title">{item.name}</h3>
                    <span className="partner-card__sub">{item.sub}</span>
                  </div>
                </div>
                <p className="partner-card__desc">{item.desc}</p>
                <div className="partner-card__tags">
                  <span className="partner-tag partner-tag--green">{item.code}</span>
                  <span className="partner-tag">{item.badge}</span>
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-card__link"
                  >
                    <span>Visit {item.name}</span>
                    <ExternalLink size={14} />
                  </a>
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
