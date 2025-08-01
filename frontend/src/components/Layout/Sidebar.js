import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState(['facturacion']);

  const menuItems = [
    { 
      key: 'dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      key: 'facturacion', 
      icon: <FileTextOutlined />, 
      label: 'Facturación',
      children: [
        { 
          key: 'nueva-factura', 
          icon: <FileAddOutlined />, 
          label: 'Nueva Factura', 
          path: '/facturas/nueva' 
        },
        { 
          key: 'listado-facturas', 
          icon: <UnorderedListOutlined />, 
          label: 'Listado de Facturas', 
          path: '/facturas' 
        }
      ]
    },
    { 
      key: 'clientes', 
      icon: <UserOutlined />, 
      label: 'Clientes', 
      path: '/clientes' 
    },
    { 
      key: 'productos', 
      icon: <ShopOutlined />, 
      label: 'Productos', 
      path: '/productos' 
    },
    { 
      key: 'vendedores', 
      icon: <UsergroupAddOutlined />, 
      label: 'Vendedores', 
      path: '/vendedores' 
    },
    { 
      key: 'change-password', 
      icon: <LockOutlined />, 
      label: 'Cambiar Contraseña', 
      path: '/configuracion/cambiar-contraseña' 
    },
    { 
      key: 'logout', 
      icon: <LogoutOutlined />, 
      label: 'Cerrar sesión', 
      path: '/login' 
    }
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/login', { replace: true });
      window.location.reload();
      return;
    }

    // Buscar el item seleccionado en toda la estructura del menú
    const findItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) return item;
        if (item.children) {
          const found = findItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const selected = findItem(menuItems, key);
    if (selected && selected.path) navigate(selected.path);
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    
    // Buscar recursivamente la clave que coincide con la ruta
    const findKeyByPath = (items, path) => {
      for (const item of items) {
        if (item.path && currentPath.startsWith(item.path)) {
          return item.key;
        }
        if (item.children) {
          const childKey = findKeyByPath(item.children, path);
          if (childKey) return childKey;
        }
      }
      return null;
    };

    return [findKeyByPath(menuItems, currentPath) || 'dashboard'];
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <Sider width={220} className="site-layout-background" theme="dark" collapsible>
      <div style={{
        color: '#fff',
        textAlign: 'center',
        padding: '1rem',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        FacturaApp
      </div>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick}
        style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
        theme="dark"
        items={menuItems}
      >
      </Menu>
    </Sider>
  );
}