import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Spin, 
  Switch,
  Row,
  Col,
  Typography,
  message
} from 'antd';
import { 
  fetchVendedorById, 
  createVendedor, 
  updateVendedor 
} from '../../api/vendedores';

const { Title } = Typography;

const VendedorForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      const loadVendedor = async () => {
        try {
          setLoading(true);
          const response = await fetchVendedorById(id);
          form.setFieldsValue({
            ...response.data,
            cuota_ventas: parseFloat(response.data.cuota_ventas)
          });
          setLoading(false);
        } catch (error) {
          message.error('Error al cargar vendedor');
          setLoading(false);
        }
      };
      loadVendedor();
    }
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      console.log("📤 Datos enviados:", values);
      setSubmitting(true);
      
      // Validación adicional para cuota de ventas
      if (values.cuota_ventas < 0) {
        message.error('La cuota de ventas no puede ser negativa');
        return;
      }
      
      if (isEdit) {
        console.log("🔄 Actualizando vendedor...");
        await updateVendedor(id, values);
        message.success('Vendedor actualizado correctamente');
      } else {
        console.log("➕ Creando nuevo vendedor...");
        await createVendedor(values);
        message.success('Vendedor creado correctamente');
      }
      
      navigate('/vendedores');
    } catch (error) {
    console.error("❌ Error en onFinish:", error);
    
    // Mostrar detalles adicionales del error
    if (error.response) {
      console.error("📦 Respuesta de error:", error.response.data);
      message.error(`Error del servidor: ${error.response.data.error || error.response.data.message}`);
    } else {
      message.error('Error al guardar el vendedor');
    }
  } finally {
    setSubmitting(false);
    }
  };

  return (
    <Card>
      <Title level={2} style={{ marginBottom: 24 }}>
        {isEdit ? 'Editar Vendedor' : 'Crear Nuevo Vendedor'}
      </Title>
      
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            estado: true,
            cuota_ventas: 0
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[
                  { required: true, message: 'Por favor ingresa el nombre' },
                  { min: 3, message: 'Mínimo 3 caracteres' }
                ]}
              >
                <Input placeholder="Nombre del vendedor" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Apellido"
                name="apellido"
                rules={[
                  { required: true, message: 'Por favor ingresa el apellido' },
                  { min: 3, message: 'Mínimo 3 caracteres' }
                ]}
              >
                <Input placeholder="Apellido del vendedor" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Ingresa un email válido' }
                ]}
              >
                <Input placeholder="ejemplo@correo.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Teléfono"
                name="telefono"
              >
                <Input placeholder="Número de teléfono" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Cuota de Ventas (USD)"
                name="cuota_ventas"
                rules={[
                  { 
                    pattern: /^\d+(\.\d{1,2})?$/,
                    message: 'Ingresa un valor válido (ej: 1000.50)'
                  },
                  { 
                    validator: (_, value) => 
                      value >= 0 ? Promise.resolve() : Promise.reject('La cuota no puede ser negativa') 
                  }
                ]}
              >
                <Input type="number" min="0" step="0.01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Estado"
                name="estado"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Activo" 
                  unCheckedChildren="Inactivo" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              style={{ marginRight: 8 }}
            >
              {isEdit ? 'Actualizar Vendedor' : 'Crear Vendedor'}
            </Button>
            <Button onClick={() => navigate('/vendedores')}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default VendedorForm;