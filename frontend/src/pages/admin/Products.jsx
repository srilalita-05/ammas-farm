import { useState, useEffect, useRef } from 'react';
import { productAPI } from '../../services/api';
import { AdminSidebar } from './Dashboard';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', description: '', price: '', stock_quantity: '',
  seasonal_availability: true, unit: 'kg', low_stock_threshold: 10, image: null
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.adminGetAll({ search });
      setProducts(data.results || data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const openCreate = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ ...p, image: null }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k === 'image' && !v) return; fd.append(k, v); });
      if (editProduct) await productAPI.update(editProduct.id, fd);
      else await productAPI.create(fd);
      toast.success(editProduct ? '✅ Product updated!' : '✅ Product added!');
      setShowModal(false); fetchProducts();
    } catch (err) {
      const errs = err.response?.data;
      if (errs) toast.error(Object.entries(errs).map(([k,v]) => `${k}: ${v}`).join(' | '));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await productAPI.delete(id); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="admin-page-title">Products</div>
            <div className="admin-page-sub">{products.length} products in your farm shop</div>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
        </div>

        <div className="search-bar" style={{ marginBottom: 20 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <p style={{ color: 'var(--ink-faint)', textAlign: 'center', padding: 40 }}>Loading...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Product</th><th>Price</th><th>Stock</th><th>Unit</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', overflow: 'hidden', flexShrink: 0, background: 'var(--sage-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '1.2rem' }}>🌿</span>}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.9rem' }}>{p.name}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--ink-faint)', marginTop: 1 }}>{p.description?.slice(0, 36)}...</p>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>₹{p.price}</span></td>
                    <td>
                      <span className={`badge ${p.stock_quantity === 0 ? 'badge-red' : p.is_low_stock ? 'badge-orange' : 'badge-green'}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td style={{ color: 'var(--ink-soft)' }}>{p.unit}</td>
                    <td>
                      <span className={`badge ${p.seasonal_availability ? 'badge-green' : 'badge-red'}`}>
                        {p.seasonal_availability ? '● Active' : '● Off'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'var(--ink-faint)' }}>No products yet. Add your first product!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" placeholder="e.g. Fresh Tomatoes"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Describe this product..."
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input className="form-input" type="number" step="0.01" placeholder="0.00"
                      value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit *</label>
                    <select className="form-select" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                      {['kg', 'g', 'piece', 'dozen', 'bundle', 'litre', 'ml', 'bag'].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input className="form-input" type="number" placeholder="0"
                      value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Low Stock Alert At</label>
                    <input className="form-input" type="number" placeholder="10"
                      value={form.low_stock_threshold} onChange={e => setForm({...form, low_stock_threshold: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <input type="file" accept="image/*" ref={fileRef}
                    onChange={e => setForm({...form, image: e.target.files[0]})}
                    style={{ fontSize: '0.85rem' }} />
                  {editProduct?.image_url && !form.image && (
                    <img src={editProduct.image_url} alt="current"
                      style={{ height: 60, borderRadius: 'var(--r-sm)', marginTop: 8, objectFit: 'cover' }} />
                  )}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: 'var(--cream-warm)', borderRadius: 'var(--r-md)' }}>
                  <input type="checkbox" checked={form.seasonal_availability}
                    onChange={e => setForm({...form, seasonal_availability: e.target.checked})}
                    style={{ width: 16, height: 16, accentColor: 'var(--forest-soft)' }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Mark as Available</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Toggle off to hide from customers</p>
                  </div>
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? '⏳ Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
