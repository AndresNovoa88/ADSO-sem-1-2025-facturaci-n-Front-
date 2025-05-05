// frontend/components/layout/MainLayout.js
import React from 'react';
import { Layout } from 'antd';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

const { Content } = Layout;

const MainLayout = ({ children }) => {
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

export default MainLayout;


