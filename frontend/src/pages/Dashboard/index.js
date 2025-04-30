// pages/Dashboard/index.js
import React from "react";
import { Row, Col, Card, Statistic, Space, Typography } from "antd";
import {
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import PageHeader from "../../components/common/PageHeader";
import MiniChart from "../../components/ui/Charts/MiniChart";

const { Title } = Typography;

const Dashboard = () => {
  // Datos de ejemplo - en una app real vendrían de la API
  const stats = {
    facturas: 124,
    clientes: 42,
    productos: 87,
    ingresos: 12543000,
  };

  return (
    <div className="dashboard-page">
      <PageHeader title="Panel Principal" />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Typography.Title level={4}>Panel de Control</Typography.Title>
            <p>Bienvenido al sistema de facturación</p>
          </Card>
          <Card>
            <Statistic
              title="Facturas"
              value={stats.facturas}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <MiniChart data={[12, 15, 8, 17, 10, 20, 14]} color="#1890ff" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Clientes"
              value={stats.clientes}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <MiniChart data={[5, 8, 6, 4, 7, 9, 6]} color="#52c41a" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Productos"
              value={stats.productos}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <MiniChart data={[10, 12, 8, 15, 12, 18, 14]} color="#faad14" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ingresos (COP)"
              value={stats.ingresos}
              precision={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#f5222d" }}
              formatter={(value) => `$${value.toLocaleString("es-CO")}`}
            />
            <MiniChart
              data={[200, 350, 180, 400, 300, 500, 450]}
              color="#f5222d"
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Actividad Reciente</Title>
        {/* Aquí iría una tabla o lista de actividad reciente */}
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Facturas por Estado">
            {/* Gráfico de facturas por estado */}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Productos más vendidos">
            {/* Gráfico de productos más vendidos */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
