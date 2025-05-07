import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchProductos, deleteProducto } from '../../api/productos';
import PageHeader from '../../components/common/PageHeader';

const ListProductos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchProductos();
      setData(res.data);
    } catch {
      message.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async id => {
    try {
      await deleteProducto(id);
      message.success('Producto eliminado');
      load();
    } catch {
      message.error('Error eliminando');
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: v => `$${v.toLocaleString()}`
    },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Categoría', dataIndex: 'categoria', key: 'categoria' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/productos/${record.id}`)} />
          <Popconfirm title="Eliminar?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="Productos"
        extra={[
          <Button
            key="new"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/productos/nuevo')}
          >
            Nuevo Producto
          </Button>
        ]}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default ListProductos;
