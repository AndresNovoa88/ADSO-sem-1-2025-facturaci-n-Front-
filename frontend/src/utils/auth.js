// utils/auth.js

export const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
  };
  
  export const removeAuthToken = () => {
    localStorage.removeItem('token');
  };
  
  export const getAuthToken = () => {
    return localStorage.getItem('token');
  };