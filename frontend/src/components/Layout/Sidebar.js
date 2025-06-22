// src/components/Sidebar.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard',        icon: <DashboardOutlined />,    label: 'Dashboard',         path: '/dashboard' },
    { key: 'facturas',         icon: <FileTextOutlined />,     label: 'Facturas',          path: '/facturas/nueva' },
    { key: 'clientes',         icon: <UserOutlined />,         label: 'Clientes',          path: '/clientes' },
    { key: 'productos',        icon: <ShopOutlined />,         label: 'Productos',         path: '/productos' },
    { key: 'vendedores',       icon: <UsergroupAddOutlined />, label: 'Vendedores',        path: '/vendedores' },
    { key: 'change-password',  icon: <LockOutlined />,        label: 'Cambiar contraseña', path: '/configuracion/cambiar-contraseña' },
    { key: 'logout',           icon: <LogoutOutlined />,       label: 'Cerrar sesión',     path: '/login' }
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
    const selected = menuItems.find(item => item.key === key);
    if (selected) {
      navigate(selected.path);
    }
  };

  const getSelectedKey = () => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/configuracion/cambiar-contraseña')) {
      return ['change-password'];
    }
    const selectedItem = menuItems.find(item =>
      item.path !== '/configuracion/cambiar-contraseña' &&
      (currentPath === item.path ||
       currentPath.startsWith(item.path))
    );
    return selectedItem ? [selectedItem.key] : ['dashboard'];
  };

  return (
    <Sider width={200} className="site-layout-background" theme="dark">
      <div style={{
        color: '#fff',
        textAlign: 'center',
        padding: '1rem',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      }}>
        FacturaApp
      </div>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        onClick={handleMenuClick}
        style={{ height: '100%', borderRight: 0 }}
        theme="dark"
        items={menuItems}
      />
    </Sider>
  );
}
