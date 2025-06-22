// frontend/src/api/vendedores.js
import API from './api'; 

export const fetchVendedores = (search = '') => {
  return API.get('/vendedores', { params: { search } });
};

export const fetchVendedorById = (id) => {
  return API.get(`/vendedores/${id}`);
};

export const createVendedor = (data) => {
  return API.post('/vendedores', data);
};

export const updateVendedor = (id, data) => {
  return API.put(`/vendedores/${id}`, data);
};

export const deleteVendedor = (id) => {
  return API.delete(`/vendedores/${id}`);
};