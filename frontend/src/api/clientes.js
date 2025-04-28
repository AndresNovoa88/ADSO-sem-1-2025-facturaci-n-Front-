import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchClientes = async () => {
  const response = await axios.get(`${API_URL}/clientes`);
  return response.data;
};

export const createCliente = async (clienteData) => {
  const response = await axios.post(`${API_URL}/clientes`, clienteData);
  return response.data;
};