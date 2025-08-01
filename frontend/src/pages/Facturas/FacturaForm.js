import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  DatePicker,
  Table,
  Space,
  Typography,
  Row,
  Col,
  InputNumber,
  message,
  AutoComplete,
  Divider,
  Spin,
  Tag,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchFacturaById,
  createFactura,
  updateFactura,
  fetchClientes,
  fetchVendedores,
  fetchProductos,
} from "../../api/facturas";
import PageHeader from "../../components/common/PageHeader";
import { useDebounce } from "../../hooks/useDebounce";
import "./FacturaForm.css";

const { Option } = Select;
const { Title, Text } = Typography;

const FacturaForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [items, setItems] = useState([]);
  const [productoSearch, setProductoSearch] = useState("");
  const [productoOptions, setProductoOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Manejar errores de API
  const handleApiError = (error) => {
    if (error.response && error.response.status === 401) {
      message.error('Sesión expirada. Redirigiendo...');
      localStorage.removeItem('token');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      message.error(error.message || 'Error en la solicitud');
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [clientesRes, vendedoresRes] = await Promise.all([
          fetchClientes().catch(() => []),
          fetchVendedores().catch(() => []),
        ]);

        setClientes(clientesRes);
        setVendedores(vendedoresRes);

        if (isEdit) {
          const facturaRes = await fetchFacturaById(id);
          if (!facturaRes) {
            message.error("Factura no encontrada");
            navigate("/facturas");
            return;
          }

          form.setFieldsValue({
            ...facturaRes,
            fecha: moment(facturaRes.fecha),
            cliente_id: facturaRes.cliente.id,
            vendedor_id: facturaRes.vendedor.id,
          });

          setItems(
            facturaRes.items.map((d) => ({
              ...d,
              producto: d.producto,
              key: d.producto.id,
            }))
          );
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, form, isEdit, navigate]);

  const debouncedSearch = useDebounce(productoSearch, 500);

  // Manejar cambio de búsqueda de producto
 useEffect(() => {
  const buscar = async () => {
    if (!debouncedSearch || debouncedSearch.length < 3) {
      setProductoOptions([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetchProductos({ search: debouncedSearch });
      setProductoOptions(
        response.map((p) => ({
    value: p.id,
    label: `${p.nombre} ($${p.precio.toLocaleString()})`,
    producto: p,
  }))
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setSearchLoading(false);
    }
  };

  buscar();
}, [debouncedSearch]);


  // Calcular totales
  const calculateTotals = useCallback(
  (items) => {
    const subtotal = items.reduce((sum, item) => {
      const precio = parseFloat(item.precio_unitario);
      return sum + precio * item.cantidad;
    }, 0);
    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;

    form.setFieldsValue({ subtotal, impuesto, total });
  },
  [form]
);

  // Efecto para calcular totales
  useEffect(() => {
    calculateTotals(items);
  }, [items, calculateTotals]);

  // Manejar agregar producto
  const handleAddItem = (value, option) => {
    const producto = option.producto;
    const existingIndex = items.findIndex(
      (item) => item.producto_id === producto.id
    );

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].cantidad += 1;
      newItems[existingIndex].subtotal =
        newItems[existingIndex].cantidad * producto.precio;
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          producto_id: producto.id,
          producto,
          cantidad: 1,
          precio_unitario: producto.precio,
          subtotal: producto.precio,
          key: producto.id,
        },
      ]);
    }

    setProductoSearch("");
    setProductoOptions([]);
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (productoId, value) => {
  // Si el valor es nulo o indefinido (cuando se borra todo), mantener el valor actual
  if (value === null || value === undefined) {
    return;
  }
  
  // Solo eliminar si explícitamente se establece en 0
  if (value === 0) {
    handleRemoveItem(productoId);
    return;
  }

  // Actualizar la cantidad normalmente
  setItems(
    items.map((item) =>
      item.producto_id === productoId
        ? {
            ...item,
            cantidad: value,
            subtotal: value * item.precio_unitario,
          }
        : item
    )
  );
};

  // Eliminar producto
  const handleRemoveItem = (productoId) => {
    setItems(items.filter((item) => item.producto_id !== productoId));
  };

  // Enviar formulario
  const handleSubmit = async () => {
    try {
      await form.validateFields();

      if (items.length === 0) {
        throw new Error("Debe agregar al menos un producto");
      }

      const values = await form.getFieldsValue();
      const facturaData = {
        ...values,
        fecha: values.fecha.format("YYYY-MM-DD"),
        items: items.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: parseFloat(item.precio_unitario),
        })),
      };

      setLoading(true);

      if (isEdit) {
        await updateFactura(id, facturaData);
        message.success("Factura actualizada exitosamente");
      } else {
        console.log("Factura a enviar:", facturaData);
        await createFactura(facturaData);
        message.success("Factura creada exitosamente");
      }

      navigate("/facturas");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: "Producto",
      dataIndex: ["producto", "nombre"],
      key: "nombre",
      width: "35%",
    },
    {
      title: "Precio Unit.",
      dataIndex: "precio_unitario",
      key: "precio",
      render: (precio) => `$${precio.toLocaleString()}`,
      align: "right",
      width: "20%",
    },
    {
  title: "Cantidad",
  dataIndex: "cantidad",
  key: "cantidad",
  render: (cantidad, record) => (
    <InputNumber
      min={1}
      value={cantidad}
      onChange={(value) => handleQuantityChange(record.producto_id, value)}
      onBlur={(e) => {
        // Si queda vacío, restaurar valor anterior
        if (e.target.value === '') {
          handleQuantityChange(record.producto_id, cantidad);
        }
      }}
      style={{ width: "80px" }}
    />
  ),
  align: "center",
  width: "20%",
},
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal) => `$${subtotal.toLocaleString()}`,
      align: "right",
      width: "20%",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.producto_id)}
        />
      ),
      align: "center",
      width: "5%",
    },
  ];

  return (
    <Spin spinning={loading}>
      <PageHeader
        title={isEdit ? "Editar Factura" : "Nueva Factura"}
        onBack={() => navigate("/facturas")}
        extra={[
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
          >
            Guardar
          </Button>,
        ]}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fecha: moment(),
          estado: "PENDIENTE",
        }}
      >
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Información Básica" className="factura-card">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="fecha"
                    label="Fecha"
                    rules={[{ required: true }]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      disabledDate={(current) => current > moment()}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="cliente_id"
                    label="Cliente"
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Seleccione cliente"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {clientes.map((cliente) => (
                        <Option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellido}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="vendedor_id"
                    label="Vendedor"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Seleccione vendedor"
                      showSearch
                      optionFilterProp="children"
                    >
                      {vendedores.map((vendedor) => (
                        <Option key={vendedor.id} value={vendedor.id}>
                          {vendedor.nombre} {vendedor.apellido}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="observaciones" label="Observaciones">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Card>

            <Card
              title="Productos"
              className="factura-card"
              extra={
                <AutoComplete
                  value={productoSearch}
                  options={productoOptions}
                  style={{ width: 300 }}
                  onSelect={handleAddItem}
                  onSearch={setProductoSearch}
                  placeholder="Buscar producto..."
                  notFoundContent={searchLoading ? "Buscando..." : null}
                >
                  <Input
                    suffix={<SearchOutlined />}
                    prefix={<ShoppingCartOutlined />}
                    allowClear
                  />
                </AutoComplete>
              }
            >
              <Table
                columns={columns}
                dataSource={items}
                rowKey="key"
                pagination={false}
                scroll={{ x: true }}
                locale={{
                  emptyText: (
                    <Space direction="vertical">
                      <ShoppingCartOutlined style={{ fontSize: 24 }} />
                      <Text type="secondary">No hay productos agregados</Text>
                    </Space>
                  ),
                }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Resumen" className="factura-card">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div className="invoice-summary-row">
                  <Text>Subtotal:</Text>
                  <Text>
                    {form
                      .getFieldValue("subtotal")
                      ?.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                  </Text>
                </div>

                <div className="invoice-summary-row">
                  <Text>IVA (19%):</Text>
                  <Text>
                    {form
                      .getFieldValue("impuesto")
                      ?.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                  </Text>
                </div>

                <Divider />

                <div className="invoice-summary-row total">
                  <Text strong>Total:</Text>
                  <Text strong>
                    {form
                      .getFieldValue("total")
                      ?.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                  </Text>
                </div>

                <Form.Item name="estado" label="Estado">
                  <Select>
                    <Option value="PENDIENTE">
                      <Tag color="orange">PENDIENTE</Tag>
                    </Option>
                    <Option value="PAGADA">
                      <Tag color="green">PAGADA</Tag>
                    </Option>
                    <Option value="CANCELADA">
                      <Tag color="red">CANCELADA</Tag>
                    </Option>
                  </Select>
                </Form.Item>

                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={items.length === 0}
                >
                  {isEdit ? "Actualizar Factura" : "Crear Factura"}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default FacturaForm;