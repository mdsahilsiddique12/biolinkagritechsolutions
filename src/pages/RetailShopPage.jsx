import { useState } from 'react';
import { Leaf, Droplets, Beaker, Sparkles, Bell, CheckCircle, Filter, Clock } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';
import { products, categories } from '../data/products';
import { api } from '../lib/api';
import './RetailShopPage.css';

const categoryIcons = {
  solid: Leaf,
  liquid: Droplets,
  specialty: Beaker,
};

function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const variant = product.variants[selectedVariant];
  const Icon = categoryIcons[product.category] || Sparkles;
  const discount = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);

  const handleNotify = async (e) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;

    setError('');
    setIsSubmitting(true);

    try {
      await api.subscribeRetailLaunch({
        email: notifyEmail,
        productId: product.id,
        productName: product.name,
        website: '',
      });
      setIsSubscribed(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-card glass-card reveal">
      <div className="product-card__coming-soon-overlay">
        <div className="product-card__coming-soon-badge">
          <Clock size={14} />
          <span>COMING SOON</span>
        </div>
      </div>

      <span className={`product-card__badge badge ${product.badgeType !== 'green' ? `badge-${product.badgeType}` : ''}`}>
        {product.badge}
      </span>

      <div className="product-card__visual">
        <div className="product-card__icon-wrap">
          <Icon size={48} />
        </div>
        <div className="product-card__glow" />
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">{product.shortName}</h3>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__npk">
          <span className="product-card__npk-label">NPK:</span>
          <span className="product-card__npk-value">{product.npk}</span>
        </div>

        <div className="product-card__features">
          {product.features.map((f) => (
            <span key={f} className="product-card__feature">{f}</span>
          ))}
        </div>

        <div className="product-card__variants">
          {product.variants.map((v, i) => (
            <button
              key={v.size}
              className={`product-card__variant ${i === selectedVariant ? 'product-card__variant--active' : ''}`}
              onClick={() => setSelectedVariant(i)}
            >
              {v.size}
            </button>
          ))}
        </div>

        <div className="product-card__pricing">
          <span className="product-card__price">Rs.{variant.price}</span>
          <span className="product-card__mrp">Rs.{variant.mrp}</span>
          <span className="product-card__discount">-{discount}%</span>
        </div>

        {!isSubscribed ? (
          <form className="product-card__notify-form" onSubmit={handleNotify}>
            <input
              type="email"
              className="input-field product-card__notify-input"
              placeholder="Enter your email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              required
              id={`notify-email-${product.id}`}
            />
            {error ? <p className="form-error">{error}</p> : null}
            <button
              type="submit"
              className="btn btn-outline product-card__notify-btn"
              id={`notify-btn-${product.id}`}
            >
              <Bell size={14} /> {isSubmitting ? 'Saving...' : 'Notify Me on Launch'}
            </button>
          </form>
        ) : (
          <div className="product-card__subscribed">
            <CheckCircle size={16} />
            <span>You'll be notified on launch!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RetailShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const revealRef = useScrollReveal();

  let filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.variants[0].price - b.variants[0].price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.variants[0].price - a.variants[0].price);
  }

  return (
    <main className="shop" ref={revealRef}>
      <section className="shop-hero" id="shop-hero">
        <div className="orb orb-green" style={{ width: 300, height: 300, top: '-5%', left: '-10%' }} />
        <div className="container shop-hero__content">
          <span className="badge badge-gold"><Clock size={12} /> Coming Soon</span>
          <h1 className="shop-hero__title">
            Retail <span className="text-glow-hero">Packed Products</span>
          </h1>
          <p className="shop-hero__subtitle">
            Premium packed bags of lab-certified bio-manure for farms, nurseries, and urban gardens.
            Retail packaging is launching soon, sign up to be notified.
          </p>
          <div className="shop-hero__bulk-note">
            <span className="badge">Bulk Orders Available Now</span>
            <p>For immediate orders of <strong>15 Metric Tons or more</strong>, visit our <a href="/institutional">Institutional Supply</a> portal.</p>
          </div>
        </div>
      </section>

      <section className="shop-filters container" id="shop-filters">
        <div className="shop-filters__categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`shop-filters__cat ${activeCategory === cat.id ? 'shop-filters__cat--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              id={`filter-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="shop-filters__sort">
          <Filter size={14} />
          <select
            className="select-field shop-filters__sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-by"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </section>

      <section className="section shop-grid-section" id="product-grid">
        <div className="container">
          <div className="shop-grid stagger-children">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
