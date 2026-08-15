import { Zap, Target, Users, Leaf, Globe, Shield, TrendingUp, Award } from 'lucide-react';
import ParticleField from '../components/ParticleField';
import { useScrollReveal } from '../hooks/useAnimations';
import './AboutPage.css';

const values = [
  { icon: Shield, title: 'Radical Transparency', desc: 'Every gram of manure is traceable to its source CBG plant with full lab documentation.' },
  { icon: TrendingUp, title: 'Farmer-First Economics', desc: 'We compress the supply chain so organic inputs reach cultivators at factory-gate prices.' },
  { icon: Leaf, title: 'Sustainability Core', desc: 'Every ton of bio-manure we move replaces chemical fertilizer and sequesters carbon.' },
  { icon: Globe, title: 'Technology Bridge', desc: 'We connect traditional agricultural supply with modern logistics and digital commerce.' },
];

const milestones = [
  { year: '2026', title: 'Founded', desc: 'BioLink Agritech Solutions launched as a digital bridge between CBG plants and commercial buyers.' },
  { year: '2026', title: 'First Hub Live', desc: 'Onboarded 6 supply hubs across Punjab, Maharashtra, Gujarat, Haryana, UP, and Karnataka.' },
  { year: '2026', title: 'Platform Launch', desc: 'B2B institutional portal and B2C retail shop go live with automated freight calculation.' },
  { year: 'Next', title: 'Scale Pan-India', desc: 'Expanding to 15+ hubs and launching mobile app with real-time tracking integration.' },
];

export default function AboutPage() {
  const revealRef = useScrollReveal();

  return (
    <main className="about" ref={revealRef}>
      {/* Hero */}
      <section className="about-hero" id="about-hero">
        <ParticleField count={40} color="#a855f7" speed={0.15} />
        <div className="orb orb-purple" style={{ width: 400, height: 400, top: '-10%', right: '-10%' }} />
        <div className="orb orb-green" style={{ width: 200, height: 200, bottom: '10%', left: '5%' }} />

        <div className="container about-hero__content">
          <span className="badge badge-purple">About Us</span>
          <h1 className="about-hero__title">
            Powering India's <span className="text-glow-hero">Organic Revolution</span>
          </h1>
          <p className="about-hero__subtitle">
            We are building the technology backbone that connects India's growing network of
            Compressed Biogas plants with the commercial farms, estates, and nurseries that
            desperately need clean, certified organic inputs.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section about-mission" id="about-mission">
        <div className="container">
          <div className="about-mission__grid">
            <div className="about-mission__card glass-card reveal">
              <Target size={28} className="about-mission__icon" />
              <h3 className="about-mission__title">Our Mission</h3>
              <p className="about-mission__text">
                To make lab-certified, high-quality bio-manure accessible to every commercial
                cultivator in India through transparent digital infrastructure, eliminating the
                logistical chaos between biogas plants and agricultural buyers.
              </p>
            </div>
            <div className="about-mission__card glass-card reveal">
              <Zap size={28} className="about-mission__icon" />
              <h3 className="about-mission__title">Our Vision</h3>
              <p className="about-mission__text">
                A future where every ton of organic waste is converted into certified bio-manure
                and seamlessly distributed to farms — replacing chemical fertilizers at scale,
                regenerating soil health, and building a circular bio-economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Bio */}
      <section className="section about-founder" id="about-founder">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Leadership</span>
            <h2 className="section-title text-glow">Founder Profile</h2>
          </div>
          
          <div className="founder-card glass-card reveal" style={{ display: 'flex', gap: '2rem', padding: '2.5rem', alignItems: 'center' }}>
            <div className="founder-card__avatar-wrap" style={{ flexShrink: 0 }}>
              <div className="founder-card__avatar" style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>MS</div>
            </div>
            <div className="founder-card__content">
              <h3 className="founder-card__name" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Mohammad Sahil Siddique</h3>
              <span className="founder-card__role" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--neon-cyan)', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Founder & Chief Sourcing Architect</span>
              <p className="founder-card__bio" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                Sahil founded BioLink Agri with a singular objective: to build a robust, tech-enabled digital matching corridor that links GOBARdhan Compressed Biogas (CBG) infrastructure directly with commercial cultivators. With a background in supply chain management and agricultural trade systems, Sahil oversees the operational protocols that guarantee ex-factory quality check approvals and reliable FTL logistics matching across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section about-values" id="about-values">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Core Principles</span>
            <h2 className="section-title text-glow">What Drives Us</h2>
          </div>

          <div className="about-values__grid stagger-children">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="value-card glass-card reveal">
                  <Icon size={24} className="value-card__icon" />
                  <h4 className="value-card__title">{v.title}</h4>
                  <p className="value-card__desc">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section about-timeline" id="about-timeline">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Journey</span>
            <h2 className="section-title text-glow">Our Milestones</h2>
          </div>

          <div className="about-timeline__track">
            {milestones.map((m, i) => (
              <div key={i} className="milestone reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="milestone__marker">
                  <div className="milestone__dot" />
                </div>
                <div className="milestone__content glass-card">
                  <span className="milestone__year badge">{m.year}</span>
                  <h4 className="milestone__title">{m.title}</h4>
                  <p className="milestone__desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="section about-network" id="about-network">
        <div className="container">
          <div className="about-network__grid stagger-children">
            <div className="network-stat reveal">
              <span className="network-stat__value">6+</span>
              <span className="network-stat__label">State Network</span>
            </div>
            <div className="network-stat reveal">
              <span className="network-stat__value">12+</span>
              <span className="network-stat__label">Partner Plants</span>
            </div>
            <div className="network-stat reveal">
              <span className="network-stat__value">500+</span>
              <span className="network-stat__label">MT Monthly Capacity</span>
            </div>
            <div className="network-stat reveal">
              <span className="network-stat__value">100%</span>
              <span className="network-stat__label">Digital Operations</span>
            </div>
          </div>
        </div>
      </section>

      {/* MSME Compliance Registry */}
      <section className="section about-compliance" id="about-compliance" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="compliance-card glass-card reveal" style={{ borderLeft: '4px solid var(--neon-gold)', padding: '2rem' }}>
            <div className="compliance-card__header" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <Award className="compliance-card__icon" size={24} style={{ color: 'var(--neon-gold)' }} />
              <h3 className="compliance-card__title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>MSME Compliance Registry</h3>
            </div>
            <p className="compliance-card__text" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              BioLink Agri operates as an asset-light digital trade matching coordinator under small-business MSME tax-exempt frameworks. In compliance with the Ministry of Micro, Small and Medium Enterprises, Government of India, all transactions, bulk dispatches, and GOBARdhan plant routing coordinates are processed ex-factory gate from nearest registered facilities under certified regulatory guidelines.
            </p>
            <div className="compliance-card__meta" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold" style={{ background: 'rgba(217, 119, 6, 0.08)', color: 'var(--neon-gold)', border: '1px solid rgba(217, 119, 6, 0.2)' }}>MSME Udyam Compliant</span>
              <span className="badge badge-cyan">Asset-Light Network</span>
              <span className="badge" style={{ background: 'rgba(15, 23, 42, 0.04)', color: 'var(--text-secondary)' }}>Tax-Exempt Framework</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
