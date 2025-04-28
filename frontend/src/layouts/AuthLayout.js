import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const AuthLayout = ({ children }) => (
  <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
    <Content style={{ padding: '50px 20px', maxWidth: 400, margin: '0 auto' }}>
      {children}
    </Content>
  </Layout>
);

export default AuthLayout;