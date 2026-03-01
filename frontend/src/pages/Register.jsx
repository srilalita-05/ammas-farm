import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    phone_number: '', password: '', password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    try {
      await register(form);
      toast.success('Welcome to Amma\'s Farm! 🌾');
      navigate('/');
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  const f = (name) => ({
    value: form[name],
    onChange: e => setForm({...form, [name]: e.target.value})
  });

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🌿</div>
          <h1>Join Our Farm</h1>
          <p>Get fresh produce delivered to your doorstep</p>
        </div>

        {errors.non_field_errors && <div className="alert alert-error">{errors.non_field_errors[0]}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" placeholder="First name" {...f('first_name')} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" placeholder="Last name" {...f('last_name')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-input" type="text" placeholder="Choose a username" {...f('username')} required />
            {errors.username && <p className="form-error">{errors.username[0]}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="your@email.com" {...f('email')} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" {...f('phone_number')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" placeholder="Min 6 chars" {...f('password')} required />
              {errors.password && <p className="form-error">{errors.password[0]}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password" placeholder="Repeat password" {...f('password2')} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? '🔄 Creating account...' : '🌱 Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
