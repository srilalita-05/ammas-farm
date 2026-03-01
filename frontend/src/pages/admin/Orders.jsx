import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { AdminSidebar } from './Dashboard';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'packed', 'shipped', 'delivered', 'cancelled'];
const STATUS_EMOJI = { pending: '⏳', packed: '📦', shipped: '🚛', delivered: '✅', cancelled: '❌' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    orderAPI.adminGetAll(params).then(({ data }) => {
      setOrders(data.results || data); setLoading(false);
    });
  }, [filter]);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await orderAPI.updateStatus(id, status);
      setOrders(orders.map(o => o.id === id ? { ...o, order_status: status } : o));
      toast.success(`Order #${id} → ${status} ${STATUS_EMOJI[status]}`);
    } catch { toast.error('Update failed'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-page-title">Orders</div>
        <div className="admin-page-sub">{orders.length} total orders</div>

        <div className="filter-bar" style={{ marginBottom: 24 }}>
          <button className={`filter-chip ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} className={`filter-chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {STATUS_EMOJI[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--ink-faint)', textAlign: 'center', padding: 40 }}>Loading...</p>
        ) : orders.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📭</div><h3>No orders found</h3></div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--forest)' }}>Order #{order.id}</span>
                    <span className={`status-badge status-${order.order_status}`}>
                      {STATUS_EMOJI[order.order_status]} {order.order_status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
                    👤 {order.user_name} · 📞 {order.phone_number} · {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--forest)' }}>
                    ₹{order.total_amount}
                  </span>
                  <select className="form-select" style={{ width: 'auto', padding: '7px 12px', fontSize: '0.82rem' }}
                    value={order.order_status}
                    onChange={e => handleStatusUpdate(order.id, e.target.value)}
                    disabled={updatingId === order.id}>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{STATUS_EMOJI[s]} {s}</option>
                    ))}
                  </select>
                  <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    {expanded === order.id ? 'Hide ▲' : 'Items ▼'}
                  </button>
                </div>
              </div>

              {expanded === order.id && (
                <div style={{ borderTop: '1px solid var(--cream-dark)', background: 'var(--cream)', padding: '16px 22px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: 4 }}>Delivery Address</p>
                      <p style={{ fontSize: '0.875rem' }}>{order.delivery_address}</p>
                    </div>
                    {order.notes && (
                      <div>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: 4 }}>Notes</p>
                        <p style={{ fontSize: '0.875rem' }}>{order.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="table-container">
                    <table>
                      <thead><tr><th>Product</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td>{item.quantity} {item.unit}</td>
                            <td>₹{item.product_price}</td>
                            <td><strong style={{ fontFamily: 'var(--font-display)' }}>₹{item.subtotal}</strong></td>
                          </tr>
                        ))}
                        <tr style={{ background: 'var(--cream)' }}>
                          <td colSpan="3" style={{ textAlign: 'right', fontWeight: 600 }}>Grand Total</td>
                          <td><strong style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--forest)' }}>₹{order.total_amount}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
