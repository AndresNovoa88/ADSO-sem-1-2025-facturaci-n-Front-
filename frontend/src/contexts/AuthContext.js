import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { login as apiLogin, getProfile } from '../api/auth';
import { setAuthToken, removeAuthToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar usuario al iniciar
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        const userData = await getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login optimizado
  const login = async (username, password) => {
    try {
      const { token, user } = await apiLogin(username, password);
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(user);
      message.success('Bienvenido');
      return user;
    } catch (error) {
      message.error(error.response?.data?.message || 'Credenciales incorrectas');
      throw error;
    }
  };

  // Logout mejorado
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    removeAuthToken();
    setUser(null);
    message.success('Sesión cerrada');
    navigate('/login');
  }, [navigate]);

  // Actualizar usuario
  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        roles: {
          isAdmin: user?.rol_id === 1,
          isGerente: user?.rol_id === 2,
          isVendedor: user?.rol_id === 3
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);