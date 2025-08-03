// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { login as apiLogin, getProfile } from '../api/auth';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true
  });
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    removeAuthToken();
    setAuthState({ user: null, loading: false });
    message.success('Sesión cerrada');
    navigate('/login');
  }, [navigate]);

  const loadUser = useCallback(async () => {
    console.log('Iniciando carga de usuario...');
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No token found');
      
      setAuthToken(token);
      const userData = await getProfile();
      
      setAuthState({
        user: userData,
        loading: false
      });
      console.log('Usuario cargado:', userData);
    } catch (error) {
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token && !authState.user) {
        await loadUser();
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    
    initializeAuth();
  }, [loadUser, authState.user]);

  const handleLogin = async (credentials) => {
    try {
      const { token, user } = await apiLogin(credentials);
      console.log("🧩 handleLogin() recibió:", { token, user });
      
      setAuthToken(token);
      setAuthState({
        user,
        loading: false
      });
      return { token, user };
      // Se elimina message.success y navigate
    } catch (error) {
      message.error(error.response?.data?.message || 'Error de autenticación');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!authState.user,
        roles: {
          isAdmin: authState.user?.rol === 'ADMIN',
          isGerente: authState.user?.rol === 'GERENTE',
          isVendedor: authState.user?.rol === 'VENDEDOR'
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
