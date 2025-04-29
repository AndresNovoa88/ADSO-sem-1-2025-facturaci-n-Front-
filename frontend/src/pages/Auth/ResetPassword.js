import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

const { Title } = Typography;
const { Password } = Input;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí deberías validar el token con tu backend
    const validateToken = async () => {
      try {
        // Ejemplo: await axios.get(`/api/auth/validate-reset-token/${token}`);
        setValidToken(true);
      } catch (error) {
        message.error('El enlace ha expirado o no es válido');
        navigate('/auth/login');
      }
    };

    validateToken();
  }, [token, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Aquí iría la llamada a tu API para resetear la contraseña
      // Ejemplo: await axios.post(`/api/auth/reset-password/${token}`, { password: values.password });
      message.success('Contraseña actualizada correctamente');
      navigate('/auth/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) return null;

  return (
    <AuthLayout>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Nueva Contraseña
        </Title>

        <Form
          name="reset_password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa tu nueva contraseña' },
              { min: 8, message: 'Mínimo 8 caracteres' }
            ]}
          >
            <Password 
              prefix={<LockOutlined />} 
              placeholder="Nueva contraseña" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirma tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Password 
              prefix={<LockOutlined />} 
              placeholder="Confirmar contraseña" 
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
              Actualizar Contraseña
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthLayout>
  );
};

export default ResetPassword;