// src/pages/Clientes/ListClientes.js
import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchClientes, deleteCliente } from "../../api/clientes";
import PageHeader from "../../components/common/PageHeader";

const ListClientes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchClientes();
      setData(res.data);
    } catch {
      message.error("Error cargando clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCliente(id);
      message.success("Cliente eliminado");
      load();
    } catch {
      message.error("Error eliminando");
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Apellido", dataIndex: "apellido", key: "apellido" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Teléfono", dataIndex: "telefono", key: "telefono" },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/clientes/editar/${record.id}`)}
          />
          <Popconfirm
            title="¿Eliminar cliente?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Clientes"
        extra={[
          <Button
            key="new"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/clientes/nuevo")}
          >
            Nuevo Cliente
          </Button>,
        ]}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default ListClientes;
