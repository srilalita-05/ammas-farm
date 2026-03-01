import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    delivery_address: user?.address || '',
    phone_number: user?.phone_number || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await orderAPI.create(form);
      await fetchCart();
      toast.success(data.message || 'Order placed!');
      navigate('/my-orders');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.error) toast.error(errData.error);
      else setErrors(errData || {});
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon">🛒</div>
          <h3>No items to checkout</h3>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '32px 16px' }}>
      <h1 style={{ marginBottom: 28 }}>📦 Complete Your Order</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 28, alignItems: 'start' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ marginBottom: 20 }}>🚚 Delivery Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea className="form-textarea" rows={4}
                  placeholder="House no, Street, Village, District, State - PIN"
                  value={form.delivery_address}
                  onChange={e => setForm({...form, delivery_address: e.target.value})} required />
                {errors.delivery_address && <p className="form-error">{errors.delivery_address[0]}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX"
                  value={form.phone_number}
                  onChange={e => setForm({...form, phone_number: e.target.value})} required />
                {errors.phone_number && <p className="form-error">{errors.phone_number[0]}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Special Instructions (optional)</label>
                <textarea className="form-textarea" rows={2} placeholder="Any special requests..."
                  value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? '⏳ Placing Order...' : '🌾 Confirm Order'}
              </button>
            </form>
          </div>
        </div>

        <div className="order-summary-card">
          <h3 style={{ marginBottom: 16 }}>📋 Order Summary</h3>
          {cart.items.map(item => (
            <div key={item.id} className="order-summary-row">
              <span style={{ fontSize: '0.85rem' }}>{item.product.name} × {item.quantity} {item.product.unit}</span>
              <span style={{ fontWeight: 600 }}>₹{item.total_price}</span>
            </div>
          ))}
          <div className="order-summary-total">
            <span>Total Amount</span>
            <span style={{ color: 'var(--green-dark)' }}>₹{cart.cart_total.toFixed(2)}</span>
          </div>
          <div className="alert alert-success" style={{ marginTop: 16 }}>
            🌿 Payment on delivery. Fresh produce guaranteed!
          </div>
        </div>
      </div>
    </div>
  );
}
