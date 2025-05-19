import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, InputNumber, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductos, createProducto, updateProducto } from '../../api/productos';
import PageHeader from '../../components/common/PageHeader';

const ProductoForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetchProductos()
        .then(res => {
          const prod = res.data.find(p => p.id === parseInt(id, 10));
          if (!prod) return message.error('Producto no encontrado');
          form.setFieldsValue(prod);
        })
        .catch(() => message.error('Error cargando producto'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, form]);

  const onFinish = async values => {
    try {
      setLoading(true);
      if (isEdit) {
        await updateProducto(id, values);
        message.success('Producto actualizado');
      } else {
        await createProducto(values);
        message.success('Producto creado');
      }
      navigate('/productos');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message); // ⬅️ muestra el mensaje del backend
      } else {
        message.error('Error al guardar producto');
      }
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Card>
      <PageHeader
        title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        onBack={() => navigate('/productos')}
      />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="descripcion" label="Descripción">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            formatter={value => `$ ${value}`}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="categoria" label="Categoría">
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

export default ProductoForm;
