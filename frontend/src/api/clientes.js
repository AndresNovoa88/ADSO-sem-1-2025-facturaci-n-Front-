// src/api/clientes.js
import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

export const fetchClientes  = () => API.get('/clientes');
export const createCliente  = (data) => API.post('/clientes', data);
export const updateCliente  = (id, data) => API.put(`/clientes/${id}`, data);
export const deleteCliente  = id       => API.delete(`/clientes/${id}`);

