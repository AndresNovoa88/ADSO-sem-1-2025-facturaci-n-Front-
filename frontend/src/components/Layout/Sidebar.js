import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined,
  UsergroupAddOutlined 
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
    { key: 'vendedores', icon: <UsergroupAddOutlined />, label: 'Vendedores', path: '/vendedores' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Cerrar sesión', path: '/login' }
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('userData'); 
    }
    const selected = menuItems.find(item => item.key === key);
    if (selected) navigate(selected.path);
  };

  // Determinar el ítem seleccionado basado en la ruta actual
  const getSelectedKey = () => {
    const currentPath = window.location.pathname;
    const selectedItem = menuItems.find(item => 
      currentPath.startsWith(item.path) ||
      (item.path === '/vendedores' && currentPath.includes('/vendedores'))
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
        defaultSelectedKeys={['dashboard']}
        selectedKeys={getSelectedKey()}
        onClick={handleMenuClick}
        style={{ height: '100%', borderRight: 0 }}
        theme="dark"
        items={menuItems}
      />
    </Sider>
  );
}