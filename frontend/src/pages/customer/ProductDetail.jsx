import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function getEmoji(name = '') {
  const n = name.toLowerCase();
  if (/tomato|carrot|beans|gourd|spinach|karela|drumstick/.test(n)) return '🥬';
  if (/mango|banana|papaya|apple|orange/.test(n)) return '🍎';
  if (/rice|wheat/.test(n)) return '🌾';
  if (/milk|curd|ghee/.test(n)) return '🥛';
  if (/egg/.test(n)) return '🥚';
  if (/honey/.test(n)) return '🍯';
  if (/coconut/.test(n)) return '🥥';
  return '🧺';
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    productAPI.getOne(id).then(({ data }) => {
      setProduct(data); setLoading(false);
    }).catch(() => { toast.error('Product not found'); navigate('/'); });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} ${product.unit} to cart! 🛒`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not add to cart');
    } finally { setAdding(false); }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!product) return null;

  return (
    <div className="page-container">
      <div className="product-detail">
        {/* Image */}
        <div>
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="product-detail-img" />
            : <div className="product-detail-placeholder">{getEmoji(product.name)}</div>}
        </div>

        {/* Info */}
        <div style={{ paddingTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}
            style={{ marginBottom: 20 }}>← Back</button>

          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--sage)' }}>
              {product.unit} · Farm Fresh
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--forest)', marginBottom: 14 }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
            <span className={`status-badge ${product.is_available ? 'status-delivered' : 'status-cancelled'}`}>
              {product.is_available ? '✓ Available' : '✗ Not Available'}
            </span>
            {product.is_low_stock && product.stock_quantity > 0 && (
              <span className="status-badge status-pending">⚠ Low Stock</span>
            )}
          </div>

          <div style={{ marginBottom: 22 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--forest)' }}>
              ₹{product.price}
            </span>
            <span style={{ color: 'var(--ink-faint)', fontSize: '1rem' }}> / {product.unit}</span>
          </div>

          <p style={{ color: 'var(--ink-mid)', lineHeight: 1.75, marginBottom: 28, fontSize: '0.95rem' }}>
            {product.description || 'Fresh, organic produce straight from our farm fields.'}
          </p>

          <div style={{
            background: 'var(--cream-warm)', borderRadius: 'var(--r-lg)',
            padding: '16px 20px', marginBottom: 28, display: 'flex', justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: 3 }}>
                Available Stock
              </p>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--forest)' }}>
                {product.stock_quantity} {product.unit}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: 3 }}>
                Unit
              </p>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--forest)' }}>{product.unit}</p>
            </div>
          </div>

          {user?.role !== 'admin' && product.is_available && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Quantity</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-display">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}>+</button>
                </div>
                <span style={{ color: 'var(--ink-faint)', fontSize: '0.85rem' }}>
                  Total: <strong style={{ color: 'var(--forest)' }}>₹{(product.price * quantity).toFixed(2)}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={adding}>
                  {adding ? '⏳ Adding...' : '🛒 Add to Cart'}
                </button>
                <button className="btn btn-gold btn-lg" onClick={async () => { await handleAddToCart(); navigate('/cart'); }}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          )}
          {!user && (
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              🌱 Login to Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
