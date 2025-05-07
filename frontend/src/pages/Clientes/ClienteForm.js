import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClientes, createCliente, updateCliente } from '../../api/clientes';
import PageHeader from '../../components/common/PageHeader';

const ClienteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetchClientes()
        .then(res => {
          const cliente = res.data.find(c => c.id === parseInt(id, 10));
          if (!cliente) return message.error('Cliente no encontrado');
          form.setFieldsValue(cliente);
        })
        .catch(() => message.error('Error cargando cliente'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, form]);

  const onFinish = async values => {
    try {
      setLoading(true);
      if (isEdit) {
        await updateCliente(id, values);
        message.success('Cliente actualizado');
      } else {
        await createCliente(values);
        message.success('Cliente creado');
      }
      navigate('/clientes');
    } catch {
      message.error('Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <PageHeader
        title={isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
        onBack={() => navigate('/clientes')}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ estado: true }}
      >
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="apellido" label="Apellido" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="telefono" label="Teléfono">
          <Input />
        </Form.Item>
        <Form.Item name="direccion" label="Dirección">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ClienteForm;
