import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, AntCloudOutlined as Logo } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values.username, values.password);
      message.success('Bienvenido al sistema');
      navigate('/dashboard');
    } catch (error) {
      message.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Logo style={{ fontSize: 80, color: '#1890ff' }} />
        <Title level={3} style={{ marginTop: 16 }}>Sistema de Facturación</Title>
      </div>
      
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Ingrese su usuario' },
            { min: 4, message: 'Mínimo 4 caracteres' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Usuario" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Ingrese su contraseña' },
            { min: 6, message: 'Mínimo 6 caracteres' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Contraseña" 
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
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;