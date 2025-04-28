import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import Loading from '../components/common/Loading';

// Lazy loading de las rutas
const AuthRoutes = lazy(() => import('./AuthRoutes'));
const AppRoutes = lazy(() => import('./AppRoutes'));

const RootRouter = () => {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <Routes>
        {/* Rutas públicas (autenticación) */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/*" element={<AuthRoutes />} />
        </Route>

        {/* Rutas protegidas (aplicación) */}
        <Route element={<AppLayout />}>
          <Route path="/*" element={<AppRoutes />} />
        </Route>

        {/* Redirecciones por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
};

export default RootRouter;