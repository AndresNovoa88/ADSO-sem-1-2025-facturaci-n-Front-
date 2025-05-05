import React from 'react';
import { Layout } from 'antd';

const { Header: AntHeader } = Layout;

export default function Header() {
  return (
    <AntHeader style={{ background: '#fff', padding: 0, paddingLeft: 24, fontSize: 18 }}>
      Panel de Administración
    </AntHeader>
  );
}
