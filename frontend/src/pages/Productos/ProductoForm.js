import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, InputNumber, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProducto,
  updateProducto,
  fetchProductoById,
} from "../../api/productos";
import PageHeader from "../../components/common/PageHeader";

const ProductoForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [createAndAdd, setCreateAndAdd] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadProductoData();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadProductoData = async () => {
    try {
      setLoading(true);
      const res = await fetchProductoById(id);
      form.setFieldsValue({
        ...res.data,
        precio: parseFloat(res.data.precio),
        stock: parseInt(res.data.stock, 10),
      });
    } catch (error) {
      message.error("Error cargando datos del producto");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Convertir a números
      values.precio = parseFloat(values.precio);
      values.stock = parseInt(values.stock, 10);

      if (isEditing) {
        await updateProducto(id, values);
        message.success("✅ Producto actualizado exitosamente");

        // Recargar datos después de editar
        loadProductoData();
      } else {
        await createProducto(values);
        message.success("✅ Producto creado exitosamente");

        if (createAndAdd) {
          // Limpiar formulario para añadir otro
          form.resetFields();
          setCreateAndAdd(false);
        } else {
          // Redirigir a la lista
          setTimeout(() => navigate("/productos"), 1500);
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          message.error("Sesión expirada. Redirigiendo...");
          localStorage.removeItem("token");
          setTimeout(() => (window.location.href = "/login"), 2000);
        } else if (
          error.response.status === 400 ||
          error.response.status === 409
        ) {
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            "Datos inválidos";
          message.error(`Error: ${errorMessage}`);
        } else {
          message.error("Error en el servidor");
        }
      } else {
        message.error("Error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndAdd = async () => {
    try {
      setLoading(true);
      setCreateAndAdd(true);

      // Obtener valores del formulario
      const values = await form.validateFields();

      // Convertir a números
      values.precio = parseFloat(values.precio);
      values.stock = parseInt(values.stock, 10);

      // Crear el producto
      await createProducto(values);
      message.success("✅ Producto creado exitosamente");

      // Limpiar formulario para añadir otro
      form.resetFields();
    } catch (error) {
      // Manejar errores de validación del formulario
      if (error.errorFields) {
        message.error("Por favor, complete todos los campos requeridos");
      }
      // Manejar otros errores
      else if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Error al crear el producto";
        message.error(`Error: ${errorMessage}`);
      } else {
        message.error("Error de conexión");
      }
    } finally {
      setLoading(false);
      setCreateAndAdd(false);
    }
  };

  return (
    <Card>
      <PageHeader
        title={isEditing ? "Editar Producto" : "Nuevo Producto"}
        onBack={() => navigate("/productos")}
      />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[
            {
              required: true,
              message: "Nombre es obligatorio",
            },
          ]}
        >
          <Input placeholder="Ej: Camiseta deportiva" />
        </Form.Item>

        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[{ max: 255, message: "Máximo 255 caracteres" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Descripción detallada del producto"
          />
        </Form.Item>

        <Form.Item
          name="precio"
          label="Precio"
          rules={[
            {
              required: true,
              type: "number",
              min: 0.01,
              message: "Precio debe ser mayor a 0",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0.01}
            step={0.1}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder="Ej: 29.99"
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock"
          rules={[
            {
              required: true,
              type: "integer",
              min: 0,
              message: "Stock no puede ser negativo",
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Ej: 100"
          />
        </Form.Item>

        <Form.Item
          name="categoria"
          label="Categoría"
          rules={[{ max: 50, message: "Máximo 50 caracteres" }]}
        >
          <Input placeholder="Ej: Ropa deportiva" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: 10 }}
          >
            {isEditing ? "Actualizar Producto" : "Crear Producto"}
          </Button>

          <Button onClick={() => navigate("/productos")} disabled={loading}>
            Cancelar
          </Button>

          {/* Botón para crear y añadir otro */}
          {!isEditing && (
            <Button
              type="dashed"
              style={{ marginLeft: 10 }}
              onClick={handleCreateAndAdd}
              loading={loading && createAndAdd}
            >
              Crear y añadir otro
            </Button>
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductoForm;
