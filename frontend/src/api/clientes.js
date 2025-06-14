// src/api/clientes.js
import api from './api';

export const fetchClientes  = () => api.get('/clientes');
export const createCliente  = (data) => api.post('/clientes', data);
export const updateCliente  = (id, data) => api.put(`/clientes/${id}`, data);
export const deleteCliente  = id       => api.delete(`/clientes/${id}`);
export const fetchClienteById = (id) => api.get(`/clientes/${id}`);

