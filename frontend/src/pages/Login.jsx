import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('customer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.first_name || user.username}! 🌾`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Incorrect username or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-badge">🌾</div>
          <h1>Amma's Farm</h1>
          <p>Fresh produce, delivered with love</p>
        </div>

        <div className="role-tabs">
          {[
            { key: 'customer', label: '🛍️ Customer', sub: 'Shop & Order' },
            { key: 'admin',    label: '🌾 Admin',    sub: 'Manage Farm' },
          ].map(t => (
            <button key={t.key} type="button"
              className={`role-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => { setTab(t.key); setError(''); setForm({ username: '', password: '' }); }}>
              <span className="role-tab-label">{t.label}</span>
              <span className="role-tab-sub">{t.sub}</span>
            </button>
          ))}
        </div>

        {tab === 'admin' ? (
          <div className="alert alert-success" style={{ marginBottom: 18 }}>
            👋 <strong>Welcome, Amma!</strong> Log in to manage your products and orders.
          </div>
        ) : (
          <div style={{
            background: 'var(--sage-pale)', borderRadius: 'var(--r-md)', padding: '10px 14px',
            fontSize: '0.84rem', color: 'var(--forest-soft)', marginBottom: 18
          }}>
            🌿 Login to start ordering fresh farm produce.
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{tab === 'admin' ? 'Admin Username' : 'Username'}</label>
            <input className="form-input" type="text"
              placeholder={tab === 'admin' ? 'Enter admin username' : 'Enter your username'}
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Enter your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}
            style={{ marginTop: 4 }}>
            {loading ? '⏳ Logging in...' : tab === 'admin' ? '🌾 Login as Admin' : '🛍️ Login'}
          </button>
        </form>

        {tab === 'customer' ? (
          <p className="auth-footer">
            New here? <Link to="/register">Create a free account</Link>
          </p>
        ) : (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.76rem', color: 'var(--ink-faint)' }}>
            🔒 Admin accounts are set up by the system.
          </p>
        )}
      </div>
    </div>
  );
}
