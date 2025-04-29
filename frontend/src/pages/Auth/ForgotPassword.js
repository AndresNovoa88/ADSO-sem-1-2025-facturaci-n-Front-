import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Aquí iría la llamada a tu API para recuperación de contraseña
      // Ejemplo: await axios.post('/api/auth/forgot-password', { email: values.email });
      message.success('Se ha enviado un correo con las instrucciones');
      navigate('/auth/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Recuperar Contraseña</Title>
          <Text type="secondary">Ingresa tu email para recibir instrucciones</Text>
        </div>

        <Form
          name="forgot_password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Email no válido' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email registrado" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Enviar Instrucciones
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button 
              type="link" 
              onClick={() => navigate('/auth/login')}
            >
              Volver al Login
            </Button>
          </div>
        </Form>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPassword;