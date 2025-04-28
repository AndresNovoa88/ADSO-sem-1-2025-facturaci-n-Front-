import React from 'react';
import { Layout } from 'antd';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';

const { Content } = Layout;

const AppLayout = ({ children }) => (
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

export default AppLayout;