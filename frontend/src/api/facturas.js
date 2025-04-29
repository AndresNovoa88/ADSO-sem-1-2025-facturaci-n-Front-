// src/api/facturas.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Métodos existentes
export const fetchFacturas = async () => {
  const response = await axios.get(`${API_URL}/facturas`);
  return response.data;
};

export const createFactura = async (facturaData) => {
  const response = await axios.post(`${API_URL}/facturas`, facturaData);
  return response.data;
};

// Nuevos métodos requeridos
export const fetchClientes = async () => {
  const response = await axios.get(`${API_URL}/clientes`);
  return response.data;
};

export const fetchVendedores = async () => {
  const response = await axios.get(`${API_URL}/vendedores`);
  return response.data;
};

export const fetchProductos = async () => {
  const response = await axios.get(`${API_URL}/productos`);
  return response.data;
};

export const fetchFacturaById = async (id) => {
  const response = await axios.get(`${API_URL}/facturas/${id}`);
  return response.data;
};

export const updateFactura = async (id, data) => {
  const response = await axios.put(`${API_URL}/facturas/${id}`, data);
  return response.data;
};