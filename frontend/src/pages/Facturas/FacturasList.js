import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Card,
  Tag,
  Tooltip,
  Popconfirm,
  message,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  fetchFacturas,
  deleteFactura,
  searchFacturasByCliente,
} from "../../api/facturas";
import PageHeader from "../../components/common/PageHeader";

const { Text } = Typography;

const FacturasList = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [downloading, setDownloading] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const loadFacturas = async (search = "") => {
    setLoading(true);
    try {
      const data = search
        ? await searchFacturasByCliente(search)
        : await fetchFacturas();
      setFacturas(data);
    } catch (error) {
      message.error(error.message || "Error cargando facturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const handleSearch = () => {
    if (searchText.length < 3) {
      message.warning("Ingrese al menos 3 caracteres para buscar");
      return;
    }
    loadFacturas(searchText);
  };

  const handleClearSearch = () => {
    setSearchText("");
    loadFacturas();
  };

  const handleDelete = async (id) => {
    try {
      await deleteFactura(id);
      message.success("Factura eliminada correctamente");
      loadFacturas();
    } catch (error) {
      message.error(error.message || "Error eliminando factura");
    }
  };

  const downloadPDF = async (codigo) => {
    setDownloading(codigo);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/facturas/pdf/${codigo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura_${codigo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(error.message || "Error al descargar el PDF");
    } finally {
      setDownloading(null);
    }
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (fecha) => moment(fecha).format("DD/MM/YYYY"),
    },
    {
    title: 'Cliente',
    key: 'cliente',
    render: (_, record) => {
      // Obtener cliente desde la relación
      const cliente = record.Cliente;
      return <Text>{cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A'}</Text>;
    }
  },
  {
    title: 'Vendedor',
    key: 'vendedor',
    render: (_, record) => {
      // Obtener vendedor desde la relación
      const vendedor = record.Vendedor;
      return <Text>{vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'N/A'}</Text>;
    }
  },
  {
    title: 'Creado por',
    key: 'creador',
    render: (_, record) => {
      // Obtener usuario desde la relación
      const creador = record.User;
      return <Text>{creador ? creador.username : 'N/A'}</Text>;
    }
  },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <Text strong>
          $
          {total.toLocaleString("es-CO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      ),
      align: "right",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => {
        let color = "";
        switch (estado) {
          case "PENDIENTE":
            color = "orange";
            break;
          case "PAGADA":
            color = "green";
            break;
          case "ANULADA":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{estado}</Tag>;
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalles">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/facturas/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title="Descargar PDF">
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => downloadPDF(record.codigo)}
              loading={downloading === record.codigo}
            />
          </Tooltip>

          {record.estado === "PENDIENTE" && (
            <Popconfirm
              title="¿Eliminar esta factura?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sí"
              cancelText="No"
            >
              <Tooltip title="Eliminar">
                <Button danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Listado de Facturas"
        extra={[
          <Button
            key="new"
            type="primary"
            onClick={() => navigate("/facturas/nueva")}
          >
            Nueva Factura
          </Button>,
        ]}
      />

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Buscar por nombre de cliente o código..."
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                Buscar
              </Button>
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 400 }}
            allowClear
            onClear={handleClearSearch}
          />
        </div>

        <Table
          columns={columns}
          dataSource={facturas}
          rowKey="id"
          loading={loading}
          scroll={{ x: true }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default FacturasList;
