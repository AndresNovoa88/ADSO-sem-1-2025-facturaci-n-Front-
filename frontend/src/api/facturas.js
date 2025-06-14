// src/api/facturas.js
import api from './api';

export const fetchFacturas = async () => {
  const response = await api.get('/facturas');
  return response.data;
};

export const createFactura = async (facturaData) => {
  const response = await api.post('/facturas', facturaData);
  return response.data;
};

export const fetchClientes = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const fetchVendedores = async () => {
  const response = await api.get('/vendedores');
  return response.data;
};

export const fetchProductos = async (params = {}) => {
  const response = await api.get('/productos', { params });
  return response.data;
};

export const fetchFacturaById = async (id) => {
  const response = await api.get(`/facturas/${id}`);
  return response.data;
};

export const updateFactura = async (id, data) => {
  const response = await api.put(`/facturas/${id}`, data);
  return response.data;
};