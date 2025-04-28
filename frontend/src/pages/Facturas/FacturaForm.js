import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Card, Select, DatePicker, 
  Table, Space, Typography, Row, Col, InputNumber, 
  message, AutoComplete, Divider, Modal 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, SearchOutlined, 
  UserOutlined, ShoppingCartOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  fetchFacturaById, createFactura, updateFactura,
  fetchClientes, fetchVendedores, fetchProductos 
} from '../../api/facturas';
import PageHeader from '../../../components/common/PageHeader';

const { Option } = Select;
const { Title, Text } = Typography;

const FacturaForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [items, setItems] = useState([]);
  const [productoSearch, setProductoSearch] = useState('');
  const [productoOptions, setProductoOptions] = useState([]);
  const [clienteSearch, setClienteSearch] = useState('');
  const [clienteOptions, setClienteOptions] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [impuesto, setImpuesto] = useState(0);
  const [total, setTotal] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar clientes y vendedores
        const [clientesRes, vendedoresRes] = await Promise.all([
          fetchClientes(),
          fetchVendedores()
        ]);
        
        setClientes(clientesRes.data);
        setVendedores(vendedoresRes.data);
        
        // Si es edición, cargar factura existente
        if (isEdit) {
          const facturaRes = await fetchFacturaById(id);
          form.setFieldsValue({
            ...facturaRes,
            fecha: moment(facturaRes.fecha),
            cliente_id: facturaRes.cliente.id,
            vendedor_id: facturaRes.vendedor.id
          });
          setItems(facturaRes.detalles.map(d => ({
            ...d,
            producto: d.producto
          })));
          calculateTotals(facturaRes.detalles);
        }
      } catch (error) {
        message.error('Error al cargar datos iniciales');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [id, form, isEdit]);

  useEffect(() => {
    calculateTotals(items);
  }, [items]);

  const calculateTotals = (items) => {
    const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const newImpuesto = newSubtotal * 0.19; // 19% IVA
    const newTotal = newSubtotal + newImpuesto;
    
    setSubtotal(newSubtotal);
    setImpuesto(newImpuesto);
    setTotal(newTotal);
  };

  const handleSearchProducto = async (value) => {
    setProductoSearch(value);
    if (value.length > 2) {
      try {
        const response = await fetchProductos({ search: value });
        setProductoOptions(response.data.map(p => ({
          value: p.nombre,
          label: `${p.nombre} - $${p.precio.toLocaleString('es-CO')}`,
          producto: p
        })));
      } catch (error) {
        message.error('Error al buscar productos');
      }
    }
  };

  const handleAddItem = (producto) => {
    const existingItem = items.find(item => item.producto_id === producto.id);
    
    if (existingItem) {
      setItems(items.map(item => 
        item.producto_id === producto.id 
          ? { 
              ...item, 
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * item.precio_unitario
            } 
          : item
      ));
    } else {
      setItems([
        ...items,
        {
          producto_id: producto.id,
          producto,
          cantidad: 1,
          precio_unitario: producto.precio,
          subtotal: producto.precio
        }
      ]);
    }
    
    setProductoSearch('');
    setProductoOptions([]);
  };

  const handleRemoveItem = (productoId) => {
    setItems(items.filter(item => item.producto_id !== productoId));
  };

  const handleUpdateQuantity = (productoId, cantidad) => {
    if (cantidad <= 0) {
      handleRemoveItem(productoId);
      return;
    }
    
    setItems(items.map(item => 
      item.producto_id === productoId 
        ? { 
            ...item, 
            cantidad,
            subtotal: cantidad * item.precio_unitario
          } 
        : item
    ));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const facturaData = {
        ...values,
        fecha: values.fecha.toISOString(),
        subtotal,
        impuesto,
        total,
        detalles: items.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal
        }))
      };
      
      setLoading(true);
      
      if (isEdit) {
        await updateFactura(id, facturaData);
        message.success('Factura actualizada correctamente');
      } else {
        await createFactura(facturaData);
        message.success('Factura creada correctamente');
      }
      
      navigate('/facturas');
    } catch (error) {
      if (items.length === 0) {
        message.error('Debe agregar al menos un producto');
      } else {
        message.error('Error al guardar la factura');
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'producto',
      key: 'producto',
      render: (producto) => producto.nombre,
    },
    {
      title: 'Precio Unitario',
      dataIndex: 'precio_unitario',
      key: 'precio_unitario',
      render: (precio) => `$${precio.toLocaleString('es-CO')}`,
      align: 'right',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      render: (cantidad, record) => (
        <InputNumber
          min={1}
          value={cantidad}
          onChange={(value) => handleUpdateQuantity(record.producto_id, value)}
        />
      ),
      align: 'center',
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal) => `$${subtotal.toLocaleString('es-CO')}`,
      align: 'right',
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleRemoveItem(record.producto_id)}
        />
      ),
      align: 'center',
    },
  ];

  return (
    <div className="factura-form-container">
      <PageHeader
        title={isEdit ? 'Editar Factura' : 'Nueva Factura'}
        onBack={() => navigate('/facturas')}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fecha: moment(),
          estado: 'PENDIENTE'
        }}
      >
        <Row gutter={24}>
          <Col span={24} lg={16}>
            <Card title="Información Básica" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={24} md={8}>
                  <Form.Item
                    name="fecha"
                    label="Fecha"
                    rules={[{ required: true, message: 'Seleccione la fecha' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={24} md={8}>
                  <Form.Item
                    name="cliente_id"
                    label="Cliente"
                    rules={[{ required: true, message: 'Seleccione el cliente' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Buscar cliente"
                      filterOption={false}
                      onSearch={setClienteSearch}
                      options={clienteOptions}
                    >
                      {clientes.map(cliente => (
                        <Option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellido}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} md={8}>
                  <Form.Item
                    name="vendedor_id"
                    label="Vendedor"
                    rules={[{ required: true, message: 'Seleccione el vendedor' }]}
                  >
                    <Select placeholder="Seleccione vendedor">
                      {vendedores.map(vendedor => (
                        <Option key={vendedor.id} value={vendedor.id}>
                          {vendedor.nombre} {vendedor.apellido}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="observaciones"
                label="Observaciones"
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Card>

            <Card 
              title="Productos" 
              extra={
                <AutoComplete
                  value={productoSearch}
                  options={productoOptions}
                  style={{ width: 300 }}
                  onSelect={(_, option) => handleAddItem(option.producto)}
                  onSearch={handleSearchProducto}
                  placeholder="Buscar producto..."
                >
                  <Input 
                    suffix={<SearchOutlined />} 
                    prefix={<ShoppingCartOutlined />}
                  />
                </AutoComplete>
              }
            >
              <Table
                columns={columns}
                dataSource={items}
                rowKey="producto_id"
                pagination={false}
                scroll={{ x: true }}
                locale={{
                  emptyText: 'No hay productos agregados'
                }}
              />
            </Card>
          </Col>
          <Col span={24} lg={8}>
            <Card title="Resumen">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Subtotal:</Text>
                  <Text style={{ float: 'right' }}>
                    ${subtotal.toLocaleString('es-CO')}
                  </Text>
                </div>
                <div>
                  <Text strong>IVA (19%):</Text>
                  <Text style={{ float: 'right' }}>
                    ${impuesto.toLocaleString('es-CO')}
                  </Text>
                </div>
                <Divider />
                <div>
                  <Text strong style={{ fontSize: '1.2em' }}>Total:</Text>
                  <Text strong style={{ float: 'right', fontSize: '1.2em' }}>
                    ${total.toLocaleString('es-CO')}
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={items.length === 0}
                >
                  {isEdit ? 'Actualizar Factura' : 'Crear Factura'}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FacturaForm;