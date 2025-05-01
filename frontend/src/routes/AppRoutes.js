import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';


// Lazy-load de páginas
const Login       = lazy(() => import('../pages/Auth/Login'));
const Dashboard   = lazy(() => import('../pages/Dashboard/index'));
const FacturaForm = lazy(() => import('../pages/Facturas/FacturaForm'));
const Clientes    = lazy(() => import('../pages/Clientes/ClienteForm'));
const Productos   = lazy(() => import('../pages/Productos/ProductoForm'));
const NotFound    = lazy(() => import('../pages/NotFound'));

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
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
