import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Tag, Input, 
  Row, Col, Statistic, DatePicker, message 
} from 'antd';
import { 
  SearchOutlined, FileAddOutlined, SyncOutlined,
  EyeOutlined, EditOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchFacturas } from '../../api/facturas';
import PageHeader from '../../components/common/PageHeader';

const { RangePicker } = DatePicker;

const ListFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await fetchFacturas();
      setFacturas(data);
    } catch (error) {
      message.error('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const columns = [
    {
      title: 'N° Factura',
      dataIndex: 'codigo',
      key: 'codigo',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Cliente',
      key: 'cliente',
      render: (_, record) => `${record.cliente.nombre} ${record.cliente.apellido}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toLocaleString('es-CO')}`,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        let color = estado === 'PAGADA' ? 'green' : estado === 'ANULADA' ? 'red' : 'orange';
        return <Tag color={color}>{estado}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/facturas/${record.id}`)} />
          <Button icon={<EditOutlined />} onClick={() => navigate(`/facturas/editar/${record.id}`)} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div className="factura-list">
      <PageHeader
        title="Gestión de Facturas"
        extra={[
          <Button 
            key="new" 
            type="primary" 
            icon={<FileAddOutlined />}
            onClick={() => navigate('/facturas/nueva')}
          >
            Nueva Factura
          </Button>,
          <Button 
            key="refresh" 
            icon={<SyncOutlined />} 
            onClick={loadFacturas}
          />
        ]}
      />

      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Input 
              placeholder="Buscar facturas..." 
              prefix={<SearchOutlined />} 
              allowClear
            />
          </Col>
          <Col span={12}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={facturas}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ListFacturas;