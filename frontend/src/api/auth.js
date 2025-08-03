// src/api/auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false   // si no usas cookies de sesión
});

// Recibe { username, password }
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  console.log('🔎 login response from backend:', response.data);
  return response.data;  // { token, user, message }
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
