import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand">
            <div className="navbar-brand-icon">🌾</div>
            <div>
              Amma's Farm
              <span className="navbar-brand-sub">Farm to Table</span>
            </div>
          </NavLink>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
            <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
              Shop
            </NavLink>

            {user && !isAdmin && (
              <>
                <NavLink to="/cart" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  Cart {cart.item_count > 0 && <span className="cart-badge">{cart.item_count}</span>}
                </NavLink>
                <NavLink to="/my-orders" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  My Orders
                </NavLink>
              </>
            )}

            {isAdmin && (
              <>
                <NavLink to="/admin" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/products" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  Products
                </NavLink>
                <NavLink to="/admin/orders" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  Orders
                </NavLink>
              </>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', padding: '0 8px' }}>
                  {isAdmin ? '🌾' : '👤'} {user.first_name || user.username}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 4 }}>
                <NavLink to="/login" className="nav-link">Login</NavLink>
                <NavLink to="/register" className="btn btn-gold btn-sm">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
