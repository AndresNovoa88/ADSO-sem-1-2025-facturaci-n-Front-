import React, { useState, useEffect } from 'react';
import { 
  Descriptions, 
  Button, 
  Tag, 
  Typography, 
  Card, 
  Table,
  Spin,
  message
} from 'antd';
import { 
  DownloadOutlined, 
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { fetchFacturaById } from '../../api/facturas';

const { Title, Text } = Typography;

const FacturaDetail = () => {
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadFactura = async () => {
      setLoading(true);
      try {
        const data = await fetchFacturaById(id);
        setFactura(data);
      } catch (error) {
        message.error(error.message || 'Error cargando factura');
      } finally {
        setLoading(false);
      }
    };
    
    loadFactura();
  }, [id]);

  const downloadPDF = async () => {
    if (!factura || !factura.codigo) return;

    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/facturas/pdf/${factura.codigo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al descargar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura_${factura.codigo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(error.message || 'Error al descargar el PDF');
    } finally {
      setDownloading(false);
    }
  };

  const columns = [
    {
      title: 'Producto',
      dataIndex: ['Producto', 'nombre'],
      key: 'producto'
    },
    {
      title: 'Descripción',
      dataIndex: ['Producto', 'descripcion'],
      key: 'descripcion',
      render: (desc) => desc || 'Sin descripción'
    },
    {
      title: 'Precio Unitario',
      dataIndex: 'precio_unitario',
      key: 'precio',
      render: (precio) => `$${precio.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad'
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal) => `$${subtotal.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }
  ];

  if (!factura) return <Spin spinning={loading} />;

  return (
    <Spin spinning={loading}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/facturas')}
        style={{ marginBottom: 16 }}
      >
        Volver a facturas
      </Button>
      
      <Card
        title={`Factura ${factura.codigo}`}
        extra={
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={downloadPDF}
            loading={downloading}
          >
            Descargar PDF
          </Button>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Fecha">
            {moment(factura.fecha).format('DD/MM/YYYY')}
          </Descriptions.Item>
          
          <Descriptions.Item label="Cliente">
            <Text strong>
              {factura.Cliente.nombre} {factura.Cliente.apellido}
            </Text>
            <br />
            <Text type="secondary">Identificación: {factura.Cliente.identificacion || 'No especificada'}</Text>
            <br />
            {factura.Cliente.direccion && <Text>Dirección: {factura.Cliente.direccion}</Text>}
            {factura.Cliente.email && <Text>Email: {factura.Cliente.email}</Text>}
            {factura.Cliente.telefono && <Text>Teléfono: {factura.Cliente.telefono}</Text>}
          </Descriptions.Item>
          
          <Descriptions.Item label="Vendedor">
            <Text strong>
              {factura.Vendedor.nombre} {factura.Vendedor.apellido}
            </Text>
            <br />
            {factura.Vendedor.email && <Text>Email: {factura.Vendedor.email}</Text>}
            {factura.Vendedor.telefono && <Text>Teléfono: {factura.Vendedor.telefono}</Text>}
          </Descriptions.Item>
          
          <Descriptions.Item label="Estado">
            <Tag color={
              factura.estado === 'PAGADA' ? 'green' : 
              factura.estado === 'ANULADA' ? 'red' : 'orange'
            }>
              {factura.estado}
            </Tag>
            {factura.motivo_anulacion && factura.estado === 'ANULADA' && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                Motivo: {factura.motivo_anulacion}
              </Text>
            )}
          </Descriptions.Item>
          
          <Descriptions.Item label="Observaciones">
            {factura.observaciones || 'Ninguna'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Creada por">
            <Text>
              {factura.Creador?.username || 'Usuario no disponible'}
            </Text>
          </Descriptions.Item>
        </Descriptions>
        
        <Title level={5} style={{ marginTop: 24 }}>Productos</Title>
        <Table
          columns={columns}
          dataSource={factura.DetalleFacturas}
          rowKey="id"
          pagination={false}
        />
        
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Text strong style={{ fontSize: 16 }}>
            Subtotal: ${factura.subtotal.toLocaleString('es-CO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
          <br />
          <Text strong style={{ fontSize: 16 }}>
            IVA (19%): ${factura.impuesto.toLocaleString('es-CO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
          <br />
          <Text strong style={{ fontSize: 18 }}>
            Total: ${factura.total.toLocaleString('es-CO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
        </div>
      </Card>
    </Spin>
  );
};

export default FacturaDetail;