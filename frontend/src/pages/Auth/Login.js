import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Layout, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
//import logo from '../../assets/images/logo-sena.png';
import { ReactComponent as Logo } from '@ant-design/icons'; // Importa el SVG como un componente

const { Content } = Layout;
const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values.username, values.password);
      navigate('/dashboard');
      message.success('Bienvenido al sistema');
    } catch (error) {
      message.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="auth-layout">
      <Content className="auth-container">
        <div className="auth-logo">
          <img src={Logo} alt="SENA Logo" style={{ height: '80px' }} />
          <Title level={3} style={{ marginTop: '16px' }}>Sistema de Facturación</Title>
        </div>
        <Card className="auth-card">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Ingrese su usuario' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Usuario" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Ingrese su contraseña' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
              >
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;