// src/pages/Auth/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("🔐 onFinish login with:", values);
    try {
      setLoading(true);
      const { token, user } = await login({
        username: values.username,
        password: values.password,
      });
      console.log("✅ login response:", { token, user });
      message.success("Bienvenido al sistema");
      navigate("/dashboard");
    } catch (error) {
      console.error("💥 login error:", error.response || error);
      message.error(
        error.response?.data?.message || "Credenciales incorrectas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Sistema de Facturación
      </Title>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Ingrese su usuario" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Usuario" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Ingrese su contraseña" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Contraseña"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
