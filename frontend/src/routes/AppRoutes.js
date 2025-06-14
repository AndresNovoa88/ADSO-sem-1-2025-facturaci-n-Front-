import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import ListClientes from "../pages/Clientes/ListClientes";
import ListProductos from "../pages/Productos/ListProductos";

// Lazy-load de páginas
const Login = lazy(() => import("../pages/Auth/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard/index"));
const FacturaForm = lazy(() => import("../pages/Facturas/FacturaForm"));
const ClienteForm = lazy(() => import("../pages/Clientes/ClienteForm")); 
const ProductoForm = lazy(() => import("../pages/Productos/ProductoForm")); 
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="full-page-loader">Cargando...</div>}>
      <Routes>
        {/* RUTAS PÚBLICAS: Login */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* RUTAS PROTEGIDAS */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout>
                <Outlet />
              </AppLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/facturas/nueva" element={<FacturaForm />} />
          <Route path="/facturas/editar/:id" element={<FacturaForm />} />

          {/* Rutas para Clientes */}
          <Route path="/clientes" element={<ListClientes />} />
          <Route path="/clientes/nuevo" element={<ClienteForm />} />
          <Route path="/clientes/editar/:id" element={<ClienteForm />} />

          {/* Rutas para Productos */}
          <Route path="/productos" element={<ListProductos />} />
          <Route path="/productos/nuevo" element={<ProductoForm />} />
          <Route path="/productos/editar/:id" element={<ProductoForm />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}