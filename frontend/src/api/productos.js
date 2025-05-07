// src/api/productos.js
import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

export const fetchProductos  = () => API.get('/productos');
export const createProducto  = (data) => API.post('/productos', data);
export const updateProducto  = (id, data) => API.put(`/productos/${id}`, data);
export const deleteProducto  = (id) => API.delete(`/productos/${id}`);