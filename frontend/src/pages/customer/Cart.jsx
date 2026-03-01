import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

function getEmoji(name = '') {
  const n = name.toLowerCase();
  if (/tomato|carrot|beans|spinach/.test(n)) return '🥬';
  if (/mango|banana|papaya/.test(n)) return '🍎';
  if (/rice|wheat/.test(n)) return '🌾';
  if (/egg/.test(n)) return '🥚';
  if (/honey/.test(n)) return '🍯';
  return '🧺';
}

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeCartItem, clearCart } = useCart();

  const handleUpdate = async (id, qty) => {
    try { await updateCartItem(id, qty); }
    catch (err) { toast.error(err.response?.data?.error || 'Update failed'); }
  };
  const handleRemove = async (id) => {
    await removeCartItem(id); toast.success('Item removed');
  };

  if (cart.items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some fresh produce from Amma's farm to get started!</p>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 8 }} onClick={() => navigate('/')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ padding: '36px 0 0' }}>
        <div style={{ marginBottom: 6, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sage)', fontWeight: 600 }}>
          Shopping Cart
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--forest)' }}>
          Your Cart ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="cart-layout">
        <div>
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">
                {item.product.image_url
                  ? <img src={item.product.image_url} alt={item.product.name} />
                  : getEmoji(item.product.name)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--forest)', marginBottom: 3 }}>
                  {item.product.name}
                </h4>
                <p style={{ color: 'var(--ink-faint)', fontSize: '0.82rem' }}>
                  ₹{item.product.price} per {item.product.unit}
                </p>
              </div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => handleUpdate(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                <span className="qty-display" style={{ minWidth: 40, fontSize: '0.9rem' }}>{item.quantity}</span>
                <button className="qty-btn" onClick={() => handleUpdate(item.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock_quantity}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--forest)' }}>
                  ₹{item.total_price}
                </p>
                <button className="btn btn-danger btn-sm" style={{ marginTop: 8 }} onClick={() => handleRemove(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>← Continue Shopping</button>
            <button style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
              onClick={async () => { await clearCart(); toast.success('Cart cleared'); }}>
              🗑️ Clear Cart
            </button>
          </div>
        </div>

        <div className="order-summary-card">
          <h3 className="order-summary-title">Order Summary</h3>
          {cart.items.map(item => (
            <div key={item.id} className="order-summary-row">
              <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.product.name} × {item.quantity}
              </span>
              <span>₹{item.total_price}</span>
            </div>
          ))}
          <div className="order-summary-total">
            <span>Total</span>
            <span>₹{cart.cart_total.toFixed(2)}</span>
          </div>
          <button className="btn btn-gold btn-block btn-lg" style={{ marginTop: 22 }} onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <div className="order-note">
            🚚 Free delivery · Fresh within 24 hours · Pay on delivery
          </div>
        </div>
      </div>
    </div>
  );
}
