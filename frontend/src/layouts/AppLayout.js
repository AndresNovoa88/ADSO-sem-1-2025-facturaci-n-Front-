//src/layouts/AppLayout.js
import React from 'react';
import { Layout } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Loading from '../components/common/Loading';

const { Content } = Layout;

const AppLayout = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <Loading />;
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;