import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { login as apiLogin, logout as apiLogout, getProfile } from '../api/auth';
import { setAuthToken, removeAuthToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
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
    };
    
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const { token, user } = await apiLogin(username, password);
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(user);
      message.success('Bienvenido');
      return user;
    } catch (error) {
      message.error('Credenciales incorrectas');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    removeAuthToken();
    setUser(null);
    message.success('Sesión cerrada');
    navigate('/login');
  };

  const updateUser = (newUserData) => {
    setUser({ ...user, ...newUserData });
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
        isAdmin: user?.rol_id === 1,
        isGerente: user?.rol_id === 2,
        isVendedor: user?.rol_id === 3
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);