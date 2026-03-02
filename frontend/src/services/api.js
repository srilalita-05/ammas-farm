import axios from 'axios';

// In production this will be https://your-backend.onrender.com
// In development the Vite proxy handles /api → localhost:8000
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh expired tokens
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:      (data)    => api.post('/auth/register/', data),
  login:         (data)    => api.post('/auth/login/', data),
  logout:        (refresh) => api.post('/auth/logout/', { refresh }),
  getProfile:    ()        => api.get('/auth/profile/'),
  updateProfile: (data)    => api.patch('/auth/profile/', data),
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:       (params) => api.get('/products/', { params }),
  getOne:       (id)     => api.get(`/products/${id}/`),
  adminGetAll:  (params) => api.get('/products/admin/', { params }),
  getDashboard: ()       => api.get('/products/admin/dashboard/stats/'),
  create: (data) =>
    api.post('/products/admin/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) =>
    api.patch(`/products/admin/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/admin/${id}/`),
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()               => api.get('/cart/'),
  add:    (product_id, quantity) => api.post('/cart/add/', { product_id, quantity }),
  update: (id, quantity)   => api.patch(`/cart/item/${id}/`, { quantity }),
  remove: (id)             => api.delete(`/cart/item/${id}/`),
  clear:  ()               => api.delete('/cart/clear/'),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  create:       (data)   => api.post('/orders/create/', data),
  getMyOrders:  ()       => api.get('/orders/my-orders/'),
  getMyOrder:   (id)     => api.get(`/orders/my-orders/${id}/`),
  adminGetAll:  (params) => api.get('/orders/admin/', { params }),
  updateStatus: (id, order_status) => api.put(`/orders/admin/${id}/status/`, { order_status }),
};

export default api;
