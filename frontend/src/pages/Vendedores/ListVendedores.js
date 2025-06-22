import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Input, 
  Tag, 
  Space, 
  Popconfirm, 
  message, 
  Badge,
  Card,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { fetchVendedores, deleteVendedor } from '../../api/vendedores';

const ListVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    loadVendedores();
  }, [searchTerm, pagination.current]);

  const loadVendedores = async () => {
    try {
      setLoading(true);
      const response = await fetchVendedores(searchTerm);
      setVendedores(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error al cargar vendedores');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVendedor(id);
      message.success('Vendedor eliminado correctamente');
      loadVendedores();
    } catch (error) {
      message.error('Error al eliminar vendedor');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Cuota Ventas',
      dataIndex: 'cuota_ventas',
      key: 'cuota_ventas',
      render: (value) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={estado ? 'green' : 'red'}>
          {estado ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/vendedores/editar/${record.id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="¿Eliminar vendedor?"
            description="¿Estás seguro de eliminar este vendedor?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h1>Gestión de Vendedores</h1>
        </Col>
        <Col>
          <Link to="/vendedores/nuevo">
            <Button type="primary" icon={<PlusOutlined />}>
              Nuevo Vendedor
            </Button>
          </Link>
        </Col>
      </Row>

      <Row style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Buscar vendedores..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={vendedores} 
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Total: ${total} vendedores`,
        }}
        onChange={(pagination) => setPagination(pagination)}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};

export default ListVendedores;