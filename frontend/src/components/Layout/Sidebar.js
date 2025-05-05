import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/dashboard' },
    { key: 'facturas', icon: <FileTextOutlined />, label: 'Facturas', path: '/facturas/nueva' },
    { key: 'clientes', icon: <UserOutlined />, label: 'Clientes', path: '/clientes' },
    { key: 'productos', icon: <ShopOutlined />, label: 'Productos', path: '/productos' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Cerrar sesión', path: '/login' }
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token'); // Ajusta esto según tu lógica
    }
    const selected = menuItems.find(item => item.key === key);
    if (selected) navigate(selected.path);
  };

  return (
    <Sider width={200} className="site-layout-background">
      <div style={{ color: '#fff', textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>
        FacturaApp
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        onClick={handleMenuClick}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}
