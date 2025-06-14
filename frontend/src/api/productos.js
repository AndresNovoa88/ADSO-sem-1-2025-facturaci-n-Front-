// frontend/src/api/productos.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// ⬇️ INTERCEPTOR para incluir el token en cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Asegúrate de guardar el token al iniciar sesión
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProductos  = () => API.get('/productos');
export const fetchProductoById = (id) => API.get(`/productos/${id}`);
export const createProducto  = (data) => API.post('/productos', data);
export const updateProducto  = (id, data) => API.put(`/productos/${id}`, data);
export const deleteProducto  = (id) => API.delete(`/productos/${id}`);

