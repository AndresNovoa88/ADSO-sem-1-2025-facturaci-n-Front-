import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import api from '../../api/api';

const { Title } = Typography;

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { currentPassword, newPassword } = values;
    try {
      setLoading(true);
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      message.success('Contraseña cambiada con éxito');
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 500, margin: '0 auto' }}>
      <Title level={3}>Cambiar Contraseña</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Contraseña actual"
          name="currentPassword"
          rules={[{ required: true, message: 'Ingresa tu contraseña actual' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="Nueva contraseña"
          name="newPassword"
          rules={[
            { required: true, message: 'Ingresa tu nueva contraseña' },
            { min: 8, message: 'Debe tener mínimo 8 caracteres' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="Confirmar nueva contraseña"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Confirma tu nueva contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Cambiar Contraseña
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePassword;
