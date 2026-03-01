import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function getEmoji(name = '') {
  const n = name.toLowerCase();
  if (/tomato|brinjal|carrot|beans|gourd|vegeta|spinach|palak|karela|drumstick|moringa/.test(n)) return '🥬';
  if (/mango|banana|papaya|apple|orange|fruit/.test(n)) return '🍎';
  if (/rice|wheat|grain|millet/.test(n)) return '🌾';
  if (/milk|curd|ghee|butter/.test(n)) return '🥛';
  if (/egg/.test(n)) return '🥚';
  if (/honey/.test(n)) return '🍯';
  if (/coconut/.test(n)) return '🥥';
  if (/turmeric|spice/.test(n)) return '🌿';
  return '🧺';
}

const HERO_CARDS = [
  { icon: '🍅', name: 'Fresh Tomatoes', price: '₹35/kg' },
  { icon: '🥥', name: 'Raw Coconuts', price: '₹25/pc' },
  { icon: '🍯', name: 'Raw Honey', price: '₹450/kg' },
  { icon: '🥚', name: 'Country Eggs', price: '₹90/dz' },
];

export default function ProductList() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [addingId, setAddingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filter === 'available') params.available_only = 'true';
      const { data } = await productAPI.getAll(params);
      setProducts(data.results || data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 280);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not add to cart');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="hero">
        <div className="hero-bg-1" />
        <div className="hero-bg-2" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span>✦</span> Locally Grown · Organically Harvested
            </div>
            <h1 className="hero-title">
              <em>Fresh</em> from<br />Amma's Fields
            </h1>
            <p className="hero-desc">
              Farm-to-table produce harvested each morning. 
              No middlemen, no preservatives — just honest, 
              wholesome food delivered to your doorstep.
            </p>
            <div className="hero-actions">
              <button className="btn btn-gold btn-xl"
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Shop Fresh Produce
              </button>
              {!user && (
                <button className="btn btn-ghost btn-lg" onClick={() => navigate('/register')}>
                  Create Account →
                </button>
              )}
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Organic</div>
              </div>
              <div>
                <div className="hero-stat-value">24hr</div>
                <div className="hero-stat-label">Fresh Delivery</div>
              </div>
              <div>
                <div className="hero-stat-value">0</div>
                <div className="hero-stat-label">Preservatives</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            {HERO_CARDS.map((card, i) => (
              <div key={i} className="hero-card">
                <div className="hero-card-icon">{card.icon}</div>
                <div className="hero-card-name">{card.name}</div>
                <div className="hero-card-price">{card.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ─────────────────────────────────────── */}
      <div className="page-container products-section" id="products-section">
        <div style={{ marginBottom: 28 }}>
          <div className="section-eyebrow">Our Harvest</div>
          <h2 className="section-title">Today's Fresh Produce</h2>
        </div>

        <div className="search-area">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search for tomatoes, honey, eggs..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-bar">
            <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All Products
            </button>
            <button className={`filter-chip ${filter === 'available' ? 'active' : ''}`} onClick={() => setFilter('available')}>
              ✅ In Stock
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌱</div>
            <p>Loading fresh produce...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🪴</div>
            <h3>Nothing found</h3>
            <p>Try a different search term or check back later</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, i) => (
              <div key={product.id} className="card product-card"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => navigate(`/products/${product.id}`)}>
                <div className="product-card-media">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} className="product-card-img" />
                    : <div className="product-card-placeholder">{getEmoji(product.name)}</div>}
                  {user?.role !== 'admin' && (
                    <div className="product-card-overlay">
                      <button className="product-card-quick"
                        onClick={e => handleAddToCart(e, product.id)}
                        disabled={!product.is_available || addingId === product.id}>
                        {addingId === product.id ? '⏳ Adding...' : product.is_available ? '+ Add to Cart' : 'Not Available'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="product-card-body">
                  <span className="product-card-tag">{product.unit}</span>
                  <h3 className="product-card-name">{product.name}</h3>
                  <p className="product-card-desc">{product.description || 'Fresh from our farm fields'}</p>
                  <div className="product-card-footer">
                    <div>
                      <span className="product-card-price">₹{product.price}</span>
                      <span className="product-card-unit"> / {product.unit}</span>
                    </div>
                    <span className={`stock-pill ${
                      product.stock_quantity === 0 ? 'stock-out'
                      : product.is_low_stock ? 'stock-low'
                      : 'stock-ok'
                    }`}>
                      {product.stock_quantity === 0 ? '● Out'
                        : product.is_low_stock ? `● ${product.stock_quantity} left`
                        : `● ${product.stock_quantity}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
