import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchFacturas = async () => {
  const response = await axios.get(`${API_URL}/facturas`);
  return response.data;
};

export const createFactura = async (facturaData) => {
  const response = await axios.post(`${API_URL}/facturas`, facturaData);
  return response.data;
};