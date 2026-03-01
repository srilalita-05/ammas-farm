import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';

const STATUS_STEPS = ['pending', 'packed', 'shipped', 'delivered'];
const STATUS_EMOJI = { pending: '⏳', packed: '📦', shipped: '🚛', delivered: '✅', cancelled: '❌' };

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getMyOrders().then(({ data }) => {
      setOrders(data.results || data); setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading-screen">Loading orders...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="page-container" style={{ paddingBottom: 48 }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: 14 }}>
              <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--forest)' }}>
                      Order #{order.id}
                    </span>
                    <span className={`status-badge status-${order.order_status}`}>
                      {STATUS_EMOJI[order.order_status]} {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                  </div>
                  <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--forest)' }}>
                    ₹{order.total_amount}
                  </span>
                  <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    {expanded === order.id ? 'Hide ▲' : 'Details ▼'}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              {order.order_status !== 'cancelled' && (
                <div style={{ padding: '0 22px 18px' }}>
                  <div className="order-progress">
                    {STATUS_STEPS.map((step, i) => {
                      const current = STATUS_STEPS.indexOf(order.order_status);
                      const state = i < current ? 'done' : i === current ? 'active' : 'todo';
                      return (
                        <div key={step} className="progress-step">
                          <div className={`progress-bar ${state}`} />
                          <div className={`progress-label ${state}`}>
                            {STATUS_EMOJI[step]} {step}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {expanded === order.id && (
                <div style={{ borderTop: '1px solid var(--cream-dark)', background: 'var(--cream)', padding: '18px 22px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: 5 }}>Delivery Address</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--ink-mid)' }}>{order.delivery_address}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: 5 }}>Phone</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--ink-mid)' }}>{order.phone_number}</p>
                    </div>
                  </div>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr><th>Product</th><th>Qty</th><th>Rate</th><th>Subtotal</th></tr>
                      </thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td>{item.quantity} {item.unit}</td>
                            <td>₹{item.product_price}</td>
                            <td><strong>₹{item.subtotal}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
