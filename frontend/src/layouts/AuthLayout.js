import React from 'react';
import { Layout } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';

const { Content } = Layout;

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Content
        style={{
          width: '100%',
          maxWidth: 400,
          padding: 20
        }}
      >
        {/* Aquí es donde se inyecta el <Login /> */}
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthLayout;
