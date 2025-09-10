// frontend/src/api/productos.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Interceptor para incluir el token en cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores global
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchProductos = (params = {}) => {
  const { search, categoria } = params;
  let url = '/productos';
  const queryParams = [];
  
  if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
  if (categoria) queryParams.push(`categoria=${encodeURIComponent(categoria)}`);
  
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  
  return API.get(url);
};

export const fetchProductoById = (id) => API.get(`/productos/${id}`);
export const createProducto = (data) => API.post('/productos', data);
export const updateProducto = (id, data) => API.put(`/productos/${id}`, data);
export const deleteProducto = (id) => API.delete(`/productos/${id}`);