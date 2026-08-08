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
  const revealRef = useScrollReveal();

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
    </main>
  );
}
