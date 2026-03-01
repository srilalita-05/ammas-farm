import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { orderAPI } from '../../services/api';

const STATUS_EMOJI = { pending: '⏳', packed: '📦', shipped: '🚛', delivered: '✅', cancelled: '❌' };

export function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <div>
            <div className="admin-sidebar-title">Amma's Farm</div>
            <div className="admin-sidebar-sub">Admin Panel</div>
          </div>
        </div>
      </div>
      <nav style={{ padding: '8px 0', flex: 1 }}>
        <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <span className="admin-nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <span className="admin-nav-icon">🥬</span> Products
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <span className="admin-nav-icon">📦</span> Orders
        </NavLink>
      </nav>
      <div style={{ padding: '12px 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <NavLink to="/" className="admin-nav-link">
          <span className="admin-nav-icon">🛍️</span> View Shop
        </NavLink>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getDashboard().then(({ data }) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-page-title">Dashboard</div>
        <div className="admin-page-sub">Good morning! Here's what's happening on your farm today.</div>

        <div className="stat-cards">
          {[
            { label: 'Total Products', value: stats?.total_products ?? 0, icon: '🥬', color: 'green' },
            { label: 'Available Now',  value: stats?.available_products ?? 0, icon: '✅', color: 'green' },
            { label: 'Total Orders',   value: stats?.total_orders ?? 0, icon: '📦', color: 'blue' },
            { label: 'Pending Orders', value: stats?.pending_orders ?? 0, icon: '⏳', color: 'gold' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-top">
                <div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                </div>
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {stats?.low_stock_products?.length > 0 && (
          <div className="card" style={{ marginBottom: 28 }}>
            <div className="card-body">
              <h3 style={{ fontFamily: 'var(--font-display)', color: '#e65100', marginBottom: 16, fontSize: '1.1rem' }}>
                ⚠️ Low Stock Alert
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {stats.low_stock_products.map(p => (
                  <div key={p.id} style={{ background: '#fff3e0', borderRadius: 'var(--r-md)', padding: '14px 16px', border: '1px solid rgba(230,162,0,0.2)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--forest)', marginBottom: 4 }}>{p.name}</p>
                    <p style={{ fontSize: '0.82rem', color: '#e65100', marginBottom: 10 }}>
                      {p.stock_quantity} left (min: {p.low_stock_threshold})
                    </p>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/products')}>
                      Update Stock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--forest)' }}>Recent Orders</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/orders')}>View All →</button>
            </div>
            {stats?.recent_orders?.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead><tr><th>#</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {stats.recent_orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600, color: 'var(--forest)' }}>#{order.id}</td>
                        <td>{order.user_name}</td>
                        <td><strong style={{ fontFamily: 'var(--font-display)' }}>₹{order.total_amount}</strong></td>
                        <td><span className={`status-badge status-${order.order_status}`}>{STATUS_EMOJI[order.order_status]} {order.order_status}</span></td>
                        <td style={{ color: 'var(--ink-faint)' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--ink-faint)', textAlign: 'center', padding: 24 }}>No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
