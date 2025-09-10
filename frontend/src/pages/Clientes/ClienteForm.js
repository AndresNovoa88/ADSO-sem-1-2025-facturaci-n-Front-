import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createCliente, updateCliente, fetchClienteById } from '../../api/clientes';

const ClienteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadClienteData();
    }
    // eslint-disable-next-line
  }, [id]); 

  const loadClienteData = async () => {
    try {
      setLoading(true);
      const res = await fetchClienteById(id);
      form.setFieldsValue(res.data);
    } catch (error) {
      message.error('Error cargando datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('No estás autenticado');
        return;
      }
      
      if (isEditing) {
        await updateCliente(id, values);
        message.success('Cliente actualizado exitosamente');
      } else {
        await createCliente(values);
        message.success('Cliente creado exitosamente');
      }
      
      // Redirigir después de 1 segundo (para que se vea el mensaje)
      setTimeout(() => navigate('/clientes'), 1000);
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          message.error('Sesión expirada. Redirigiendo...');
          localStorage.removeItem('token');
          setTimeout(() => window.location.href = '/login', 2000);
        } else if (error.response.status === 400) {
          const errorMsg = error.response.data?.message || 
                          error.response.data?.error ||
                          'Datos inválidos';
          message.error(`Error: ${errorMsg}`);
        } else {
          message.error('Error en el servidor');
        }
      } else {
        message.error('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item 
        label="Identificación" 
        name="identificacion"
        rules={[{ pattern: /^[0-9A-Za-z-]+$/, message: 'Identificación inválida' }]}
      >
        <Input placeholder="Número de identificación" />
      </Form.Item>
      
      <Form.Item 
        label="Nombre" 
        name="nombre"
        rules={[{ required: true, message: 'Nombre es obligatorio' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item 
        label="Apellido" 
        name="apellido"
        rules={[{ required: true, message: 'Apellido es obligatorio' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item 
        label="Email" 
        name="email"
        rules={[{ type: 'email', message: 'Email inválido' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item 
        label="Teléfono" 
        name="telefono"
        rules={[{ pattern: /^[0-9+-\s()]{7,15}$/, message: 'Teléfono inválido' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item label="Dirección" name="direccion">
        <Input.TextArea rows={3} />
      </Form.Item>
      
      <Button type="primary" htmlType="submit" loading={loading}>
        {isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
      </Button>
      
      <Button style={{ marginLeft: 10 }} onClick={() => navigate('/clientes')}>
        Cancelar
      </Button>
    </Form>
  );
};

export default ClienteForm;