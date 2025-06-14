// frontend/src/api/productos.js
import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchProductos, deleteProducto } from "../../api/productos";
import PageHeader from "../../components/common/PageHeader";

const ListProductos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchProductos();
      setData(res.data);
    } catch {
      message.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProducto(id);
      message.success("✅ Producto eliminado");
      load();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Error eliminando producto");
      }
    }
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      ellipsis: true,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      ellipsis: true,
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      render: (v) =>
        `$${parseFloat(v).toLocaleString("es-CO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      ellipsis: true,
    },
    {
      title: "Acciones",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/productos/editar/${record.id}`)}
            title="Editar"
          />

          <Popconfirm
            title="¿Eliminar este producto?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
            placement="left"
          >
            <Button danger icon={<DeleteOutlined />} title="Eliminar" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Productos"
        extra={[
          <Button
            key="new"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/productos/nuevo")}
          >
            Nuevo Producto
          </Button>,
        ]}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Total: ${total} productos`,
        }}
        scroll={{ x: true }}
      />
    </>
  );
};

export default ListProductos;
