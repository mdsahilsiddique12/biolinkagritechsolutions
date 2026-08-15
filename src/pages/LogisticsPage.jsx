import { useState } from 'react';
import { Search, Truck, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';
import { api } from '../lib/api';
import './LogisticsPage.css';

export default function LogisticsPage() {
  const [trackingId, setTrackingId] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState('');
  const revealRef = useScrollReveal();

  const handleDistanceCalc = (val) => {
    setDistance(val);
  };

  const loadTracking = async (id) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await api.getTracking(id);
      setTrackingData(result);
      setShowTracking(true);
    } catch (requestError) {
      setTrackingData(null);
      setShowTracking(false);
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    await loadTracking(trackingId.trim());
  };

  return (
    <main className="logistics" ref={revealRef}>
      <section className="logistics-hero" id="logistics-hero">
        <div className="orb orb-cyan" style={{ width: 300, height: 300, top: '0', right: '-5%' }} />
        <div className="container logistics-hero__content">
          <span className="badge badge-cyan">Logistics Dashboard</span>
          <h1 className="logistics-hero__title">
            Track Your <span className="text-glow-hero">Consignment</span>
          </h1>
          <p className="logistics-hero__subtitle">
            Real-time tracking for all institutional dispatches. Enter your consignment ID below.
          </p>

          <form className="logistics-search" onSubmit={handleSearch} id="tracking-search">
            <div className="logistics-search__icon">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="logistics-search__input"
              placeholder="Enter Consignment ID (e.g., BL-2026-08-0847)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              id="tracking-input"
            />
            <button type="submit" className="btn btn-primary logistics-search__btn" id="tracking-submit">
              {isLoading ? 'Checking...' : 'Track'} <ArrowRight size={14} />
            </button>
          </form>

          {error ? <p className="form-error">{error}</p> : null}

          {!showTracking && (
            <button
              className="btn btn-ghost logistics-demo"
              onClick={() => {
                setTrackingId('BL-2026-08-0847');
                void loadTracking('BL-2026-08-0847');
              }}
              id="tracking-demo"
            >
              View Demo Tracking {'->'}
            </button>
          )}
        </div>
      </section>

      {showTracking && trackingData ? (
        <section className="section logistics-result" id="tracking-result">
          <div className="container">
            <div className="logistics-result__card glass-card">
              <div className="logistics-result__header">
                <div>
                  <span className="form-label">Consignment ID</span>
                  <h3 className="logistics-result__id">{trackingData.trackingId}</h3>
                </div>
                <span className="badge badge-cyan">
                  <Truck size={12} /> {String(trackingData.status || '').replace(/-/g, ' ')}
                </span>
              </div>

              <div className="logistics-result__details">
                <div className="logistics-detail">
                  <span className="logistics-detail__label">Product</span>
                  <span className="logistics-detail__value">{trackingData.product}</span>
                </div>
                <div className="logistics-detail">
                  <span className="logistics-detail__label">Volume</span>
                  <span className="logistics-detail__value">{trackingData.volume}</span>
                </div>
                <div className="logistics-detail">
                  <span className="logistics-detail__label">Origin</span>
                  <span className="logistics-detail__value">{trackingData.origin}</span>
                </div>
                <div className="logistics-detail">
                  <span className="logistics-detail__label">Destination</span>
                  <span className="logistics-detail__value">{trackingData.destination}</span>
                </div>
              </div>

              <div className="logistics-timeline">
                <h4 className="logistics-timeline__title">
                  <Clock size={16} /> Shipment Timeline
                </h4>
                <div className="logistics-timeline__track">
                  {trackingData.steps?.map((step, i) => (
                    <div
                      key={`${step.label}-${i}`}
                      className={`timeline-step ${step.done ? 'timeline-step--done' : ''} ${step.active ? 'timeline-step--active' : ''}`}
                    >
                      <div className="timeline-step__marker">
                        {step.done ? (
                          <CheckCircle size={18} />
                        ) : step.active ? (
                          <div className="timeline-step__pulse" />
                        ) : (
                          <div className="timeline-step__dot" />
                        )}
                      </div>
                      <div className="timeline-step__connector" />
                      <div className="timeline-step__content">
                        <h5 className="timeline-step__label">{step.label}</h5>
                        <p className="timeline-step__detail">{step.detail}</p>
                        <span className="timeline-step__time">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ CORPORATE LOGISTICS STANDARDS & CALCULATOR ═══ */}
      <section className="section logistics-standards" id="logistics-standards" style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 'var(--space-xl)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Logistics Protocols</span>
            <h2 className="section-title text-glow">Weighbridge Rules & Interstate Distance Tracker</h2>
            <p className="section-subtitle">
              Verify freight regulations, Dharma Kanta platform rules, and check out-of-state transit parameters in real-time.
            </p>
          </div>

          <div className="logistics-rules-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', marginTop: 'var(--space-xl)' }}>
            
            {/* Dharma Kanta Weighbridge Rules */}
            <div className="rules-card glass-card reveal-left" style={{ padding: '2rem' }}>
              <h3 className="rules-card__title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Dharma Kanta Weighbridge Rules
              </h3>
              <p className="rules-card__desc" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                To guarantee absolute weight transparency, BioLink Agritech enforces a double-entry weighbridge validation protocol at the dispatch plant and receiving site:
              </p>
              
              <ul className="rules-list" style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li className="rules-item">
                  <strong>Gross-minus-Tare Verification:</strong> Every cargo shipment payload is weighed twice on a state-authorized Dharma Kanta platform. The net payload weight is determined by subtracting the verified vehicle tare weight from the gross laden vehicle weight.
                </li>
                <li className="rules-item">
                  <strong>Authorized Receipts:</strong> Drivers must secure a printed, stamped Dharma Kanta slip before dispatch and present it upon gate clearance at the buyer's estate or cultivation site.
                </li>
                <li className="rules-item">
                  <strong>Discrepancy Allowance:</strong> Any discrepancy between plant gross weights and site receiving weights exceeding 1.5% triggers automatic QA dispute review and payment hold in escrow.
                </li>
              </ul>
            </div>

            {/* Out-of-State Distance Tracker */}
            <div className="tracker-card glass-card reveal-right" style={{ padding: '2rem' }}>
              <h3 className="tracker-card__title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Out-of-State Distance & Transit Tracker
              </h3>
              <p className="tracker-card__desc" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Enter your shipping distance to estimate e-way bill validity, transit days, and interstate toll checkposts.
              </p>

              <div className="distance-calculator">
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Est. Sourcing Distance (in Kilometers)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Enter distance (e.g. 450)"
                    value={distance}
                    onChange={(e) => handleDistanceCalc(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                {distance && (
                  <div className="calc-results" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.2rem' }}>
                    <div className="calc-result-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span className="calc-label" style={{ color: 'var(--text-secondary)' }}>E-way Bill Validity:</span>
                      <span className="calc-value" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.ceil(Number(distance) / 200)} Day(s)</span>
                    </div>
                    <div className="calc-result-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span className="calc-label" style={{ color: 'var(--text-secondary)' }}>Est. Transit Duration:</span>
                      <span className="calc-value" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.ceil(Number(distance) / 300) + 1} Day(s)</span>
                    </div>
                    <div className="calc-result-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span className="calc-label" style={{ color: 'var(--text-secondary)' }}>Checkpost Inspections:</span>
                      <span className="calc-value" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.floor(Number(distance) / 250) + 1} Toll Nodes</span>
                    </div>
                    <div className="calc-result-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span className="calc-label" style={{ color: 'var(--text-secondary)' }}>GST Tax Compliance:</span>
                      <span className="calc-value text-glow" style={{ fontWeight: 700, color: 'var(--neon-cyan)' }}>IGST Exempt (Bio-Manure Small business)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
