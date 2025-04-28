import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from '../components/auth/RequireAuth';
import NotFound from '../pages/NotFound';

// Lazy loading de módulos
const DashboardRoutes = lazy(() => import('./modules/DashboardRoutes'));
const FacturaRoutes = lazy(() => import('./modules/FacturaRoutes'));
const ClienteRoutes = lazy(() => import('./modules/ClienteRoutes'));
const ProductoRoutes = lazy(() => import('./modules/ProductoRoutes'));
const VendedorRoutes = lazy(() => import('./modules/VendedorRoutes'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard/*" element={
        <RequireAuth>
          <DashboardRoutes />
        </RequireAuth>
      } />

      {/* Módulo de Facturación */}
      <Route path="facturas/*" element={
        <RequireAuth roles={['ADMIN', 'GERENTE', 'VENDEDOR']}>
          <FacturaRoutes />
        </RequireAuth>
      } />

      {/* Módulo de Clientes */}
      <Route path="clientes/*" element={
        <RequireAuth roles={['ADMIN', 'GERENTE']}>
          <ClienteRoutes />
        </RequireAuth>
      } />

      {/* Módulo de Productos */}
      <Route path="productos/*" element={
        <RequireAuth roles={['ADMIN', 'GERENTE']}>
          <ProductoRoutes />
        </RequireAuth>
      } />

      {/* Módulo de Vendedores */}
      <Route path="vendedores/*" element={
        <RequireAuth roles={['ADMIN', 'GERENTE']}>
          <VendedorRoutes />
        </RequireAuth>
      } />

      {/* Otras rutas */}
      <Route path="not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

export default AppRoutes;